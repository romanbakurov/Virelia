import { componentMetadata } from '../../../packages/metadata/src';
import type {
  ComponentPlatform,
  ComponentQualityDimension,
  ComponentQualityEvaluationKind,
  ComponentQualityRuleSeverity,
} from '@vellira-ui/metadata';

import {
  resolveComponentQualityMetadata,
  runComponentQualityCheck,
  selectedComponentQualityPlatforms,
} from './engine';
import { componentQualityRules } from './rules';
import type {
  ComponentQualityCompletionGuidance,
  ComponentQualityRunOptions,
} from './types';

export interface ComponentQualityCompletionRequirement {
  ruleId: string;
  dimension: ComponentQualityDimension;
  severity: ComponentQualityRuleSeverity;
  evaluation: ComponentQualityEvaluationKind;
  description: string;
  guidance?: ComponentQualityCompletionGuidance;
}

export interface ComponentQualityCompletionPlatformContract {
  platform: ComponentPlatform;
  requirements: readonly ComponentQualityCompletionRequirement[];
}

export interface ComponentQualityCompletionContractV1 {
  schemaVersion: '1';
  componentName: string;
  platforms: readonly ComponentQualityCompletionPlatformContract[];
}

export async function buildComponentQualityCompletionContract(
  options: Omit<ComponentQualityRunOptions, 'rules'> & {
    componentName: string;
  }
): Promise<ComponentQualityCompletionContractV1> {
  const metadataRegistry = options.metadataRegistry ?? componentMetadata;
  const selection = options.platform ?? 'all';

  const [metadata] = resolveComponentQualityMetadata(
    metadataRegistry,
    options.componentName
  );

  if (!metadata) {
    throw new Error(
      `Component Quality completion contract could not resolve "${options.componentName}".`
    );
  }

  const result = await runComponentQualityCheck({
    ...options,
    metadataRegistry,
    rules: componentQualityRules,
  });

  const component = result.report.components[0];

  if (!component || component.componentName !== metadata.name) {
    throw new Error(
      `Component Quality completion contract could not resolve "${options.componentName}".`
    );
  }

  const selectedPlatforms = selectedComponentQualityPlatforms(
    metadata,
    selection
  );

  return {
    schemaVersion: '1',
    componentName: metadata.name,
    platforms: selectedPlatforms.map((platform) => {
      const platformResult = component.platforms.find(
        (candidate) => candidate.platform === platform
      );

      if (!platformResult) {
        throw new Error(
          `Missing Component Quality result for ${metadata.name} (${platform}).`
        );
      }

      const findings = new Map(
        platformResult.findings.map((finding) => [finding.ruleId, finding])
      );

      const requirements = componentQualityRules.flatMap((rule) => {
        if (
          rule.definition.platforms &&
          !rule.definition.platforms.includes(platform)
        ) {
          return [];
        }

        const finding = findings.get(rule.definition.id);

        if (!finding || finding.status === 'not-applicable') {
          return [];
        }

        const guidance = rule.completionGuidance?.({
          metadata,
          platform,
          rootDir: options.rootDir,
        });

        return [
          {
            ruleId: rule.definition.id,
            dimension: rule.definition.dimension,
            severity: rule.definition.severity,
            evaluation: rule.definition.evaluation,
            description: rule.definition.description,
            ...(guidance ? { guidance } : {}),
          },
        ];
      });

      return {
        platform,
        requirements,
      };
    }),
  };
}
