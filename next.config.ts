import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'replicate.delivery',
      },
      {
        protocol: 'https',
        hostname: 'replicate.com',
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: '/report',
        destination: '/report.html',
      },
    ];
  },
};

export default nextConfig;
