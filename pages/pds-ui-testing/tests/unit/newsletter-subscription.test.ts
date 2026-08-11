import { describe, expect, it } from 'vitest';
import {
  createInitialNewsletterFormState,
  hasNewsletterValidationErrors,
  NEWSLETTER_ERROR_FIELD_ORDER,
  type NewsletterValidationErrors,
  validateNewsletterForm,
} from '@/app/lib/newsletter-subscription';

const validationErrors: NewsletterValidationErrors = {
  emailRequired: 'Email required',
  emailInvalid: 'Email invalid',
  firstNameRequired: 'First name required',
  privacyRequired: 'Privacy required',
};

describe('newsletter subscription validation', () => {
  it('createInitialNewsletterFormState returns empty defaults', () => {
    const form = createInitialNewsletterFormState();
    expect(form.email).toBe('');
    expect(form.firstName).toBe('');
    expect(form.privacyAccepted).toBe(false);
  });

  it('NEWSLETTER_ERROR_FIELD_ORDER lists all validated fields', () => {
    expect(NEWSLETTER_ERROR_FIELD_ORDER).toEqual(['email', 'firstName', 'privacy']);
  });

  it('validateNewsletterForm flags all required fields when empty', () => {
    const errors = validateNewsletterForm(createInitialNewsletterFormState(), validationErrors);
    expect(errors.email).toBe(validationErrors.emailRequired);
    expect(errors.firstName).toBe(validationErrors.firstNameRequired);
    expect(errors.privacy).toBe(validationErrors.privacyRequired);
    expect(hasNewsletterValidationErrors(errors)).toBe(true);
  });

  it('validateNewsletterForm rejects invalid email', () => {
    const form = {
      ...createInitialNewsletterFormState(),
      firstName: 'Alex',
      email: 'not-an-email',
      privacyAccepted: true,
    };
    const errors = validateNewsletterForm(form, validationErrors);
    expect(errors.email).toBe(validationErrors.emailInvalid);
    expect(errors.firstName).toBeUndefined();
    expect(errors.privacy).toBeUndefined();
  });

  it('validateNewsletterForm passes for valid input', () => {
    const form = {
      ...createInitialNewsletterFormState(),
      firstName: 'Alex',
      email: 'alex@example.com',
      privacyAccepted: true,
    };
    const errors = validateNewsletterForm(form, validationErrors);
    expect(hasNewsletterValidationErrors(errors)).toBe(false);
  });
});
