import { PWordmark } from '@porsche-design-system/components-react/ssr';
import { Form } from '../../components/Form';
import type { Route } from './+types/home';
import logoDark from './logo-dark.svg';
import logoLight from './logo-light.svg';

export function meta(_: Route.MetaArgs) {
  return [{ title: 'New React Router App' }, { name: 'description', content: 'Welcome to React Router!' }];
}

export default function Home() {
  return (
    <main className="grid-template">
      <div className="col-wide grid grid-cols-subgrid justify-items-center gap-fluid-md p-fluid-lg bg-surface rounded-lg">
        <PWordmark className="col-wide" />
        <h1 className="prose-display-md col-wide">Porsche Design System</h1>
        <div className="col-wide flex gap-4 items-center flex-col sm:flex-row">
          <a href="https://reactrouter.com/docs" target="_blank" rel="noopener">
            <div className="w-[500px] max-w-[100vw] p-4">
              <img src={logoLight} alt="React Router" className="block w-full dark:hidden" />
              <img src={logoDark} alt="React Router" className="hidden w-full dark:block" />
            </div>
          </a>
        </div>
      </div>
      <Form />
    </main>
  );
}
