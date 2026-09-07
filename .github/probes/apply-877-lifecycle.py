from pathlib import Path


def replace_exact(source: str, old: str, new: str, *, count: int = 1, label: str) -> str:
    if source.count(old) != count:
        raise SystemExit(f'{label}: expected {count} replacement anchor(s), got {source.count(old)}')
    return source.replace(old, new, count)


contracts = Path('scripts/component-production/contracts.ts')
source = contracts.read_text()
source = replace_exact(
    source,
    "  'generation',\n  'format',",
    "  'generation',\n  'semantic-completion',\n  'format',",
    label='contracts stage order',
)
source = replace_exact(
    source,
    "export type ComponentProductionStatus = 'ready' | 'blocked' | 'failed';\n",
    """export type ComponentProductionStatus = 'ready' | 'blocked' | 'failed';

export const COMPONENT_PRODUCTION_LIFECYCLE_PHASES = [
  'scaffolded',
  'semantic-completion-required',
  'candidate',
  'validated',
  'ready-for-review',
] as const;

export type ComponentProductionLifecyclePhase =
  (typeof COMPONENT_PRODUCTION_LIFECYCLE_PHASES)[number];

export type ComponentProductionLifecycleV1 = {
  current: ComponentProductionLifecyclePhase;
  completed: readonly ComponentProductionLifecyclePhase[];
  semanticCompletionRequired: boolean;
  readyForReview: boolean;
};
""",
    label='contracts lifecycle types',
)
old_output = """export type ComponentProductionOutputSummaryV1 = {
  generation: {
    status: ComponentProductionStageStatus;
    artifacts: readonly string[];
  };
  metadata: ComponentProductionArtifactGroupV1;
  testGeneration: ComponentProductionArtifactGroupV1;
  docsGeneration: ComponentProductionArtifactGroupV1;
  websiteGeneration: ComponentProductionArtifactGroupV1;
};"""
new_output = """export type ComponentProductionOutputSummaryV1 = {
  generation: {
    status: ComponentProductionStageStatus;
    artifacts: readonly string[];
  };
  runtimeRenderers: ComponentProductionArtifactGroupV1;
  sharedContracts: ComponentProductionArtifactGroupV1;
  metadata: ComponentProductionArtifactGroupV1;
  designResources: ComponentProductionArtifactGroupV1;
  testGeneration: ComponentProductionArtifactGroupV1;
  storyGeneration: ComponentProductionArtifactGroupV1;
  docsGeneration: ComponentProductionArtifactGroupV1;
  websiteGeneration: ComponentProductionArtifactGroupV1;
};"""
source = replace_exact(source, old_output, new_output, label='contracts output summary')
source = replace_exact(
    source,
    "  readyForReview: boolean;\n  stages: readonly ComponentProductionStageResult[];",
    "  readyForReview: boolean;\n  lifecycle: ComponentProductionLifecycleV1;\n  stages: readonly ComponentProductionStageResult[];",
    count=2,
    label='contracts result lifecycle field',
)
source = replace_exact(
    source,
    "    readyForReview: status === 'ready',\n    stages: params.stages,",
    "    readyForReview: status === 'ready',\n    lifecycle: createComponentProductionLifecycle(params.stages),\n    stages: params.stages,",
    label='contracts result lifecycle value',
)
lifecycle_marker = "export function createComponentProductionValidationSummary(\n"
lifecycle_code = """export function createComponentProductionLifecycle(
  stages: readonly ComponentProductionStageResult[]
): ComponentProductionLifecycleV1 {
  const generation = stages.find((stage) => stage.id === 'generation');
  const semanticCompletion = stages.find(
    (stage) => stage.id === 'semantic-completion'
  );

  if (generation?.status !== 'passed') {
    return {
      current: 'scaffolded',
      completed: [],
      semanticCompletionRequired: false,
      readyForReview: false,
    };
  }

  if (semanticCompletion?.status !== 'passed') {
    return {
      current: 'semantic-completion-required',
      completed: ['scaffolded'],
      semanticCompletionRequired: true,
      readyForReview: false,
    };
  }

  const validationStages = stages.filter(
    (stage) =>
      stage.id !== 'preflight' &&
      stage.id !== 'generation' &&
      stage.id !== 'semantic-completion'
  );

  return lifecycleFromValidationStages(validationStages);
}

export function createComponentProductionValidationLifecycle(
  stages: readonly ComponentProductionStageResult[]
): ComponentProductionLifecycleV1 {
  return lifecycleFromValidationStages(stages);
}

function lifecycleFromValidationStages(
  stages: readonly ComponentProductionStageResult[]
): ComponentProductionLifecycleV1 {
  const hasSkipped = stages.some((stage) => stage.status === 'skipped');
  const hasFailed = stages.some((stage) => stage.status === 'failed');
  const hasBlocked = stages.some((stage) => stage.status === 'blocked');

  if (!hasSkipped && !hasFailed && !hasBlocked) {
    return {
      current: 'ready-for-review',
      completed: [
        'scaffolded',
        'semantic-completion-required',
        'candidate',
        'validated',
      ],
      semanticCompletionRequired: false,
      readyForReview: true,
    };
  }

  if (!hasSkipped && !hasFailed) {
    return {
      current: 'validated',
      completed: [
        'scaffolded',
        'semantic-completion-required',
        'candidate',
      ],
      semanticCompletionRequired: false,
      readyForReview: false,
    };
  }

  return {
    current: 'candidate',
    completed: ['scaffolded', 'semantic-completion-required'],
    semanticCompletionRequired: false,
    readyForReview: false,
  };
}

"""
source = replace_exact(
    source,
    lifecycle_marker,
    lifecycle_code + lifecycle_marker,
    label='contracts lifecycle insertion',
)
output_return = """  return {
    generation: {
      status: generation.status,
      artifacts,
    },
    metadata: artifactGroup("""
output_replacement = """  return {
    generation: {
      status: generation.status,
      artifacts,
    },
    runtimeRenderers: artifactGroup(
      artifacts,
      (artifact) =>
        (artifact.startsWith('packages/react/src/') ||
          artifact.startsWith('packages/react-native/src/')) &&
        !artifact.includes('.test.') &&
        !artifact.includes('.stories.') &&
        !artifact.includes('test-contract') &&
        !artifact.endsWith('/public-api.test.ts')
    ),
    sharedContracts: artifactGroup(artifacts, (artifact) =>
      artifact.startsWith('packages/types/')
    ),
    metadata: artifactGroup("""
source = replace_exact(source, output_return, output_replacement, label='contracts output groups')
test_anchor = """    testGeneration: artifactGroup(
      artifacts,
      (artifact) =>
        artifact.includes('.test.') ||
        artifact.includes('test-contract') ||
        artifact.endsWith('/public-api.test.ts')
    ),
    docsGeneration:"""
test_replacement = """    designResources: artifactGroup(artifacts, (artifact) =>
      artifact.startsWith('packages/tokens/')
    ),
    testGeneration: artifactGroup(
      artifacts,
      (artifact) =>
        artifact.includes('.test.') ||
        artifact.includes('test-contract') ||
        artifact.endsWith('/public-api.test.ts')
    ),
    storyGeneration: artifactGroup(artifacts, (artifact) =>
      artifact.includes('.stories.')
    ),
    docsGeneration:"""
source = replace_exact(source, test_anchor, test_replacement, label='contracts test/story groups')
contracts.write_text(source)

run = Path('scripts/component-production/run.ts')
source = run.read_text()
source = replace_exact(
    source,
    "  createComponentProductionResult,\n  createComponentProductionValidationSummary,",
    "  createComponentProductionResult,\n  createComponentProductionValidationLifecycle,\n  createComponentProductionValidationSummary,",
    label='run lifecycle import',
)
start = source.index('export async function runComponentProduction(params: {')
end = source.index('export async function runComponentProductionValidation(params: {')
replacement = """export async function runComponentProduction(params: {
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
    const reason =
      'Semantic completion and validation were skipped because component generation did not pass.';

    return createComponentProductionResult({
      input,
      stages: [
        generation.preflight,
        generation.generation,
        skippedStage('semantic-completion', reason),
        ...skippedValidationStages(reason),
      ],
      completeness: null,
      quality: null,
    });
  }

  const semanticCompletion: ComponentProductionStageResult = {
    id: 'semantic-completion',
    status: 'blocked',
    summary:
      'Canonical scaffolding completed. Component-specific API, behavior, accessibility and design decisions must be completed before validation.',
    findings: [
      {
        id: 'semantic-completion:required',
        stage: 'semantic-completion',
        severity: 'blocking',
        message:
          'Generation success does not imply semantic completion. Complete the component candidate, then run component-production:validate:json with the same specification.',
      },
    ],
    artifacts: [],
  };

  return createComponentProductionResult({
    input,
    stages: [
      generation.preflight,
      generation.generation,
      semanticCompletion,
      ...skippedValidationStages(
        'Validation is pending semantic completion of the generated scaffold.'
      ),
    ],
    completeness: null,
    quality: null,
  });
}

"""
source = source[:start] + replacement + source[end:]
source = replace_exact(
    source,
    "    readyForReview: validationSummary.status === 'ready',\n    stages: validation.stages,",
    "    readyForReview: validationSummary.status === 'ready',\n    lifecycle: createComponentProductionValidationLifecycle(validation.stages),\n    stages: validation.stages,",
    label='run validation lifecycle',
)
run.write_text(source)

cli = Path('scripts/component-production/cli.ts')
source = cli.read_text()
cli_anchor = """    if (result.status === 'ready') {
      return 0;
    }

    if (result.status === 'blocked') {"""
cli_replacement = """    if (
      result.status === 'ready' ||
      (result.status === 'blocked' &&
        result.lifecycle.current === 'semantic-completion-required')
    ) {
      return 0;
    }

    if (result.status === 'blocked') {"""
source = replace_exact(source, cli_anchor, cli_replacement, label='cli exit code')
cli.write_text(source)

run_test = Path('scripts/component-production/run.test.ts')
source = run_test.read_text()
start = source.index("describe('runComponentProduction', () => {")
end = source.index("describe('runComponentProductionValidation', () => {")
new_block = """describe('runComponentProduction', () => {
  it('stops at the semantic-completion boundary after deterministic generation', async () => {
    const calls: string[] = [];
    const artifacts = [
      'apps/docs/src/react/avatar.md',
      'apps/website/src/component-catalog/components/Avatar/index.ts',
      'packages/metadata/src/components/Avatar.metadata.ts',
      'packages/react/src/primitives/Avatar/Avatar.stories.tsx',
      'packages/react/src/primitives/Avatar/Avatar.test.tsx',
      'packages/react/src/primitives/Avatar/Avatar.tsx',
      'packages/tokens/src/factories/avatar.ts',
      'packages/types/src/avatar.ts',
    ];

    const result = await runComponentProduction({
      root: '/tmp/vellira-production',
      input: RAW_INPUT,
      dependencies: {
        runGeneration: async () => {
          calls.push('generation');
          return {
            preflight: passedStage('preflight'),
            generation: { ...passedStage('generation'), artifacts },
            generatedArtifacts: artifacts,
          };
        },
        runCommandValidation: () => {
          calls.push('command-validation');
          return { stages: commandStages() };
        },
        runStructuredValidation: async () => {
          calls.push('structured-validation');
          return {
            stages: [passedStage('completeness'), passedStage('quality')],
            completeness: [],
            quality: passingQuality(),
          };
        },
      },
    });

    expect(calls).toEqual(['generation']);
    expect(result.status).toBe('blocked');
    expect(result.readyForReview).toBe(false);
    expect(result.lifecycle).toEqual({
      current: 'semantic-completion-required',
      completed: ['scaffolded'],
      semanticCompletionRequired: true,
      readyForReview: false,
    });
    expect(result.blockingFindings).toEqual([
      expect.objectContaining({
        id: 'semantic-completion:required',
        stage: 'semantic-completion',
      }),
    ]);
    expect(result.stages.find((stage) => stage.id === 'semantic-completion')).toMatchObject({
      status: 'blocked',
    });
    expect(result.stages.slice(3).every((stage) => stage.status === 'skipped')).toBe(true);
    expect(result.outputs.runtimeRenderers.artifacts).toEqual([
      'packages/react/src/primitives/Avatar/Avatar.tsx',
    ]);
    expect(result.outputs.sharedContracts.artifacts).toEqual([
      'packages/types/src/avatar.ts',
    ]);
    expect(result.outputs.designResources.artifacts).toEqual([
      'packages/tokens/src/factories/avatar.ts',
    ]);
    expect(result.outputs.storyGeneration.artifacts).toEqual([
      'packages/react/src/primitives/Avatar/Avatar.stories.tsx',
    ]);
  });

  it('stops before semantic completion when deterministic preflight blocks', async () => {
    let validationCalled = false;

    const result = await runComponentProduction({
      root: '/tmp/vellira-production',
      input: RAW_INPUT,
      dependencies: {
        runGeneration: async () => ({
          preflight: {
            id: 'preflight',
            status: 'blocked',
            summary: 'Preflight blocked.',
            findings: [
              {
                id: 'preflight:1',
                stage: 'preflight',
                severity: 'blocking',
                message: 'Component already exists.',
              },
            ],
            artifacts: [],
          },
          generation: {
            id: 'generation',
            status: 'skipped',
            summary: 'Generation skipped.',
            findings: [],
            artifacts: [],
          },
          generatedArtifacts: [],
        }),
        runCommandValidation: () => {
          validationCalled = true;
          return { stages: commandStages() };
        },
        runStructuredValidation: async () => {
          validationCalled = true;
          return {
            stages: [passedStage('completeness'), passedStage('quality')],
            completeness: [],
            quality: passingQuality(),
          };
        },
      },
    });

    expect(validationCalled).toBe(false);
    expect(result.status).toBe('blocked');
    expect(result.readyForReview).toBe(false);
    expect(result.lifecycle.current).toBe('scaffolded');
    expect(result.stages.find((stage) => stage.id === 'semantic-completion')?.status).toBe('skipped');
    expect(result.stages.slice(3).every((stage) => stage.status === 'skipped')).toBe(true);
  });
});

"""
source = source[:start] + new_block + source[end:]
source = replace_exact(
    source,
    """      readyForReview: true,
      blockingFindings: [],""",
    """      readyForReview: true,
      lifecycle: {
        current: 'ready-for-review',
        semanticCompletionRequired: false,
        readyForReview: true,
      },
      blockingFindings: [],""",
    label='run test validation lifecycle',
)
source = replace_exact(
    source,
    "    expect(result.validationSummary.blockedStages).toEqual(['tests']);",
    "    expect(result.validationSummary.blockedStages).toEqual(['tests']);\n    expect(result.lifecycle.current).toBe('candidate');",
    label='run test blocked lifecycle',
)
run_test.write_text(source)

contracts_test = Path('scripts/component-production/contracts.test.ts')
source = contracts_test.read_text()
source = replace_exact(
    source,
    """    expect(result.readyForReview).toBe(true);
    expect(result.blockingFindings).toEqual([]);""",
    """    expect(result.readyForReview).toBe(true);
    expect(result.lifecycle).toEqual({
      current: 'ready-for-review',
      completed: [
        'scaffolded',
        'semantic-completion-required',
        'candidate',
        'validated',
      ],
      semanticCompletionRequired: false,
      readyForReview: true,
    });
    expect(result.blockingFindings).toEqual([]);""",
    label='contracts test lifecycle',
)
grouping_anchor = "  it('requires the complete canonical stage sequence', () => {"
grouping_test = """  it('groups generated artifacts by production responsibility', () => {
    const result = createComponentProductionResult({
      input: BASE_INPUT,
      stages: stages({
        generation: {
          artifacts: [
            'packages/react/src/primitives/Avatar/Avatar.tsx',
            'packages/react/src/primitives/Avatar/Avatar.stories.tsx',
            'packages/react/src/primitives/Avatar/Avatar.test.tsx',
            'packages/types/src/avatar.ts',
            'packages/tokens/src/factories/avatar.ts',
          ],
        },
      }),
      completeness: [],
      quality: {
        status: 'pass',
        report: { schemaVersion: '1', components: [] },
      },
    });

    expect(result.outputs.runtimeRenderers.artifacts).toEqual([
      'packages/react/src/primitives/Avatar/Avatar.tsx',
    ]);
    expect(result.outputs.sharedContracts.artifacts).toEqual([
      'packages/types/src/avatar.ts',
    ]);
    expect(result.outputs.designResources.artifacts).toEqual([
      'packages/tokens/src/factories/avatar.ts',
    ]);
    expect(result.outputs.testGeneration.artifacts).toEqual([
      'packages/react/src/primitives/Avatar/Avatar.test.tsx',
    ]);
    expect(result.outputs.storyGeneration.artifacts).toEqual([
      'packages/react/src/primitives/Avatar/Avatar.stories.tsx',
    ]);
  });

"""
source = replace_exact(
    source,
    grouping_anchor,
    grouping_test + grouping_anchor,
    label='contracts grouping test',
)
contracts_test.write_text(source)

cli_test = Path('scripts/component-production/cli.test.ts')
source = cli_test.read_text()
source = replace_exact(source, 'return readyResult();', 'return scaffoldResult();', label='cli scaffold helper use')
source = replace_exact(
    source,
    """    expect(JSON.parse(output[0] ?? '')).toMatchObject({
      schemaVersion: '1',
      status: 'ready',
      readyForReview: true,
    });""",
    """    expect(JSON.parse(output[0] ?? '')).toMatchObject({
      schemaVersion: '1',
      status: 'blocked',
      readyForReview: false,
      lifecycle: {
        current: 'semantic-completion-required',
        semanticCompletionRequired: true,
      },
    });""",
    label='cli scaffold output',
)
source = source.replace('...readyResult(),', '...scaffoldResult(),', 2)
source = replace_exact(
    source,
    'function readyResult(): ComponentProductionResultV1 {',
    'function scaffoldResult(): ComponentProductionResultV1 {',
    label='cli scaffold helper rename',
)
source = replace_exact(
    source,
    """    status: 'ready',
    readyForReview: true,
    stages: [],""",
    """    status: 'blocked',
    readyForReview: false,
    lifecycle: {
      current: 'semantic-completion-required',
      completed: ['scaffolded'],
      semanticCompletionRequired: true,
      readyForReview: false,
    },
    stages: [],""",
    label='cli scaffold helper lifecycle',
)
source = replace_exact(
    source,
    """      metadata: {
        generated: false,
        artifacts: [],
      },
      testGeneration:""",
    """      runtimeRenderers: {
        generated: false,
        artifacts: [],
      },
      sharedContracts: {
        generated: false,
        artifacts: [],
      },
      metadata: {
        generated: false,
        artifacts: [],
      },
      designResources: {
        generated: false,
        artifacts: [],
      },
      testGeneration:""",
    label='cli output groups one',
)
source = replace_exact(
    source,
    """      docsGeneration: {
        generated: false,
        artifacts: [],
      },""",
    """      storyGeneration: {
        generated: false,
        artifacts: [],
      },
      docsGeneration: {
        generated: false,
        artifacts: [],
      },""",
    label='cli story output group',
)
source = replace_exact(
    source,
    """          status: 'blocked',
          readyForReview: false,
          stages:""",
    """          status: 'blocked',
          readyForReview: false,
          lifecycle: {
            current: 'scaffolded',
            completed: [],
            semanticCompletionRequired: false,
            readyForReview: false,
          },
          stages:""",
    label='cli blocked fixture lifecycle',
)
source = replace_exact(
    source,
    """          status: 'failed',
          readyForReview: false,
        }),""",
    """          status: 'failed',
          readyForReview: false,
          lifecycle: {
            current: 'scaffolded',
            completed: [],
            semanticCompletionRequired: false,
            readyForReview: false,
          },
        }),""",
    label='cli failed fixture lifecycle',
)
cli_test.write_text(source)

validate_test = Path('scripts/component-production/validate-cli.test.ts')
source = validate_test.read_text()
source = replace_exact(
    source,
    """    readyForReview: status === 'ready',
    stages: [],""",
    """    readyForReview: status === 'ready',
    lifecycle:
      status === 'ready'
        ? {
            current: 'ready-for-review',
            completed: [
              'scaffolded',
              'semantic-completion-required',
              'candidate',
              'validated',
            ],
            semanticCompletionRequired: false,
            readyForReview: true,
          }
        : status === 'blocked'
          ? {
              current: 'validated',
              completed: [
                'scaffolded',
                'semantic-completion-required',
                'candidate',
              ],
              semanticCompletionRequired: false,
              readyForReview: false,
            }
          : {
              current: 'candidate',
              completed: ['scaffolded', 'semantic-completion-required'],
              semanticCompletionRequired: false,
              readyForReview: false,
            },
    stages: [],""",
    label='validate cli lifecycle fixture',
)
validate_test.write_text(source)

readme = Path('scripts/generators/component/README.md')
source = readme.read_text()
if source.count('└── README.md') != 3:
    raise SystemExit(f'README.md: expected three stale README claims, got {source.count("└── README.md")}')
source = source.replace('├── index.ts\n└── README.md', '└── index.ts', 2)
source = source.replace('├── index.ts\n└── README.md', '└── index.ts', 1)
stale_tokens = """`compound` and `overlay` profiles intentionally do not emit generic top-level
style files or component-token factories/theme files. Their generated runtime
scaffolds do not consume those artifacts, and component-specific visual
semantics belong to the production implementation rather than the generic
structural scaffold."""
corrected_tokens = """`compound` and `overlay` profiles intentionally do not emit generic top-level
style scaffolds. Component-token ownership is separate from visual scaffold
selection: the generation plan follows the explicit component-token contract
(`standard`, a specialized contract, or `false`) and may therefore create token
factory/theme artifacts even when the structural runtime scaffold has no generic
style file."""
source = replace_exact(source, stale_tokens, corrected_tokens, label='README token claim')
source = replace_exact(source, '- component README documentation\n', '', label='README ownership claim')
responsibility_anchor = '## Responsibility\n'
production_section = """## Component Production Contract

`pnpm create:component` is the low-level deterministic scaffold mechanism. New
production work should begin from the versioned Component Production Contract
when the full component intent includes canonical package/component
dependencies, component-token intent, icons, tokens, or assets.

The lifecycle is deliberately split:

```text
scaffolded
→ semantic completion required
→ candidate
→ validated
→ ready for review
→ reviewed/promoted stable
```

A successful generator run never means that component-specific API, behavior,
accessibility, platform UX, or design decisions are complete. After scaffolding,
a human or authorized agent must perform semantic completion. The completed
candidate is then checked with `pnpm component-production:validate:json --spec
<component-spec.json>`. Only that validation path can produce
`readyForReview: true`; review/promotion to stable remains a separate governance
action.

The production contract is the canonical place to express dependencies and
resources. Generator metadata, docs metadata, and deterministic repository
consequences derive from that contract rather than from independent assumptions.

"""
source = replace_exact(
    source,
    responsibility_anchor,
    production_section + responsibility_anchor,
    label='README production contract section',
)
readme.write_text(source)
