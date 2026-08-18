import { componentQualityIssueMarker } from './identity';
import type {
  DesiredQualityIssue,
  NormalizedQualityFinding,
  QualityIssueLabelPolicy,
} from './types';

const defaultLabelPolicy: QualityIssueLabelPolicy = {
  base: ['component-quality'],
  dimensions: {
    accessibility: ['accessibility'],
    interaction: ['accessibility'],
    'public-api': ['api'],
    'type-quality': ['api'],
    tests: ['coverage'],
    storybook: ['coverage'],
    documentation: ['coverage'],
    'tokens-theming': ['tokens'],
    'platform-quality': ['platform-quality'],
  },
  platforms: {
    react: ['react'],
    'react-native': ['react-native'],
  },
};

function uniqueSorted(values: readonly string[]) {
  return [...new Set(values)].sort();
}

function labelsForFinding(
  finding: NormalizedQualityFinding,
  policy: QualityIssueLabelPolicy
) {
  return uniqueSorted([
    ...(policy.base ?? []),
    ...(policy.dimensions?.[finding.dimension] ?? []),
    ...(policy.platforms?.[finding.platform] ?? []),
  ]);
}

function evidenceSection(evidence: readonly string[]) {
  if (evidence.length === 0) return '_No source evidence was provided._';
  return evidence.map((entry) => `- \`${entry}\``).join('\n');
}

export function desiredIssueForFinding(
  finding: NormalizedQualityFinding,
  labelPolicy: QualityIssueLabelPolicy = defaultLabelPolicy
): DesiredQualityIssue {
  const title = `[Component Quality] ${finding.componentName} (${finding.platform}): ${finding.ruleId}`;
  const message = finding.message ?? 'The component quality rule reported an actionable finding.';

  const body = `## Component quality finding

Component: ${finding.componentName}
Platform: ${finding.platform}
Rule: ${finding.ruleId}
Dimension: ${finding.dimension}
Severity: ${finding.severity}
Result: ${finding.status.toUpperCase()}

## Finding

${message}

## Evidence

${evidenceSection(finding.evidence)}

## Remediation

Review the rule output and update the component so the quality contract is satisfied. Preserve intentional platform-specific behavior where applicable.

---

This issue is generated and maintained by the Vellira Component Quality Checker issue synchronizer. Manual notes should be kept outside the generated finding fields because synchronized content may be refreshed.

${componentQualityIssueMarker(finding.key)}`;

  return {
    key: finding.key,
    title,
    body,
    labels: labelsForFinding(finding, labelPolicy),
  };
}
