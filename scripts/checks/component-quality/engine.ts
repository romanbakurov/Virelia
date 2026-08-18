import {
  componentMetadata,
  validateComponentMetadata,
  type ComponentMetadata,
  type ComponentPlatform,
  type ComponentPlatformQualityResult,
  type ComponentQualityFinding,
  type ComponentQualityResult,
  type ComponentQualityStatus,
} from '@vellira-ui/metadata';

import {
  ComponentQualityRuntimeError,
  type ComponentQualityRule,
  type ComponentQualityRunOptions,
  type ComponentQualityRunResult,
  type QualityPlatformSelection,
} from './types';

const statusRank: Record<ComponentQualityStatus, number> = {
  'not-applicable': 0,
  pass: 1,
  warn: 2,
  fail: 3,
};

function aggregateStatus(statuses: readonly ComponentQualityStatus[]) {
  if (statuses.length === 0) return 'not-applicable' as const;

  return statuses.reduce<ComponentQualityStatus>((current, status) =>
    statusRank[status] > statusRank[current] ? status : current
  , 'not-applicable');
}

function selectedPlatforms(
  metadata: ComponentMetadata,
  selection: QualityPlatformSelection
): ComponentPlatform[] {
  const requested =
    selection === 'web'
      ? ['react']
      : selection === 'native'
        ? ['react-native']
        : metadata.platforms;

  return requested.filter((platform): platform is ComponentPlatform =>
    metadata.platforms.includes(platform as ComponentPlatform)
  );
}

function normalizeFinding(
  rule: ComponentQualityRule,
  finding: ComponentQualityFinding,
  platform: ComponentPlatform
): ComponentQualityFinding {
  return {
    ...finding,
    ruleId: rule.definition.id,
    dimension: rule.definition.dimension,
    severity: rule.definition.severity,
    evaluation: rule.definition.evaluation,
    platform,
  };
}

async function evaluatePlatform(
  metadata: ComponentMetadata,
  platform: ComponentPlatform,
  rules: readonly ComponentQualityRule[]
): Promise<ComponentPlatformQualityResult> {
  const findings: ComponentQualityFinding[] = [];

  for (const rule of rules) {
    if (
      rule.definition.platforms &&
      !rule.definition.platforms.includes(platform)
    ) {
      continue;
    }

    try {
      const finding = await rule.evaluate({ metadata, platform });
      findings.push(normalizeFinding(rule, finding, platform));
    } catch (error) {
      throw new ComponentQualityRuntimeError(
        `Rule "${rule.definition.id}" failed for ${metadata.name} (${platform}): ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  return {
    platform,
    status: aggregateStatus(findings.map((finding) => finding.status)),
    findings,
  };
}

export async function runComponentQualityCheck(
  options: ComponentQualityRunOptions = {}
): Promise<ComponentQualityRunResult> {
  const selection = options.platform ?? 'all';
  const rules = options.rules ?? [];

  const validatedMetadata = componentMetadata.map((metadata) => {
    const validation = validateComponentMetadata(metadata);
    if (!validation.valid) {
      throw new ComponentQualityRuntimeError(
        `Invalid metadata for ${metadata.name}: ${validation.errors.join('; ')}`
      );
    }
    return metadata;
  });

  const components = options.componentName
    ? validatedMetadata.filter(
        (metadata) =>
          metadata.name.toLowerCase() === options.componentName?.toLowerCase()
      )
    : validatedMetadata;

  if (options.componentName && components.length === 0) {
    throw new ComponentQualityRuntimeError(
      `Unknown component "${options.componentName}".`
    );
  }

  const results: ComponentQualityResult[] = [];

  for (const metadata of components) {
    const platforms = selectedPlatforms(metadata, selection);

    if (selection !== 'all' && platforms.length === 0) {
      throw new ComponentQualityRuntimeError(
        `${metadata.name} does not support platform "${selection}".`
      );
    }

    const platformResults: ComponentPlatformQualityResult[] = [];
    for (const platform of platforms) {
      platformResults.push(await evaluatePlatform(metadata, platform, rules));
    }

    const findings = platformResults.flatMap((result) => result.findings);
    results.push({
      componentName: metadata.name,
      status: aggregateStatus(platformResults.map((result) => result.status)),
      platforms: platformResults,
      findings,
    });
  }

  return {
    report: { schemaVersion: '1', components: results },
    status: aggregateStatus(results.map((result) => result.status)),
  };
}
