import type { NextConfig } from "next";

// This configuration is only needed for a static build (SSG) to deploy this demo to GitHub Pages.
const nextConfig: NextConfig = {
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || '',
  output: 'export',
  trailingSlash: true,
  distDir: 'dist',
};

export default nextConfig;
