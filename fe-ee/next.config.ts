import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false,
  images: {
    unoptimized: true,
    domains: ['lh3.googleusercontent.com'],
  }
};

export default nextConfig;
