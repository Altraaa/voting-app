import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typedRoutes: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "abjoyqywflfrshargakz.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
    formats: ["image/webp", "image/avif"],
  },
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
  unoptimized: true,
};

export default nextConfig;
