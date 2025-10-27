import { PWordmark } from '@porsche-design-system/components-react/ssr';
import Image from 'next/image';
import { Form } from '@/components/Form';

export default function Home() {
  return (
    <main className="grid-template">
      <div className="col-wide grid grid-cols-subgrid justify-items-center gap-fluid-md p-fluid-lg bg-surface rounded-lg">
        <PWordmark className="col-wide" />
        <h1 className="prose-display-md col-wide">Porsche Design System</h1>
        <div className="col-wide flex gap-4 items-center flex-col sm:flex-row">
          <a href="https://nextjs.org/" target="_blank" rel="noopener">
            <Image className="dark:invert" src="next.svg" alt="Next.js logo" width={180} height={38} priority />
          </a>
        </div>
      </div>
      <Form />
    </main>
  );
}
