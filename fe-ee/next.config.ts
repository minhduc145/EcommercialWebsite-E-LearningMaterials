import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false,
  images: {
    unoptimized: false,
    domains: ['lh3.googleusercontent.com'],
  }
};

export default nextConfig;
