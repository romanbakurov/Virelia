import { describe, expect, it } from 'vitest';

import { normalizeActionableFindings } from './normalize';

function malformedFindingReport(finding: Record<string, unknown>) {
  return {
    schemaVersion: '1',
    components: [
      {
        componentName: 'Select',
        platforms: [
          {
            platform: 'react',
            findings: [
              {
                ruleId: 'api.public-surface',
                dimension: 'public-api',
                severity: 'required',
                status: 'fail',
                ...finding,
              },
            ],
          },
        ],
      },
    ],
  };
}

describe('component quality issue report validation', () => {
  it('rejects unsupported report schemas', () => {
    expect(() => normalizeActionableFindings({ schemaVersion: '2' })).toThrow(
      'Unsupported Component Quality report schema version'
    );
  });

  it('rejects invalid platform values', () => {
    const report = malformedFindingReport({ platform: 'desktop' });

    expect(() => normalizeActionableFindings(report)).toThrow(
      'invalid finding platform'
    );
  });

  it('rejects mismatched platform findings', () => {
    const report = malformedFindingReport({ platform: 'react-native' });

    expect(() => normalizeActionableFindings(report)).toThrow(
      'finding for a mismatched platform'
    );
  });

  it('rejects invalid dimensions and severities', () => {
    expect(() =>
      normalizeActionableFindings(
        malformedFindingReport({ dimension: 'unknown-dimension' })
      )
    ).toThrow('invalid finding dimension');

    expect(() =>
      normalizeActionableFindings(
        malformedFindingReport({ severity: 'optional' })
      )
    ).toThrow('invalid finding severity');
  });

  it('accepts design-system findings from the metadata contract', () => {
    expect(
      normalizeActionableFindings(
        malformedFindingReport({
          ruleId: 'conformity.hardcoded-color',
          dimension: 'design-system',
        })
      )
    ).toHaveLength(1);
  });

  it('rejects malformed message and evidence fields', () => {
    expect(() =>
      normalizeActionableFindings(malformedFindingReport({ message: 42 }))
    ).toThrow('invalid finding message');

    expect(() =>
      normalizeActionableFindings(
        malformedFindingReport({ evidence: ['valid.ts', 42] })
      )
    ).toThrow('invalid finding evidence');
  });
});
