import { resolve } from 'node:path';
import {
  getComponentChunkLinks,
  getFontLinks,
  getIconLinks,
  getLoaderScript,
  getMetaTagsAndIconLinks,
} from '@porsche-design-system/components-js/partials';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';

const REGEX_HEAD = /<\/head>/;
const REGEX_BODY = /<\/body>/;

const transformIndexHtmlPlugin = () => {
  return {
    name: 'html-transform',
    transformIndexHtml(html) {
      // biome-ignore lint/correctness/noUnusedVariables: can be re-enabled when config is extended to support home & nav
      const cspContent = [
        `default-src 'self' https://cdn.ui.porsche.com`,
        `style-src 'self' https://cdn.ui.porsche.com 'unsafe-inline'`,
        `script-src 'self' https://cdn.ui.porsche.com ${getLoaderScript({ format: 'sha256' })}`,
        `img-src 'self' https://cdn.ui.porsche.com https://porsche-design-system.github.io data:`, // data: is needed for inline background images, e.g. used in checkbox-wrapper and radio-button-wrapper
      ].join('; ');

      const headPartials = [
        //`<meta http-equiv="Content-Security-Policy" content="${cspContent}"/>`, // disabled due to loading of H&N
        getComponentChunkLinks({ components: ['display', 'text', 'carousel', 'link-tile', 'link-pure', 'link'] }),
        getFontLinks(),
        getIconLinks(),
        getMetaTagsAndIconLinks({ appTitle: 'Examples by Porsche Design System' }),
      ].join('');

      const bodyPartials = [getLoaderScript()].join('');

      return html.replace(REGEX_HEAD, `${headPartials}$&`).replace(REGEX_BODY, `${bodyPartials}$&`);
    },
  };
};

export default defineConfig({
  base: process.env.TEMPLATES_PUBLIC_BASE_PATH || '',
  root: 'src',
  publicDir: '../public',
  emptyOutDir: true,
  server: {
    host: true,
  },
  build: {
    outDir: '../dist/',
    rollupOptions: {
      input: {
        'landing-page-1': resolve(__dirname, 'src/landing-page/1/index.html'),
        'admin-panel-1': resolve(__dirname, 'src/admin-panel/1/index.html'),
      },
    },
  },
  plugins: [transformIndexHtmlPlugin(), tailwindcss()],
});
