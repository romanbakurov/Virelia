from pathlib import Path

path = Path('scripts/component-production/run.test.ts')
source = path.read_text()

contracts_import = """import type {
  ComponentProductionFinding,
  ComponentProductionInputV1,
  ComponentProductionStageId,
  ComponentProductionStageResult,
} from './contracts';
"""
extra_imports = contracts_import + """import {
  runComponentProductionCommandValidation,
  type ComponentProductionCommandExecution,
} from './command-validation';
import {
  runComponentProductionFinalValidation,
  type ComponentProductionFinalCommandExecution,
} from './final-validation';
import { runComponentProductionStructuredValidation } from './structured-validation';
"""
assert contracts_import in source
source = source.replace(contracts_import, extra_imports, 1)

anchor = """describe('validateComponentProductionCandidate', () => {
"""
fixture_block = """const REPRESENTATIVE_READY_CANDIDATES = [
  {
    name: 'Web',
    platform: 'web',
    structuredPlatform: 'web',
    commandIds: [
      'format-check',
      'lint',
      'core-tests',
      'metadata-tests',
      'react-tests',
      'react-typecheck',
      'react-build',
      'react-storybook-build',
      'component-docs',
      'component-pages',
    ],
    finalIds: [
      'public-api',
      'tooling-contracts',
      'canonical-web-visual',
      'web-smoke',
    ],
  },
  {
    name: 'React Native',
    platform: 'native',
    structuredPlatform: 'native',
    commandIds: [
      'format-check',
      'lint',
      'core-tests',
      'metadata-tests',
      'react-native-tests',
      'react-native-typecheck',
      'react-native-build',
      'component-docs',
      'component-pages',
    ],
    finalIds: ['public-api', 'tooling-contracts', 'native-smoke'],
  },
  {
    name: 'cross-platform',
    platform: 'both',
    structuredPlatform: 'all',
    commandIds: [
      'format-check',
      'lint',
      'core-tests',
      'metadata-tests',
      'react-tests',
      'react-native-tests',
      'react-typecheck',
      'react-native-typecheck',
      'react-build',
      'react-native-build',
      'react-storybook-build',
      'component-docs',
      'component-pages',
    ],
    finalIds: [
      'public-api',
      'tooling-contracts',
      'canonical-web-visual',
      'web-smoke',
      'native-smoke',
    ],
  },
] as const;

describe('representative component production readiness', () => {
  it.each(REPRESENTATIVE_READY_CANDIDATES)(
    'returns readyForReview for a clean $name candidate',
    async (fixture) => {
      const commandCalls: string[] = [];
      const structuredPlatforms: string[] = [];
      const finalCalls: string[] = [];
      const input: ComponentProductionInputV1 = {
        ...RAW_INPUT,
        platform: fixture.platform,
      };

      const result = await runComponentProductionValidation({
        root: '/tmp/vellira-production',
        input,
        dependencies: {
          runCommandValidation: ({ root, input: candidate }) =>
            runComponentProductionCommandValidation({
              root,
              input: candidate,
              runner: (command) => {
                commandCalls.push(command.id);
                return commandSuccess();
              },
            }),
          runStructuredValidation: ({ root, input: candidate }) =>
            runComponentProductionStructuredValidation({
              root,
              input: candidate,
              checkPlanContract: async () => [],
              runner: ({ platform }) => {
                structuredPlatforms.push(platform);

                return {
                  exitCode: 0,
                  stdout: JSON.stringify({
                    schemaVersion: '1',
                    status: 'ok',
                    componentName: candidate.componentName,
                    completeness: [
                      {
                        componentName: candidate.componentName,
                        ready: true,
                        checks: [],
                      },
                    ],
                    quality: passingQualityFor(
                      candidate.componentName,
                      platform
                    ),
                  }),
                  stderr: '',
                  timedOut: false,
                };
              },
            }),
          runFinalValidation: ({ root, input: candidate }) =>
            runComponentProductionFinalValidation({
              root,
              input: candidate,
              runner: (command) => {
                finalCalls.push(command.id);
                return finalSuccess();
              },
            }),
        },
      });

      expect(commandCalls).toEqual(fixture.commandIds);
      expect(structuredPlatforms).toEqual([fixture.structuredPlatform]);
      expect(finalCalls).toEqual(fixture.finalIds);
      expect(result.status).toBe('ready');
      expect(result.readyForReview).toBe(true);
      expect(result.validationSummary).toMatchObject({
        status: 'ready',
        blockedStages: [],
        failedStages: [],
        skippedStages: [],
      });
      expect(result.stages.every((stage) => stage.status === 'passed')).toBe(
        true
      );

      if (fixture.platform === 'native') {
        expect(
          result.stages.find((stage) => stage.id === 'visual')
        ).toMatchObject({
          status: 'passed',
          summary: expect.stringContaining('not applicable'),
        });
      }
    }
  );
});

""" + anchor
assert anchor in source
source = source.replace(anchor, fixture_block, 1)

end_anchor = """function passingQuality() {
  return {
    status: 'pass' as const,
    report: {
      schemaVersion: '1' as const,
      components: [],
    },
  };
}
"""
helpers = """function commandSuccess(): ComponentProductionCommandExecution {
  return {
    exitCode: 0,
    stdout: '',
    stderr: '',
    timedOut: false,
  };
}

function finalSuccess(): ComponentProductionFinalCommandExecution {
  return {
    exitCode: 0,
    stdout: '',
    stderr: '',
    timedOut: false,
  };
}

function passingQualityFor(
  componentName: string,
  platform: 'web' | 'native' | 'all'
) {
  const platforms =
    platform === 'all'
      ? (['react', 'react-native'] as const)
      : ([platform === 'web' ? 'react' : 'react-native'] as const);

  return {
    status: 'pass' as const,
    report: {
      schemaVersion: '1' as const,
      components: [
        {
          componentName,
          status: 'pass' as const,
          platforms: platforms.map((candidatePlatform) => ({
            platform: candidatePlatform,
            status: 'pass' as const,
            findings: [],
          })),
          findings: [],
        },
      ],
    },
  };
}

""" + end_anchor
assert end_anchor in source
source = source.replace(end_anchor, helpers, 1)

path.write_text(source)
