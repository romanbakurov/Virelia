import fc from 'fast-check';
import { describe, expect, it } from 'vitest';

import type { ComponentQualityReportV1 } from '@vellira-ui/metadata';

import { runComponentQualityIssueSyncCli } from './cli';
import type { GitHubQualityIssueClient } from './github';
import {
  componentQualityFindingKey,
  componentQualityIssueMarker,
  extractComponentQualityIssueKey,
} from './identity';
import { normalizeActionableFindings } from './normalize';
import { planQualityIssueSync } from './planner';
import {
  desiredIssueForFinding,
  qualityIssueLabelPolicyForAvailableLabels,
} from './render';
import type { ManagedQualityIssue, NormalizedQualityFinding } from './types';

const propertyTestOptions = { numRuns: 80, seed: 615 } as const;

const report: ComponentQualityReportV1 = {
  schemaVersion: '1',
  components: [
    {
      componentName: 'Select',
      status: 'fail',
      platforms: [
        {
          platform: 'react',
          status: 'fail',
          findings: [
            {
              ruleId: 'api.public-surface',
              dimension: 'public-api',
              severity: 'required',
              evaluation: 'automated',
              status: 'fail',
              platform: 'react',
              message: 'Missing public props contract.',
              evidence: ['b.ts', 'a.ts'],
            },
            {
              ruleId: 'conformity.hardcoded-geometry',
              dimension: 'tokens-theming',
              severity: 'recommended',
              evaluation: 'automated',
              status: 'warn',
              platform: 'react',
              message: 'Hardcoded geometry.',
            },
            {
              ruleId: 'coverage.tests',
              dimension: 'tests',
              severity: 'required',
              evaluation: 'automated',
              status: 'pass',
              platform: 'react',
            },
            {
              ruleId: 'platform.overlay-presentation',
              dimension: 'platform-quality',
              severity: 'required',
              evaluation: 'automated',
              status: 'not-applicable',
              platform: 'react',
            },
          ],
        },
      ],
      findings: [],
    },
  ],
};

function failFinding(): NormalizedQualityFinding {
  return normalizeActionableFindings(report)[0]!;
}

function managedIssue(
  finding: NormalizedQualityFinding,
  overrides: Partial<ManagedQualityIssue> = {}
): ManagedQualityIssue {
  const desired = desiredIssueForFinding(finding, { base: [] });
  return {
    number: 42,
    state: 'open',
    key: finding.key,
    title: desired.title,
    body: desired.body,
    labels: desired.labels,
    ...overrides,
  };
}

function createMockClient(existing: readonly ManagedQualityIssue[] = []) {
  const mutations: string[] = [];
  const client: GitHubQualityIssueClient = {
    async listManagedIssues() {
      return existing;
    },
    async listAvailableLabels() {
      return ['component-quality', 'api', 'react'];
    },
    async createIssue() {
      mutations.push('create');
    },
    async updateIssue() {
      mutations.push('update');
    },
    async closeIssue() {
      mutations.push('close');
    },
    async reopenIssue() {
      mutations.push('reopen');
    },
  };
  return { client, mutations };
}

function expectedNormalizedPart(value: string) {
  return value.trim().replace(/\s+/g, '-');
}

const arbitraryIdentityPart = fc.string({
  unit: 'binary',
  maxLength: 128,
});

const supportedMarkerKey = fc
  .string({ unit: 'binary', minLength: 1, maxLength: 128 })
  .filter(
    (key) => key.trim() === key && !/\s/.test(key) && !key.includes('-->')
  );

describe('component quality issue synchronization', () => {
  it('normalizes FAIL findings by default and ignores WARN/PASS/not-applicable', () => {
    const findings = normalizeActionableFindings(report);

    expect(findings).toHaveLength(1);
    expect(findings[0]).toMatchObject({
      componentName: 'Select',
      platform: 'react',
      ruleId: 'api.public-surface',
      status: 'fail',
      evidence: ['a.ts', 'b.ts'],
    });
  });

  it('includes WARN findings only when explicitly enabled', () => {
    const findings = normalizeActionableFindings(report, { includeWarn: true });

    expect(findings.map(({ status }) => status)).toEqual(['fail', 'warn']);
  });

  it('generates stable identities independent of message and evidence', () => {
    const first = failFinding();
    const changed = { ...first, message: 'Changed', evidence: ['new.ts'] };

    expect(first.key).toBe(changed.key);
    expect(first.key).toBe(
      componentQualityFindingKey('Select', 'react', 'api.public-surface')
    );
  });

  it('keeps Web and React Native identities independent', () => {
    expect(componentQualityFindingKey('Select', 'react', 'rule')).not.toBe(
      componentQualityFindingKey('Select', 'react-native', 'rule')
    );
  });

  it('round-trips the managed issue identity marker', () => {
    const key = componentQualityFindingKey('Select', 'react', 'rule');
    const body = `Generated\n\n${componentQualityIssueMarker(key)}`;

    expect(extractComponentQualityIssueKey(body)).toBe(key);
  });

  it('normalizes whitespace in finding key parts', () => {
    expect(
      componentQualityFindingKey(
        '  Select \n Menu\tTrigger  ',
        'react-native',
        '  api. public \n surface  '
      )
    ).toBe(
      'component-quality:Select-Menu-Trigger:react-native:api.-public-surface'
    );
  });

  it('generates deterministic finding keys for arbitrary inputs', () => {
    fc.assert(
      fc.property(
        arbitraryIdentityPart,
        fc.constantFrom('react', 'react-native'),
        arbitraryIdentityPart,
        (componentName, platform, ruleId) => {
          const first = componentQualityFindingKey(
            componentName,
            platform,
            ruleId
          );
          const second = componentQualityFindingKey(
            componentName,
            platform,
            ruleId
          );

          expect(second).toBe(first);
          expect(first).toBe(
            [
              'component-quality',
              expectedNormalizedPart(componentName),
              expectedNormalizedPart(platform),
              expectedNormalizedPart(ruleId),
            ].join(':')
          );
        }
      ),
      propertyTestOptions
    );
  });

  it('round-trips supported arbitrary marker keys', () => {
    fc.assert(
      fc.property(supportedMarkerKey, (key) => {
        const marker = componentQualityIssueMarker(key);

        expect(marker).toBe(`<!-- component-quality-key:${key} -->`);
        expect(extractComponentQualityIssueKey(marker)).toBe(key);
        expect(
          extractComponentQualityIssueKey(`Before\n${marker}\nAfter`)
        ).toBe(key);
      }),
      propertyTestOptions
    );
  });

  it('extracts issue keys from arbitrary bodies deterministically', () => {
    fc.assert(
      fc.property(fc.string({ unit: 'binary', maxLength: 512 }), (body) => {
        const first = extractComponentQualityIssueKey(body);
        const second = extractComponentQualityIssueKey(body);

        expect(second).toBe(first);

        if (first !== undefined) {
          expect(first.length).toBeGreaterThan(0);
          expect(/\s/.test(first)).toBe(false);
        }
      }),
      propertyTestOptions
    );
  });

  it('rejects malformed reports safely', () => {
    expect(() => normalizeActionableFindings({ schemaVersion: '2' })).toThrow(
      'Unsupported Component Quality report schema version'
    );
  });

  it('plans creation for a new finding', () => {
    const finding = failFinding();
    const plan = planQualityIssueSync([finding], [], { base: [] });

    expect(plan.operations).toHaveLength(1);
    expect(plan.operations[0]).toMatchObject({
      kind: 'create',
      key: finding.key,
    });
  });

  it('does not plan duplicate writes for unchanged managed issues', () => {
    const finding = failFinding();
    const plan = planQualityIssueSync([finding], [managedIssue(finding)], {
      base: [],
    });

    expect(plan.operations).toEqual([]);
  });

  it('plans update when generated content changes materially', () => {
    const finding = failFinding();
    const existing = managedIssue(finding, { body: 'stale body' });
    const plan = planQualityIssueSync([finding], [existing], { base: [] });

    expect(plan.operations[0]).toMatchObject({
      kind: 'update',
      issueNumber: 42,
    });
  });

  it('plans close when a managed finding resolves', () => {
    const finding = failFinding();
    const plan = planQualityIssueSync([], [managedIssue(finding)], {
      base: [],
    });

    expect(plan.operations).toEqual([
      { kind: 'close', key: finding.key, issueNumber: 42 },
    ]);
  });

  it('plans reopen instead of creating a duplicate after regression', () => {
    const finding = failFinding();
    const existing = managedIssue(finding, { state: 'closed' });
    const plan = planQualityIssueSync([finding], [existing], { base: [] });

    expect(plan.operations[0]).toMatchObject({
      kind: 'reopen',
      issueNumber: 42,
      key: finding.key,
    });
  });

  it('refuses ambiguous duplicate managed identities', () => {
    const finding = failFinding();
    expect(() =>
      planQualityIssueSync(
        [finding],
        [managedIssue(finding), managedIssue(finding, { number: 43 })],
        { base: [] }
      )
    ).toThrow('Multiple managed GitHub issues use finding identity');
  });

  it('uses only labels that already exist in the target repository', () => {
    const policy = qualityIssueLabelPolicyForAvailableLabels([
      'component-quality',
      'react',
    ]);
    const desired = desiredIssueForFinding(failFinding(), policy);

    expect(desired.labels).toEqual(['component-quality', 'react']);
  });

  it('dry-run prints operations without GitHub mutations', async () => {
    const { client, mutations } = createMockClient();
    const output: string[] = [];

    const exitCode = await runComponentQualityIssueSyncCli(['--dry-run'], {
      runChecker: async () => report,
      createClient: () => client,
      write: (message) => output.push(message),
    });

    expect(exitCode).toBe(0);
    expect(output.some((line) => line.includes('[dry-run] CREATE'))).toBe(true);
    expect(mutations).toEqual([]);
  });

  it('applies planned mutations outside dry-run mode', async () => {
    const { client, mutations } = createMockClient();

    const exitCode = await runComponentQualityIssueSyncCli([], {
      runChecker: async () => report,
      createClient: () => client,
      write: () => undefined,
    });

    expect(exitCode).toBe(0);
    expect(mutations).toEqual(['create']);
  });
});
