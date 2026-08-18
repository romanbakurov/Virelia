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
}

export interface ComponentQualityRule {
  definition: ComponentQualityRuleDefinition;
  evaluate(
    context: ComponentQualityRuleContext
  ): ComponentQualityFinding | Promise<ComponentQualityFinding>;
}

export interface ComponentQualityRunOptions {
  componentName?: string;
  platform?: QualityPlatformSelection;
  rules?: readonly ComponentQualityRule[];
  metadataRegistry?: readonly unknown[];
}

export interface ComponentQualityRunResult {
  report: ComponentQualityReportV1;
  status: ComponentQualityStatus;
}

export class ComponentQualityRuntimeError extends Error {
  override name = 'ComponentQualityRuntimeError';
}
