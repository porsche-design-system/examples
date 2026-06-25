import { PWordmark } from '@porsche-design-system/components-react/ssr';
import { ColorSchemeSelect } from '../../components/common/ColorSchemeSelect';
import { Form } from '../../components/Form';
import { useColorScheme } from '../../hooks/useColorScheme';
import type { ColorScheme } from '../../models/colorScheme';
import type { Route } from './+types/home';
import logoDark from './logo-dark.svg';
import logoLight from './logo-light.svg';

export function meta(_: Route.MetaArgs) {
  return [{ title: 'New React Router App' }, { name: 'description', content: 'Welcome to React Router!' }];
}

export default function Home() {
  const { colorScheme, setColorScheme } = useColorScheme();
  return (
    <main className="grid-template my-fluid-md">
      <div className="col-wide grid grid-cols-subgrid justify-items-center gap-fluid-md p-fluid-lg bg-surface rounded-3xl">
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
