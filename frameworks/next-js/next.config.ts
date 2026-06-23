import type { NextConfig } from 'next';

// This configuration is only needed for a static build (SSG) to deploy this demo to GitHub Pages.
const nextConfig: NextConfig = {
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || '',
  output: 'export',
  trailingSlash: true,
  distDir: 'dist',
  experimental: {
    useLightningcss: true,
    // Disables light-dark() polyfill of lightningcss which is broken https://github.com/porsche-design-system/porsche-design-system/issues/4257
    lightningCssFeatures: {
      exclude: ['light-dark'],
    },
  },
};

export default nextConfig;
