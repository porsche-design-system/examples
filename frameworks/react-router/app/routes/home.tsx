import { PWordmark } from '@porsche-design-system/components-react/ssr';
import { ThemeSelect } from '../../components/common/ThemeSelect';
import { Form } from '../../components/Form';
import { useTheme } from '../../hooks/useTheme';
import type { Theme } from '../../models/theme';
import type { Route } from './+types/home';
import logoDark from './logo-dark.svg';
import logoLight from './logo-light.svg';

export function meta(_: Route.MetaArgs) {
  return [{ title: 'New React Router App' }, { name: 'description', content: 'Welcome to React Router!' }];
}

export default function Home() {
  const { theme, setTheme } = useTheme();
  return (
    <main className="grid-template my-fluid-md">
      <div className="col-wide grid grid-cols-subgrid justify-items-center gap-fluid-md p-fluid-lg bg-surface rounded-lg">
        <PWordmark className="col-wide" />
        <h1 className="prose-display-md col-wide">Porsche Design System</h1>
        <div className="col-wide flex gap-4 items-center flex-col sm:flex-row">
          <a href="https://reactrouter.com/docs" target="_blank" rel="noopener">
            <div className="w-[300px]">
              <img
                src={logoLight}
                alt="React Router"
                className="block w-full dark:hidden [html:not(.light)_&]:[@media(prefers-color-scheme:dark)]:hidden"
              />
              <img
                src={logoDark}
                alt="React Router"
                className="hidden w-full dark:block [html:not(.light)_&]:[@media(prefers-color-scheme:dark)]:block"
              />
            </div>
          </a>
        </div>
      </div>
      <div className="col-wide flex justify-items-center gap-fluid-md p-fluid-sm bg-surface rounded-2xl">
        <ThemeSelect
          className="w-48"
          value={theme}
          onChange={(e) => setTheme((e.target as HTMLElement & { value: Theme }).value)}
        />
      </div>
      <Form />
    </main>
  );
}
