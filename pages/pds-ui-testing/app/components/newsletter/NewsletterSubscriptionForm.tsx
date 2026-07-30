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
} from '@porsche-design-system/components-react/ssr';
import { useCallback, useEffect, useRef, useState } from 'react';
import { MainContent } from '@/app/components/layout/MainContent';
import type { Dictionary } from '@/app/i18n/get-dictionary';
import {
  createInitialNewsletterFormState,
  hasNewsletterValidationErrors,
  NEWSLETTER_ERROR_FIELD_ORDER,
  type NewsletterFieldErrorKey,
  type NewsletterFieldErrors,
  pdsCheckboxChecked,
  pdsStringValue,
  validateNewsletterForm,
} from '@/app/lib/newsletter-subscription';
import { PAGE_HEADING_ID } from '@/app/lib/skip-to-page-heading';

export type NewsletterSubscriptionCopy = Dictionary['pages']['newsletter'];

type Props = {
  copy: NewsletterSubscriptionCopy;
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

export function NewsletterSubscriptionForm({ copy }: Props) {
  const [form, setForm] = useState(createInitialNewsletterFormState);
  const [errors, setErrors] = useState<NewsletterFieldErrors>({});
  const [postSubmitPhase, setPostSubmitPhase] = useState<PostSubmitPhase>('idle');
  const fieldHostsRef = useRef<Partial<Record<NewsletterFieldErrorKey, HTMLElement | null>>>({});
  const shouldFocusFirstErrorRef = useRef(false);

  const assignFieldHostRef = useCallback(
    (key: NewsletterFieldErrorKey) => (instance: HTMLElement | null) => {
      fieldHostsRef.current[key] = instance;
    },
    []
  );

  const clearError = useCallback((key: NewsletterFieldErrorKey) => {
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
    if (!hasNewsletterValidationErrors(errors)) return;
    shouldFocusFirstErrorRef.current = false;
    const firstKey = NEWSLETTER_ERROR_FIELD_ORDER.find((key) => errors[key] != null && errors[key] !== '');
    if (!firstKey) return;
    const host = fieldHostsRef.current[firstKey];
    requestAnimationFrame(() => focusFieldHost(host));
  }, [errors]);

  const handleSubmit = useCallback(() => {
    const next = validateNewsletterForm(form, copy.errors);
    setErrors(next);
    if (hasNewsletterValidationErrors(next)) {
      shouldFocusFirstErrorRef.current = true;
      return;
    }
    setErrors({});
    setPostSubmitPhase('pending');
  }, [form, copy.errors]);

  const handleReset = useCallback(() => {
    setForm(createInitialNewsletterFormState());
    setErrors({});
    setPostSubmitPhase('idle');
  }, []);

  return (
    <MainContent className="grid-template py-fluid-lg">
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
              {copy.subscribeAgain}
            </PButton>
          </div>
        ) : postSubmitPhase === 'pending' ? (
          <div
            aria-live="polite"
            className="flex min-h-[200px] flex-col items-center justify-center gap-static-md py-fluid-lg"
            role="status"
          >
            <PSpinner aria={{ 'aria-label': copy.submittingHint }} size="lg" />
            <PText color="contrast-medium" size="sm">
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
            {hasNewsletterValidationErrors(errors) ? (
              <PInlineNotification
                description={copy.errors.formSummary}
                dismissButton={false}
                heading={copy.errors.formSummaryHeading}
                state="error"
              />
            ) : null}

            <PFieldset label={copy.fieldsetLabel}>
              <div className="mt-static-md grid gap-static-md">
                <PInputText
                  ref={assignFieldHostRef('firstName')}
                  autoComplete="given-name"
                  label={copy.firstName}
                  message={errors.firstName ?? ''}
                  name="newsletter-first-name"
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
                <PInputEmail
                  ref={assignFieldHostRef('email')}
                  autoComplete="email"
                  label={copy.email}
                  message={errors.email ?? ''}
                  name="newsletter-email"
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
                <PCheckbox
                  ref={assignFieldHostRef('privacy')}
                  checked={form.privacyAccepted}
                  label={copy.privacy}
                  message={errors.privacy ?? ''}
                  name="newsletter-privacy"
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
    </MainContent>
  );
}
