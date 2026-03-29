import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["192.168.0.100"],
  images: {
    // Local images in /public don't need remote patterns by default,
    // but they require localPatterns if you use query strings for cache busting.
    localPatterns: [
      {
        pathname: "/products/**",
      },
      {
        pathname: "/editorial/**",
      },
    ],
    // Keep unsplash pattern in case Supabase data references external URLs.
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
};

export default nextConfig;
