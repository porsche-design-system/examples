'use client';

import { createContext, useContext } from 'react';
import type { Dictionary } from '@/app/i18n/get-dictionary';

export type PageFeedbackCopy = Dictionary['feedback'];

const FeedbackCopyContext = createContext<PageFeedbackCopy | null>(null);

type ProviderProps = {
  children: React.ReactNode;
  copy: PageFeedbackCopy;
};

export function FeedbackCopyProvider({ children, copy }: ProviderProps) {
  return <FeedbackCopyContext.Provider value={copy}>{children}</FeedbackCopyContext.Provider>;
}

export function useFeedbackCopy(): PageFeedbackCopy {
  const copy = useContext(FeedbackCopyContext);
  if (!copy) {
    throw new Error('useFeedbackCopy must be used within FeedbackCopyProvider');
  }
  return copy;
}
