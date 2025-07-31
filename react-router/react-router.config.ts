import type { Config } from "@react-router/dev/config";

export default {
  ssr: false, // disable SSR
  prerender: true, // enable SSG
} satisfies Config;
