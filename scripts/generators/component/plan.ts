import path from 'node:path';

import type { ComponentCapability } from '@vellira-ui/metadata';
import type {
  ComponentGeneratorOptions,
  ComponentLayerArg,
  ComponentPlatformArg,
  ComponentProfileArg,
  FormControlKindArg,
} from './cli';

export type ComponentTargetPackage = 'react' | 'react-native';

export type ComponentGenerationTarget = {
  packageName: ComponentTargetPackage;
  componentDir: string;
  barrelFile: string;
  packageBarrelFile: string;
  publicApiTestFile: string;
  isNative: boolean;
};

export type ComponentTokenThemeTarget = {
  theme: 'light' | 'dark' | 'highContrast';
  componentFile: string;
  barrelFile: string;
};

export type ComponentGenerationPlan = {
  root: string;
  componentName: string;
  layer: ComponentLayerArg;
  category: ComponentGeneratorOptions['category'];
  profile: ComponentProfileArg;
  control: FormControlKindArg;
  capabilities: readonly ComponentCapability[];
  force: boolean;
  parts: readonly string[];
  targets: readonly ComponentGenerationTarget[];
  sharedTypesFile: string;
  sharedTypesBarrelFile: string;
  metadataFile: string;
  metadataBarrelFile: string;
  tokenFactoryFile: string;
  tokenFactoryBarrelFile: string;
  tokenThemeTargets: readonly ComponentTokenThemeTarget[];
  docsRoot: string;
  docsContractFile: string;
  docsContractRegistryFile: string;
};

function getTargetPackages(
  platform: ComponentPlatformArg
): ComponentTargetPackage[] {
  switch (platform) {
    case 'web':
      return ['react'];
    case 'native':
      return ['react-native'];
    case 'both':
      return ['react', 'react-native'];
  }
}

export function createComponentGenerationPlan(params: {
  root: string;
  options: ComponentGeneratorOptions;
}): ComponentGenerationPlan {
  const { root, options } = params;

  const targets = getTargetPackages(options.platform).map((packageName) => ({
    packageName,
    isNative: packageName === 'react-native',
    componentDir: path.join(
      root,
      'packages',
      packageName,
      'src',
      options.layer,
      options.componentName
    ),
    barrelFile: path.join(
      root,
      'packages',
      packageName,
      'src',
      options.layer,
      'index.ts'
    ),
    packageBarrelFile: path.join(
      root,
      'packages',
      packageName,
      'src',
      'index.ts'
    ),
    publicApiTestFile: path.join(
      root,
      'packages',
      packageName,
      'src',
      'public-api.test.ts'
    ),
  }));

  const sharedTypesFileName = `${options.componentName[0].toLowerCase()}${options.componentName.slice(1)}.ts`;
  const tokenComponentFileName = `${options.componentName[0].toLowerCase()}${options.componentName.slice(1)}.ts`;

  const tokenThemeTargets: ComponentTokenThemeTarget[] = [
    'light',
    'dark',
    'highContrast',
  ].map((theme) => ({
    theme: theme as ComponentTokenThemeTarget['theme'],
    componentFile: path.join(
      root,
      'packages',
      'tokens',
      'src',
      theme,
      'components',
      tokenComponentFileName
    ),
    barrelFile: path.join(
      root,
      'packages',
      'tokens',
      'src',
      theme,
      'components',
      'index.ts'
    ),
  }));

  return {
    root,
    componentName: options.componentName,
    layer: options.layer,
    category: options.category,
    profile: options.profile,
    control: options.control ?? 'value',
    capabilities: options.capabilities ?? [],
    parts: options.parts,
    force: options.force,
    targets,

    sharedTypesFile: path.join(
      root,
      'packages',
      'types',
      'src',
      sharedTypesFileName
    ),

    sharedTypesBarrelFile: path.join(
      root,
      'packages',
      'types',
      'src',
      'index.ts'
    ),

    metadataFile: path.join(
      root,
      'packages',
      'metadata',
      'src',
      'components',
      `${options.componentName}.metadata.ts`
    ),

    metadataBarrelFile: path.join(
      root,
      'packages',
      'metadata',
      'src',
      'components',
      'index.ts'
    ),

    tokenFactoryFile: path.join(
      root,
      'packages',
      'tokens',
      'src',
      'factories',
      `create${options.componentName}Tokens.ts`
    ),

    tokenFactoryBarrelFile: path.join(
      root,
      'packages',
      'tokens',
      'src',
      'factories',
      'index.ts'
    ),

    tokenThemeTargets,

    docsRoot: path.join(root, 'apps', 'docs', 'src'),

    docsContractFile: path.join(
      root,
      'apps',
      'docs',
      'src',
      'component-docs',
      `${options.componentName}.docs.ts`
    ),

    docsContractRegistryFile: path.join(
      root,
      'apps',
      'docs',
      'src',
      'component-docs',
      'index.ts'
    ),
  };
}
