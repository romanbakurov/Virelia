import type { ComponentQualityRule } from './types';
import { apiFeatureQualityRules } from './rules/api-feature';
import { componentTokenContractQualityRules } from './rules/component-token-contract';
import { conformityQualityRules } from './rules/conformity';
import { coverageQualityRules } from './rules/coverage';
import { platformAccessibilityQualityRules } from './rules/platform-accessibility';

export const componentQualityRules: readonly ComponentQualityRule[] = [
  ...apiFeatureQualityRules,
  ...platformAccessibilityQualityRules,
  ...coverageQualityRules,
  ...conformityQualityRules,
  ...componentTokenContractQualityRules,
];
