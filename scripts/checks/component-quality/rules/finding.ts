import type { ComponentQualityFinding } from '@vellira-ui/metadata';

import type {
  ComponentQualityRule,
  ComponentQualityRuleContext,
} from '../types';

export function createRuleFinding(
  rule: ComponentQualityRule,
  context: ComponentQualityRuleContext,
  status: ComponentQualityFinding['status'],
  message?: string,
  evidence?: readonly string[]
): ComponentQualityFinding {
  return {
    ruleId: rule.definition.id,
    dimension: rule.definition.dimension,
    severity: rule.definition.severity,
    evaluation: rule.definition.evaluation,
    status,
    platform: context.platform,
    message,
    evidence,
  };
}
