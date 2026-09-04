import type { ComponentPageMetadata } from '../../../../apps/website/src/component-catalog/metadata';
import {
  assertGeneratedNativeTextHostSafety,
  NATIVE_TEXT_IMPORT,
  renderGeneratedNativeText,
} from '../../native-text-host';
import type { ExtractedProp, Platform } from '../model/types';

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
  partProps?: Partial<
    Record<Platform, Record<string, readonly ExtractedProp[]>>
  >;
  platforms?: readonly Platform[];
}): ComponentPageMetadata {
  if (params.profile !== 'compound') {
    return {};
  }

  const parts = new Set(params.parts);

  function getPartProps(platform: Platform, partName: string) {
    return params.partProps?.[platform]?.[partName] ?? [];
  }

  function renderJsxStringExpression(value: string) {
    return `{${JSON.stringify(value)}}`;
  }

  function renderSynthesizedProp(prop: ExtractedProp) {
    if (prop.name === 'children' || !prop.required) {
      return null;
    }

    switch (prop.kind) {
      case 'string':
        return `${prop.name}='${prop.name}-1'`;

      case 'number':
        return `${prop.name}={1}`;

      case 'boolean':
        return `${prop.name}={false}`;

      case 'select':
        return `${prop.name}=${renderJsxStringExpression(prop.options[0])}`;

      case 'other':
        return null;
    }
  }

  function getUnsupportedRequiredProps(platform: Platform, partName: string) {
    return getPartProps(platform, partName).filter(
      (prop) =>
        prop.required && prop.name !== 'children' && prop.kind === 'other'
    );
  }

  function renderOpeningTag(platform: Platform, partName: string) {
    const synthesizedProps = getPartProps(platform, partName)
      .map(renderSynthesizedProp)
      .filter((prop): prop is string => Boolean(prop));

    return synthesizedProps.length > 0
      ? `<${params.componentName}.${partName} ${synthesizedProps.join(' ')}>`
      : `<${params.componentName}.${partName}>`;
  }

  function renderGeneratedText(platform: Platform, value: string) {
    return platform === 'react-native'
      ? renderGeneratedNativeText(value, 'view-like')
      : value;
  }

  function renderChildren(platform: Platform) {
    const renderedParts = parts.has('Item')
      ? ['Item', 'Trigger', 'Content']
      : ['Trigger', 'Content'];

    const unsupportedRequiredProps = renderedParts.flatMap((partName) =>
      getUnsupportedRequiredProps(platform, partName).map(
        (prop) => `${partName}.${prop.name}`
      )
    );

    if (unsupportedRequiredProps.length > 0) {
      console.warn(
        `⚠️ ${params.componentName} ${platform} compound composition requires explicit metadata for complex part props: ${unsupportedRequiredProps.join(
          ', '
        )}`
      );

      return '';
    }

    if (parts.has('Item') && parts.has('Trigger') && parts.has('Content')) {
      return `${renderOpeningTag(platform, 'Item')}
  ${renderOpeningTag(platform, 'Trigger')}${renderGeneratedText(platform, 'Section')}</${params.componentName}.Trigger>
  ${renderOpeningTag(platform, 'Content')}${renderGeneratedText(platform, 'Section content')}</${params.componentName}.Content>
</${params.componentName}.Item>`;
    }

    if (parts.has('Trigger') && parts.has('Content')) {
      return `${renderOpeningTag(platform, 'Trigger')}${renderGeneratedText(platform, 'Open')}</${params.componentName}.Trigger>
${renderOpeningTag(platform, 'Content')}${renderGeneratedText(platform, 'Content')}</${params.componentName}.Content>`;
    }

    return '';
  }

  const targetPlatforms = params.platforms ?? ['react', 'react-native'];
  const reactChildren = targetPlatforms.includes('react')
    ? renderChildren('react')
    : '';
  const nativeChildren = targetPlatforms.includes('react-native')
    ? renderChildren('react-native')
    : '';

  if (!reactChildren && !nativeChildren) {
    return {};
  }

  const metadata: ComponentPageMetadata = {};

  if (reactChildren) {
    metadata.react = { children: reactChildren };
  }

  if (nativeChildren) {
    assertGeneratedNativeTextHostSafety({
      componentName: params.componentName,
      surface: 'component-page generated native composition',
      source: nativeChildren,
    });

    metadata.native = {
      children: nativeChildren,
      imports: [NATIVE_TEXT_IMPORT],
    };
  }

  return metadata;
}

type ProfileTargetApi = {
  reactApiProps: readonly ExtractedProp[];
  nativeApiProps: readonly ExtractedProp[];
};

function filterRecordByPropNames<T>(
  record: Record<string, T> | undefined,
  propNames: ReadonlySet<string>
) {
  if (!record) {
    return undefined;
  }

  return Object.fromEntries(
    Object.entries(record).filter(([name]) => propNames.has(name))
  ) as Record<string, T>;
}

function scopeProfileMetadataToTargetApi(
  metadata: ComponentPageMetadata,
  targetApi: ProfileTargetApi
): ComponentPageMetadata {
  const reactPropNames = new Set(
    targetApi.reactApiProps.map((prop) => prop.name)
  );
  const nativePropNames = new Set(
    targetApi.nativeApiProps.map((prop) => prop.name)
  );
  const sharedPropNames = new Set([...reactPropNames, ...nativePropNames]);

  return {
    ...metadata,
    demo: metadata.demo
      ? {
          ...metadata.demo,
          initialValues: filterRecordByPropNames(
            metadata.demo.initialValues,
            sharedPropNames
          ),
        }
      : undefined,
    defaults: metadata.defaults
      ? {
          ...metadata.defaults,
          shared: filterRecordByPropNames(
            metadata.defaults.shared,
            sharedPropNames
          ),
          react: filterRecordByPropNames(
            metadata.defaults.react,
            reactPropNames
          ),
          native: filterRecordByPropNames(
            metadata.defaults.native,
            nativePropNames
          ),
        }
      : undefined,
  };
}

export function getProfileMetadata(
  profile: ComponentProfile,
  targetApi?: ProfileTargetApi
): ComponentPageMetadata {
  let metadata: ComponentPageMetadata;

  if (profile === 'selection-control') {
    metadata = {
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
  } else if (profile === 'form-control') {
    metadata = {
      demo: {
        previewWidth: 'field',
      },
    };
  } else if (profile === 'compound') {
    metadata = {
      related: ['tabs', 'select', 'dropdown'],
    };
  } else {
    metadata = {};
  }

  return targetApi
    ? scopeProfileMetadataToTargetApi(metadata, targetApi)
    : metadata;
}
