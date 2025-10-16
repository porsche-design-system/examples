import viteLogo from '/vite.svg';
import reactLogo from './assets/react.svg';
import './App.css';
import { PWordmark } from '@porsche-design-system/components-react';
import { Form } from './Form.tsx';

function App() {
  return (
    <main className="grid-template">
      <div className="col-wide grid grid-cols-subgrid justify-items-center gap-fluid-md p-fluid-lg bg-surface rounded-lg">
        <PWordmark className="col-wide" />
        <h1 className="prose-display-md col-wide">Porsche Design System</h1>
        <div className="col-wide flex gap-4 items-center flex-col sm:flex-row">
          <a href="https://vite.dev" target="_blank" rel="noopener">
            <img src={viteLogo} className="logo" alt="Vite logo" />
          </a>
          <a href="https://react.dev" target="_blank" rel="noopener">
            <img src={reactLogo} className="logo react" alt="React logo" />
          </a>
        </div>
      </div>
      <Form />
    </main>
  );
}

export default App;
