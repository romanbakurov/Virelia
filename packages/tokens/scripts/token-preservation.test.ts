import { describe, expect, it } from 'vitest';

import type { TokenMigrationEntry } from '../src/preservation/token-migrations.js';

import {
  createTokenPreservationBaseline,
  type TokenPreservationBaselineV1,
  verifyTokenPreservation,
} from './token-preservation.js';

function cloneBaseline(
  baseline: TokenPreservationBaselineV1
): TokenPreservationBaselineV1 {
  return structuredClone(baseline);
}

function firstCanonicalPath(
  baseline: TokenPreservationBaselineV1,
  theme: keyof TokenPreservationBaselineV1['themes']
): string {
  const path = Object.keys(baseline.themes[theme].entries)[0];

  if (!path) throw new Error(`Missing baseline path for ${theme}.`);

  return path;
}

function firstWebPath(
  baseline: TokenPreservationBaselineV1,
  theme: keyof TokenPreservationBaselineV1['platformOutputs']['web']
): string {
  const path = Object.keys(baseline.platformOutputs.web[theme].entries)[0];

  if (!path) throw new Error(`Missing Web baseline path for ${theme}.`);

  return path;
}

describe('token preservation contract', () => {
  it('accepts unchanged canonical, Web, and React Native output', () => {
    const baseline = createTokenPreservationBaseline('test-revision');

    expect(verifyTokenPreservation({ baseline, manifest: [] })).toEqual([]);
  });

  it('fails when a canonical resolved value hash changes without migration evidence', () => {
    const baseline = createTokenPreservationBaseline('test-revision');
    const changed = cloneBaseline(baseline);
    const path = firstCanonicalPath(changed, 'light');

    changed.themes.light.entries[path] = '0'.repeat(64);

    expect(
      verifyTokenPreservation({ baseline: changed, manifest: [] })
    ).toContainEqual(
      expect.objectContaining({
        rule: 'token.changed',
        theme: 'light',
        path,
      })
    );
  });

  it('fails when serialized Web output changes without migration evidence', () => {
    const baseline = createTokenPreservationBaseline('test-revision');
    const changed = cloneBaseline(baseline);
    const path = firstWebPath(changed, 'light');

    changed.platformOutputs.web.light.entries[path] = '0'.repeat(64);

    expect(
      verifyTokenPreservation({ baseline: changed, manifest: [] })
    ).toContainEqual(
      expect.objectContaining({
        rule: 'platform.changed',
        theme: 'light',
        platform: 'web',
        path,
      })
    );
  });

  it('allows a Web-only representation change only with explicit evidence', () => {
    const baseline = createTokenPreservationBaseline('test-revision');
    const changed = cloneBaseline(baseline);
    const path = firstWebPath(changed, 'light');
    const manifest: readonly TokenMigrationEntry[] = [
      {
        id: 'test-web-representation',
        kind: 'representation-change',
        issue: '#880',
        reason: 'Synthetic regression fixture.',
        themes: ['light'],
        platforms: ['web'],
        from: path,
        equivalence:
          'The canonical value is unchanged; only Web serialization changes.',
        evidence: 'Synthetic platform-output fixture.',
      },
    ];

    changed.platformOutputs.web.light.entries[path] = '0'.repeat(64);

    expect(
      verifyTokenPreservation({ baseline: changed, manifest })
    ).not.toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          rule: 'platform.changed',
          theme: 'light',
          platform: 'web',
          path,
        }),
      ])
    );
  });

  it('requires React Native output to resolve through the canonical theme contract', () => {
    const baseline = createTokenPreservationBaseline('test-revision');
    const changed = cloneBaseline(baseline);

    changed.platformOutputs.reactNative.mode = 'invalid' as 'canonical-theme';

    expect(
      verifyTokenPreservation({ baseline: changed, manifest: [] })
    ).toContainEqual(
      expect.objectContaining({
        rule: 'baseline.schema',
        platform: 'react-native',
      })
    );
  });

  it('requires exact baseline source revision when requested', () => {
    const baseline = createTokenPreservationBaseline('old-revision');

    expect(
      verifyTokenPreservation({
        baseline,
        manifest: [],
        expectedSourceRevision: 'expected-revision',
      })
    ).toContainEqual(
      expect.objectContaining({
        rule: 'baseline.source-revision',
      })
    );
  });

  it('rejects a rename target whose value drifts from the old identity', () => {
    const baseline = createTokenPreservationBaseline('test-revision');
    const path = firstCanonicalPath(baseline, 'light');
    const manifest: readonly TokenMigrationEntry[] = [
      {
        id: 'test-rename',
        kind: 'rename',
        issue: '#880',
        reason: 'Synthetic regression fixture.',
        themes: ['light'],
        from: path,
        to: 'semantic.synthetic.rename-target',
      },
    ];

    expect(verifyTokenPreservation({ baseline, manifest })).toContainEqual(
      expect.objectContaining({
        rule: 'migration.target-missing',
        theme: 'light',
        path: 'semantic.synthetic.rename-target',
      })
    );
  });

  it('detects baseline laundering that silently drops a canonical path', () => {
    const baseline = createTokenPreservationBaseline('test-revision');
    const changed = cloneBaseline(baseline);
    const path = firstCanonicalPath(changed, 'light');

    delete changed.themes.light.entries[path];
    changed.themes.light.entryCount -= 1;

    expect(
      verifyTokenPreservation({ baseline: changed, manifest: [] })
    ).toContainEqual(
      expect.objectContaining({
        rule: 'token.untracked-addition',
        theme: 'light',
        path,
      })
    );
  });

  it('rejects additions that are recorded but do not exist', () => {
    const baseline = createTokenPreservationBaseline('test-revision');
    const manifest: readonly TokenMigrationEntry[] = [
      {
        id: 'test-addition',
        kind: 'addition',
        issue: '#880',
        reason: 'Synthetic regression fixture.',
        themes: ['light'],
        to: 'semantic.synthetic.added',
      },
    ];

    expect(verifyTokenPreservation({ baseline, manifest })).toContainEqual(
      expect.objectContaining({
        rule: 'migration.target-missing',
        theme: 'light',
        path: 'semantic.synthetic.added',
      })
    );
  });
});
