import { describe, expect, it } from 'vitest';
import {
  CONTACT_ERROR_FIELD_ORDER,
  type ContactValidationErrors,
  createInitialContactFormState,
  hasContactValidationErrors,
  validateContactForm,
} from '@/app/lib/contact-form';

const validationErrors: ContactValidationErrors = {
  firstNameRequired: 'First name required',
  lastNameRequired: 'Last name required',
  emailRequired: 'Email required',
  emailInvalid: 'Email invalid',
  messageRequired: 'Message required',
  privacyRequired: 'Privacy required',
};

describe('contact form validation', () => {
  it('createInitialContactFormState returns empty defaults', () => {
    const form = createInitialContactFormState();
    expect(form.firstName).toBe('');
    expect(form.lastName).toBe('');
    expect(form.email).toBe('');
    expect(form.message).toBe('');
    expect(form.privacyAccepted).toBe(false);
  });

  it('CONTACT_ERROR_FIELD_ORDER lists all validated fields', () => {
    expect(CONTACT_ERROR_FIELD_ORDER).toEqual(['firstName', 'lastName', 'email', 'message', 'privacy']);
  });

  it('validateContactForm flags all required fields when empty', () => {
    const errors = validateContactForm(createInitialContactFormState(), validationErrors);
    expect(errors.firstName).toBe(validationErrors.firstNameRequired);
    expect(errors.lastName).toBe(validationErrors.lastNameRequired);
    expect(errors.email).toBe(validationErrors.emailRequired);
    expect(errors.message).toBe(validationErrors.messageRequired);
    expect(errors.privacy).toBe(validationErrors.privacyRequired);
    expect(hasContactValidationErrors(errors)).toBe(true);
  });

  it('validateContactForm rejects invalid email', () => {
    const form = {
      ...createInitialContactFormState(),
      firstName: 'Alex',
      lastName: 'Müller',
      email: 'not-an-email',
      message: 'Hello',
      privacyAccepted: true,
    };
    const errors = validateContactForm(form, validationErrors);
    expect(errors.email).toBe(validationErrors.emailInvalid);
  });

  it('validateContactForm passes for valid input', () => {
    const form = {
      ...createInitialContactFormState(),
      firstName: 'Alex',
      lastName: 'Müller',
      email: 'alex@example.com',
      message: 'I have a question about your products.',
      privacyAccepted: true,
    };
    const errors = validateContactForm(form, validationErrors);
    expect(hasContactValidationErrors(errors)).toBe(false);
  });
});
