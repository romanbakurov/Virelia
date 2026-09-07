from pathlib import Path

source_path = Path('scripts/component-production/structured-validation.ts')
source = source_path.read_text()

old_import = """import type {
  ComponentProductionFinding,
  ComponentProductionInputV1,
  ComponentProductionStageResult,
} from './contracts';
"""
new_import = """import { checkGeneratedPlanContract } from '../generators/component/plan-contract';
import { createComponentGenerationPlan } from '../generators/component/plan';

import {
  createComponentProductionGeneratorOptions,
  type ComponentProductionFinding,
  type ComponentProductionInputV1,
  type ComponentProductionStageResult,
} from './contracts';
"""
assert old_import in source
source = source.replace(old_import, new_import, 1)

old_runner = """export type ComponentProductionStructuredValidationWorkerRunner = (params: {
  root: string;
  componentName: string;
  platform: 'web' | 'native' | 'all';
}) => ComponentProductionStructuredValidationWorkerExecution;
"""
new_runner = old_runner + "\nexport type ComponentProductionPlanContractChecker =\n  typeof checkGeneratedPlanContract;\n"
assert old_runner in source
source = source.replace(old_runner, new_runner, 1)

old_signature = """export async function runComponentProductionStructuredValidation(params: {
  root: string;
  input: ComponentProductionInputV1;
  runner?: ComponentProductionStructuredValidationWorkerRunner;
}): Promise<ComponentProductionStructuredValidationResult> {
  const root = path.resolve(params.root);
  const runner =
    params.runner ?? runComponentProductionStructuredValidationWorker;
"""
new_signature = """export async function runComponentProductionStructuredValidation(params: {
  root: string;
  input: ComponentProductionInputV1;
  runner?: ComponentProductionStructuredValidationWorkerRunner;
  checkPlanContract?: ComponentProductionPlanContractChecker;
}): Promise<ComponentProductionStructuredValidationResult> {
  const root = path.resolve(params.root);
  const plan = createComponentGenerationPlan({
    root,
    options: createComponentProductionGeneratorOptions(params.input),
  });
  const checkPlanContract =
    params.checkPlanContract ?? checkGeneratedPlanContract;

  let driftedFiles: string[];

  try {
    driftedFiles = await checkPlanContract(plan);
  } catch (error) {
    return runtimeFailure(error);
  }

  if (driftedFiles.length > 0) {
    return productionContractMismatch({
      root,
      componentName: params.input.componentName,
      driftedFiles,
    });
  }

  const runner =
    params.runner ?? runComponentProductionStructuredValidationWorker;
"""
assert old_signature in source
source = source.replace(old_signature, new_signature, 1)

marker = """function parseWorkerResult(
  value: string
): ComponentProductionValidationWorkerResult {
"""
helper = """function productionContractMismatch(params: {
  root: string;
  componentName: string;
  driftedFiles: readonly string[];
}): ComponentProductionStructuredValidationResult {
  const paths = [
    ...new Set(
      params.driftedFiles.map((filePath) =>
        normalizeRepositoryPath(params.root, filePath)
      )
    ),
  ].sort();

  return {
    stages: [
      {
        id: 'completeness',
        status: 'blocked',
        summary:
          'Component production input does not match the canonical generated plan contract.',
        findings: paths.map((filePath) => ({
          id: `completeness:${normalizeId(
            params.componentName
          )}:production-contract:${normalizeId(filePath)}`,
          stage: 'completeness',
          severity: 'blocking',
          message: `Component production input disagrees with the canonical generated contract at ${filePath}.`,
          path: filePath,
        })),
        artifacts: [],
      },
      {
        id: 'quality',
        status: 'skipped',
        summary:
          'Component Quality validation was skipped because the production contract did not match canonical generated ownership.',
        findings: [],
        artifacts: [],
      },
    ],
    completeness: null,
    quality: null,
  };
}

function normalizeRepositoryPath(root: string, filePath: string): string {
  const absolutePath = path.isAbsolute(filePath)
    ? filePath
    : path.resolve(root, filePath);

  return path.relative(root, absolutePath).split(path.sep).join('/');
}

""" + marker
assert marker in source
source = source.replace(marker, helper, 1)
source_path.write_text(source)

test_path = Path('scripts/component-production/structured-validation.test.ts')
test = test_path.read_text()

input_marker = """const INPUT: ComponentProductionInputV1 = {
  schemaVersion: '1',
  componentName: 'Avatar',
  platform: 'both',
  layer: 'primitives',
  category: 'data-display',
  profile: 'base',
  capabilities: [],
  componentTokens: 'standard',
  parts: [],
};
"""
assert input_marker in test
test = test.replace(
    input_marker,
    input_marker + "\nconst PASSING_PLAN_CONTRACT = async () => [] as string[];\n",
    1,
)

needle = "      input: INPUT,\n      runner:"
count = test.count(needle)
assert count >= 6, count
test = test.replace(
    needle,
    "      input: INPUT,\n      checkPlanContract: PASSING_PLAN_CONTRACT,\n      runner:",
)

first_test_end = """    expect(result.stages.map((stage) => [stage.id, stage.status])).toEqual([
      ['completeness', 'passed'],
      ['quality', 'passed'],
    ]);
  });
"""
assert first_test_end in test
new_test = first_test_end + """
  it('blocks before validators when production input drifts from the canonical generated plan', async () => {
    let workerCalled = false;
    let observedProfile: string | undefined;

    const result = await runComponentProductionStructuredValidation({
      root: '/tmp/vellira-production',
      input: INPUT,
      checkPlanContract: async (plan) => {
        observedProfile = plan.profile;
        return [plan.metadataFile, plan.metadataFile];
      },
      runner: () => {
        workerCalled = true;

        return workerSuccess({
          completeness: [
            {
              componentName: 'Avatar',
              ready: true,
              checks: [],
            },
          ],
          quality: passingQuality(),
        });
      },
    });

    expect(observedProfile).toBe('base');
    expect(workerCalled).toBe(false);
    expect(result.completeness).toBeNull();
    expect(result.quality).toBeNull();
    expect(result.stages[0]).toMatchObject({
      id: 'completeness',
      status: 'blocked',
      findings: [
        {
          severity: 'blocking',
          path: 'packages/metadata/src/components/Avatar.metadata.ts',
        },
      ],
    });
    expect(result.stages[1]).toMatchObject({
      id: 'quality',
      status: 'skipped',
    });
  });
"""
test = test.replace(first_test_end, new_test, 1)

test_path.write_text(test)
