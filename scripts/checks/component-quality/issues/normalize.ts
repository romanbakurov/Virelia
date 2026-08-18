import type { ComponentQualityReportV1 } from '@vellira-ui/metadata';

import { componentQualityFindingKey } from './identity';
import type {
  FindingNormalizationOptions,
  NormalizedQualityFinding,
} from './types';
import { ComponentQualityIssueSyncError } from './types';

function assertReport(report: unknown): asserts report is ComponentQualityReportV1 {
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

      for (const finding of platformResult.findings) {
        const status =
          finding.status === 'fail'
            ? 'fail'
            : includeWarn && finding.status === 'warn'
              ? 'warn'
              : undefined;

        if (!status) continue;

        if (!finding.ruleId || !finding.dimension || !finding.severity) {
          throw new ComponentQualityIssueSyncError(
            `Component Quality result for ${component.componentName} contains an invalid actionable finding.`
          );
        }

        const platform = finding.platform ?? platformResult.platform;
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
          dimension: finding.dimension,
          severity: finding.severity,
          status,
          message: finding.message,
          evidence: [...(finding.evidence ?? [])].sort(),
        });
      }
    }
  }

  return findings.sort((left, right) => left.key.localeCompare(right.key));
}
