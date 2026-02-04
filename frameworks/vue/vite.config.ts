import { fileURLToPath, URL } from 'node:url';
import {
  getComponentChunkLinks,
  getFontLinks,
  getIconLinks,
  getMetaTagsAndIconLinks,
} from '@porsche-design-system/components-vue/partials';
import tailwindcss from '@tailwindcss/vite';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import { defineConfig, type PluginOption } from 'vite';
import vueDevTools from 'vite-plugin-vue-devtools';

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

// https://vite.dev/config/
export default defineConfig({
  base: process.env.VUE_PUBLIC_BASE_PATH || '',
  plugins: [
    vue(),
    vueJsx() as PluginOption,
    vueDevTools() as PluginOption,
    transformIndexHtmlPlugin(),
    tailwindcss() as PluginOption,
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
});
