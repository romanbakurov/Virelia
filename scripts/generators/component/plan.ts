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
  isNative: boolean;
};

export type ComponentGenerationPlan = {
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
  }));

  const sharedTypesFileName = `${options.componentName[0].toLowerCase()}${options.componentName.slice(1)}.ts`;

  return {
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
  };
}
