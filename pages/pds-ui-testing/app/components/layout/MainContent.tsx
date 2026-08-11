import { PageFeedback } from '@/app/components/feedback/PageFeedback';

type Props = {
  children: React.ReactNode;
  className?: string;
};

/** Shared page landmark: page body plus site-wide feedback band before the footer. */
export function MainContent({ children, className }: Props) {
  return (
    <main className={className} data-testid="main-content">
      {children}
      <PageFeedback />
    </main>
  );
}
