import { reactRouter } from '@react-router/dev/vite';
import tailwindcss from '@tailwindcss/vite';
import { Features } from 'lightningcss';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig(({ isSsrBuild }) => {
  return {
    define: {
      'process.browser': JSON.stringify(!isSsrBuild),
    },
    build: {
      assetsDir: 'examples/v4/react-router',
    },
    css: {
      transformer: 'lightningcss',
      // Disables light-dark() polyfill of lightningcss which is broken https://github.com/porsche-design-system/porsche-design-system/issues/4257
      lightningcss: {
        exclude: Features.LightDark,
      },
    },
    plugins: [tailwindcss(), reactRouter(), tsconfigPaths()],
  };
});
