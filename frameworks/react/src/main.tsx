import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { PorscheDesignSystemProvider } from '@porsche-design-system/components-react';

// biome-ignore lint/style/noNonNullAssertion: ok
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <PorscheDesignSystemProvider>
      <App />
    </PorscheDesignSystemProvider>
  </StrictMode>
)
