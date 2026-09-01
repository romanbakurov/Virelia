import repositoryPackage from '../../../../package.json';

export const publishedPackageNames = [
  '@vellira-ui/core',
  '@vellira-ui/icons',
  '@vellira-ui/react',
  '@vellira-ui/react-native',
  '@vellira-ui/tokens',
  '@vellira-ui/types',
] as const;

export const builtInThemeNames = ['light', 'dark', 'highContrast'] as const;

export const productionPlatformNames = ['react', 'react-native'] as const;

export type HomepageProductFacts = {
  stableRelease: string | null;
  publishedPackages: number | null;
  builtInThemes: number | null;
  productionPlatforms: number | null;
};

export function formatStableRelease(version: unknown): string | null {
  if (
    typeof version !== 'string' ||
    !/^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?$/.test(version)
  ) {
    return null;
  }

  return `v${version}`;
}

export const homepageProductFacts: HomepageProductFacts = {
  stableRelease: formatStableRelease(repositoryPackage.version),
  publishedPackages: publishedPackageNames.length,
  builtInThemes: builtInThemeNames.length,
  productionPlatforms: productionPlatformNames.length,
};
