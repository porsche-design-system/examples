import type { Config } from "@react-router/dev/config";

export default {
  basename: '/examples/react-router/',
  ssr: false, // disable SSR
  prerender: true, // enable SSG
} satisfies Config;
