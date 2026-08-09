import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  devIndicators: false,
  transpilePackages: [
    '@vellira-ui/react',
    '@vellira-ui/react-native',
    '@vellira-ui/tokens',
    '@vellira-ui/icons',
    '@vellira-ui/core',
    '@vellira-ui/types',
    'react-native-web',
  ],

  turbopack: {
    resolveAlias: {
      'react-native': 'react-native-web',
    },
  },
};

export default nextConfig;
