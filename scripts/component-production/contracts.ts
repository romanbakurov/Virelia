import type {
  ComponentCapability,
  ComponentPlatform,
} from '@vellira-ui/metadata';

import type { ComponentCompletenessResult } from '../checks/component-completeness/types';
import type { ComponentQualityRunResult } from '../checks/component-quality/types';
import {
  parseComponentGeneratorArgs,
  type ComponentCategoryArg,
  type ComponentGeneratorOptions,
  type ComponentLayerArg,
  type ComponentPlatformArg,
  type ComponentProfileArg,
  type FormControlKindArg,
} from '../generators/component/cli';

export const COMPONENT_PRODUCTION_SCHEMA_VERSION = '1' as const;

export type ComponentProductionInputV1 = {
  schemaVersion: typeof COMPONENT_PRODUCTION_SCHEMA_VERSION;
  componentName: string;
  platform: ComponentPlatformArg;
  layer: ComponentLayerArg;
  category: ComponentCategoryArg;
  profile: ComponentProfileArg;
  control?: FormControlKindArg;
  capabilities: readonly ComponentCapability[];
  parts: readonly string[];
};

export const COMPONENT_PRODUCTION_STAGE_IDS = [
  'preflight',
  'generation',
  'format',
  'lint',
  'tests',
  'typecheck',
  'build',
  'storybook',
  'docs',
  'website',
  'completeness',
  'quality',
] as const;

export type ComponentProductionStageId =
  (typeof COMPONENT_PRODUCTION_STAGE_IDS)[number];

export type ComponentProductionStageStatus =
  'passed' | 'blocked' | 'failed' | 'skipped';

export type ComponentProductionFindingSeverity = 'blocking' | 'warning';

export type ComponentProductionFinding = {
  id: string;
  stage: ComponentProductionStageId;
  severity: ComponentProductionFindingSeverity;
  message: string;
  path?: string;
  platform?: ComponentPlatform;
  ruleId?: string;
};

export type ComponentProductionStageResult = {
  id: ComponentProductionStageId;
  status: ComponentProductionStageStatus;
  summary: string;
  findings: readonly ComponentProductionFinding[];
  artifacts: readonly string[];
};

export type ComponentProductionStatus = 'ready' | 'blocked' | 'failed';

export type ComponentProductionArtifactGroupV1 = {
  generated: boolean;
  artifacts: readonly string[];
};

export type ComponentProductionOutputSummaryV1 = {
  generation: {
    status: ComponentProductionStageStatus;
    artifacts: readonly string[];
  };
  metadata: ComponentProductionArtifactGroupV1;
  testGeneration: ComponentProductionArtifactGroupV1;
  docsGeneration: ComponentProductionArtifactGroupV1;
  websiteGeneration: ComponentProductionArtifactGroupV1;
};

export type ComponentProductionValidationSummaryV1 = {
  status: ComponentProductionStatus;
  passedStages: readonly ComponentProductionStageId[];
  blockedStages: readonly ComponentProductionStageId[];
  failedStages: readonly ComponentProductionStageId[];
  skippedStages: readonly ComponentProductionStageId[];
};

export type ComponentProductionValidationResultV1 = {
  schemaVersion: typeof COMPONENT_PRODUCTION_SCHEMA_VERSION;
  input: ComponentProductionInputV1;
  status: ComponentProductionStatus;
  readyForReview: boolean;
  stages: readonly ComponentProductionStageResult[];
  blockingFindings: readonly ComponentProductionFinding[];
  validationSummary: ComponentProductionValidationSummaryV1;
  completeness: readonly ComponentCompletenessResult[] | null;
  quality: ComponentQualityRunResult | null;
};

export type ComponentProductionResultV1 = {
  schemaVersion: typeof COMPONENT_PRODUCTION_SCHEMA_VERSION;
  input: ComponentProductionInputV1;
  status: ComponentProductionStatus;
  readyForReview: boolean;
  stages: readonly ComponentProductionStageResult[];
  blockingFindings: readonly ComponentProductionFinding[];
  artifacts: readonly string[];
  outputs: ComponentProductionOutputSummaryV1;
  validationSummary: ComponentProductionValidationSummaryV1;
  completeness: readonly ComponentCompletenessResult[] | null;
  quality: ComponentQualityRunResult | null;
};

const INPUT_KEYS = new Set([
  'schemaVersion',
  'componentName',
  'platform',
  'layer',
  'category',
  'profile',
  'control',
  'capabilities',
  'parts',
]);

export function parseComponentProductionInput(
  value: unknown
): ComponentProductionInputV1 {
  if (!isRecord(value)) {
    throw new Error('Component production input must be an object.');
  }

  for (const key of Object.keys(value)) {
    if (!INPUT_KEYS.has(key)) {
      throw new Error(`Unknown component production input field "${key}".`);
    }
  }

  if (value.schemaVersion !== COMPONENT_PRODUCTION_SCHEMA_VERSION) {
    throw new Error(
      `Unsupported component production schema version "${String(
        value.schemaVersion
      )}". Expected "${COMPONENT_PRODUCTION_SCHEMA_VERSION}".`
    );
  }

  const componentName = requiredString(value, 'componentName');
  const platform = requiredString(value, 'platform');
  const layer = requiredString(value, 'layer');
  const category = requiredString(value, 'category');
  const profile = requiredString(value, 'profile');
  const control = optionalString(value, 'control');
  const capabilities = optionalStringArray(value, 'capabilities');
  const parts = optionalStringArray(value, 'parts');

  const args = [
    componentName,
    platform,
    layer,
    category,
    `--profile=${profile}`,
  ];

  if (control !== undefined) {
    args.push(`--control=${control}`);
  }

  if (capabilities.length > 0) {
    args.push(`--capabilities=${capabilities.join(',')}`);
  }

  if (parts.length > 0) {
    args.push(`--parts=${parts.join(',')}`);
  }

  const generatorOptions = parseComponentGeneratorArgs(args);

  return {
    schemaVersion: COMPONENT_PRODUCTION_SCHEMA_VERSION,
    componentName: generatorOptions.componentName,
    platform: generatorOptions.platform,
    layer: generatorOptions.layer,
    category: generatorOptions.category,
    profile: generatorOptions.profile,
    ...(generatorOptions.profile === 'form-control'
      ? {
          control: generatorOptions.control ?? 'value',
        }
      : {}),
    capabilities: generatorOptions.capabilities ?? [],
    parts: generatorOptions.parts,
  };
}

export function createComponentProductionGeneratorOptions(
  input: ComponentProductionInputV1
): ComponentGeneratorOptions {
  return {
    componentName: input.componentName,
    platform: input.platform,
    layer: input.layer,
    category: input.category,
    profile: input.profile,
    ...(input.control !== undefined
      ? {
          control: input.control,
        }
      : {}),
    capabilities: input.capabilities,
    parts: input.parts,
    force: false,
    dryRun: false,
    check: false,
  };
}

export function createComponentProductionResult(params: {
  input: ComponentProductionInputV1;
  stages: readonly ComponentProductionStageResult[];
  completeness: readonly ComponentCompletenessResult[] | null;
  quality: ComponentQualityRunResult | null;
}): ComponentProductionResultV1 {
  assertCanonicalStageSequence(params.stages);

  for (const stage of params.stages) {
    for (const finding of stage.findings) {
      if (finding.stage !== stage.id) {
        throw new Error(
          `Component production finding "${finding.id}" belongs to stage "${finding.stage}" but was emitted by "${stage.id}".`
        );
      }
    }
  }

  const validationSummary = createComponentProductionValidationSummary(
    params.stages
  );
  const status = validationSummary.status;

  const blockingFindings = params.stages.flatMap((stage) =>
    stage.findings.filter((finding) => finding.severity === 'blocking')
  );

  if (status !== 'ready' && blockingFindings.length === 0) {
    throw new Error(
      'Blocked or failed component production results require at least one blocking finding.'
    );
  }

  const artifacts = [
    ...new Set(params.stages.flatMap((stage) => stage.artifacts)),
  ].sort();

  const outputs = createComponentProductionOutputSummary(params.stages);

  return {
    schemaVersion: COMPONENT_PRODUCTION_SCHEMA_VERSION,
    input: params.input,
    status,
    readyForReview: status === 'ready',
    stages: params.stages,
    blockingFindings,
    artifacts,
    outputs,
    validationSummary,
    completeness: params.completeness,
    quality: params.quality,
  };
}

export function createComponentProductionValidationSummary(
  stages: readonly ComponentProductionStageResult[]
): ComponentProductionValidationSummaryV1 {
  const passedStages = stages
    .filter((stage) => stage.status === 'passed')
    .map((stage) => stage.id);

  const blockedStages = stages
    .filter((stage) => stage.status === 'blocked')
    .map((stage) => stage.id);

  const failedStages = stages
    .filter((stage) => stage.status === 'failed')
    .map((stage) => stage.id);

  const skippedStages = stages
    .filter((stage) => stage.status === 'skipped')
    .map((stage) => stage.id);

  const status: ComponentProductionStatus =
    failedStages.length > 0
      ? 'failed'
      : blockedStages.length > 0 || skippedStages.length > 0
        ? 'blocked'
        : 'ready';

  return {
    status,
    passedStages,
    blockedStages,
    failedStages,
    skippedStages,
  };
}

export function createComponentProductionOutputSummary(
  stages: readonly ComponentProductionStageResult[]
): ComponentProductionOutputSummaryV1 {
  const generation = stages.find((stage) => stage.id === 'generation');

  if (!generation) {
    throw new Error(
      'Component production output summary requires the generation stage.'
    );
  }

  const artifacts = [...new Set(generation.artifacts)].sort();

  return {
    generation: {
      status: generation.status,
      artifacts,
    },
    metadata: artifactGroup(
      artifacts,
      (artifact) =>
        artifact.startsWith('packages/metadata/') ||
        artifact.endsWith('.metadata.ts')
    ),
    testGeneration: artifactGroup(
      artifacts,
      (artifact) =>
        artifact.includes('.test.') ||
        artifact.includes('test-contract') ||
        artifact.endsWith('/public-api.test.ts')
    ),
    docsGeneration: artifactGroup(
      artifacts,
      (artifact) =>
        artifact.startsWith('apps/docs/') ||
        artifact.endsWith('/API.md') ||
        artifact.includes('/component-docs/')
    ),
    websiteGeneration: artifactGroup(artifacts, (artifact) =>
      artifact.startsWith('apps/website/')
    ),
  };
}

function artifactGroup(
  artifacts: readonly string[],
  matches: (artifact: string) => boolean
): ComponentProductionArtifactGroupV1 {
  const selected = artifacts.filter(matches);

  return {
    generated: selected.length > 0,
    artifacts: selected,
  };
}

function assertCanonicalStageSequence(
  stages: readonly ComponentProductionStageResult[]
): void {
  if (stages.length !== COMPONENT_PRODUCTION_STAGE_IDS.length) {
    throw new Error(
      'Component production result must contain every canonical pipeline stage exactly once.'
    );
  }

  for (
    let index = 0;
    index < COMPONENT_PRODUCTION_STAGE_IDS.length;
    index += 1
  ) {
    const expected = COMPONENT_PRODUCTION_STAGE_IDS[index];
    const actual = stages[index]?.id;

    if (actual !== expected) {
      throw new Error(
        `Component production stage order mismatch at index ${index}: expected "${expected}", got "${String(actual)}".`
      );
    }
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function requiredString(value: Record<string, unknown>, key: string): string {
  const field = value[key];

  if (typeof field !== 'string' || field.length === 0) {
    throw new Error(
      `Component production input field "${key}" must be a non-empty string.`
    );
  }

  return field;
}

function optionalString(
  value: Record<string, unknown>,
  key: string
): string | undefined {
  const field = value[key];

  if (field === undefined) {
    return undefined;
  }

  if (typeof field !== 'string' || field.length === 0) {
    throw new Error(
      `Component production input field "${key}" must be a non-empty string when provided.`
    );
  }

  return field;
}

function optionalStringArray(
  value: Record<string, unknown>,
  key: string
): string[] {
  const field = value[key];

  if (field === undefined) {
    return [];
  }

  if (
    !Array.isArray(field) ||
    field.some(
      (item) =>
        typeof item !== 'string' || item.length === 0 || item.includes(',')
    )
  ) {
    throw new Error(
      `Component production input field "${key}" must be an array of non-empty strings without commas.`
    );
  }

  return [...field];
}
