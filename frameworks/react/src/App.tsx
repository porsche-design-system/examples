import { PWordmark } from '@porsche-design-system/components-react';
import viteLogo from '/vite.svg';
import reactLogo from './assets/react.svg';
import { ColorSchemeSelect } from './components/common/ColorSchemeSelect.tsx';
import { Form } from './Form.tsx';
import { useColorScheme } from './hooks/useColorScheme.ts';
import type { ColorScheme } from './models/colorScheme.ts';

function App() {
  const { colorScheme, setColorScheme } = useColorScheme();
  return (
    <main className="grid-template my-fluid-md">
      <div className="col-wide grid grid-cols-subgrid justify-items-center gap-fluid-md p-fluid-lg bg-surface rounded-3xl">
        <PWordmark className="col-wide" />
        <h1 className="prose-display-md col-wide">Porsche Design System</h1>
        <div className="col-wide flex gap-4 items-center flex-col sm:flex-row">
          <a href="https://vite.dev" target="_blank" rel="noopener">
            <img src={viteLogo} className="logo" alt="Vite logo" width={50} />
          </a>
          <a href="https://react.dev" target="_blank" rel="noopener">
            <img src={reactLogo} className="logo react" alt="React logo" width={50} />
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

export default App;
