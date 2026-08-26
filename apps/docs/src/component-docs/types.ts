import type { ComponentPlatform } from '@vellira-ui/metadata';

export interface ComponentDocsContract {
  component: string;
  platforms: Partial<Record<ComponentPlatform, PlatformDocsContract>>;
}

export interface PlatformDocsContract {
  title: string;
  description: string;
  summary: string;
  whenToUse?: readonly string[];
  storybook?: StorybookReference;
  accessibility?: readonly string[];
  seeAlso?: readonly RelatedComponentReference[];
  notes?: readonly string[];
}

export interface StorybookReference {
  story: string;
  title: string;
  height?: number;
}

export interface RelatedComponentReference {
  component: string;
  label?: string;
}
