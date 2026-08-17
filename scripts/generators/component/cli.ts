export type ComponentPlatformArg = 'web' | 'native' | 'both';

export type ComponentLayerArg = 'primitives' | 'components' | 'patterns';

export type ComponentCategoryArg =
  | 'action'
  | 'form'
  | 'navigation'
  | 'overlay'
  | 'feedback'
  | 'data-display'
  | 'layout'
  | 'utility';

export type ComponentProfileArg =
  'base' | 'form-control' | 'compound' | 'overlay';

export type ComponentGeneratorOptions = {
  componentName: string;
  platform: ComponentPlatformArg;
  layer: ComponentLayerArg;
  category: ComponentCategoryArg;
  force: boolean;
  profile: ComponentProfileArg;
};

const platforms: readonly ComponentPlatformArg[] = ['web', 'native', 'both'];

const layers: readonly ComponentLayerArg[] = [
  'primitives',
  'components',
  'patterns',
];

const categories: readonly ComponentCategoryArg[] = [
  'action',
  'form',
  'navigation',
  'overlay',
  'feedback',
  'data-display',
  'layout',
  'utility',
];

const componentNamePattern = /^[A-Z][A-Za-z0-9]*$/;

export const componentGeneratorUsage =
  'Usage: pnpm create:component <Name> web|native|both primitives|components|patterns action|form|navigation|overlay|feedback|data-display|layout|utility [--profile=base|form-control|compound|overlay] [--force]';

export function parseComponentGeneratorArgs(
  args: readonly string[]
): ComponentGeneratorOptions {
  const positionalArgs = args.filter((arg) => !arg.startsWith('--'));
  const flags = args.filter((arg) => arg.startsWith('--'));

  let profile: ComponentProfileArg = 'base';
  let force = false;

  const [componentName, platformArg, layerArg, categoryArg, ...extraArgs] =
    positionalArgs;

  for (const flag of flags) {
    if (flag === '--force') {
      force = true;
      continue;
    }

    if (flag.startsWith('--profile=')) {
      const value = flag.slice('--profile='.length);

      if (
        value !== 'base' &&
        value !== 'form-control' &&
        value !== 'compound' &&
        value !== 'overlay'
      ) {
        throw new Error(
          `Invalid component profile "${value}". Expected base, form-control, compound, or overlay.`
        );
      }

      profile = value;
      continue;
    }

    throw new Error(`Unknown option: ${flag}`);
  }

  if (extraArgs.length > 0) {
    throw new Error(`Unexpected arguments: ${extraArgs.join(', ')}`);
  }

  if (!componentName || !platformArg || !layerArg || !categoryArg) {
    throw new Error(componentGeneratorUsage);
  }

  if (!componentNamePattern.test(componentName)) {
    throw new Error(
      'Component name must be PascalCase and contain only letters and numbers.'
    );
  }

  if (!platforms.includes(platformArg as ComponentPlatformArg)) {
    throw new Error(
      `Invalid platform "${platformArg}". Expected: ${platforms.join(', ')}.`
    );
  }

  if (!layers.includes(layerArg as ComponentLayerArg)) {
    throw new Error(
      `Invalid layer "${layerArg}". Expected: ${layers.join(', ')}.`
    );
  }

  if (!categories.includes(categoryArg as ComponentCategoryArg)) {
    throw new Error(
      `Invalid category "${categoryArg}". Expected: ${categories.join(', ')}.`
    );
  }

  return {
    componentName,
    platform: platformArg as ComponentPlatformArg,
    layer: layerArg as ComponentLayerArg,
    category: categoryArg as ComponentCategoryArg,
    profile,
    force,
  };
}
