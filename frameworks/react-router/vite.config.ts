import { reactRouter } from '@react-router/dev/vite';
import tailwindcss from '@tailwindcss/vite';
import { Features } from 'lightningcss';
import { defineConfig } from 'vite';

export default defineConfig(({ isSsrBuild }) => {
  // Ensure base path ends with '/' since the React Router Vite plugin reads
  // the raw `base` value before Vite normalizes it (which would add a trailing slash).
  // Without it, asset URLs like `/base-pathassets/chunk.js` would be generated instead of `/base-path/assets/chunk.js`.
  const basePath = process.env.REACT_ROUTER_PUBLIC_BASE_PATH || '';
  const normalizedBase = basePath && !basePath.endsWith('/') ? `${basePath}/` : basePath;

  return {
    define: {
      'process.browser': JSON.stringify(!isSsrBuild),
    },
    base: normalizedBase,
    css: {
      transformer: 'lightningcss',
      // Disables light-dark() polyfill of lightningcss which is broken https://github.com/porsche-design-system/porsche-design-system/issues/4257
      lightningcss: {
        exclude: Features.LightDark,
      },
    },
    // Native tsconfig paths resolution (replaces the deprecated vite-tsconfig-paths plugin in Vite 8).
    resolve: {
      tsconfigPaths: true,
    },
    plugins: [tailwindcss(), reactRouter()],
  };
});
