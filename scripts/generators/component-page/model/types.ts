import type { ComponentPageMetadata } from '../metadata/metadata';

export type Platform = 'react' | 'react-native';

export type GeneratedPlatformChildren = Partial<Record<Platform, string>>;

export type GeneratedPlatformImports = Partial<
  Record<Platform, readonly string[]>
>;

export type ExtractedProp = {
  name: string;
  kind: 'boolean' | 'string' | 'number' | 'select' | 'other';
  required: boolean;
  type: string;
  description: string;
  sourceFilePath?: string;
  options?: string[];
};

export type GeneratedExample = {
  title: string;
  description: string;
  props: readonly string[];
  /** Whether this example inherits the component's configured demo props. */
  inheritDemoProps?: boolean;
  imports?: readonly string[];
  reactImports?: readonly string[];
  nativeImports?: readonly string[];
  reactProps?: readonly string[];
  nativeProps?: readonly string[];
  reactChildren?: string;
  nativeChildren?: string;
  platforms?: readonly Platform[];
};

export type AccessibilityItem = {
  title: string;
  description: string;
  props?: readonly string[];
};

export type GeneratedApiSectionModel = {
  name: string;
  props: readonly ExtractedProp[];
};

export type GeneratedApiModel = Record<
  Platform,
  {
    sections: readonly GeneratedApiSectionModel[];
    inheritedProps: readonly ExtractedProp[];
  }
>;

export type GeneratedPageModel = {
  componentName: string;
  slug: string;
  platforms: readonly Platform[];
  demo: {
    staticProps: Partial<Record<Platform, string>>;
    children: GeneratedPlatformChildren;
    imports: GeneratedPlatformImports;
    responsivePresentation: boolean;
  };
  playground: {
    props: readonly ExtractedProp[];
    initialValues: Record<string, string | boolean | number>;
  };
  usage: {
    children: GeneratedPlatformChildren;
  };
  examples: readonly GeneratedExample[];
  accessibility: Record<Platform, readonly AccessibilityItem[]>;
  api: GeneratedApiModel;
  related: readonly string[];
};

export type ApiSectionConfig = NonNullable<
  NonNullable<ComponentPageMetadata['api']>['sections']
>[number];
