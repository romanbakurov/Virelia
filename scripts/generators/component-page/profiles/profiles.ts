import type { ComponentPageMetadata } from '../../../../apps/website/src/component-catalog/metadata';

export type ComponentProfile = NonNullable<ComponentPageMetadata['profile']>;

export type GeneratorComponentCategory =
  | 'action'
  | 'form'
  | 'navigation'
  | 'overlay'
  | 'feedback'
  | 'data-display'
  | 'layout'
  | 'utility';

export type CatalogCategory =
  | 'general'
  | 'layout'
  | 'forms'
  | 'navigation'
  | 'overlays'
  | 'feedback'
  | 'data-display';

export const componentPageProfiles = [
  'primitive',
  'form-control',
  'selection-control',
  'compound',
  'overlay',
  'navigation',
] as const satisfies readonly ComponentProfile[];

export const generatorComponentCategories = [
  'action',
  'form',
  'navigation',
  'overlay',
  'feedback',
  'data-display',
  'layout',
  'utility',
] as const satisfies readonly GeneratorComponentCategory[];

export function mapGeneratorCategory(
  category: GeneratorComponentCategory
): CatalogCategory {
  switch (category) {
    case 'form':
      return 'forms';

    case 'navigation':
      return 'navigation';

    case 'overlay':
      return 'overlays';

    case 'feedback':
      return 'feedback';

    case 'data-display':
      return 'data-display';

    case 'layout':
      return 'layout';

    case 'action':
    case 'utility':
      return 'general';
  }
}

export function inferComponentProfile(componentName: string): ComponentProfile {
  if (['Modal', 'Popover', 'Tooltip', 'Dropdown'].includes(componentName)) {
    return 'overlay';
  }

  if (['Tabs'].includes(componentName)) {
    return 'navigation';
  }

  if (['Select'].includes(componentName)) {
    return 'compound';
  }

  if (['Radio', 'Checkbox'].includes(componentName)) {
    return 'selection-control';
  }

  if (['Input', 'FormField'].includes(componentName)) {
    return 'form-control';
  }

  return 'primitive';
}

export function catalogCategoryForProfile(
  profile: ComponentProfile
): CatalogCategory {
  if (profile === 'form-control' || profile === 'selection-control') {
    return 'forms';
  }

  if (profile === 'overlay') return 'overlays';

  if (profile === 'compound' || profile === 'navigation') {
    return 'navigation';
  }

  return 'general';
}

export function resolveCatalogCategory(params: {
  profile: ComponentProfile;
  requestedCategory?: GeneratorComponentCategory;
  generatedCategory?: GeneratorComponentCategory;
}): CatalogCategory {
  const category = params.requestedCategory ?? params.generatedCategory;

  return category
    ? mapGeneratorCategory(category)
    : catalogCategoryForProfile(params.profile);
}

export function getGeneratedCompositionMetadata(params: {
  profile: ComponentProfile;
  componentName: string;
  parts: readonly string[];
}): ComponentPageMetadata {
  if (params.profile !== 'compound') {
    return {};
  }

  const parts = new Set(params.parts);

  let children = '';

  if (parts.has('Item') && parts.has('Trigger') && parts.has('Content')) {
    children = `<${params.componentName}.Item>
  <${params.componentName}.Trigger>Section</${params.componentName}.Trigger>
  <${params.componentName}.Content>Section content</${params.componentName}.Content>
</${params.componentName}.Item>`;
  } else if (parts.has('Trigger') && parts.has('Content')) {
    children = `<${params.componentName}.Trigger>Open</${params.componentName}.Trigger>
<${params.componentName}.Content>Content</${params.componentName}.Content>`;
  }

  if (!children) {
    return {};
  }

  return {
    react: { children },
    native: { children },
  };
}

export function getProfileMetadata(
  profile: ComponentProfile
): ComponentPageMetadata {
  if (profile === 'selection-control') {
    return {
      demo: {
        label: 'Accept terms',
        initialValues: {
          checked: false,
          disabled: false,
          required: false,
          indeterminate: false,
          size: 'md',
          color: 'primary',
          labelPosition: 'end',
          error: '',
        },
        previewWidth: 'field',
      },
      defaults: {
        shared: {
          defaultChecked: false,
          disabled: false,
          required: false,
          indeterminate: false,
          size: 'md',
          color: 'primary',
          labelPosition: 'end',
        },
      },
      related: ['radio', 'select'],
    };
  }

  if (profile === 'form-control') {
    return {
      demo: {
        previewWidth: 'field',
      },
    };
  }

  if (profile === 'compound') {
    return {
      related: ['tabs', 'select', 'dropdown'],
    };
  }

  return {};
}
