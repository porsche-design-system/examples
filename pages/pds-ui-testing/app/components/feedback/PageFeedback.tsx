'use client';

import {
  PButton,
  PHeading,
  PSegmentedControl,
  PSegmentedControlItem,
  PText,
  PTextarea,
} from '@porsche-design-system/components-react/ssr';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { pdsStringValue } from '@/app/lib/product-inquiry';
import { useFeedbackCopy } from './FeedbackCopyContext';

export type { PageFeedbackCopy } from './FeedbackCopyContext';

type Phase = 'form' | 'thanks';

const RATING_OPTIONS = [
  { value: '1', srKey: 'rating1Sr' },
  { value: '2', srKey: 'rating2Sr' },
  { value: '3', srKey: 'rating3Sr' },
  { value: '4', srKey: 'rating4Sr' },
  { value: '5', srKey: 'rating5Sr' },
] as const;

/**
 * Site-wide page feedback band (demo only — no data is sent).
 * Mirrors patterns/src/feedback/1: rating → optional comment → fake submit → thank-you.
 * Rendered as the last child of `MainContent` so it stays inside `<main>`.
 */
export function PageFeedback() {
  const copy = useFeedbackCopy();
  const [phase, setPhase] = useState<Phase>('form');
  const [rating, setRating] = useState('');
  const [comment, setComment] = useState('');
  const [hasRated, setHasRated] = useState(false);
  const [loading, setLoading] = useState(false);
  const questionRef = useRef<HTMLElement>(null);
  const thanksHeadingRef = useRef<HTMLElement>(null);
  const pendingFocusRef = useRef<'question' | 'thanks' | null>(null);
  const submitTimeoutRef = useRef<number | null>(null);

  useLayoutEffect(() => {
    const target = pendingFocusRef.current;
    if (!target) return;
    pendingFocusRef.current = null;
    if (target === 'thanks') {
      thanksHeadingRef.current?.focus();
      return;
    }
    questionRef.current?.focus();
  }, [phase]);

  useEffect(() => {
    return () => {
      if (submitTimeoutRef.current !== null) {
        window.clearTimeout(submitTimeoutRef.current);
      }
    };
  }, []);

  const revealCommentAndSubmit = (value: string) => {
    setRating(value);
    setHasRated(true);
  };

  const showConfirmation = () => {
    submitTimeoutRef.current = null;
    setLoading(false);
    pendingFocusRef.current = 'thanks';
    setPhase('thanks');
  };

  const submitFeedback = () => {
    // Simulate a short server round-trip. In a real integration the request would happen here.
    setLoading(true);
    submitTimeoutRef.current = window.setTimeout(showConfirmation, 1200);
  };

  const restartFeedback = () => {
    if (submitTimeoutRef.current !== null) {
      window.clearTimeout(submitTimeoutRef.current);
      submitTimeoutRef.current = null;
    }
    setRating('');
    setComment('');
    setLoading(false);
    setHasRated(false);
    pendingFocusRef.current = 'question';
    setPhase('form');
  };

  return (
    <section
      aria-label={copy.sectionLabel}
      className="col-full mt-fluid-xl grid grid-cols-subgrid justify-items-center bg-surface py-fluid-lg"
      data-testid="page-feedback"
    >
      <div className="col-extended grid max-w-prose justify-items-center gap-fluid-md">
        <PHeading
          ref={questionRef}
          align="center"
          className="rounded-md outline-focus outline-offset-2 focus-visible:outline"
          hidden={phase !== 'form'}
          id="feedback-question"
          size="md"
          tabIndex={-1}
          tag="h2"
        >
          {copy.question}
        </PHeading>

        <form className="grid w-full justify-items-center gap-fluid-md" hidden={phase !== 'form'} id="feedback-form">
          <div className="grid w-full items-center gap-static-md md:grid-cols-[auto_minmax(320px,1fr)_auto]">
            <PText
              align="start"
              className="col-1 row-2 justify-self-start max-sm:hidden md:col-auto md:row-auto"
              color="contrast-medium"
              size="small"
            >
              {copy.scaleStart}
            </PText>
            <PSegmentedControl
              className="col-span-2 row-1 md:col-auto md:row-auto"
              columns={{ base: 1, s: 5 }}
              hideLabel
              id="feedback-rating"
              label={copy.ratingLabel}
              name="feedback-rating"
              onChange={(event) => revealCommentAndSubmit(pdsStringValue(event))}
              value={rating || undefined}
            >
              {RATING_OPTIONS.map(({ value, srKey }) => (
                <PSegmentedControlItem key={value} value={value}>
                  {value} <span className="sm:sr-only">{copy[srKey]}</span>
                </PSegmentedControlItem>
              ))}
            </PSegmentedControl>
            <PText
              align="end"
              className="col-2 row-2 justify-self-end max-sm:hidden md:col-auto md:row-auto"
              color="contrast-medium"
              size="small"
            >
              {copy.scaleEnd}
            </PText>
          </div>
          <PTextarea
            className="w-full"
            hidden={!hasRated}
            id="feedback-comment"
            label={copy.commentLabel}
            name="comment"
            onChange={(event) => setComment(pdsStringValue(event))}
            onInput={(event) => setComment(pdsStringValue(event))}
            rows={4}
            value={comment}
          />
          <PButton hidden={!hasRated} id="feedback-submit" loading={loading} type="button" onClick={submitFeedback}>
            {copy.submit}
          </PButton>
        </form>

        <div
          aria-atomic="true"
          aria-live="polite"
          className="grid w-full justify-items-center gap-fluid-md"
          hidden={phase !== 'thanks'}
          id="feedback-thanks"
        >
          <PHeading
            ref={thanksHeadingRef}
            align="center"
            className="rounded-md outline-focus outline-offset-2 focus-visible:outline"
            id="feedback-thanks-heading"
            size="md"
            tabIndex={-1}
            tag="h2"
          >
            {copy.thanksHeading}
          </PHeading>
          <PText align="center">{copy.thanksCopy}</PText>
          <PButton icon="refresh" id="feedback-restart" type="button" variant="secondary" onClick={restartFeedback}>
            {copy.restart}
          </PButton>
        </div>
      </div>
    </section>
  );
}
