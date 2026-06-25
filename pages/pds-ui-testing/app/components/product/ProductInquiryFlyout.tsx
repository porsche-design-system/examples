"use client";

import {
  type CSSProperties,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import {
  PButton,
  PCheckbox,
  PFieldset,
  PFlyout,
  PHeading,
  PInlineNotification,
  PInputDate,
  PInputEmail,
  PInputMonth,
  PInputPassword,
  PInputTel,
  PInputText,
  PInputTime,
  PInputWeek,
  PMultiSelect,
  PMultiSelectOption,
  POptgroup,
  PPinCode,
  PPopover,
  PRadioGroup,
  PRadioGroupOption,
  PSegmentedControl,
  PSegmentedControlItem,
  PSelect,
  PSelectOption,
  PSpinner,
  PStepperHorizontal,
  PStepperHorizontalItem,
  PSwitch,
  PText,
  PTextarea,
  type StepperHorizontalUpdateEventDetail,
} from "@porsche-design-system/components-react/ssr";
import type { Dictionary } from "@/app/i18n/get-dictionary";
import {
  createInitialInquiryFormState,
  createInquirySteps,
  getActiveInquiryStepIndex,
  getFirstInquiryErrorKeyForStep,
  getInquiryStepIndexForField,
  hasInquiryValidationErrors,
  INQUIRY_ERROR_FIELD_ORDER,
  INQUIRY_STEP_FIELDS,
  INQUIRY_STEP_IDS,
  pdsCheckboxChecked,
  pdsStringArrayValue,
  pdsStringValue,
  pdsSwitchChecked,
  setActiveInquiryStepIndex,
  validateInquiryForm,
  validateInquiryStep,
  type InquiryFieldErrorKey,
  type InquiryFieldErrors,
  type InquiryStepConfig,
  type InquiryStepId,
} from "@/app/lib/product-inquiry";

export type { InquiryFieldErrors };

export type ProductInquiryCopy =
  Dictionary["pages"]["productDetail"]["inquiry"];

type Props = {
  copy: ProductInquiryCopy;
  productName: string;
  productImageSrc: string;
  productImageAlt: string;
};

const FLYOUT_STYLE = {
  "--p-flyout-width": "min(100vw, 760px)",
} as CSSProperties;

type CountryLabelKey = keyof Pick<
  ProductInquiryCopy,
  | "countryUs"
  | "countryCa"
  | "countryMx"
  | "countryBr"
  | "countryDe"
  | "countryAt"
  | "countryCh"
  | "countryFr"
  | "countryGb"
  | "countryIt"
  | "countryEs"
  | "countryNl"
  | "countryBe"
  | "countryPl"
  | "countrySe"
  | "countryNo"
  | "countryDk"
  | "countryFi"
  | "countryIe"
  | "countryPt"
  | "countryCz"
  | "countryHu"
  | "countryRo"
  | "countryJp"
  | "countryCn"
  | "countryIn"
  | "countrySg"
  | "countryKr"
  | "countryAu"
  | "countryAe"
  | "countryZa"
>;

type CountryGroupKey = keyof Pick<
  ProductInquiryCopy,
  | "countryGroupAmericas"
  | "countryGroupEurope"
  | "countryGroupAsiaPacific"
  | "countryGroupMiddleEastAfrica"
>;

const COUNTRY_GROUPS: {
  groupKey: CountryGroupKey;
  options: { value: string; labelKey: CountryLabelKey }[];
}[] = [
  {
    groupKey: "countryGroupAmericas",
    options: [
      { value: "us", labelKey: "countryUs" },
      { value: "ca", labelKey: "countryCa" },
      { value: "mx", labelKey: "countryMx" },
      { value: "br", labelKey: "countryBr" },
    ],
  },
  {
    groupKey: "countryGroupEurope",
    options: [
      { value: "de", labelKey: "countryDe" },
      { value: "at", labelKey: "countryAt" },
      { value: "ch", labelKey: "countryCh" },
      { value: "fr", labelKey: "countryFr" },
      { value: "gb", labelKey: "countryGb" },
      { value: "it", labelKey: "countryIt" },
      { value: "es", labelKey: "countryEs" },
      { value: "nl", labelKey: "countryNl" },
      { value: "be", labelKey: "countryBe" },
      { value: "pl", labelKey: "countryPl" },
      { value: "se", labelKey: "countrySe" },
      { value: "no", labelKey: "countryNo" },
      { value: "dk", labelKey: "countryDk" },
      { value: "fi", labelKey: "countryFi" },
      { value: "ie", labelKey: "countryIe" },
      { value: "pt", labelKey: "countryPt" },
      { value: "cz", labelKey: "countryCz" },
      { value: "hu", labelKey: "countryHu" },
      { value: "ro", labelKey: "countryRo" },
    ],
  },
  {
    groupKey: "countryGroupAsiaPacific",
    options: [
      { value: "jp", labelKey: "countryJp" },
      { value: "cn", labelKey: "countryCn" },
      { value: "in", labelKey: "countryIn" },
      { value: "sg", labelKey: "countrySg" },
      { value: "kr", labelKey: "countryKr" },
      { value: "au", labelKey: "countryAu" },
    ],
  },
  {
    groupKey: "countryGroupMiddleEastAfrica",
    options: [
      { value: "ae", labelKey: "countryAe" },
      { value: "za", labelKey: "countryZa" },
    ],
  },
];

/** PDS form hosts in visual order within a step panel. */
const STEP_FIELD_HOST_SELECTOR = [
  "p-radio-group",
  "p-segmented-control",
  "p-input-text",
  "p-input-email",
  "p-input-tel",
  "p-select",
  "p-multi-select",
  "p-textarea",
  "p-switch",
  "p-checkbox",
  "p-input-date",
  "p-input-time",
  "p-input-month",
  "p-input-week",
  "p-pin-code",
  "p-input-password",
].join(", ");

function focusInquiryFieldHost(host: HTMLElement | null | undefined): void {
  if (!host) return;
  host.scrollIntoView({ block: "nearest", inline: "nearest" });
  host.focus();
  const root = host.shadowRoot;
  if (!root) return;
  const inner = root.querySelector<HTMLElement>(
    'input:not([type="hidden"]), textarea, button:not([disabled])',
  );
  if (inner && document.activeElement !== inner) inner.focus();
}

type PdsStencilHost = HTMLElement & {
  componentOnReady?: () => Promise<void>;
};

const STEP_FIRST_FIELD: Partial<Record<InquiryStepId, InquiryFieldErrorKey>> = {
  requestType: "inquiryType",
  contact: "firstName",
};

function isFocusInsideHost(host: HTMLElement): boolean {
  const active = document.activeElement;
  if (!active) return false;
  return active === host || host.shadowRoot?.contains(active) === true;
}

async function waitForStencilHost(host: PdsStencilHost): Promise<void> {
  const tag = host.localName;
  if (tag && customElements.get(tag) == null) {
    await customElements.whenDefined(tag);
  }
  if (typeof host.componentOnReady === "function") {
    await host.componentOnReady();
  }
}

function resolveFirstFieldHost(
  panel: HTMLElement,
  stepId: InquiryStepId,
  fieldHosts: Partial<Record<InquiryFieldErrorKey, HTMLElement | null>>,
): HTMLElement | null {
  const mappedKey = STEP_FIRST_FIELD[stepId];
  if (mappedKey && fieldHosts[mappedKey]) {
    return fieldHosts[mappedKey] ?? null;
  }
  return panel.querySelector<HTMLElement>(STEP_FIELD_HOST_SELECTOR);
}

/**
 * Focuses the first field of a step after navigation. Retries until the step panel
 * is mounted, Stencil hosts are ready, and focus leaves the footer control.
 */
async function focusFirstFieldInStep(
  stepId: InquiryStepId,
  getPanel: () => HTMLElement | null,
  fieldHosts: Partial<Record<InquiryFieldErrorKey, HTMLElement | null>>,
): Promise<boolean> {
  for (let attempt = 0; attempt < 10; attempt++) {
    await new Promise<void>((resolve) => {
      requestAnimationFrame(() => resolve());
    });

    const panel = getPanel();
    if (!panel) continue;

    const host = resolveFirstFieldHost(panel, stepId, fieldHosts);
    if (!host) continue;

    try {
      await waitForStencilHost(host as PdsStencilHost);
    } catch {
      // Host disconnected during navigation; retry on next frame.
      continue;
    }

    const previous = document.activeElement;
    if (
      previous instanceof HTMLElement &&
      previous !== host &&
      !host.contains(previous)
    ) {
      previous.blur();
    }

    focusInquiryFieldHost(host);

    if (isFocusInsideHost(host)) {
      return true;
    }
  }

  return false;
}

type PostSubmitPhase = "idle" | "pending" | "done";

export function ProductInquiryFlyout({
  copy,
  productName,
  productImageSrc,
  productImageAlt,
}: Props) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(createInitialInquiryFormState);
  const [errors, setErrors] = useState<InquiryFieldErrors>({});
  const [steps, setSteps] = useState<InquiryStepConfig[]>(() =>
    createInquirySteps(copy),
  );
  const [postSubmitPhase, setPostSubmitPhase] =
    useState<PostSubmitPhase>("idle");
  const fieldHostsRef = useRef<
    Partial<Record<InquiryFieldErrorKey, HTMLElement | null>>
  >({});
  const stepPanelRefs = useRef<(HTMLElement | null)[]>([]);
  const shouldFocusFirstErrorRef = useRef(false);
  const pendingFocusStepIndexRef = useRef<number | null>(null);
  const focusStepSessionRef = useRef(0);
  const focusStepIndexRef = useRef(0);
  const activeStepIndex = getActiveInquiryStepIndex(steps);

  const assignFieldHostRef = useCallback(
    (key: InquiryFieldErrorKey) => (instance: HTMLElement | null) => {
      fieldHostsRef.current[key] = instance;
    },
    [],
  );

  const assignStepPanelRef = useCallback(
    (index: number) => (instance: HTMLElement | null) => {
      stepPanelRefs.current[index] = instance;
    },
    [],
  );

  const navigateToStep = useCallback(
    (targetIndex: number, options?: { focusFirstField?: boolean }) => {
      setSteps((prev) => setActiveInquiryStepIndex([...prev], targetIndex));
      if (options?.focusFirstField !== false) {
        pendingFocusStepIndexRef.current = targetIndex;
      } else {
        pendingFocusStepIndexRef.current = null;
      }
    },
    [],
  );

  const clearError = useCallback((key: InquiryFieldErrorKey) => {
    setErrors((prev) => {
      if (!(key in prev)) return prev;
      const next = { ...prev };
      delete next[key];
      return next;
    });
  }, []);

  const resetAndClose = useCallback(() => {
    pendingFocusStepIndexRef.current = null;
    focusStepSessionRef.current += 1;
    setForm(createInitialInquiryFormState());
    setErrors({});
    setSteps(createInquirySteps(copy));
    setPostSubmitPhase("idle");
    setOpen(false);
  }, [copy]);

  useEffect(() => {
    if (postSubmitPhase !== "pending") return;
    const id = window.setTimeout(() => {
      setPostSubmitPhase("done");
    }, 5000);
    return () => window.clearTimeout(id);
  }, [postSubmitPhase]);

  const handleSubmit = useCallback(() => {
    const next = validateInquiryForm(form, copy.errors);
    setErrors(next);
    if (hasInquiryValidationErrors(next)) {
      const firstKey = INQUIRY_ERROR_FIELD_ORDER.find(
        (key) => next[key] != null && next[key] !== "",
      );
      const stepIndex = firstKey ? getInquiryStepIndexForField(firstKey) : 0;
      navigateToStep(stepIndex, { focusFirstField: false });
      focusStepIndexRef.current = stepIndex;
      shouldFocusFirstErrorRef.current = true;
      return;
    }
    setErrors({});
    setPostSubmitPhase("pending");
  }, [form, copy.errors, navigateToStep]);

  const handlePrevStep = useCallback(() => {
    if (activeStepIndex === 0) return;
    navigateToStep(activeStepIndex - 1);
  }, [activeStepIndex, navigateToStep]);

  const handleNextStep = useCallback(() => {
    const stepErrors = validateInquiryStep(form, copy.errors, activeStepIndex);
    if (hasInquiryValidationErrors(stepErrors)) {
      setErrors((prev) => ({ ...prev, ...stepErrors }));
      focusStepIndexRef.current = activeStepIndex;
      shouldFocusFirstErrorRef.current = true;
      return;
    }
    setErrors((prev) => {
      const next = { ...prev };
      for (const key of INQUIRY_STEP_FIELDS[INQUIRY_STEP_IDS[activeStepIndex]]) {
        delete next[key];
      }
      return next;
    });
    if (activeStepIndex < steps.length - 1) {
      navigateToStep(activeStepIndex + 1);
    }
  }, [activeStepIndex, copy.errors, form, navigateToStep, steps.length]);

  const handleStepperUpdate = useCallback(
    (event: CustomEvent<StepperHorizontalUpdateEventDetail>) => {
      const { activeStepIndex: targetIndex } = event.detail;
      navigateToStep(targetIndex);
    },
    [navigateToStep],
  );

  useLayoutEffect(() => {
    const targetIndex = pendingFocusStepIndexRef.current;
    if (targetIndex === null || targetIndex !== activeStepIndex) return;

    const session = ++focusStepSessionRef.current;
    const stepId = INQUIRY_STEP_IDS[targetIndex];

    void (async () => {
      const focused = await focusFirstFieldInStep(
        stepId,
        () => stepPanelRefs.current[targetIndex] ?? null,
        fieldHostsRef.current,
      );

      if (focusStepSessionRef.current !== session) return;
      if (focused) pendingFocusStepIndexRef.current = null;
    })();
  }, [activeStepIndex]);

  useLayoutEffect(() => {
    if (!shouldFocusFirstErrorRef.current) return;
    if (!hasInquiryValidationErrors(errors)) return;
    shouldFocusFirstErrorRef.current = false;
    const firstKey =
      getFirstInquiryErrorKeyForStep(errors, focusStepIndexRef.current) ??
      INQUIRY_ERROR_FIELD_ORDER.find(
        (key) => errors[key] != null && errors[key] !== "",
      );
    if (!firstKey) return;
    const host = fieldHostsRef.current[firstKey];
    requestAnimationFrame(() => focusInquiryFieldHost(host));
  }, [errors]);

  const handleDismiss = useCallback(() => {
    resetAndClose();
  }, [resetAndClose]);

  return (
    <>
      <PButton
        type="button"
        icon="shopping-cart"
        aria={{ "aria-haspopup": "dialog" }}
        onClick={() => {
          setForm(createInitialInquiryFormState());
          setErrors({});
          setSteps(createInquirySteps(copy));
          setPostSubmitPhase("idle");
          setOpen(true);
        }}
      >
        {copy.triggerLabel}
      </PButton>

      <PFlyout
        aria={{ "aria-label": copy.flyoutAriaLabel }}
        footerBehavior="fixed"
        onDismiss={handleDismiss}
        open={open}
        style={FLYOUT_STYLE}
      >
        <div className="grid gap-fluid-md">
          <div className="flex items-start gap-static-md" slot="header">
            <div className="relative h-[100px] w-[104px] shrink-0 overflow-hidden rounded-md bg-contrast-low">
              {/* biome-ignore lint/performance/noImgElement: Thumbnail matches product detail / tile pattern. */}
              <img
                alt={productImageAlt}
                className="h-full w-full object-cover"
                src={productImageSrc}
              />
            </div>
            <div className="grid min-w-0 gap-static-xs">
              <PHeading size="small" tag="h2">
                {productName}
              </PHeading>
              <PText color="contrast-medium" size="small">
                {copy.subtitle}
              </PText>
            </div>
          </div>

          <div className="grid gap-fluid-md">
            {postSubmitPhase === "done" ? (
              <div className="grid gap-fluid-md" role="status">
                <PInlineNotification
                  description={copy.successDescription}
                  dismissButton={false}
                  heading={copy.successHeading}
                  state="success"
                />
              </div>
            ) : postSubmitPhase === "pending" ? (
              <div
                aria-live="polite"
                className="flex min-h-[200px] flex-col items-center justify-center gap-static-md py-fluid-lg"
                role="status"
              >
                <PSpinner
                  aria={{ "aria-label": copy.submittingHint }}
                  size="large"
                />
                <PText color="contrast-medium" size="small">
                  {copy.submittingHint}
                </PText>
              </div>
            ) : (
              <>
                {hasInquiryValidationErrors(errors) ? (
                  <PInlineNotification
                    description={copy.errors.formSummary}
                    dismissButton={false}
                    heading={copy.errors.formSummaryHeading}
                    state="error"
                  />
                ) : null}

                <PStepperHorizontal onUpdate={handleStepperUpdate}>
                  {steps.map(({ state, name }) => (
                    <PStepperHorizontalItem key={name} state={state}>
                      {name}
                    </PStepperHorizontalItem>
                  ))}
                </PStepperHorizontal>

                {activeStepIndex === 0 ? (
                  <div ref={assignStepPanelRef(0)}>
                    <PFieldset label={copy.fieldsetRequestType}>
                      <div className="mt-static-md grid gap-static-md">
                        <PRadioGroup
                          ref={assignFieldHostRef("inquiryType")}
                          label={copy.inquiryTypeLabel}
                          message={errors.inquiryType ?? ""}
                          name="inquiry-type"
                          onChange={(e) => {
                            setForm((s) => ({
                              ...s,
                              inquiryType: pdsStringValue(e),
                            }));
                            clearError("inquiryType");
                          }}
                          required
                          state={errors.inquiryType ? "error" : "none"}
                          value={form.inquiryType}
                        >
                          <PRadioGroupOption
                            label={copy.inquiryTypeQuote}
                            value="quote"
                          />
                          <PRadioGroupOption
                            label={copy.inquiryTypeAvailability}
                            value="availability"
                          />
                          <PRadioGroupOption
                            label={copy.inquiryTypeSupport}
                            value="support"
                          />
                        </PRadioGroup>

                        <PSegmentedControl
                          columns={{ base: 1, s: 3 }}
                          label={copy.priorityLabel}
                          name="inquiry-priority"
                          onChange={(e) =>
                            setForm((s) => ({
                              ...s,
                              priority: pdsStringValue(e),
                            }))
                          }
                          value={form.priority}
                        >
                          <PSegmentedControlItem value="normal">
                            {copy.priorityNormal}
                          </PSegmentedControlItem>
                          <PSegmentedControlItem value="high">
                            {copy.priorityHigh}
                          </PSegmentedControlItem>
                          <PSegmentedControlItem value="urgent">
                            {copy.priorityUrgent}
                          </PSegmentedControlItem>
                        </PSegmentedControl>
                      </div>
                    </PFieldset>
                  </div>
                ) : null}

                {activeStepIndex === 1 ? (
                  <div ref={assignStepPanelRef(1)}>
                    <PFieldset label={copy.fieldsetContact}>
                      <div className="mt-static-md grid gap-static-md md:grid-cols-2">
                        <PInputText
                          ref={assignFieldHostRef("firstName")}
                          autoComplete="given-name"
                          label={copy.firstName}
                          message={errors.firstName ?? ""}
                          name="inquiry-first-name"
                          onChange={(e) => {
                            setForm((s) => ({
                              ...s,
                              firstName: pdsStringValue(e),
                            }));
                            clearError("firstName");
                          }}
                          onInput={(e) => {
                            setForm((s) => ({
                              ...s,
                              firstName: pdsStringValue(e),
                            }));
                            clearError("firstName");
                          }}
                          required
                          state={errors.firstName ? "error" : "none"}
                          value={form.firstName}
                        />
                        <PInputText
                          ref={assignFieldHostRef("lastName")}
                          autoComplete="family-name"
                          label={copy.lastName}
                          message={errors.lastName ?? ""}
                          name="inquiry-last-name"
                          onChange={(e) => {
                            setForm((s) => ({
                              ...s,
                              lastName: pdsStringValue(e),
                            }));
                            clearError("lastName");
                          }}
                          onInput={(e) => {
                            setForm((s) => ({
                              ...s,
                              lastName: pdsStringValue(e),
                            }));
                            clearError("lastName");
                          }}
                          required
                          state={errors.lastName ? "error" : "none"}
                          value={form.lastName}
                        />
                        <PInputEmail
                          ref={assignFieldHostRef("email")}
                          autoComplete="email"
                          label={copy.email}
                          message={errors.email ?? ""}
                          name="inquiry-email"
                          onChange={(e) => {
                            setForm((s) => ({
                              ...s,
                              email: pdsStringValue(e),
                            }));
                            clearError("email");
                          }}
                          onInput={(e) => {
                            setForm((s) => ({
                              ...s,
                              email: pdsStringValue(e),
                            }));
                            clearError("email");
                          }}
                          required
                          state={errors.email ? "error" : "none"}
                          value={form.email}
                        />
                        <PInputTel
                          autoComplete="tel"
                          label={copy.phone}
                          name="inquiry-phone"
                          onChange={(e) =>
                            setForm((s) => ({
                              ...s,
                              phone: pdsStringValue(e),
                            }))
                          }
                          onInput={(e) =>
                            setForm((s) => ({
                              ...s,
                              phone: pdsStringValue(e),
                            }))
                          }
                          value={form.phone}
                        />
                      </div>
                    </PFieldset>
                  </div>
                ) : null}

                {activeStepIndex === 2 ? (
                  <div ref={assignStepPanelRef(2)}>
                    <PFieldset label={copy.fieldsetLocation}>
                      <div className="mt-static-md grid gap-static-md">
                        <PMultiSelect
                          label={copy.country}
                          name="inquiry-country"
                          onChange={(e) =>
                            setForm((s) => ({
                              ...s,
                              country: pdsStringArrayValue(e),
                            }))
                          }
                          value={form.country}
                        >
                          {COUNTRY_GROUPS.map(({ groupKey, options }) => (
                            <POptgroup
                              key={groupKey}
                              label={copy[groupKey]}
                            >
                              {options.map(({ value, labelKey }) => (
                                <PMultiSelectOption
                                  key={value}
                                  value={value}
                                >
                                  {copy[labelKey]}
                                </PMultiSelectOption>
                              ))}
                            </POptgroup>
                          ))}
                        </PMultiSelect>
                        <PSelect
                          description={copy.contactChannelsDescription}
                          label={copy.contactChannels}
                          name="inquiry-channels"
                          onChange={(e) =>
                            setForm((s) => ({
                              ...s,
                              channels: pdsStringValue(e),
                            }))
                          }
                          value={form.channels}
                        >
                          <PSelectOption value="email">
                            {copy.channelEmail}
                          </PSelectOption>
                          <PSelectOption value="phone">
                            {copy.channelPhone}
                          </PSelectOption>
                          <PSelectOption value="sms">
                            {copy.channelSms}
                          </PSelectOption>
                        </PSelect>
                        <PTextarea
                          ref={assignFieldHostRef("message")}
                          label={copy.message}
                          message={errors.message ?? ""}
                          name="inquiry-message"
                          onChange={(e) => {
                            setForm((s) => ({
                              ...s,
                              message: pdsStringValue(e),
                            }));
                            clearError("message");
                          }}
                          onInput={(e) => {
                            setForm((s) => ({
                              ...s,
                              message: pdsStringValue(e),
                            }));
                            clearError("message");
                          }}
                          placeholder={copy.messagePlaceholder}
                          required
                          rows={5}
                          state={errors.message ? "error" : "none"}
                          value={form.message}
                          counter
                          maxLength={50}
                        />
                        <PSwitch
                          checked={form.newsletter}
                          onUpdate={(e) =>
                            setForm((s) => ({
                              ...s,
                              newsletter: pdsSwitchChecked(e),
                            }))
                          }
                        >
                          {copy.newsletter}
                        </PSwitch>
                        <PCheckbox
                          ref={assignFieldHostRef("privacy")}
                          checked={form.privacyAccepted}
                          label={copy.privacy}
                          message={errors.privacy ?? ""}
                          name="inquiry-privacy"
                          onChange={(e) => {
                            setForm((s) => ({
                              ...s,
                              privacyAccepted: pdsCheckboxChecked(
                                e,
                                s.privacyAccepted,
                              ),
                            }));
                            clearError("privacy");
                          }}
                          required
                          state={errors.privacy ? "error" : "none"}
                        >
                          <PPopover slot="label-after">
                            {copy.privacyPopover}
                          </PPopover>
                        </PCheckbox>
                      </div>
                    </PFieldset>
                  </div>
                ) : null}

                {activeStepIndex === 3 ? (
                  <div
                    className="grid gap-static-md"
                    ref={assignStepPanelRef(3)}
                  >
                    <PFieldset label={copy.fieldsetScheduling}>
                      <PText
                        className="mt-static-sm"
                        color="contrast-medium"
                        size="small"
                      >
                        {copy.schedulingHint}
                      </PText>
                      <div className="mt-static-md grid gap-static-md md:grid-cols-2">
                        <PInputDate
                          label={copy.preferredDate}
                          name="inquiry-date"
                          onChange={(e) =>
                            setForm((s) => ({
                              ...s,
                              preferredDate: pdsStringValue(e),
                            }))
                          }
                          onInput={(e) =>
                            setForm((s) => ({
                              ...s,
                              preferredDate: pdsStringValue(e),
                            }))
                          }
                          value={form.preferredDate}
                        />
                        <PInputTime
                          label={copy.preferredTime}
                          name="inquiry-time"
                          onChange={(e) =>
                            setForm((s) => ({
                              ...s,
                              preferredTime: pdsStringValue(e),
                            }))
                          }
                          onInput={(e) =>
                            setForm((s) => ({
                              ...s,
                              preferredTime: pdsStringValue(e),
                            }))
                          }
                          value={form.preferredTime}
                        />
                        <PInputMonth
                          label={copy.preferredMonth}
                          name="inquiry-month"
                          onChange={(e) =>
                            setForm((s) => ({
                              ...s,
                              preferredMonth: pdsStringValue(e),
                            }))
                          }
                          onInput={(e) =>
                            setForm((s) => ({
                              ...s,
                              preferredMonth: pdsStringValue(e),
                            }))
                          }
                          value={form.preferredMonth}
                        />
                        <PInputWeek
                          label={copy.preferredWeek}
                          name="inquiry-week"
                          onChange={(e) =>
                            setForm((s) => ({
                              ...s,
                              preferredWeek: pdsStringValue(e),
                            }))
                          }
                          onInput={(e) =>
                            setForm((s) => ({
                              ...s,
                              preferredWeek: pdsStringValue(e),
                            }))
                          }
                          value={form.preferredWeek}
                        />
                      </div>
                    </PFieldset>

                    <PPinCode
                      description={copy.pinDescription}
                      label={copy.pinLabel}
                      length={4}
                      name="inquiry-pin"
                      onChange={(e) =>
                        setForm((s) => ({
                          ...s,
                          pin: pdsStringValue(e),
                        }))
                      }
                      value={form.pin}
                    />

                    <PInputPassword
                      description={copy.passwordDemoDescription}
                      label={copy.passwordDemoLabel}
                      name="inquiry-password-demo"
                      toggle={true}
                      onChange={(e) =>
                        setForm((s) => ({
                          ...s,
                          passwordDemo: pdsStringValue(e),
                        }))
                      }
                      onInput={(e) =>
                        setForm((s) => ({
                          ...s,
                          passwordDemo: pdsStringValue(e),
                        }))
                      }
                      value={form.passwordDemo}
                    />
                  </div>
                ) : null}
              </>
            )}
          </div>
        </div>

        <div className="flex flex-wrap gap-static-sm" slot="footer">
          {postSubmitPhase === "done" ? (
            <PButton onClick={resetAndClose} type="button" variant="primary">
              {copy.successClose}
            </PButton>
          ) : postSubmitPhase === "pending" ? (
            <PButton onClick={resetAndClose} type="button" variant="secondary">
              {copy.close}
            </PButton>
          ) : (
            <>
              <PButton
                disabled={activeStepIndex === 0}
                icon="arrow-head-left"
                onClick={handlePrevStep}
                type="button"
                variant="secondary"
              >
                {copy.stepPrevious}
              </PButton>
              {activeStepIndex < steps.length - 1 ? (
                <PButton
                  onClick={handleNextStep}
                  type="button"
                  variant="primary"
                >
                  {copy.stepNext}
                </PButton>
              ) : (
                <PButton onClick={handleSubmit} type="button" variant="primary">
                  {copy.submit}
                </PButton>
              )}
              <PButton
                aria={{ "aria-label": copy.close }}
                hideLabel
                icon="close"
                onClick={resetAndClose}
                type="button"
                variant="secondary"
              >
                {copy.close}
              </PButton>
            </>
          )}
        </div>
      </PFlyout>
    </>
  );
}
