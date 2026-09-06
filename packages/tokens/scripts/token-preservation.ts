import { createHash } from 'node:crypto';

import { darkTheme } from '../src/dark/theme.js';
import { highContrastTheme } from '../src/highContrast/theme.js';
import { lightTheme } from '../src/light/theme.js';
import type {
  TokenMigrationEntry,
  TokenMigrationThemeName,
} from '../src/preservation/token-migrations.js';

export const tokenPreservationSchemaVersion = 1 as const;

export type TokenPreservationBaselineV1 = {
  schemaVersion: typeof tokenPreservationSchemaVersion;
  sourceRevision: string;
  themes: Record<
    TokenMigrationThemeName,
    {
      entryCount: number;
      entries: Record<string, string>;
    }
  >;
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
    | 'migration.removal-still-present';
  theme?: TokenMigrationThemeName;
  path?: string;
  message: string;
};

type TokenTheme = {
  colors: object;
  semantic: object;
  components: object;
  tokens: object;
};

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
      throw new Error(`Token preservation cannot hash non-finite number ${value}.`);
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

  return result;
}

function toSortedRecord(entries: Map<string, string>): Record<string, string> {
  return Object.fromEntries(
    [...entries.entries()].sort(([left], [right]) =>
      left.localeCompare(right, 'en')
    )
  );
}

export function createTokenPreservationBaseline(
  sourceRevision: string
): TokenPreservationBaselineV1 {
  return {
    schemaVersion: tokenPreservationSchemaVersion,
    sourceRevision,
    themes: Object.fromEntries(
      Object.entries(themes).map(([themeName, theme]) => {
        const entries = collectResolvedTokenHashes(theme);

        return [
          themeName,
          {
            entryCount: entries.size,
            entries: toSortedRecord(entries),
          },
        ];
      })
    ) as TokenPreservationBaselineV1['themes'],
  };
}

function migrationApplies(
  migration: TokenMigrationEntry,
  theme: TokenMigrationThemeName
): boolean {
  return migration.themes === undefined || migration.themes.includes(theme);
}

function migrationsFromPath(
  manifest: readonly TokenMigrationEntry[],
  theme: TokenMigrationThemeName,
  path: string
): TokenMigrationEntry[] {
  return manifest.filter(
    (migration) =>
      migrationApplies(migration, theme) &&
      'from' in migration &&
      migration.from === path
  );
}

function migrationTarget(migration: TokenMigrationEntry): string | null {
  if ('to' in migration && migration.to !== undefined) return migration.to;
  if ('from' in migration && migration.from !== undefined) return migration.from;
  return null;
}

function pushChangedFinding(params: {
  findings: TokenPreservationFinding[];
  theme: TokenMigrationThemeName;
  path: string;
  expected: string;
  actual: string;
  rule?: TokenPreservationFinding['rule'];
}) {
  params.findings.push({
    rule: params.rule ?? 'token.changed',
    theme: params.theme,
    path: params.path,
    message: `${params.path} changed resolved value (${params.expected.slice(
      0,
      12
    )} -> ${params.actual.slice(0, 12)}).`,
  });
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

  for (const themeName of Object.keys(themes) as TokenMigrationThemeName[]) {
    const baselineTheme = baseline.themes[themeName];

    if (!baselineTheme) {
      findings.push({
        rule: 'baseline.schema',
        theme: themeName,
        message: `Missing ${themeName} preservation baseline.`,
      });
      continue;
    }

    const current = collectResolvedTokenHashes(themes[themeName]);
    const consumedCurrentPaths = new Set<string>();
    const baselineEntries = new Map(Object.entries(baselineTheme.entries));

    for (const [path, expectedHash] of baselineEntries) {
      const migrations = migrationsFromPath(manifest, themeName, path);

      if (migrations.length > 1) {
        findings.push({
          rule: 'migration.invalid',
          theme: themeName,
          path,
          message: `${path} has multiple applicable migrations for ${themeName}.`,
        });
        continue;
      }

      const migration = migrations[0];

      if (!migration) {
        const actualHash = current.get(path);

        if (actualHash === undefined) {
          findings.push({
            rule: 'token.missing',
            theme: themeName,
            path,
            message: `${path} disappeared without migration evidence.`,
          });
          continue;
        }

        consumedCurrentPaths.add(path);

        if (actualHash !== expectedHash) {
          pushChangedFinding({
            findings,
            theme: themeName,
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
            theme: themeName,
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
          theme: themeName,
          path,
          message: `${migration.id} does not resolve a migration target.`,
        });
        continue;
      }

      const targetHash = current.get(target);

      if (targetHash === undefined) {
        findings.push({
          rule: 'migration.target-missing',
          theme: themeName,
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
            theme: themeName,
            path,
            message: `${migration.id} is a rename but the old path still exists. Use alias while both paths are public.`,
          });
          consumedCurrentPaths.add(path);
        }

        if (targetHash !== expectedHash) {
          pushChangedFinding({
            findings,
            theme: themeName,
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
            theme: themeName,
            path,
            message: `${migration.id} is an alias migration but compatibility path ${path} is missing.`,
          });
        } else {
          consumedCurrentPaths.add(path);

          if (aliasHash !== targetHash) {
            pushChangedFinding({
              findings,
              theme: themeName,
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
            theme: themeName,
            path: target,
            expected: expectedHash,
            actual: targetHash,
            rule: 'migration.value-drift',
          });
        }
        continue;
      }

      if (migration.kind === 'representation-change') {
        continue;
      }

      if (migration.kind === 'visual-change') {
        if (!migration.approved || migration.approvalEvidence.trim() === '') {
          findings.push({
            rule: 'migration.invalid',
            theme: themeName,
            path: target,
            message: `${migration.id} lacks explicit visual approval evidence.`,
          });
        }
        continue;
      }

      findings.push({
        rule: 'migration.invalid',
        theme: themeName,
        path,
        message: `${migration.id} cannot migrate an existing baseline path with kind ${migration.kind}.`,
      });
    }

    const additions = manifest.filter(
      (migration) =>
        migration.kind === 'addition' && migrationApplies(migration, themeName)
    );

    for (const addition of additions) {
      if (!current.has(addition.to)) {
        findings.push({
          rule: 'migration.target-missing',
          theme: themeName,
          path: addition.to,
          message: `${addition.id} records an addition that does not exist.`,
        });
        continue;
      }

      if (baselineEntries.has(addition.to)) {
        findings.push({
          rule: 'migration.invalid',
          theme: themeName,
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
        rule: 'token.untracked-addition',
        theme: themeName,
        path,
        message: `${path} was added without migration evidence.`,
      });
    }
  }

  return findings.sort((left, right) => {
    const leftKey = `${left.theme ?? ''}:${left.path ?? ''}:${left.rule}`;
    const rightKey = `${right.theme ?? ''}:${right.path ?? ''}:${right.rule}`;
    return leftKey.localeCompare(rightKey, 'en');
  });
}
