import type { NextConfig } from 'next';

const isSsrMode = process.env.NEXT_OUTPUT_MODE === 'ssr';

const nextConfig: NextConfig = {
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || '',
  output: isSsrMode ? undefined : 'export',
  trailingSlash: !isSsrMode,
  distDir: 'dist',
  images: isSsrMode ? undefined : { unoptimized: true },
  experimental: {
    useLightningcss: true,
    // Disables light-dark() polyfill of lightningcss which is broken.
    lightningCssFeatures: {
      exclude: ['light-dark'],
    },
  },
};

export default nextConfig;
