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

function firstPath(
  baseline: TokenPreservationBaselineV1,
  theme: keyof TokenPreservationBaselineV1['themes']
): string {
  const path = Object.keys(baseline.themes[theme].entries)[0];

  if (!path) throw new Error(`Missing baseline path for ${theme}.`);

  return path;
}

describe('token preservation contract', () => {
  it('accepts an unchanged resolved token baseline', () => {
    const baseline = createTokenPreservationBaseline('test-revision');

    expect(
      verifyTokenPreservation({ baseline, manifest: [] })
    ).toEqual([]);
  });

  it('fails when a resolved value hash changes without migration evidence', () => {
    const baseline = createTokenPreservationBaseline('test-revision');
    const changed = cloneBaseline(baseline);
    const path = firstPath(changed, 'light');

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
    const path = firstPath(baseline, 'light');
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

    expect(
      verifyTokenPreservation({ baseline, manifest })
    ).toContainEqual(
      expect.objectContaining({
        rule: 'migration.target-missing',
        theme: 'light',
        path: 'semantic.synthetic.rename-target',
      })
    );
  });

  it('requires explicit migration evidence for removals', () => {
    const baseline = createTokenPreservationBaseline('test-revision');
    const changed = cloneBaseline(baseline);
    const path = firstPath(changed, 'light');

    delete changed.themes.light.entries[path];

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

    expect(
      verifyTokenPreservation({ baseline, manifest })
    ).toContainEqual(
      expect.objectContaining({
        rule: 'migration.target-missing',
        theme: 'light',
        path: 'semantic.synthetic.added',
      })
    );
  });
});
