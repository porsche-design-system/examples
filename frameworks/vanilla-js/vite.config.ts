import {
  getComponentChunkLinks,
  getFontLinks,
  getIconLinks,
  getLoaderScript,
  getMetaTagsAndIconLinks,
} from '@porsche-design-system/components-js/partials';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';

const transformIndexHtmlPlugin = () => {
  return {
    name: 'html-transform',
    transformIndexHtml(html: string) {
      const headPartials = [
        // preloads Porsche Next font (=> minimize FOUT)
        getFontLinks(),
        // preloads PDS component core chunk from CDN for PDS component hydration (=> improve loading performance)
        getComponentChunkLinks(),
        // preloads Porsche icons (=> minimize FOUC)
        getIconLinks(),
        // injects favicon, apple touch icons, android touch icons, etc.
        getMetaTagsAndIconLinks({ appTitle: 'Porsche' }),
      ].join('');

      const bodyPartials = [getLoaderScript()].join('');

      return html.replace(/<\/head>/, `${headPartials}$&`).replace(/<\/body>/, `${bodyPartials}$&`);
    },
  };
};

export default defineConfig({
  base: process.env.VANILLA_JS_PUBLIC_BASE_PATH || '',
  plugins: [transformIndexHtmlPlugin(), tailwindcss()],
});
