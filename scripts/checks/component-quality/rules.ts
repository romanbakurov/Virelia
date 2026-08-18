import type { ComponentQualityRule } from './types';
import { apiFeatureQualityRules } from './rules/api-feature';
import { coverageQualityRules } from './rules/coverage';
import { platformAccessibilityQualityRules } from './rules/platform-accessibility';

/**
 * Canonical Component Quality Checker V1 rule registry.
 *
 * Rule families are added by #518-#521. The core checker intentionally owns
 * orchestration only and must not hard-code rule-family behavior.
 */
export const componentQualityRules: readonly ComponentQualityRule[] = [
  ...apiFeatureQualityRules,
  ...platformAccessibilityQualityRules,
  ...coverageQualityRules,
];
