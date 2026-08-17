import type { ComponentPlatform } from '@vellira-ui/metadata';

export type ComponentCheckName =
  | 'implementation'
  | 'types'
  | 'exports'
  | 'tests'
  | 'storybook'
  | 'website'
  | 'api-docs'
  | 'tokens'
  | 'accessibility';

export type ComponentCheckResult = {
  name: ComponentCheckName;
  platform?: ComponentPlatform;
  ok: boolean;
  details?: string;
};

export type ComponentCompletenessResult = {
  componentName: string;
  ready: boolean;
  checks: readonly ComponentCheckResult[];
};
