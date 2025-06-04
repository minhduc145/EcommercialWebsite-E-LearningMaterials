import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false,
  images: {
    unoptimized: false,
    domains: ['lh3.googleusercontent.com', 'pub-e96712ffb5c644eab6d6682c1ebe8bf3.r2.dev','images.unsplash.com'],

  }
};

export default nextConfig;
