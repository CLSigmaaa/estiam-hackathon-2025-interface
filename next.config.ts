import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
   eslint: {
    ignoreDuringBuilds: false, // true = ignore les erreurs ESLint lors du build
  },
  typescript: {
    ignoreBuildErrors: false, // true = ignore les erreurs TypeScript lors du build
  },
};

export default nextConfig;
