export type ComponentCatalogPlatform = 'react' | 'react-native';

export type ComponentCatalogProfile =
  | 'primitive'
  | 'form-control'
  | 'selection-control'
  | 'compound'
  | 'overlay'
  | 'navigation';

export type ComponentPlatformMetadata = {
  demoProps?: string;
  children?: string;
  childPropBindings?: readonly ComponentChildPropBinding[];
  imports?: readonly string[];
  responsivePresentation?: boolean;
};

export type ComponentChildPropBinding = {
  target: string;
  props: readonly string[];
};

export type ComponentDemoMetadata = {
  label?: string;
  description?: string;
  excludeControls?: readonly string[];
  initialValues?: Record<string, string | boolean | number>;
  staticProps?: Record<string, string>;
  satisfiedRequiredProps?: readonly string[];
  previewWidth?: 'auto' | 'field' | 'full';
};

export type ComponentExampleMetadata = {
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
  platforms?: readonly ComponentCatalogPlatform[];
};

export type ComponentApiMetadata = {
  sections?: readonly {
    name: string;
    exportName: string | Partial<Record<ComponentCatalogPlatform, string>>;
  }[];
  descriptions?: Record<string, string>;
};

export type ComponentAccessibilityMetadata = {
  react?: readonly {
    title: string;
    description: string;
    props?: readonly string[];
  }[];
  native?: readonly {
    title: string;
    description: string;
    props?: readonly string[];
  }[];
};

export type ComponentPageMetadata = {
  profile?: ComponentCatalogProfile;
  react?: ComponentPlatformMetadata;
  native?: ComponentPlatformMetadata;
  demo?: ComponentDemoMetadata;
  defaults?: {
    shared?: Record<string, string | boolean | number>;
    react?: Record<string, string | boolean | number>;
    native?: Record<string, string | boolean | number>;
  };
  examples?: readonly ComponentExampleMetadata[];
  api?: ComponentApiMetadata;
  accessibility?: ComponentAccessibilityMetadata;
  related?: readonly string[];
};

export function defineComponentPageMetadata(metadata: ComponentPageMetadata) {
  return metadata;
}
