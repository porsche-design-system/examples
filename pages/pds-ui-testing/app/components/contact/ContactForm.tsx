'use client';

import {
  PButton,
  PCheckbox,
  PFieldset,
  PHeading,
  PInlineNotification,
  PInputEmail,
  PInputText,
  PPopover,
  PSpinner,
  PText,
  PTextarea,
} from '@porsche-design-system/components-react/ssr';
import { useCallback, useEffect, useRef, useState } from 'react';
import type { Dictionary } from '@/app/i18n/get-dictionary';
import {
  CONTACT_ERROR_FIELD_ORDER,
  type ContactFieldErrorKey,
  type ContactFieldErrors,
  createInitialContactFormState,
  hasContactValidationErrors,
  pdsCheckboxChecked,
  pdsStringValue,
  validateContactForm,
} from '@/app/lib/contact-form';
import { PAGE_HEADING_ID } from '@/app/lib/skip-to-page-heading';

export type ContactFormCopy = Dictionary['pages']['contact'];

type Props = {
  copy: ContactFormCopy;
};

type PostSubmitPhase = 'idle' | 'pending' | 'done';

function focusFieldHost(host: HTMLElement | null | undefined): void {
  if (!host) return;
  host.scrollIntoView({ block: 'nearest', inline: 'nearest' });
  host.focus();
  const root = host.shadowRoot;
  if (!root) return;
  const inner = root.querySelector<HTMLElement>('input:not([type="hidden"]), textarea, button:not([disabled])');
  if (inner && document.activeElement !== inner) inner.focus();
}

export function ContactForm({ copy }: Props) {
  const [form, setForm] = useState(createInitialContactFormState);
  const [errors, setErrors] = useState<ContactFieldErrors>({});
  const [postSubmitPhase, setPostSubmitPhase] = useState<PostSubmitPhase>('idle');
  const fieldHostsRef = useRef<Partial<Record<ContactFieldErrorKey, HTMLElement | null>>>({});
  const shouldFocusFirstErrorRef = useRef(false);

  const assignFieldHostRef = useCallback(
    (key: ContactFieldErrorKey) => (instance: HTMLElement | null) => {
      fieldHostsRef.current[key] = instance;
    },
    []
  );

  const clearError = useCallback((key: ContactFieldErrorKey) => {
    setErrors((prev) => {
      if (!(key in prev)) return prev;
      const next = { ...prev };
      delete next[key];
      return next;
    });
  }, []);

  useEffect(() => {
    if (postSubmitPhase !== 'pending') return;
    const id = window.setTimeout(() => {
      setPostSubmitPhase('done');
    }, 5000);
    return () => window.clearTimeout(id);
  }, [postSubmitPhase]);

  useEffect(() => {
    if (!shouldFocusFirstErrorRef.current) return;
    if (!hasContactValidationErrors(errors)) return;
    shouldFocusFirstErrorRef.current = false;
    const firstKey = CONTACT_ERROR_FIELD_ORDER.find((key) => errors[key] != null && errors[key] !== '');
    if (!firstKey) return;
    const host = fieldHostsRef.current[firstKey];
    requestAnimationFrame(() => focusFieldHost(host));
  }, [errors]);

  const handleSubmit = useCallback(() => {
    const next = validateContactForm(form, copy.errors);
    setErrors(next);
    if (hasContactValidationErrors(next)) {
      shouldFocusFirstErrorRef.current = true;
      return;
    }
    setErrors({});
    setPostSubmitPhase('pending');
  }, [form, copy.errors]);

  const handleReset = useCallback(() => {
    setForm(createInitialContactFormState());
    setErrors({});
    setPostSubmitPhase('idle');
  }, []);

  return (
    <main className="grid-template py-fluid-lg" data-testid="main-content">
      <div className="col-wide flex max-w-prose flex-col gap-fluid-md">
        <div className="flex flex-col gap-fluid-sm">
          <PHeading id={PAGE_HEADING_ID} tag="h1">
            {copy.title}
          </PHeading>
          <PText color="contrast-medium">{copy.intro}</PText>
        </div>

        {postSubmitPhase === 'done' ? (
          <div className="grid gap-fluid-md" role="status">
            <PInlineNotification
              description={copy.successDescription}
              dismissButton={false}
              heading={copy.successHeading}
              state="success"
            />
            <PButton onClick={handleReset} type="button" variant="secondary">
              {copy.sendAnother}
            </PButton>
          </div>
        ) : postSubmitPhase === 'pending' ? (
          <div
            aria-live="polite"
            className="flex min-h-[200px] flex-col items-center justify-center gap-static-md py-fluid-lg"
            role="status"
          >
            <PSpinner aria={{ 'aria-label': copy.submittingHint }} size="large" />
            <PText color="contrast-medium" size="small">
              {copy.submittingHint}
            </PText>
          </div>
        ) : (
          <form
            className="grid gap-fluid-md"
            noValidate
            onSubmit={(event) => {
              event.preventDefault();
              handleSubmit();
            }}
          >
            {hasContactValidationErrors(errors) ? (
              <PInlineNotification
                description={copy.errors.formSummary}
                dismissButton={false}
                heading={copy.errors.formSummaryHeading}
                state="error"
              />
            ) : null}

            <PFieldset label={copy.fieldsetContact}>
              <div className="mt-static-md grid gap-static-md md:grid-cols-2">
                <PInputText
                  ref={assignFieldHostRef('firstName')}
                  autoComplete="given-name"
                  label={copy.firstName}
                  message={errors.firstName ?? ''}
                  name="contact-first-name"
                  onChange={(e) => {
                    setForm((s) => ({
                      ...s,
                      firstName: pdsStringValue(e),
                    }));
                    clearError('firstName');
                  }}
                  onInput={(e) => {
                    setForm((s) => ({
                      ...s,
                      firstName: pdsStringValue(e),
                    }));
                    clearError('firstName');
                  }}
                  required
                  state={errors.firstName ? 'error' : 'none'}
                  value={form.firstName}
                />
                <PInputText
                  ref={assignFieldHostRef('lastName')}
                  autoComplete="family-name"
                  label={copy.lastName}
                  message={errors.lastName ?? ''}
                  name="contact-last-name"
                  onChange={(e) => {
                    setForm((s) => ({
                      ...s,
                      lastName: pdsStringValue(e),
                    }));
                    clearError('lastName');
                  }}
                  onInput={(e) => {
                    setForm((s) => ({
                      ...s,
                      lastName: pdsStringValue(e),
                    }));
                    clearError('lastName');
                  }}
                  required
                  state={errors.lastName ? 'error' : 'none'}
                  value={form.lastName}
                />
                <PInputEmail
                  ref={assignFieldHostRef('email')}
                  autoComplete="email"
                  className="md:col-span-2"
                  label={copy.email}
                  message={errors.email ?? ''}
                  name="contact-email"
                  onChange={(e) => {
                    setForm((s) => ({
                      ...s,
                      email: pdsStringValue(e),
                    }));
                    clearError('email');
                  }}
                  onInput={(e) => {
                    setForm((s) => ({
                      ...s,
                      email: pdsStringValue(e),
                    }));
                    clearError('email');
                  }}
                  required
                  state={errors.email ? 'error' : 'none'}
                  value={form.email}
                />
              </div>
            </PFieldset>

            <PFieldset label={copy.fieldsetMessage}>
              <div className="mt-static-md grid gap-static-md">
                <PTextarea
                  ref={assignFieldHostRef('message')}
                  label={copy.message}
                  message={errors.message ?? ''}
                  name="contact-message"
                  onChange={(e) => {
                    setForm((s) => ({
                      ...s,
                      message: pdsStringValue(e),
                    }));
                    clearError('message');
                  }}
                  onInput={(e) => {
                    setForm((s) => ({
                      ...s,
                      message: pdsStringValue(e),
                    }));
                    clearError('message');
                  }}
                  placeholder={copy.messagePlaceholder}
                  required
                  rows={5}
                  state={errors.message ? 'error' : 'none'}
                  value={form.message}
                  counter
                  maxLength={500}
                />
                <PCheckbox
                  ref={assignFieldHostRef('privacy')}
                  checked={form.privacyAccepted}
                  label={copy.privacy}
                  message={errors.privacy ?? ''}
                  name="contact-privacy"
                  onChange={(e) => {
                    setForm((s) => ({
                      ...s,
                      privacyAccepted: pdsCheckboxChecked(e, s.privacyAccepted),
                    }));
                    clearError('privacy');
                  }}
                  required
                  state={errors.privacy ? 'error' : 'none'}
                >
                  <PPopover slot="label-after">{copy.privacyPopover}</PPopover>
                </PCheckbox>
              </div>
            </PFieldset>

            <PButton type="submit" variant="primary">
              {copy.submit}
            </PButton>
          </form>
        )}
      </div>
    </main>
  );
}
