import type { Config } from "@react-router/dev/config";

// This configuration is only needed for a static build (SSG) to deploy this demo to GitHub Pages.
export default {
  basename: '/examples/react-router',
  ssr: false,
  prerender: true,
} satisfies Config;
