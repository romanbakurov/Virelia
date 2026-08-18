import type { ComponentPlatform } from './component';

/**
 * Stable quality dimensions used by Component Quality Model V1.
 *
 * Dimensions describe why a rule exists. They do not imply that every rule is
 * applicable to every component or platform.
 */
export type ComponentQualityDimension =
  | 'implementation-completeness'
  | 'public-api'
  | 'type-quality'
  | 'behavior'
  | 'accessibility'
  | 'interaction'
  | 'tests'
  | 'storybook'
  | 'documentation'
  | 'tokens-theming'
  | 'exports-package'
  | 'platform-quality';

/** Required rules block readiness; recommended rules surface improvements. */
export type ComponentQualityRuleSeverity = 'required' | 'recommended';

/**
 * V1 rule outcomes.
 *
 * - pass: the applicable contract is satisfied
 * - warn: a recommended contract is not satisfied
 * - fail: a required contract is not satisfied
 * - not-applicable: the contract does not apply to this component/platform
 */
export type ComponentQualityStatus =
  'pass' | 'warn' | 'fail' | 'not-applicable';

/** Separates deterministic checks from criteria that still require judgment. */
export type ComponentQualityEvaluationKind = 'automated' | 'human-review';

/**
 * Declarative identity for a quality rule.
 *
 * The executable rule implementation belongs to the future quality checker,
 * not to this metadata package.
 */
export interface ComponentQualityRuleDefinition {
  id: string;
  dimension: ComponentQualityDimension;
  severity: ComponentQualityRuleSeverity;
  evaluation: ComponentQualityEvaluationKind;
  platforms?: readonly ComponentPlatform[];
  description: string;
}

/** One evaluated rule result suitable for human and machine-readable reports. */
export interface ComponentQualityFinding {
  ruleId: string;
  dimension: ComponentQualityDimension;
  severity: ComponentQualityRuleSeverity;
  evaluation: ComponentQualityEvaluationKind;
  status: ComponentQualityStatus;
  platform?: ComponentPlatform;
  message?: string;
  evidence?: readonly string[];
}

/** Aggregated result for one supported platform. */
export interface ComponentPlatformQualityResult {
  platform: ComponentPlatform;
  status: ComponentQualityStatus;
  findings: readonly ComponentQualityFinding[];
}

/** Aggregated result for one component across its applicable platforms. */
export interface ComponentQualityResult {
  componentName: string;
  status: ComponentQualityStatus;
  platforms: readonly ComponentPlatformQualityResult[];
  findings: readonly ComponentQualityFinding[];
}

/** Stable machine-readable envelope for Component Quality Checker V1. */
export interface ComponentQualityReportV1 {
  schemaVersion: '1';
  components: readonly ComponentQualityResult[];
}
