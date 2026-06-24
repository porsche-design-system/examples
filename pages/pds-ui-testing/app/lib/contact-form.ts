import { pdsCheckboxChecked, pdsStringValue } from '@/app/lib/product-inquiry';

export type ContactFieldErrorKey = 'firstName' | 'lastName' | 'email' | 'message' | 'privacy';

export type ContactFieldErrors = Partial<Record<ContactFieldErrorKey, string>>;

export type ContactValidationErrors = {
  firstNameRequired: string;
  lastNameRequired: string;
  emailRequired: string;
  emailInvalid: string;
  messageRequired: string;
  privacyRequired: string;
};

export const CONTACT_ERROR_FIELD_ORDER: ContactFieldErrorKey[] = [
  'firstName',
  'lastName',
  'email',
  'message',
  'privacy',
];

export function createInitialContactFormState() {
  return {
    firstName: '',
    lastName: '',
    email: '',
    message: '',
    privacyAccepted: false,
  };
}

export type ContactFormState = ReturnType<typeof createInitialContactFormState>;

export function hasContactValidationErrors(errors: ContactFieldErrors): boolean {
  return Object.values(errors).some((m) => m != null && m !== '');
}

export function validateContactForm(form: ContactFormState, err: ContactValidationErrors): ContactFieldErrors {
  const errors: ContactFieldErrors = {};
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

export { pdsCheckboxChecked, pdsStringValue };
