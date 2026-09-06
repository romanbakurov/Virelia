import { describe, expect, it } from 'vitest';

import type { TokenMigrationEntry } from '../src/preservation/token-migrations.js';

import {
  createTokenPreservationBaseline,
  verifyTokenPreservation,
} from './token-preservation.js';

describe('token preservation representation routing', () => {
  it('applies canonical representation evidence to React Native canonical-theme output', () => {
    const baseline = createTokenPreservationBaseline('test-revision');
    const changed = structuredClone(baseline);
    const path = Object.keys(changed.themes.light.entries)[0];

    if (!path) throw new Error('Missing light-theme preservation path.');

    changed.themes.light.entries[path] = '0'.repeat(64);

    const manifest: readonly TokenMigrationEntry[] = [
      {
        id: 'test-canonical-native-routing',
        kind: 'representation-change',
        layer: 'canonical',
        issue: '#881',
        reason: 'Synthetic canonical representation fixture.',
        themes: ['light'],
        from: path,
        equivalence:
          'React Native consumes the canonical theme, so the same canonical representation evidence applies.',
        evidence: 'Synthetic canonical-theme routing regression.',
      },
    ];

    const findings = verifyTokenPreservation({
      baseline: changed,
      manifest,
    });

    expect(findings).not.toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          rule: 'token.changed',
          theme: 'light',
          path,
        }),
        expect.objectContaining({
          rule: 'platform.changed',
          theme: 'light',
          platform: 'react-native',
          path,
        }),
      ])
    );
  });
});
