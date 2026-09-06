export const tokenPreservationBaselineRevisionV1 =
  'c218cd97244cf5738bb22b9fb1e5ce172c0f516a' as const;

export const tokenMigrationKinds = [
  'rename',
  'alias',
  'remove',
  'addition',
  'representation-change',
  'visual-change',
] as const;

export type TokenMigrationKind = (typeof tokenMigrationKinds)[number];

export const tokenMigrationThemeNames = [
  'light',
  'dark',
  'high-contrast',
] as const;

export type TokenMigrationThemeName = (typeof tokenMigrationThemeNames)[number];

export const tokenMigrationPlatforms = ['web', 'react-native'] as const;

export type TokenMigrationPlatform = (typeof tokenMigrationPlatforms)[number];

type TokenMigrationBase = {
  id: string;
  issue: `#${number}`;
  reason: string;
  themes?: readonly TokenMigrationThemeName[];
  platforms?: readonly TokenMigrationPlatform[];
};

export type TokenRenameMigration = TokenMigrationBase & {
  kind: 'rename';
  from: string;
  to: string;
};

export type TokenAliasMigration = TokenMigrationBase & {
  kind: 'alias';
  from: string;
  to: string;
};

export type TokenRemovalMigration = TokenMigrationBase & {
  kind: 'remove';
  from: string;
};

export type TokenAdditionMigration = TokenMigrationBase & {
  kind: 'addition';
  to: string;
};

export type TokenRepresentationMigration = Omit<
  TokenMigrationBase,
  'platforms'
> & {
  kind: 'representation-change';
  from: string;
  to?: string;
  platforms: readonly [TokenMigrationPlatform, ...TokenMigrationPlatform[]];
  equivalence: string;
  evidence: string;
};

export type TokenVisualChangeMigration = TokenMigrationBase & {
  kind: 'visual-change';
  from?: string;
  to?: string;
  approved: true;
  approvalEvidence: string;
};

export type TokenMigrationEntry =
  | TokenRenameMigration
  | TokenAliasMigration
  | TokenRemovalMigration
  | TokenAdditionMigration
  | TokenRepresentationMigration
  | TokenVisualChangeMigration;

/**
 * Migration/test metadata only. This is not a runtime token registry.
 *
 * Every #879 token rename, alias, removal, addition, representation-only
 * change, or intentionally approved visual change must be recorded here before
 * the preservation baseline is allowed to accept it.
 */
export const tokenMigrationManifestV1 =
  [] satisfies readonly TokenMigrationEntry[];
