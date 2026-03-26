import {
  getComponentChunkLinks,
  getFontLinks,
  getIconLinks,
  getMetaTagsAndIconLinks,
} from '@porsche-design-system/components-react/partials';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { Features } from 'lightningcss';
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

      return html.replace(/<\/head>/, `${headPartials}$&`);
    },
  };
};

export default defineConfig({
  base: process.env.REACT_PUBLIC_BASE_PATH || '',
  css: {
    transformer: 'lightningcss',
    // Disables light-dark() polyfill of lightningcss which is broken https://github.com/porsche-design-system/porsche-design-system/issues/4257
    lightningcss: {
      exclude: Features.LightDark,
    },
  },
  plugins: [react(), transformIndexHtmlPlugin(), tailwindcss()],
});
