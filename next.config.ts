import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ftp3.syscom.mx',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
