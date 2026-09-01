import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';

import { describe, expect, it } from 'vitest';

import {
  builtInThemeNames,
  formatStableRelease,
  homepageProductFacts,
  productionPlatformNames,
  publishedPackageNames,
} from '../../apps/website/src/config/homepageProductFacts';
import repositoryPackage from '../../package.json';

type PackageManifest = {
  name?: string;
  private?: boolean;
};

const socialProofSource = readFileSync(
  resolve('apps/website/src/sections/home/SocialProof/SocialProof.tsx'),
  'utf8'
);

function getPublishableWorkspacePackages() {
  const packagesDirectory = resolve('packages');

  return readdirSync(packagesDirectory, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => {
      const packageJsonPath = resolve(
        packagesDirectory,
        entry.name,
        'package.json'
      );
      const manifest = JSON.parse(
        readFileSync(packageJsonPath, 'utf8')
      ) as PackageManifest;

      return manifest;
    })
    .filter(
      (manifest): manifest is PackageManifest & { name: string } =>
        manifest.private !== true && typeof manifest.name === 'string'
    )
    .map((manifest) => manifest.name)
    .sort();
}

function getBuiltInThemeDirectories() {
  const tokenSourceDirectory = resolve('packages/tokens/src');

  return readdirSync(tokenSourceDirectory, { withFileTypes: true })
    .filter(
      (entry) =>
        entry.isDirectory() &&
        existsSync(resolve(tokenSourceDirectory, entry.name, 'theme.ts'))
    )
    .map((entry) => entry.name)
    .sort();
}

describe('homepage product facts', () => {
  it('derives the stable release from the repository release version', () => {
    expect(homepageProductFacts.stableRelease).toBe(
      `v${repositoryPackage.version}`
    );
    expect(formatStableRelease('2.86.0')).toBe('v2.86.0');
    expect(formatStableRelease(undefined)).toBeNull();
    expect(formatStableRelease('not-a-version')).toBeNull();
  });

  it('keeps the published package source aligned with publishable workspace manifests', () => {
    expect([...publishedPackageNames].sort()).toEqual(
      getPublishableWorkspacePackages()
    );
    expect(homepageProductFacts.publishedPackages).toBe(
      publishedPackageNames.length
    );
  });

  it('keeps the theme and platform facts explicit and non-zero', () => {
    expect([...builtInThemeNames].sort()).toEqual(getBuiltInThemeDirectories());
    expect(homepageProductFacts.builtInThemes).toBe(builtInThemeNames.length);
    expect(homepageProductFacts.productionPlatforms).toBe(
      productionPlatformNames.length
    );
    expect(productionPlatformNames).toEqual(['react', 'react-native']);
    expect(homepageProductFacts.builtInThemes).toBeGreaterThan(0);
    expect(homepageProductFacts.productionPlatforms).toBeGreaterThan(0);
  });

  it('renders known facts directly and uses a neutral unavailable state', () => {
    expect(socialProofSource).not.toContain('AnimatedMetric');
    expect(socialProofSource).toContain("{value ?? '—'}");
    expect(socialProofSource).toContain("{productFacts.stableRelease ?? '—'}");
  });
});
