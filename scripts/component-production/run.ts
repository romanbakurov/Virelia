import type { ComponentCompletenessResult } from '../checks/component-completeness/types';
import type { ComponentQualityRunResult } from '../checks/component-quality/types';

import {
  runComponentProductionCommandValidation,
  type ComponentProductionCommandValidationResult,
} from './command-validation';
import {
  createComponentProductionResult,
  createComponentProductionValidationSummary,
  parseComponentProductionInput,
  type ComponentProductionInputV1,
  type ComponentProductionResultV1,
  type ComponentProductionValidationResultV1,
  type ComponentProductionStageId,
  type ComponentProductionStageResult,
} from './contracts';
import {
  runComponentProductionGeneration,
  type ComponentProductionGenerationResult,
} from './generation';
import {
  runComponentProductionStructuredValidation,
  type ComponentProductionStructuredValidationResult,
} from './structured-validation';

const VALIDATION_STAGE_IDS = [
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
] as const satisfies readonly ComponentProductionStageId[];

export type ComponentProductionValidationResult = {
  stages: readonly ComponentProductionStageResult[];
  completeness: readonly ComponentCompletenessResult[] | null;
  quality: ComponentQualityRunResult | null;
};

export type ComponentProductionRunDependencies = {
  runGeneration?: (params: {
    root: string;
    input: ComponentProductionInputV1;
  }) => Promise<ComponentProductionGenerationResult>;
  runCommandValidation?: (params: {
    root: string;
    input: ComponentProductionInputV1;
  }) => ComponentProductionCommandValidationResult;
  runStructuredValidation?: (params: {
    root: string;
    input: ComponentProductionInputV1;
  }) => Promise<ComponentProductionStructuredValidationResult>;
};

export async function runComponentProduction(params: {
  root: string;
  input: unknown;
  dependencies?: ComponentProductionRunDependencies;
}): Promise<ComponentProductionResultV1> {
  const input = parseComponentProductionInput(params.input);

  const runGeneration =
    params.dependencies?.runGeneration ?? runComponentProductionGeneration;

  const generation = await runGeneration({
    root: params.root,
    input,
  });

  if (
    generation.preflight.status !== 'passed' ||
    generation.generation.status !== 'passed'
  ) {
    return createComponentProductionResult({
      input,
      stages: [
        generation.preflight,
        generation.generation,
        ...skippedValidationStages(
          'Validation was skipped because component generation did not pass.'
        ),
      ],
      completeness: null,
      quality: null,
    });
  }

  const validation = await validateComponentProductionCandidate({
    root: params.root,
    input,
    dependencies: params.dependencies,
  });

  return createComponentProductionResult({
    input,
    stages: [generation.preflight, generation.generation, ...validation.stages],
    completeness: validation.completeness,
    quality: validation.quality,
  });
}

export async function runComponentProductionValidation(params: {
  root: string;
  input: unknown;
  dependencies?: Pick<
    ComponentProductionRunDependencies,
    'runCommandValidation' | 'runStructuredValidation'
  >;
}): Promise<ComponentProductionValidationResultV1> {
  const input = parseComponentProductionInput(params.input);

  const validation = await validateComponentProductionCandidate({
    root: params.root,
    input,
    dependencies: params.dependencies,
  });

  assertValidationStageSequence(validation.stages);

  const validationSummary = createComponentProductionValidationSummary(
    validation.stages
  );

  const blockingFindings = validation.stages.flatMap((stage) =>
    stage.findings.filter((finding) => finding.severity === 'blocking')
  );

  if (validationSummary.status !== 'ready' && blockingFindings.length === 0) {
    throw new Error(
      'Blocked or failed component production validation requires at least one blocking finding.'
    );
  }

  return {
    schemaVersion: input.schemaVersion,
    input,
    status: validationSummary.status,
    readyForReview: validationSummary.status === 'ready',
    stages: validation.stages,
    blockingFindings,
    validationSummary,
    completeness: validation.completeness,
    quality: validation.quality,
  };
}

export async function validateComponentProductionCandidate(params: {
  root: string;
  input: ComponentProductionInputV1;
  dependencies?: Pick<
    ComponentProductionRunDependencies,
    'runCommandValidation' | 'runStructuredValidation'
  >;
}): Promise<ComponentProductionValidationResult> {
  const runCommandValidation =
    params.dependencies?.runCommandValidation ??
    runComponentProductionCommandValidation;

  const runStructuredValidation =
    params.dependencies?.runStructuredValidation ??
    runComponentProductionStructuredValidation;

  const commandValidation = runCommandValidation({
    root: params.root,
    input: params.input,
  });

  const blockingCommandStage = commandValidation.stages.find(
    (stage) => stage.status !== 'passed'
  );

  if (blockingCommandStage) {
    const reason = `Structured validation was skipped because ${blockingCommandStage.id} validation did not pass.`;

    return {
      stages: [
        ...commandValidation.stages,
        skippedStage('completeness', reason),
        skippedStage('quality', reason),
      ],
      completeness: null,
      quality: null,
    };
  }

  const structuredValidation = await runStructuredValidation({
    root: params.root,
    input: params.input,
  });

  return {
    stages: [...commandValidation.stages, ...structuredValidation.stages],
    completeness: structuredValidation.completeness,
    quality: structuredValidation.quality,
  };
}

function assertValidationStageSequence(
  stages: readonly ComponentProductionStageResult[]
): void {
  if (stages.length !== VALIDATION_STAGE_IDS.length) {
    throw new Error(
      'Component production validation result must contain every canonical validation stage exactly once.'
    );
  }

  for (let index = 0; index < VALIDATION_STAGE_IDS.length; index += 1) {
    const expected = VALIDATION_STAGE_IDS[index];
    const actual = stages[index]?.id;

    if (actual !== expected) {
      throw new Error(
        `Component production validation stage order mismatch at index ${index}: expected "${expected}", got "${String(actual)}".`
      );
    }
  }
}

function skippedStage(
  id: ComponentProductionStageId,
  reason: string
): ComponentProductionStageResult {
  return {
    id,
    status: 'skipped',
    summary: reason,
    findings: [],
    artifacts: [],
  };
}

function skippedValidationStages(
  reason: string
): ComponentProductionStageResult[] {
  return VALIDATION_STAGE_IDS.map((id) => skippedStage(id, reason));
}
