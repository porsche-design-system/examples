import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import {
  getComponentChunkLinks,
  getFontFaceStyles,
  getFontLinks,
  getIconLinks,
  getInitialStyles,
  getMetaTagsAndIconLinks
} from "@porsche-design-system/components-react/partials";

const transformIndexHtmlPlugin = () => {
  return {
    name: 'html-transform',
    transformIndexHtml(html: string) {
      const headPartials = [
        // necessary for SSR support, injects stylesheet which defines visibility of pre-hydrated PDS components
        getInitialStyles(),
        // injects stylesheet which defines Porsche Next CSS font-face definition (=> minimize FOUT)
        getFontFaceStyles(),
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
  plugins: [react(), transformIndexHtmlPlugin(), tailwindcss()],
});
