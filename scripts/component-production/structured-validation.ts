import { spawnSync } from 'node:child_process';
import path from 'node:path';

import type { ComponentCompletenessResult } from '../checks/component-completeness/types';
import type { ComponentQualityRunResult } from '../checks/component-quality/types';

import type {
  ComponentProductionFinding,
  ComponentProductionInputV1,
  ComponentProductionStageResult,
} from './contracts';
import {
  COMPONENT_PRODUCTION_VALIDATION_WORKER_SCHEMA_VERSION,
  type ComponentProductionValidationWorkerResult,
} from './structured-validation-protocol';

const STRUCTURED_VALIDATION_TIMEOUT_MS = 120_000;

export type ComponentProductionStructuredValidationResult = {
  stages: readonly [
    ComponentProductionStageResult,
    ComponentProductionStageResult,
  ];
  completeness: readonly ComponentCompletenessResult[] | null;
  quality: ComponentQualityRunResult | null;
};

export type ComponentProductionStructuredValidationWorkerExecution = {
  exitCode: number | null;
  stdout: string;
  stderr: string;
  timedOut: boolean;
  error?: string;
};

export type ComponentProductionStructuredValidationWorkerRunner = (params: {
  root: string;
  componentName: string;
  platform: 'web' | 'native' | 'all';
}) => ComponentProductionStructuredValidationWorkerExecution;

export async function runComponentProductionStructuredValidation(params: {
  root: string;
  input: ComponentProductionInputV1;
  runner?: ComponentProductionStructuredValidationWorkerRunner;
}): Promise<ComponentProductionStructuredValidationResult> {
  const root = path.resolve(params.root);
  const runner =
    params.runner ?? runComponentProductionStructuredValidationWorker;

  let execution: ComponentProductionStructuredValidationWorkerExecution;

  try {
    execution = runner({
      root,
      componentName: params.input.componentName,
      platform: qualityPlatformSelection(params.input),
    });
  } catch (error) {
    return runtimeFailure(error);
  }

  if (
    execution.timedOut ||
    execution.error !== undefined ||
    execution.exitCode !== 0
  ) {
    return runtimeFailure(
      execution.timedOut
        ? new Error(
            `Structured validation timed out after ${STRUCTURED_VALIDATION_TIMEOUT_MS}ms.`
          )
        : new Error(
            execution.error ??
              execution.stderr.trim() ??
              `Structured validation exited with code ${String(
                execution.exitCode
              )}.`
          )
    );
  }

  let workerResult: ComponentProductionValidationWorkerResult;

  try {
    workerResult = parseWorkerResult(execution.stdout);
  } catch (error) {
    return runtimeFailure(error);
  }

  if (workerResult.status === 'blocked') {
    return {
      stages: [
        {
          id: 'completeness',
          status: 'blocked',
          summary:
            'Canonical component metadata validation blocked production.',
          findings: [
            {
              id: `completeness:${normalizeId(
                workerResult.componentName
              )}:metadata-registration`,
              stage: 'completeness',
              severity: 'blocking',
              message: workerResult.message,
            },
          ],
          artifacts: [],
        },
        {
          id: 'quality',
          status: 'skipped',
          summary:
            'Component Quality validation was skipped because canonical metadata registration did not pass.',
          findings: [],
          artifacts: [],
        },
      ],
      completeness: null,
      quality: null,
    };
  }

  const completenessStage = completenessStageFromResults(
    workerResult.completeness
  );

  if (completenessStage.status !== 'passed') {
    return {
      stages: [
        completenessStage,
        {
          id: 'quality',
          status: 'skipped',
          summary:
            'Component Quality validation was skipped because completeness validation did not pass.',
          findings: [],
          artifacts: [],
        },
      ],
      completeness: workerResult.completeness,
      quality: null,
    };
  }

  if (workerResult.quality === null) {
    return {
      stages: [
        completenessStage,
        {
          id: 'quality',
          status: 'failed',
          summary: 'Component Quality validation could not complete reliably.',
          findings: [
            {
              id: 'quality:missing-result',
              stage: 'quality',
              severity: 'blocking',
              message:
                'Structured validation worker did not return a quality result after completeness passed.',
            },
          ],
          artifacts: [],
        },
      ],
      completeness: workerResult.completeness,
      quality: null,
    };
  }

  return {
    stages: [
      completenessStage,
      qualityStageFromResult(params.input, workerResult.quality),
    ],
    completeness: workerResult.completeness,
    quality: workerResult.quality,
  };
}

export function runComponentProductionStructuredValidationWorker(params: {
  root: string;
  componentName: string;
  platform: 'web' | 'native' | 'all';
}): ComponentProductionStructuredValidationWorkerExecution {
  const result = spawnSync(
    'pnpm',
    [
      'exec',
      'tsx',
      'scripts/component-production/structured-validation-worker.ts',
      params.componentName,
      params.platform,
    ],
    {
      cwd: params.root,
      encoding: 'utf8',
      timeout: STRUCTURED_VALIDATION_TIMEOUT_MS,
      shell: false,
    }
  );

  const errorCode =
    result.error &&
    'code' in result.error &&
    typeof result.error.code === 'string'
      ? result.error.code
      : undefined;

  return {
    exitCode: result.status,
    stdout: result.stdout ?? '',
    stderr: result.stderr ?? '',
    timedOut: errorCode === 'ETIMEDOUT',
    ...(result.error
      ? {
          error: result.error.message,
        }
      : {}),
  };
}

function parseWorkerResult(
  value: string
): ComponentProductionValidationWorkerResult {
  let parsed: unknown;

  try {
    parsed = JSON.parse(value);
  } catch {
    throw new Error('Structured validation worker returned malformed JSON.');
  }

  if (
    typeof parsed !== 'object' ||
    parsed === null ||
    !('schemaVersion' in parsed) ||
    parsed.schemaVersion !==
      COMPONENT_PRODUCTION_VALIDATION_WORKER_SCHEMA_VERSION ||
    !('status' in parsed) ||
    (parsed.status !== 'ok' && parsed.status !== 'blocked')
  ) {
    throw new Error(
      'Structured validation worker returned an unsupported result.'
    );
  }

  return parsed as ComponentProductionValidationWorkerResult;
}

function completenessStageFromResults(
  results: readonly ComponentCompletenessResult[]
): ComponentProductionStageResult {
  const findings: ComponentProductionFinding[] = [];

  for (const result of results) {
    for (const check of result.checks) {
      if (check.ok) {
        continue;
      }

      findings.push({
        id: [
          'completeness',
          normalizeId(result.componentName),
          check.platform ?? 'shared',
          check.name,
        ].join(':'),
        stage: 'completeness',
        severity: 'blocking',
        message: check.details
          ? `${result.componentName} ${check.name}: ${check.details}`
          : `${result.componentName} failed completeness check "${check.name}".`,
        ...(check.platform
          ? {
              platform: check.platform,
            }
          : {}),
      });
    }

    if (!result.ready && !result.checks.some((check) => !check.ok)) {
      findings.push({
        id: `completeness:${normalizeId(result.componentName)}:not-ready`,
        stage: 'completeness',
        severity: 'blocking',
        message: `${result.componentName} is not ready according to the canonical completeness checker.`,
      });
    }
  }

  if (results.some((result) => !result.ready)) {
    return {
      id: 'completeness',
      status: 'blocked',
      summary:
        'Canonical component completeness validation detected blocking findings.',
      findings,
      artifacts: [],
    };
  }

  return {
    id: 'completeness',
    status: 'passed',
    summary: 'Canonical component completeness validation passed.',
    findings: [],
    artifacts: [],
  };
}

function qualityStageFromResult(
  input: ComponentProductionInputV1,
  result: ComponentQualityRunResult
): ComponentProductionStageResult {
  const component = result.report.components.find(
    (candidate) =>
      candidate.componentName.toLowerCase() ===
      input.componentName.toLowerCase()
  );

  if (!component) {
    return {
      id: 'quality',
      status: 'failed',
      summary:
        'Component Quality validation returned an invalid production result.',
      findings: [
        {
          id: 'quality:missing-component',
          stage: 'quality',
          severity: 'blocking',
          message: `Component Quality report does not contain ${input.componentName}.`,
        },
      ],
      artifacts: [],
    };
  }

  const findings = component.findings.flatMap(
    (finding): ComponentProductionFinding[] => {
      if (finding.status !== 'fail' && finding.status !== 'warn') {
        return [];
      }

      return [
        {
          id: [
            'quality',
            normalizeId(component.componentName),
            finding.platform ?? 'shared',
            finding.ruleId,
          ].join(':'),
          stage: 'quality',
          severity: finding.status === 'fail' ? 'blocking' : 'warning',
          message:
            finding.message ??
            `${component.componentName} quality rule "${finding.ruleId}" returned ${finding.status}.`,
          ...(finding.platform
            ? {
                platform: finding.platform,
              }
            : {}),
          ruleId: finding.ruleId,
        },
      ];
    }
  );

  if (component.status === 'fail') {
    if (!findings.some((finding) => finding.severity === 'blocking')) {
      findings.push({
        id: `quality:${normalizeId(component.componentName)}:failed`,
        stage: 'quality',
        severity: 'blocking',
        message: `${component.componentName} failed canonical Component Quality validation without an explicit failing finding.`,
      });
    }

    return {
      id: 'quality',
      status: 'blocked',
      summary:
        'Canonical Component Quality validation detected blocking findings.',
      findings,
      artifacts: [],
    };
  }

  return {
    id: 'quality',
    status: 'passed',
    summary:
      component.status === 'warn'
        ? 'Canonical Component Quality validation passed with advisory findings.'
        : 'Canonical Component Quality validation passed.',
    findings,
    artifacts: [],
  };
}

function runtimeFailure(
  error: unknown
): ComponentProductionStructuredValidationResult {
  const message = error instanceof Error ? error.message : String(error);

  return {
    stages: [
      {
        id: 'completeness',
        status: 'failed',
        summary: 'Structured production validation could not complete.',
        findings: [
          {
            id: 'completeness:runtime',
            stage: 'completeness',
            severity: 'blocking',
            message,
          },
        ],
        artifacts: [],
      },
      {
        id: 'quality',
        status: 'skipped',
        summary:
          'Component Quality validation was skipped because structured completeness validation could not complete.',
        findings: [],
        artifacts: [],
      },
    ],
    completeness: null,
    quality: null,
  };
}

function qualityPlatformSelection(
  input: ComponentProductionInputV1
): 'web' | 'native' | 'all' {
  if (input.platform === 'web') {
    return 'web';
  }

  if (input.platform === 'native') {
    return 'native';
  }

  return 'all';
}

function normalizeId(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
