'use client';

import { PWordmark } from '@porsche-design-system/components-react/ssr';
import Image from 'next/image';
import { ColorSchemeSelect } from '@/components/common/ColorSchemeSelect';
import { Form } from '@/components/Form';
import { useColorScheme } from '@/hooks/useColorScheme';
import type { ColorScheme } from '@/models/colorScheme';

export default function Home() {
  const { colorScheme, setColorScheme } = useColorScheme();
  return (
    <main className="grid-template my-fluid-md">
      <div className="col-wide grid grid-cols-subgrid justify-items-center gap-fluid-md p-fluid-lg bg-surface rounded-4xl">
        <PWordmark className="col-wide" />
        <h1 className="prose-display-md col-wide">Porsche Design System</h1>
        <div className="col-wide flex gap-4 items-center flex-col sm:flex-row">
          <a href="https://nextjs.org/" target="_blank" rel="noopener">
            <Image
              className="dark:invert [html:not(.light)_&]:[@media(prefers-color-scheme:dark)]:invert"
              src="next.svg"
              alt="Next.js logo"
              width={180}
              height={38}
              priority
            />
          </a>
        </div>
      </div>
      <div className="col-wide flex justify-items-center gap-fluid-md p-fluid-sm bg-surface rounded-2xl">
        <ColorSchemeSelect
          className="w-48"
          value={colorScheme}
          onChange={(e) => setColorScheme((e.target as HTMLElement & { value: ColorScheme }).value)}
        />
      </div>
      <Form />
    </main>
  );
}
