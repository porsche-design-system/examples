import { pdsCheckboxChecked, pdsStringValue } from '@/app/lib/product-inquiry';

export type NewsletterFieldErrorKey = 'email' | 'firstName' | 'privacy';

export type NewsletterFieldErrors = Partial<Record<NewsletterFieldErrorKey, string>>;

export type NewsletterValidationErrors = {
  emailRequired: string;
  emailInvalid: string;
  firstNameRequired: string;
  privacyRequired: string;
};

export const NEWSLETTER_ERROR_FIELD_ORDER: NewsletterFieldErrorKey[] = ['email', 'firstName', 'privacy'];

export function createInitialNewsletterFormState() {
  return {
    email: '',
    firstName: '',
    privacyAccepted: false,
  };
}

export type NewsletterFormState = ReturnType<typeof createInitialNewsletterFormState>;

export function hasNewsletterValidationErrors(errors: NewsletterFieldErrors): boolean {
  return Object.values(errors).some((m) => m != null && m !== '');
}

export function validateNewsletterForm(
  form: NewsletterFormState,
  err: NewsletterValidationErrors
): NewsletterFieldErrors {
  const errors: NewsletterFieldErrors = {};
  if (!form.email.trim()) errors.email = err.emailRequired;
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
    errors.email = err.emailInvalid;
  }
  if (!form.firstName.trim()) errors.firstName = err.firstNameRequired;
  if (!form.privacyAccepted) errors.privacy = err.privacyRequired;
  return errors;
}

export { pdsCheckboxChecked, pdsStringValue };
