import { createHash } from 'node:crypto';

import { darkTheme } from '../src/dark/theme.js';
import { highContrastTheme } from '../src/highContrast/theme.js';
import { lightTheme } from '../src/light/theme.js';
import type {
  TokenMigrationEntry,
  TokenMigrationPlatform,
  TokenMigrationThemeName,
} from '../src/preservation/token-migrations.js';
import { overlay as primitiveOverlay } from '../src/primitives/overlay.js';
import { controlSizes } from '../src/tokens/controlSizes.js';

import { collectResolvedWebCssOutput } from './token-css-output.js';

export const tokenPreservationSchemaVersion = 1 as const;

type TokenHashSnapshot = {
  entryCount: number;
  entries: Record<string, string>;
};

export type TokenPreservationBaselineV1 = {
  schemaVersion: typeof tokenPreservationSchemaVersion;
  sourceRevision: string;
  themes: Record<TokenMigrationThemeName, TokenHashSnapshot>;
  platformOutputs: {
    web: Record<TokenMigrationThemeName, TokenHashSnapshot>;
    reactNative: {
      mode: 'canonical-theme';
    };
  };
};

export type TokenPreservationFinding = {
  rule:
    | 'baseline.schema'
    | 'baseline.source-revision'
    | 'migration.invalid'
    | 'token.changed'
    | 'token.missing'
    | 'token.untracked-addition'
    | 'migration.target-missing'
    | 'migration.value-drift'
    | 'migration.alias-drift'
    | 'migration.removal-still-present'
    | 'platform.changed'
    | 'platform.missing'
    | 'platform.untracked-addition';
  theme?: TokenMigrationThemeName;
  platform?: TokenMigrationPlatform;
  path?: string;
  message: string;
};

type TokenTheme = {
  colors: object;
  semantic: object;
  components: object;
  tokens: object;
};

type PreservationContext = 'canonical' | TokenMigrationPlatform;

const themes = {
  light: lightTheme,
  dark: darkTheme,
  'high-contrast': highContrastTheme,
} satisfies Record<TokenMigrationThemeName, TokenTheme>;

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function normalizeLeaf(value: unknown): string {
  if (value === null) return 'null:null';

  if (typeof value === 'string') {
    return `string:${JSON.stringify(value)}`;
  }

  if (typeof value === 'boolean') {
    return `boolean:${String(value)}`;
  }

  if (typeof value === 'number') {
    if (!Number.isFinite(value)) {
      throw new Error(
        `Token preservation cannot hash non-finite number ${value}.`
      );
    }

    return `number:${Object.is(value, -0) ? '-0' : String(value)}`;
  }

  throw new Error(
    `Token preservation only supports scalar leaves. Received ${typeof value}.`
  );
}

function hashLeaf(value: unknown): string {
  return createHash('sha256').update(normalizeLeaf(value)).digest('hex');
}

function collectLeafHashes(
  value: unknown,
  prefix: string,
  result: Map<string, string>
): void {
  if (Array.isArray(value)) {
    value.forEach((entry, index) => {
      collectLeafHashes(entry, `${prefix}.${index}`, result);
    });
    return;
  }

  if (isPlainObject(value)) {
    for (const key of Object.keys(value).sort((left, right) =>
      left.localeCompare(right, 'en')
    )) {
      const nextPrefix = prefix ? `${prefix}.${key}` : key;
      collectLeafHashes(value[key], nextPrefix, result);
    }
    return;
  }

  if (!prefix) {
    throw new Error('Token preservation encountered a leaf without a path.');
  }

  result.set(prefix, hashLeaf(value));
}

export function collectResolvedTokenHashes(
  theme: TokenTheme
): Map<string, string> {
  const result = new Map<string, string>();

  collectLeafHashes(theme.colors, 'colors', result);
  collectLeafHashes(theme.semantic, 'semantic', result);
  collectLeafHashes(theme.components, 'components', result);
  collectLeafHashes(theme.tokens, 'tokens', result);
  collectLeafHashes(primitiveOverlay, 'primitives.overlay', result);
  collectLeafHashes(controlSizes, 'tokens.controlSizes', result);

  return result;
}

function collectResolvedWebOutputHashes(
  theme: TokenTheme
): Map<string, string> {
  return new Map(
    [...collectResolvedWebCssOutput(theme as typeof lightTheme)].map(
      ([path, value]) => [path, hashLeaf(value)]
    )
  );
}

function toSortedRecord(entries: Map<string, string>): Record<string, string> {
  return Object.fromEntries(
    [...entries.entries()].sort(([left], [right]) =>
      left.localeCompare(right, 'en')
    )
  );
}

function createSnapshot(entries: Map<string, string>): TokenHashSnapshot {
  return {
    entryCount: entries.size,
    entries: toSortedRecord(entries),
  };
}

export function createTokenPreservationBaseline(
  sourceRevision: string
): TokenPreservationBaselineV1 {
  return {
    schemaVersion: tokenPreservationSchemaVersion,
    sourceRevision,
    themes: Object.fromEntries(
      Object.entries(themes).map(([themeName, theme]) => [
        themeName,
        createSnapshot(collectResolvedTokenHashes(theme)),
      ])
    ) as TokenPreservationBaselineV1['themes'],
    platformOutputs: {
      web: Object.fromEntries(
        Object.entries(themes).map(([themeName, theme]) => [
          themeName,
          createSnapshot(collectResolvedWebOutputHashes(theme)),
        ])
      ) as TokenPreservationBaselineV1['platformOutputs']['web'],
      reactNative: {
        mode: 'canonical-theme',
      },
    },
  };
}

function migrationAppliesToTheme(
  migration: TokenMigrationEntry,
  theme: TokenMigrationThemeName
): boolean {
  return migration.themes === undefined || migration.themes.includes(theme);
}

function migrationAppliesToContext(
  migration: TokenMigrationEntry,
  context: PreservationContext
): boolean {
  if (context === 'canonical') {
    if (
      (migration.kind === 'representation-change' ||
        migration.kind === 'visual-change') &&
      migration.platforms !== undefined
    ) {
      return false;
    }

    return true;
  }

  if (migration.kind === 'representation-change') {
    return migration.platforms?.includes(context) ?? false;
  }

  return (
    migration.platforms === undefined || migration.platforms.includes(context)
  );
}

function migrationsFromPath(
  manifest: readonly TokenMigrationEntry[],
  theme: TokenMigrationThemeName,
  path: string,
  context: PreservationContext
): TokenMigrationEntry[] {
  return manifest.filter(
    (migration) =>
      migrationAppliesToTheme(migration, theme) &&
      migrationAppliesToContext(migration, context) &&
      'from' in migration &&
      migration.from === path
  );
}

function migrationTarget(migration: TokenMigrationEntry): string | null {
  if ('to' in migration && migration.to !== undefined) return migration.to;
  if ('from' in migration && migration.from !== undefined)
    return migration.from;
  return null;
}

function contextLocation(context: PreservationContext) {
  return context === 'canonical' ? {} : { platform: context };
}

function changedRule(
  context: PreservationContext
): TokenPreservationFinding['rule'] {
  return context === 'canonical' ? 'token.changed' : 'platform.changed';
}

function missingRule(
  context: PreservationContext
): TokenPreservationFinding['rule'] {
  return context === 'canonical' ? 'token.missing' : 'platform.missing';
}

function additionRule(
  context: PreservationContext
): TokenPreservationFinding['rule'] {
  return context === 'canonical'
    ? 'token.untracked-addition'
    : 'platform.untracked-addition';
}

function pushChangedFinding(params: {
  findings: TokenPreservationFinding[];
  theme: TokenMigrationThemeName;
  context: PreservationContext;
  path: string;
  expected: string;
  actual: string;
  rule?: TokenPreservationFinding['rule'];
}) {
  params.findings.push({
    rule: params.rule ?? changedRule(params.context),
    theme: params.theme,
    ...contextLocation(params.context),
    path: params.path,
    message: `${params.path} changed resolved value (${params.expected.slice(
      0,
      12
    )} -> ${params.actual.slice(0, 12)}).`,
  });
}

function validateSnapshotShape(params: {
  snapshot: TokenHashSnapshot;
  theme: TokenMigrationThemeName;
  context: PreservationContext;
  findings: TokenPreservationFinding[];
}): boolean {
  const actualCount = Object.keys(params.snapshot.entries).length;

  if (params.snapshot.entryCount === actualCount) return true;

  params.findings.push({
    rule: 'baseline.schema',
    theme: params.theme,
    ...contextLocation(params.context),
    message: `Baseline entryCount ${params.snapshot.entryCount} does not match ${actualCount} stored entries.`,
  });
  return false;
}

function verifySnapshot(params: {
  baseline: TokenHashSnapshot;
  current: Map<string, string>;
  manifest: readonly TokenMigrationEntry[];
  theme: TokenMigrationThemeName;
  context: PreservationContext;
  findings: TokenPreservationFinding[];
}): void {
  const { baseline, current, manifest, theme, context, findings } = params;

  if (
    !validateSnapshotShape({ snapshot: baseline, theme, context, findings })
  ) {
    return;
  }

  const consumedCurrentPaths = new Set<string>();
  const baselineEntries = new Map(Object.entries(baseline.entries));

  for (const [path, expectedHash] of baselineEntries) {
    const migrations = migrationsFromPath(manifest, theme, path, context);

    if (migrations.length > 1) {
      findings.push({
        rule: 'migration.invalid',
        theme,
        ...contextLocation(context),
        path,
        message: `${path} has multiple applicable migrations for ${theme}/${context}.`,
      });
      continue;
    }

    const migration = migrations[0];

    if (!migration) {
      const actualHash = current.get(path);

      if (actualHash === undefined) {
        findings.push({
          rule: missingRule(context),
          theme,
          ...contextLocation(context),
          path,
          message: `${path} disappeared without migration evidence.`,
        });
        continue;
      }

      consumedCurrentPaths.add(path);

      if (actualHash !== expectedHash) {
        pushChangedFinding({
          findings,
          theme,
          context,
          path,
          expected: expectedHash,
          actual: actualHash,
        });
      }
      continue;
    }

    if (migration.kind === 'remove') {
      if (current.has(path)) {
        findings.push({
          rule: 'migration.removal-still-present',
          theme,
          ...contextLocation(context),
          path,
          message: `${path} is marked removed but still exists.`,
        });
      }
      continue;
    }

    const target = migrationTarget(migration);

    if (!target) {
      findings.push({
        rule: 'migration.invalid',
        theme,
        ...contextLocation(context),
        path,
        message: `${migration.id} does not resolve a migration target.`,
      });
      continue;
    }

    const targetHash = current.get(target);

    if (targetHash === undefined) {
      findings.push({
        rule: 'migration.target-missing',
        theme,
        ...contextLocation(context),
        path: target,
        message: `${migration.id} expects ${target}, but the target does not exist.`,
      });
      continue;
    }

    consumedCurrentPaths.add(target);

    if (migration.kind === 'rename') {
      if (current.has(path)) {
        findings.push({
          rule: 'migration.invalid',
          theme,
          ...contextLocation(context),
          path,
          message: `${migration.id} is a rename but the old path still exists. Use alias while both paths are public.`,
        });
        consumedCurrentPaths.add(path);
      }

      if (targetHash !== expectedHash) {
        pushChangedFinding({
          findings,
          theme,
          context,
          path: target,
          expected: expectedHash,
          actual: targetHash,
          rule: 'migration.value-drift',
        });
      }
      continue;
    }

    if (migration.kind === 'alias') {
      const aliasHash = current.get(path);

      if (aliasHash === undefined) {
        findings.push({
          rule: 'migration.target-missing',
          theme,
          ...contextLocation(context),
          path,
          message: `${migration.id} is an alias migration but compatibility path ${path} is missing.`,
        });
      } else {
        consumedCurrentPaths.add(path);

        if (aliasHash !== targetHash) {
          pushChangedFinding({
            findings,
            theme,
            context,
            path,
            expected: targetHash,
            actual: aliasHash,
            rule: 'migration.alias-drift',
          });
        }
      }

      if (targetHash !== expectedHash) {
        pushChangedFinding({
          findings,
          theme,
          context,
          path: target,
          expected: expectedHash,
          actual: targetHash,
          rule: 'migration.value-drift',
        });
      }
      continue;
    }

    if (migration.kind === 'representation-change') {
      if (
        migration.equivalence.trim() === '' ||
        migration.evidence.trim() === ''
      ) {
        findings.push({
          rule: 'migration.invalid',
          theme,
          ...contextLocation(context),
          path: target,
          message: `${migration.id} lacks representation-equivalence evidence.`,
        });
      }
      continue;
    }

    if (migration.kind === 'visual-change') {
      if (!migration.approved || migration.approvalEvidence.trim() === '') {
        findings.push({
          rule: 'migration.invalid',
          theme,
          ...contextLocation(context),
          path: target,
          message: `${migration.id} lacks explicit visual approval evidence.`,
        });
      }
      continue;
    }

    findings.push({
      rule: 'migration.invalid',
      theme,
      ...contextLocation(context),
      path,
      message: `${migration.id} cannot migrate an existing baseline path with kind ${migration.kind}.`,
    });
  }

  const additions = manifest.filter(
    (migration) =>
      migration.kind === 'addition' &&
      migrationAppliesToTheme(migration, theme) &&
      migrationAppliesToContext(migration, context)
  );

  for (const addition of additions) {
    if (!current.has(addition.to)) {
      findings.push({
        rule: 'migration.target-missing',
        theme,
        ...contextLocation(context),
        path: addition.to,
        message: `${addition.id} records an addition that does not exist.`,
      });
      continue;
    }

    if (baselineEntries.has(addition.to)) {
      findings.push({
        rule: 'migration.invalid',
        theme,
        ...contextLocation(context),
        path: addition.to,
        message: `${addition.id} marks an existing baseline path as an addition.`,
      });
      continue;
    }

    consumedCurrentPaths.add(addition.to);
  }

  for (const path of current.keys()) {
    if (consumedCurrentPaths.has(path)) continue;

    findings.push({
      rule: additionRule(context),
      theme,
      ...contextLocation(context),
      path,
      message: `${path} was added without migration evidence.`,
    });
  }
}

export function verifyTokenPreservation(params: {
  baseline: TokenPreservationBaselineV1;
  manifest: readonly TokenMigrationEntry[];
  expectedSourceRevision?: string;
}): TokenPreservationFinding[] {
  const { baseline, manifest, expectedSourceRevision } = params;
  const findings: TokenPreservationFinding[] = [];

  if (baseline.schemaVersion !== tokenPreservationSchemaVersion) {
    findings.push({
      rule: 'baseline.schema',
      message: `Expected preservation schema ${tokenPreservationSchemaVersion}, received ${baseline.schemaVersion}.`,
    });
    return findings;
  }

  if (
    expectedSourceRevision !== undefined &&
    baseline.sourceRevision !== expectedSourceRevision
  ) {
    findings.push({
      rule: 'baseline.source-revision',
      message: `Expected baseline revision ${expectedSourceRevision}, received ${baseline.sourceRevision}.`,
    });
  }

  if (baseline.platformOutputs?.reactNative?.mode !== 'canonical-theme') {
    findings.push({
      rule: 'baseline.schema',
      platform: 'react-native',
      message:
        'React Native preservation mode must explicitly resolve through the canonical theme.',
    });
  }

  for (const themeName of Object.keys(themes) as TokenMigrationThemeName[]) {
    const baselineTheme = baseline.themes[themeName];
    const baselineWeb = baseline.platformOutputs?.web?.[themeName];

    if (!baselineTheme) {
      findings.push({
        rule: 'baseline.schema',
        theme: themeName,
        message: `Missing ${themeName} preservation baseline.`,
      });
      continue;
    }

    const currentTheme = collectResolvedTokenHashes(themes[themeName]);

    verifySnapshot({
      baseline: baselineTheme,
      current: currentTheme,
      manifest,
      theme: themeName,
      context: 'canonical',
      findings,
    });

    verifySnapshot({
      baseline: baselineTheme,
      current: currentTheme,
      manifest,
      theme: themeName,
      context: 'react-native',
      findings,
    });

    if (!baselineWeb) {
      findings.push({
        rule: 'baseline.schema',
        theme: themeName,
        platform: 'web',
        message: `Missing ${themeName} Web platform-output baseline.`,
      });
      continue;
    }

    verifySnapshot({
      baseline: baselineWeb,
      current: collectResolvedWebOutputHashes(themes[themeName]),
      manifest,
      theme: themeName,
      context: 'web',
      findings,
    });
  }

  return findings.sort((left, right) => {
    const leftKey = `${left.theme ?? ''}:${left.platform ?? ''}:${
      left.path ?? ''
    }:${left.rule}`;
    const rightKey = `${right.theme ?? ''}:${right.platform ?? ''}:${
      right.path ?? ''
    }:${right.rule}`;
    return leftKey.localeCompare(rightKey, 'en');
  });
}
