import { render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { AnalyticsScripts } from '@/app/components/analytics/AnalyticsScripts';

vi.mock('next/script', () => ({
  default: ({ children, id, src }: { children?: ReactNode; id?: string; src?: string }) => (
    <script data-testid={id} id={id} src={src}>
      {children}
    </script>
  ),
}));

describe('AnalyticsScripts', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('renders nothing when NEXT_PUBLIC_FULLSTORY_ORG_ID is unset', () => {
    vi.stubEnv('NEXT_PUBLIC_FULLSTORY_ORG_ID', '');
    const { container } = render(<AnalyticsScripts />);
    expect(container).toBeEmptyDOMElement();
  });

  it('injects FullStory and Usetiful scripts when the org id is set', () => {
    vi.stubEnv('NEXT_PUBLIC_FULLSTORY_ORG_ID', 'o-ARNQ-eu1');
    render(<AnalyticsScripts />);
    expect(screen.getByTestId('fullstory-script')).toHaveTextContent('o-ARNQ-eu1');
    expect(screen.getByTestId('usetifulScript')).toHaveAttribute('src', 'https://guides.eu1.fullstory.com/dist/gs.js');
  });
});
