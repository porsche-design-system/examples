import { describe, expect, it } from "vitest";
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
  type ProductInquiryValidationErrors,
} from "@/app/lib/product-inquiry";

const validationErrors: ProductInquiryValidationErrors = {
  inquiryTypeRequired: "Select inquiry type",
  firstNameRequired: "First name required",
  lastNameRequired: "Last name required",
  emailRequired: "Email required",
  emailInvalid: "Email invalid",
  messageRequired: "Message required",
  privacyRequired: "Privacy required",
};

const stepLabels = {
  fieldsetRequestType: "Request",
  fieldsetContact: "Contact",
  fieldsetLocation: "Location",
  fieldsetScheduling: "Scheduling",
};

describe("inquiry step helpers", () => {
  it("createInquirySteps marks first step as current", () => {
    const steps = createInquirySteps(stepLabels);
    expect(steps[0]?.state).toBe("current");
    expect(steps[1]?.state).toBeUndefined();
  });

  it("getActiveInquiryStepIndex finds current step", () => {
    const steps = createInquirySteps(stepLabels);
    expect(getActiveInquiryStepIndex(steps)).toBe(0);
    const advanced = setActiveInquiryStepIndex(steps, 2);
    expect(getActiveInquiryStepIndex(advanced)).toBe(2);
  });

  it("setActiveInquiryStepIndex marks prior steps complete", () => {
    const steps = setActiveInquiryStepIndex(createInquirySteps(stepLabels), 2);
    expect(steps[0]?.state).toBe("complete");
    expect(steps[1]?.state).toBe("complete");
    expect(steps[2]?.state).toBe("current");
    expect(steps[3]?.state).toBeUndefined();
  });

  it("getInquiryStepIndexForField maps fields to steps", () => {
    expect(getInquiryStepIndexForField("email")).toBe(1);
    expect(getInquiryStepIndexForField("message")).toBe(2);
  });

  it("getFirstInquiryErrorKeyForStep returns first error in step", () => {
    const key = getFirstInquiryErrorKeyForStep(
      { firstName: "err", lastName: "err2" },
      1,
    );
    expect(key).toBe("firstName");
  });

  it("INQUIRY_ERROR_FIELD_ORDER lists all validated fields", () => {
    expect(INQUIRY_ERROR_FIELD_ORDER).toHaveLength(6);
    expect(INQUIRY_STEP_IDS).toHaveLength(4);
    expect(INQUIRY_STEP_FIELDS.scheduling).toEqual([]);
  });
});

describe("validateInquiryForm", () => {
  it("returns no errors for a valid form", () => {
    const form = {
      ...createInitialInquiryFormState(),
      firstName: "Max",
      lastName: "Mustermann",
      email: "max@example.com",
      message: "Hello",
      privacyAccepted: true,
    };
    expect(validateInquiryForm(form, validationErrors)).toEqual({});
    expect(hasInquiryValidationErrors({})).toBe(false);
  });

  it("requires all mandatory fields", () => {
    const form = createInitialInquiryFormState();
    const errors = validateInquiryForm(form, validationErrors);
    expect(errors.firstName).toBe(validationErrors.firstNameRequired);
    expect(errors.lastName).toBe(validationErrors.lastNameRequired);
    expect(errors.email).toBe(validationErrors.emailRequired);
    expect(errors.message).toBe(validationErrors.messageRequired);
    expect(errors.privacy).toBe(validationErrors.privacyRequired);
    expect(hasInquiryValidationErrors(errors)).toBe(true);
  });

  it("rejects invalid email format", () => {
    const form = {
      ...createInitialInquiryFormState(),
      email: "not-an-email",
    };
    expect(validateInquiryForm(form, validationErrors).email).toBe(
      validationErrors.emailInvalid,
    );
  });

  it("rejects invalid inquiry type", () => {
    const form = {
      ...createInitialInquiryFormState(),
      inquiryType: "invalid",
    };
    expect(validateInquiryForm(form, validationErrors).inquiryType).toBe(
      validationErrors.inquiryTypeRequired,
    );
  });
});

describe("validateInquiryStep", () => {
  it("returns only errors for the active step", () => {
    const form = createInitialInquiryFormState();
    const step0 = validateInquiryStep(form, validationErrors, 0);
    expect(step0).toEqual({});

    const step1 = validateInquiryStep(form, validationErrors, 1);
    expect(step1.firstName).toBeDefined();
    expect(step1.email).toBeDefined();
    expect(step1.message).toBeUndefined();
  });
});

describe("PDS event value helpers", () => {
  it("pdsStringValue reads detail and target", () => {
    expect(
      pdsStringValue(new CustomEvent("x", { detail: { value: 42 } })),
    ).toBe("42");
    const input = document.createElement("input");
    input.value = "text";
    expect(
      pdsStringValue({ target: input } as unknown as CustomEvent),
    ).toBe("text");
  });

  it("pdsStringArrayValue reads array detail", () => {
    expect(
      pdsStringArrayValue(
        new CustomEvent("x", { detail: { value: ["a", "b"] } }),
      ),
    ).toEqual(["a", "b"]);
    expect(pdsStringArrayValue(new CustomEvent("x"))).toEqual([]);
  });

  it("pdsCheckboxChecked uses detail or toggles previous", () => {
    expect(
      pdsCheckboxChecked(
        new CustomEvent("x", { detail: { checked: true } }),
        false,
      ),
    ).toBe(true);
    expect(pdsCheckboxChecked(new CustomEvent("x"), false)).toBe(true);
  });

  it("pdsSwitchChecked reads checked detail", () => {
    expect(
      pdsSwitchChecked(new CustomEvent("x", { detail: { checked: true } })),
    ).toBe(true);
    expect(
      pdsSwitchChecked(new CustomEvent("x", { detail: { checked: false } })),
    ).toBe(false);
  });
});
