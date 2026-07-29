import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  devIndicators: false,
  experimental: {
    inlineCss: true,
  },
  transpilePackages: [
    '@vellira-ui/react',
    '@vellira-ui/tokens',
    '@vellira-ui/icons',
    '@vellira-ui/core',
    '@vellira-ui/types',
  ],
};

export default nextConfig;
