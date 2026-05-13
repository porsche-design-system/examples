"use client";

import { type CSSProperties, useCallback, useEffect, useState } from "react";
import {
  PButton,
  PCheckbox,
  PDivider,
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
  PRadioGroup,
  PRadioGroupOption,
  PSegmentedControl,
  PSegmentedControlItem,
  PSelect,
  PSelectOption,
  PSpinner,
  PSwitch,
  PText,
  PTextarea,
} from "@porsche-design-system/components-react/ssr";
import type { Dictionary } from "@/app/i18n/get-dictionary";

export type ProductInquiryCopy =
  Dictionary["pages"]["productDetail"]["inquiry"];

type Props = {
  copy: ProductInquiryCopy;
  productName: string;
  productImageSrc: string;
  productImageAlt: string;
};

const FLYOUT_STYLE = {
  "--p-flyout-width": "min(100vw - 2rem, 760px)",
} as CSSProperties;

const INQUIRY_TYPES = ["quote", "availability", "support"] as const;

type InquiryFieldErrorKey =
  | "inquiryType"
  | "firstName"
  | "lastName"
  | "email"
  | "message"
  | "privacy";

export type InquiryFieldErrors = Partial<Record<InquiryFieldErrorKey, string>>;

type PostSubmitPhase = "idle" | "pending" | "done";

function hasValidationErrors(errors: InquiryFieldErrors): boolean {
  return Object.values(errors).some((m) => m != null && m !== "");
}

function validateInquiryForm(
  f: ReturnType<typeof initialFormState>,
  err: ProductInquiryCopy["errors"],
): InquiryFieldErrors {
  const errors: InquiryFieldErrors = {};
  if (
    !INQUIRY_TYPES.includes(f.inquiryType as (typeof INQUIRY_TYPES)[number])
  ) {
    errors.inquiryType = err.inquiryTypeRequired;
  }
  if (!f.firstName.trim()) errors.firstName = err.firstNameRequired;
  if (!f.lastName.trim()) errors.lastName = err.lastNameRequired;
  if (!f.email.trim()) errors.email = err.emailRequired;
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email.trim())) {
    errors.email = err.emailInvalid;
  }
  if (!f.message.trim()) errors.message = err.messageRequired;
  if (!f.privacyAccepted) errors.privacy = err.privacyRequired;
  return errors;
}

function pdsStringValue(event: CustomEvent): string {
  const detail = (event as unknown as CustomEvent<{ value?: unknown }>).detail;
  if (detail != null && "value" in detail && detail.value !== undefined) {
    return String(detail.value);
  }
  const target = event.target as unknown as { value?: unknown };
  if (target != null && typeof target.value === "string") {
    return target.value;
  }
  return "";
}

function pdsStringArrayValue(event: CustomEvent): string[] {
  const detail = (event as unknown as CustomEvent<{ value?: unknown }>).detail;
  if (detail != null && "value" in detail) {
    const value = detail.value;
    if (Array.isArray(value)) return value as string[];
  }
  return [];
}

function pdsCheckboxChecked(event: CustomEvent, previous: boolean): boolean {
  const detail = (event as unknown as CustomEvent<{ checked?: boolean }>)
    .detail;
  if (typeof detail?.checked === "boolean") return detail.checked;
  return !previous;
}

function pdsSwitchChecked(event: CustomEvent): boolean {
  return Boolean(
    (event as unknown as CustomEvent<{ checked: boolean }>).detail.checked,
  );
}

function initialFormState() {
  return {
    inquiryType: "quote",
    priority: "normal",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    country: "us",
    channels: [] as string[],
    preferredDate: "",
    preferredTime: "",
    preferredMonth: "",
    preferredWeek: "",
    message: "",
    pin: "",
    passwordDemo: "",
    newsletter: false,
    privacyAccepted: false,
  };
}

export function ProductInquiryFlyout({
  copy,
  productName,
  productImageSrc,
  productImageAlt,
}: Props) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(initialFormState);
  const [errors, setErrors] = useState<InquiryFieldErrors>({});
  const [postSubmitPhase, setPostSubmitPhase] =
    useState<PostSubmitPhase>("idle");

  const clearError = useCallback((key: InquiryFieldErrorKey) => {
    setErrors((prev) => {
      if (!(key in prev)) return prev;
      const next = { ...prev };
      delete next[key];
      return next;
    });
  }, []);

  const resetAndClose = useCallback(() => {
    setForm(initialFormState());
    setErrors({});
    setPostSubmitPhase("idle");
    setOpen(false);
  }, []);

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
    if (hasValidationErrors(next)) return;
    setErrors({});
    setPostSubmitPhase("pending");
  }, [form, copy.errors]);

  const handleDismiss = useCallback(() => {
    resetAndClose();
  }, [resetAndClose]);

  return (
    <>
      <PButton
        type="button"
        icon="none"
        aria={{ "aria-haspopup": "dialog" }}
        onClick={() => {
          setForm(initialFormState());
          setErrors({});
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

          {open ? (
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
                  {hasValidationErrors(errors) ? (
                    <PInlineNotification
                      description={copy.errors.formSummary}
                      dismissButton={false}
                      heading={copy.errors.formSummaryHeading}
                      state="error"
                    />
                  ) : null}
                  <PRadioGroup
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
                    <PSegmentedControlItem
                      label={copy.priorityNormal}
                      value="normal"
                    />
                    <PSegmentedControlItem
                      label={copy.priorityHigh}
                      value="high"
                    />
                    <PSegmentedControlItem
                      label={copy.priorityUrgent}
                      value="urgent"
                    />
                  </PSegmentedControl>

                  <PDivider />

                  <PFieldset label={copy.fieldsetContact}>
                    <div className="mt-static-md grid gap-static-md md:grid-cols-2">
                      <PInputText
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

                  <PFieldset label={copy.fieldsetLocation}>
                    <div className="mt-static-md grid gap-static-md">
                      <PSelect
                        label={copy.country}
                        name="inquiry-country"
                        onChange={(e) =>
                          setForm((s) => ({
                            ...s,
                            country: pdsStringValue(e),
                          }))
                        }
                        value={form.country}
                      >
                        <POptgroup label={copy.countryGroupOther}>
                          <PSelectOption value="us">
                            {copy.countryUs}
                          </PSelectOption>
                        </POptgroup>
                        <POptgroup label={copy.countryGroupEurope}>
                          <PSelectOption value="de">
                            {copy.countryDe}
                          </PSelectOption>
                          <PSelectOption value="at">
                            {copy.countryAt}
                          </PSelectOption>
                          <PSelectOption value="ch">
                            {copy.countryCh}
                          </PSelectOption>
                        </POptgroup>
                      </PSelect>
                      <PMultiSelect
                        description={copy.contactChannelsDescription}
                        label={copy.contactChannels}
                        name="inquiry-channels"
                        onChange={(e) =>
                          setForm((s) => ({
                            ...s,
                            channels: pdsStringArrayValue(e),
                          }))
                        }
                        value={form.channels}
                      >
                        <PMultiSelectOption value="email">
                          {copy.channelEmail}
                        </PMultiSelectOption>
                        <PMultiSelectOption value="phone">
                          {copy.channelPhone}
                        </PMultiSelectOption>
                        <PMultiSelectOption value="sms">
                          {copy.channelSms}
                        </PMultiSelectOption>
                      </PMultiSelect>
                      <PTextarea
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
                      />
                    </div>
                  </PFieldset>

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
                </>
              )}
            </div>
          ) : null}
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
              <PButton onClick={handleSubmit} type="button" variant="primary">
                {copy.submit}
              </PButton>
              <PButton
                aria={{ "aria-label": copy.close }}
                icon="close"
                hideLabel
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
