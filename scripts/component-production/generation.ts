import path from 'node:path';

import { type ComponentGeneratorOptions } from '../generators/component/cli';
import {
  createComponentGenerationPlan,
  type ComponentGenerationPlan,
} from '../generators/component/plan';
import {
  validateComponentGenerationPlan,
  type ComponentPreflightResult,
} from '../generators/component/preflight';
import {
  runComponentGenerator,
  type RunComponentGeneratorResult,
} from '../generators/component/run';

import { validateComponentProductionRepositorySafety } from './repository-safety';

import {
  createComponentProductionGeneratorOptions,
  type ComponentProductionFinding,
  type ComponentProductionInputV1,
  type ComponentProductionStageResult,
} from './contracts';

export type ComponentProductionGenerationResult = {
  preflight: ComponentProductionStageResult;
  generation: ComponentProductionStageResult;
  generatedArtifacts: readonly string[];
};

export type ComponentProductionGenerationDependencies = {
  validateRepositorySafety?: typeof validateComponentProductionRepositorySafety;
  createPlan?: (params: {
    root: string;
    options: ComponentGeneratorOptions;
  }) => ComponentGenerationPlan;
  validatePlan?: (plan: ComponentGenerationPlan) => ComponentPreflightResult;
  runGenerator?: (params: {
    root: string;
    options: ComponentGeneratorOptions;
  }) => Promise<RunComponentGeneratorResult>;
};

export async function runComponentProductionGeneration(params: {
  root: string;
  input: ComponentProductionInputV1;
  dependencies?: ComponentProductionGenerationDependencies;
}): Promise<ComponentProductionGenerationResult> {
  const root = path.resolve(params.root);
  const options = createComponentProductionGeneratorOptions(params.input);

  const validateRepositorySafety =
    params.dependencies?.validateRepositorySafety ??
    validateComponentProductionRepositorySafety;

  const repositorySafety = validateRepositorySafety(root);

  if (!repositorySafety.ok) {
    return {
      preflight: {
        id: 'preflight',
        status: 'blocked',
        summary:
          'Component production repository safety preflight blocked generation.',
        findings: [
          {
            id: 'preflight:repository-safety',
            stage: 'preflight',
            severity: 'blocking',
            message: repositorySafety.reason,
          },
        ],
        artifacts: [],
      },
      generation: skippedGeneration(
        'Generation was skipped because repository safety preflight failed.'
      ),
      generatedArtifacts: [],
    };
  }

  const createPlan =
    params.dependencies?.createPlan ?? createComponentGenerationPlan;
  const validatePlan =
    params.dependencies?.validatePlan ?? validateComponentGenerationPlan;
  const runGenerator =
    params.dependencies?.runGenerator ?? runComponentGenerator;

  let plan: ComponentGenerationPlan;

  try {
    plan = createPlan({
      root,
      options,
    });
  } catch (error) {
    const finding = runtimeFinding('preflight:plan', 'preflight', error);

    return {
      preflight: {
        id: 'preflight',
        status: 'failed',
        summary:
          'Component production preflight could not create a generation plan.',
        findings: [finding],
        artifacts: [],
      },
      generation: skippedGeneration(
        'Generation was skipped because production planning failed.'
      ),
      generatedArtifacts: [],
    };
  }

  let preflight: ComponentPreflightResult;

  try {
    preflight = validatePlan(plan);
  } catch (error) {
    const finding = runtimeFinding('preflight:runtime', 'preflight', error);

    return {
      preflight: {
        id: 'preflight',
        status: 'failed',
        summary: 'Component production preflight could not complete.',
        findings: [finding],
        artifacts: [],
      },
      generation: skippedGeneration(
        'Generation was skipped because preflight could not complete.'
      ),
      generatedArtifacts: [],
    };
  }

  if (!preflight.ok) {
    const findings = preflight.errors.map(
      (message, index): ComponentProductionFinding => ({
        id: `preflight:${index + 1}`,
        stage: 'preflight',
        severity: 'blocking',
        message,
      })
    );

    return {
      preflight: {
        id: 'preflight',
        status: 'blocked',
        summary: 'Component production preflight rejected the generation plan.',
        findings,
        artifacts: [],
      },
      generation: skippedGeneration(
        'Generation was skipped because deterministic preflight failed.'
      ),
      generatedArtifacts: [],
    };
  }

  const preflightStage: ComponentProductionStageResult = {
    id: 'preflight',
    status: 'passed',
    summary: 'Component production preflight passed.',
    findings: [],
    artifacts: [],
  };

  try {
    const result = await runGenerator({
      root,
      options,
    });

    const artifacts = normalizeArtifacts(root, [
      ...result.createdFiles,
      ...result.updatedFiles,
    ]);

    return {
      preflight: preflightStage,
      generation: {
        id: 'generation',
        status: 'passed',
        summary: `Generated ${result.createdFiles.length} files and updated ${result.updatedFiles.length} files.`,
        findings: [],
        artifacts,
      },
      generatedArtifacts: artifacts,
    };
  } catch (error) {
    const finding = runtimeFinding('generation:runtime', 'generation', error);

    return {
      preflight: preflightStage,
      generation: {
        id: 'generation',
        status: 'failed',
        summary: 'Canonical component generation failed.',
        findings: [finding],
        artifacts: [],
      },
      generatedArtifacts: [],
    };
  }
}

function skippedGeneration(summary: string): ComponentProductionStageResult {
  return {
    id: 'generation',
    status: 'skipped',
    summary,
    findings: [],
    artifacts: [],
  };
}

function runtimeFinding(
  id: string,
  stage: 'preflight' | 'generation',
  error: unknown
): ComponentProductionFinding {
  return {
    id,
    stage,
    severity: 'blocking',
    message: error instanceof Error ? error.message : String(error),
  };
}

function normalizeArtifacts(
  root: string,
  artifacts: readonly string[]
): string[] {
  const normalized = artifacts.map((artifact) => {
    const absolute = path.resolve(artifact);
    const relative = path.relative(root, absolute);

    if (
      relative === '' ||
      relative === '..' ||
      relative.startsWith(`..${path.sep}`) ||
      path.isAbsolute(relative)
    ) {
      throw new Error(
        `Generated artifact escaped the production repository root: ${artifact}`
      );
    }

    return relative.split(path.sep).join('/');
  });

  return [...new Set(normalized)].sort();
}
