import type {
  ComponentPlatform,
  ComponentQualityDimension,
  ComponentQualityReportV1,
  ComponentQualityRuleSeverity,
} from '@vellira-ui/metadata';

import { componentQualityFindingKey } from './identity';
import type {
  FindingNormalizationOptions,
  NormalizedQualityFinding,
} from './types';
import { ComponentQualityIssueSyncError } from './types';

const componentPlatforms = new Set<ComponentPlatform>([
  'react',
  'react-native',
]);

const qualityDimensions = new Set<ComponentQualityDimension>([
  'implementation-completeness',
  'public-api',
  'type-quality',
  'behavior',
  'accessibility',
  'interaction',
  'tests',
  'storybook',
  'documentation',
  'tokens-theming',
  'exports-package',
  'platform-quality',
]);

const qualitySeverities = new Set<ComponentQualityRuleSeverity>([
  'required',
  'recommended',
]);

function assertReport(
  report: unknown
): asserts report is ComponentQualityReportV1 {
  if (!report || typeof report !== 'object') {
    throw new ComponentQualityIssueSyncError(
      'Component Quality report must be an object.'
    );
  }

  const candidate = report as {
    schemaVersion?: unknown;
    components?: unknown;
  };

  if (candidate.schemaVersion !== '1') {
    throw new ComponentQualityIssueSyncError(
      'Unsupported Component Quality report schema version.'
    );
  }

  if (!Array.isArray(candidate.components)) {
    throw new ComponentQualityIssueSyncError(
      'Component Quality report components must be an array.'
    );
  }
}

function assertPlatform(value: unknown, context: string): ComponentPlatform {
  if (
    typeof value !== 'string' ||
    !componentPlatforms.has(value as ComponentPlatform)
  ) {
    throw new ComponentQualityIssueSyncError(
      `Component Quality report contains an invalid ${context} platform.`
    );
  }

  return value as ComponentPlatform;
}

function assertDimension(value: unknown): ComponentQualityDimension {
  if (
    typeof value !== 'string' ||
    !qualityDimensions.has(value as ComponentQualityDimension)
  ) {
    throw new ComponentQualityIssueSyncError(
      'Component Quality report contains an invalid finding dimension.'
    );
  }

  return value as ComponentQualityDimension;
}

function assertSeverity(value: unknown): ComponentQualityRuleSeverity {
  if (
    typeof value !== 'string' ||
    !qualitySeverities.has(value as ComponentQualityRuleSeverity)
  ) {
    throw new ComponentQualityIssueSyncError(
      'Component Quality report contains an invalid finding severity.'
    );
  }

  return value as ComponentQualityRuleSeverity;
}

function assertOptionalString(value: unknown, field: string) {
  if (value !== undefined && typeof value !== 'string') {
    throw new ComponentQualityIssueSyncError(
      `Component Quality report contains an invalid finding ${field}.`
    );
  }
}

function normalizeEvidence(value: unknown): readonly string[] {
  if (value === undefined) return [];

  if (
    !Array.isArray(value) ||
    value.some((entry) => typeof entry !== 'string')
  ) {
    throw new ComponentQualityIssueSyncError(
      'Component Quality report contains invalid finding evidence.'
    );
  }

  return [...value].sort();
}

export function normalizeActionableFindings(
  report: unknown,
  options: FindingNormalizationOptions = {}
): readonly NormalizedQualityFinding[] {
  assertReport(report);

  const includeWarn = options.includeWarn ?? false;
  const findings: NormalizedQualityFinding[] = [];
  const seen = new Set<string>();

  for (const component of report.components) {
    if (!component || typeof component.componentName !== 'string') {
      throw new ComponentQualityIssueSyncError(
        'Component Quality report contains an invalid component result.'
      );
    }

    if (!Array.isArray(component.platforms)) {
      throw new ComponentQualityIssueSyncError(
        `Component Quality result for ${component.componentName} has invalid platforms.`
      );
    }

    for (const platformResult of component.platforms) {
      if (!platformResult || !Array.isArray(platformResult.findings)) {
        throw new ComponentQualityIssueSyncError(
          `Component Quality result for ${component.componentName} has invalid platform findings.`
        );
      }

      const resultPlatform = assertPlatform(
        platformResult.platform,
        `${component.componentName} result`
      );

      for (const finding of platformResult.findings) {
        if (!finding || typeof finding !== 'object') {
          throw new ComponentQualityIssueSyncError(
            `Component Quality result for ${component.componentName} contains an invalid finding.`
          );
        }

        const status =
          finding.status === 'fail'
            ? 'fail'
            : includeWarn && finding.status === 'warn'
              ? 'warn'
              : undefined;

        if (!status) continue;

        if (typeof finding.ruleId !== 'string' || finding.ruleId.length === 0) {
          throw new ComponentQualityIssueSyncError(
            `Component Quality result for ${component.componentName} contains an invalid actionable finding rule.`
          );
        }

        const dimension = assertDimension(finding.dimension);
        const severity = assertSeverity(finding.severity);
        assertOptionalString(finding.message, 'message');
        const evidence = normalizeEvidence(finding.evidence);
        const platform =
          finding.platform === undefined
            ? resultPlatform
            : assertPlatform(finding.platform, 'finding');

        if (platform !== resultPlatform) {
          throw new ComponentQualityIssueSyncError(
            `Component Quality result for ${component.componentName} contains a finding for a mismatched platform.`
          );
        }

        const key = componentQualityFindingKey(
          component.componentName,
          platform,
          finding.ruleId
        );

        if (seen.has(key)) continue;
        seen.add(key);

        findings.push({
          key,
          componentName: component.componentName,
          platform,
          ruleId: finding.ruleId,
          dimension,
          severity,
          status,
          message: finding.message,
          evidence,
        });
      }
    }
  }

  return findings.sort((left, right) => left.key.localeCompare(right.key));
}
