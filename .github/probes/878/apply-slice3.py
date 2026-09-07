from pathlib import Path

source_path = Path('scripts/component-production/structured-validation.ts')
source = source_path.read_text()

old_import = """import type {\n  ComponentProductionFinding,\n  ComponentProductionInputV1,\n  ComponentProductionStageResult,\n} from './contracts';\n"""
new_import = """import { checkGeneratedPlanContract } from '../generators/component/plan-contract';\nimport { createComponentGenerationPlan } from '../generators/component/plan';\n\nimport {\n  createComponentProductionGeneratorOptions,\n  type ComponentProductionFinding,\n  type ComponentProductionInputV1,\n  type ComponentProductionStageResult,\n} from './contracts';\n"""
assert old_import in source
source = source.replace(old_import, new_import, 1)

old_runner = """export type ComponentProductionStructuredValidationWorkerRunner = (params: {\n  root: string;\n  componentName: string;\n  platform: 'web' | 'native' | 'all';\n}) => ComponentProductionStructuredValidationWorkerExecution;\n"""
new_runner = old_runner + "\nexport type ComponentProductionPlanContractChecker =\n  typeof checkGeneratedPlanContract;\n"
assert old_runner in source
source = source.replace(old_runner, new_runner, 1)

old_signature = """export async function runComponentProductionStructuredValidation(params: {\n  root: string;\n  input: ComponentProductionInputV1;\n  runner?: ComponentProductionStructuredValidationWorkerRunner;\n}): Promise<ComponentProductionStructuredValidationResult> {\n  const root = path.resolve(params.root);\n  const runner =\n    params.runner ?? runComponentProductionStructuredValidationWorker;\n"""
new_signature = """export async function runComponentProductionStructuredValidation(params: {\n  root: string;\n  input: ComponentProductionInputV1;\n  runner?: ComponentProductionStructuredValidationWorkerRunner;\n  checkPlanContract?: ComponentProductionPlanContractChecker;\n}): Promise<ComponentProductionStructuredValidationResult> {\n  const root = path.resolve(params.root);\n  const plan = createComponentGenerationPlan({\n    root,\n    options: createComponentProductionGeneratorOptions(params.input),\n  });\n  const checkPlanContract =\n    params.checkPlanContract ?? checkGeneratedPlanContract;\n\n  let driftedFiles: string[];\n\n  try {\n    driftedFiles = await checkPlanContract(plan);\n  } catch (error) {\n    return runtimeFailure(error);\n  }\n\n  if (driftedFiles.length > 0) {\n    return productionContractMismatch({\n      root,\n      componentName: params.input.componentName,\n      driftedFiles,\n    });\n  }\n\n  const runner =\n    params.runner ?? runComponentProductionStructuredValidationWorker;\n"""
assert old_signature in source
source = source.replace(old_signature, new_signature, 1)

marker = """function parseWorkerResult(\n  value: string\n): ComponentProductionValidationWorkerResult {\n"""
helper = """function productionContractMismatch(params: {\n  root: string;\n  componentName: string;\n  driftedFiles: readonly string[];\n}): ComponentProductionStructuredValidationResult {\n  const paths = [\n    ...new Set(\n      params.driftedFiles.map((filePath) =>\n        normalizeRepositoryPath(params.root, filePath)\n      )\n    ),\n  ].sort();\n\n  return {\n    stages: [\n      {\n        id: 'completeness',\n        status: 'blocked',\n        summary:\n          'Component production input does not match the canonical generated plan contract.',\n        findings: paths.map((filePath) => ({\n          id: `completeness:${normalizeId(\n            params.componentName\n          )}:production-contract:${normalizeId(filePath)}`,\n          stage: 'completeness',\n          severity: 'blocking',\n          message: `Component production input disagrees with the canonical generated contract at ${filePath}.`,\n          path: filePath,\n        })),\n        artifacts: [],\n      },\n      {\n        id: 'quality',\n        status: 'skipped',\n        summary:\n          'Component Quality validation was skipped because the production contract did not match canonical generated ownership.',\n        findings: [],\n        artifacts: [],\n      },\n    ],\n    completeness: null,\n    quality: null,\n  };\n}\n\nfunction normalizeRepositoryPath(root: string, filePath: string): string {\n  const absolutePath = path.isAbsolute(filePath)\n    ? filePath\n    : path.resolve(root, filePath);\n\n  return path.relative(root, absolutePath).split(path.sep).join('/');\n}\n\n""" + marker
assert marker in source
source = source.replace(marker, helper, 1)
source_path.write_text(source)

test_path = Path('scripts/component-production/structured-validation.test.ts')
test = test_path.read_text()

input_marker = """const INPUT: ComponentProductionInputV1 = {\n  schemaVersion: '1',\n  componentName: 'Avatar',\n  platform: 'both',\n  layer: 'primitives',\n  category: 'data-display',\n  profile: 'base',\n  capabilities: [],\n  componentTokens: 'standard',\n  parts: [],\n};\n"""
assert input_marker in test
test = test.replace(\n    input_marker,\n    input_marker + "\nconst PASSING_PLAN_CONTRACT = async () => [] as string[];\n",\n    1,\n)

needle = "      input: INPUT,\n      runner:"
count = test.count(needle)
assert count >= 6, count
test = test.replace(needle, "      input: INPUT,\n      checkPlanContract: PASSING_PLAN_CONTRACT,\n      runner:")

first_test_end = """    expect(result.stages.map((stage) => [stage.id, stage.status])).toEqual([\n      ['completeness', 'passed'],\n      ['quality', 'passed'],\n    ]);\n  });\n"""
assert first_test_end in test
new_test = first_test_end + """\n  it('blocks before validators when production input drifts from the canonical generated plan', async () => {\n    let workerCalled = false;\n    let observedProfile: string | undefined;\n\n    const result = await runComponentProductionStructuredValidation({\n      root: '/tmp/vellira-production',\n      input: INPUT,\n      checkPlanContract: async (plan) => {\n        observedProfile = plan.profile;\n        return [plan.metadataFile, plan.metadataFile];\n      },\n      runner: () => {\n        workerCalled = true;\n\n        return workerSuccess({\n          completeness: [\n            {\n              componentName: 'Avatar',\n              ready: true,\n              checks: [],\n            },\n          ],\n          quality: passingQuality(),\n        });\n      },\n    });\n\n    expect(observedProfile).toBe('base');\n    expect(workerCalled).toBe(false);\n    expect(result.completeness).toBeNull();\n    expect(result.quality).toBeNull();\n    expect(result.stages[0]).toMatchObject({\n      id: 'completeness',\n      status: 'blocked',\n      findings: [\n        {\n          severity: 'blocking',\n          path: 'packages/metadata/src/components/Avatar.metadata.ts',\n        },\n      ],\n    });\n    expect(result.stages[1]).toMatchObject({\n      id: 'quality',\n      status: 'skipped',\n    });\n  });\n"""
test = test.replace(first_test_end, new_test, 1)

test_path.write_text(test)
