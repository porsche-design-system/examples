import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { PorscheDesignSystemProvider } from '@porsche-design-system/components-react';
import App from './App.tsx';
import { ColorSchemeProvider } from './providers/ColorSchemeProvider.tsx';

// biome-ignore lint/style/noNonNullAssertion: ok
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ColorSchemeProvider>
      <PorscheDesignSystemProvider>
        <App />
      </PorscheDesignSystemProvider>
    </ColorSchemeProvider>
  </StrictMode>
);
