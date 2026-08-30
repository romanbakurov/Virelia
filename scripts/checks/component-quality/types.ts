import type {
  ComponentMetadata,
  ComponentPlatform,
  ComponentQualityFinding,
  ComponentQualityReportV1,
  ComponentQualityRuleDefinition,
  ComponentQualityStatus,
} from '@vellira-ui/metadata';

export type QualityPlatformSelection = 'all' | 'web' | 'native';

export interface ComponentQualityRuleContext {
  metadata: ComponentMetadata;
  platform: ComponentPlatform;
  rootDir?: string;
}

export interface ComponentQualityCompletionGuidance {
  summary: string;
  evidence?: readonly string[];
}

export interface ComponentQualityRule {
  definition: ComponentQualityRuleDefinition;
  completionGuidance?: (
    context: ComponentQualityRuleContext
  ) => ComponentQualityCompletionGuidance | undefined;
  evaluate(
    context: ComponentQualityRuleContext
  ): ComponentQualityFinding | Promise<ComponentQualityFinding>;
}

export interface ComponentQualityRunOptions {
  componentName?: string;
  platform?: QualityPlatformSelection;
  rules?: readonly ComponentQualityRule[];
  metadataRegistry?: readonly unknown[];
  rootDir?: string;
}

export interface ComponentQualityRunResult {
  report: ComponentQualityReportV1;
  status: ComponentQualityStatus;
}

export class ComponentQualityRuntimeError extends Error {
  override name = 'ComponentQualityRuntimeError';
}
