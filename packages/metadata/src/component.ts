export type ComponentPlatform = 'react' | 'react-native';

export type ComponentLayer = 'primitives' | 'components' | 'patterns';

export type ComponentStatus = 'experimental' | 'stable' | 'deprecated';

export type ComponentCategory =
  | 'action'
  | 'form'
  | 'navigation'
  | 'overlay'
  | 'feedback'
  | 'data-display'
  | 'layout'
  | 'utility';

export type ComponentCapability =
  | 'controlled'
  | 'uncontrolled'
  | 'disabled'
  | 'required'
  | 'invalid'
  | 'loading'
  | 'keyboard'
  | 'focus-management'
  | 'compound-api'
  | 'portal'
  | 'responsive';

export type ComponentProfile = 'base' | 'form-control' | 'compound' | 'overlay';

export interface ComponentDependencies {
  packages?: readonly string[];
  components?: readonly string[];
}

export interface ComponentRequirements {
  tests: boolean;
  storybook: boolean;
  docs: boolean;
  accessibility: boolean;
  tokens?: readonly string[];
}

export interface ComponentMetadata {
  name: string;
  layer: ComponentLayer;
  category: ComponentCategory;
  platforms: readonly ComponentPlatform[];
  profile: ComponentProfile;
  status: ComponentStatus;
  capabilities?: readonly ComponentCapability[];
  dependencies?: ComponentDependencies;
  requirements: ComponentRequirements;
}
