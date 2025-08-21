// @ts-check

import vue from '@astrojs/vue';
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  base: process.env.ASTRO_PUBLIC_BASE_PATH || '',
  integrations: [
    vue({
      template: {
        compilerOptions: {
          isCustomElement: (tag) => {
            return tag.startsWith('p-');
          },
        },
      },
    }),
  ],
});
