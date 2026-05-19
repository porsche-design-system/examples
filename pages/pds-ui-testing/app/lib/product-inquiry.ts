export const INQUIRY_TYPES = ["quote", "availability", "support"] as const;

export type InquiryFieldErrorKey =
  | "inquiryType"
  | "firstName"
  | "lastName"
  | "email"
  | "message"
  | "privacy";

export const INQUIRY_STEP_IDS = [
  "requestType",
  "contact",
  "location",
  "scheduling",
] as const;

export type InquiryStepId = (typeof INQUIRY_STEP_IDS)[number];

export const INQUIRY_STEP_FIELDS: Record<InquiryStepId, InquiryFieldErrorKey[]> =
  {
    requestType: ["inquiryType"],
    contact: ["firstName", "lastName", "email"],
    location: ["message", "privacy"],
    scheduling: [],
  };

export type InquiryStepState = "current" | "complete";

export type InquiryStepConfig = {
  state?: InquiryStepState;
  name: string;
};

export type InquiryFieldErrors = Partial<Record<InquiryFieldErrorKey, string>>;

export type ProductInquiryStepLabels = {
  fieldsetRequestType: string;
  fieldsetContact: string;
  fieldsetLocation: string;
  fieldsetScheduling: string;
};

export type ProductInquiryValidationErrors = {
  inquiryTypeRequired: string;
  firstNameRequired: string;
  lastNameRequired: string;
  emailRequired: string;
  emailInvalid: string;
  messageRequired: string;
  privacyRequired: string;
};

/** Visual / logical order for “first invalid field” focus after submit. */
export const INQUIRY_ERROR_FIELD_ORDER: InquiryFieldErrorKey[] = [
  "inquiryType",
  "firstName",
  "lastName",
  "email",
  "message",
  "privacy",
];

export function createInquirySteps(
  copy: ProductInquiryStepLabels,
): InquiryStepConfig[] {
  return [
    { state: "current", name: copy.fieldsetRequestType },
    { name: copy.fieldsetContact },
    { name: copy.fieldsetLocation },
    { name: copy.fieldsetScheduling },
  ];
}

export function getActiveInquiryStepIndex(steps: InquiryStepConfig[]): number {
  const index = steps.findIndex((step) => step.state === "current");
  return index === -1 ? 0 : index;
}

export function setActiveInquiryStepIndex(
  steps: InquiryStepConfig[],
  targetIndex: number,
): InquiryStepConfig[] {
  return steps.map((step, index) => {
    const next = { ...step };
    if (index < targetIndex) {
      next.state = "complete";
    } else if (index === targetIndex) {
      next.state = "current";
    } else {
      delete next.state;
    }
    return next;
  });
}

export function getInquiryStepIndexForField(
  key: InquiryFieldErrorKey,
): number {
  return INQUIRY_STEP_IDS.findIndex((stepId) =>
    INQUIRY_STEP_FIELDS[stepId].includes(key),
  );
}

export function getFirstInquiryErrorKeyForStep(
  errors: InquiryFieldErrors,
  stepIndex: number,
): InquiryFieldErrorKey | undefined {
  const keys = INQUIRY_STEP_FIELDS[INQUIRY_STEP_IDS[stepIndex]];
  return keys.find((key) => errors[key] != null && errors[key] !== "");
}

export function hasInquiryValidationErrors(errors: InquiryFieldErrors): boolean {
  return Object.values(errors).some((m) => m != null && m !== "");
}

export function createInitialInquiryFormState() {
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

export type ProductInquiryFormState = ReturnType<
  typeof createInitialInquiryFormState
>;

export function validateInquiryForm(
  form: ProductInquiryFormState,
  err: ProductInquiryValidationErrors,
): InquiryFieldErrors {
  const errors: InquiryFieldErrors = {};
  if (
    !INQUIRY_TYPES.includes(
      form.inquiryType as (typeof INQUIRY_TYPES)[number],
    )
  ) {
    errors.inquiryType = err.inquiryTypeRequired;
  }
  if (!form.firstName.trim()) errors.firstName = err.firstNameRequired;
  if (!form.lastName.trim()) errors.lastName = err.lastNameRequired;
  if (!form.email.trim()) errors.email = err.emailRequired;
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
    errors.email = err.emailInvalid;
  }
  if (!form.message.trim()) errors.message = err.messageRequired;
  if (!form.privacyAccepted) errors.privacy = err.privacyRequired;
  return errors;
}

export function validateInquiryStep(
  form: ProductInquiryFormState,
  err: ProductInquiryValidationErrors,
  stepIndex: number,
): InquiryFieldErrors {
  const allErrors = validateInquiryForm(form, err);
  const stepErrors: InquiryFieldErrors = {};
  for (const key of INQUIRY_STEP_FIELDS[INQUIRY_STEP_IDS[stepIndex]]) {
    if (allErrors[key]) stepErrors[key] = allErrors[key];
  }
  return stepErrors;
}

export function pdsStringValue(event: CustomEvent): string {
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

export function pdsStringArrayValue(event: CustomEvent): string[] {
  const detail = (event as unknown as CustomEvent<{ value?: unknown }>).detail;
  if (detail != null && "value" in detail) {
    const value = detail.value;
    if (Array.isArray(value)) return value as string[];
  }
  return [];
}

export function pdsCheckboxChecked(
  event: CustomEvent,
  previous: boolean,
): boolean {
  const detail = (event as unknown as CustomEvent<{ checked?: boolean }>)
    .detail;
  if (typeof detail?.checked === "boolean") return detail.checked;
  return !previous;
}

export function pdsSwitchChecked(event: CustomEvent): boolean {
  return Boolean(
    (event as unknown as CustomEvent<{ checked: boolean }>).detail.checked,
  );
}
