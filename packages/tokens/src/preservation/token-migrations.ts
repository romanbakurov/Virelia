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

type TokenRepresentationMigrationBase = Omit<
  TokenMigrationBase,
  'platforms'
> & {
  kind: 'representation-change';
  from: string;
  to?: string;
  equivalence: string;
  evidence: string;
};

// Canonical migrations change renderer-neutral representation; platform-output
// migrations change only a named renderer's serialized representation.
export type TokenCanonicalRepresentationMigration =
  TokenRepresentationMigrationBase & {
    layer: 'canonical';
    platforms?: never;
  };

export type TokenPlatformRepresentationMigration =
  TokenRepresentationMigrationBase & {
    layer: 'platform-output';
    platforms: readonly [TokenMigrationPlatform, ...TokenMigrationPlatform[]];
  };

export type TokenRepresentationMigration =
  TokenCanonicalRepresentationMigration | TokenPlatformRepresentationMigration;

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

const valueKindWebFixApproval =
  '#881 explicitly requires correcting invalid unitless CSS serialization; targeted serializer regressions and the pinned Linux visual suite are the approval evidence.';

/**
 * Migration/test metadata only. This is not a runtime token registry.
 *
 * Every #879 token rename, alias, removal, addition, representation-only
 * change, or intentionally approved visual change must be recorded here before
 * the preservation baseline is allowed to accept it.
 */
export const tokenMigrationManifestV1 = [
  {
    id: '881-modal-z-index-offset-number',
    kind: 'representation-change',
    layer: 'canonical',
    issue: '#881',
    reason:
      'Remove a stringified-number workaround now that z-index/order has a canonical unitless numeric kind.',
    from: 'components.modal.content.zIndexOffset',
    equivalence:
      'Canonical "1" and numeric 1 represent the same stack offset; Web serialization remains the literal value 1.',
    evidence:
      'The value-kind serializer regression locks Web output to 1 and current first-party Modal renderers do not consume the old string representation directly.',
  },
  {
    id: '881-radio-pressed-scale-web',
    kind: 'visual-change',
    issue: '#881',
    platforms: ['web'],
    from: 'components.radio.motion.pressedScale',
    approved: true,
    approvalEvidence: valueKindWebFixApproval,
  },
  {
    id: '881-radio-active-scale-web',
    kind: 'visual-change',
    issue: '#881',
    platforms: ['web'],
    from: 'components.radio.motion.activeScale',
    approved: true,
    approvalEvidence: valueKindWebFixApproval,
  },
  {
    id: '881-radio-pressed-opacity-web',
    kind: 'visual-change',
    issue: '#881',
    platforms: ['web'],
    from: 'components.radio.motion.pressedOpacity',
    approved: true,
    approvalEvidence: valueKindWebFixApproval,
  },
  {
    id: '881-tooltip-scale-web',
    kind: 'visual-change',
    issue: '#881',
    platforms: ['web'],
    from: 'components.tooltip.content.scale',
    approved: true,
    approvalEvidence: valueKindWebFixApproval,
  },
  {
    id: '881-popover-native-shadow-opacity-web',
    kind: 'visual-change',
    issue: '#881',
    platforms: ['web'],
    from: 'components.popover.shadow.native.opacity',
    approved: true,
    approvalEvidence: valueKindWebFixApproval,
  },
  {
    id: '881-popover-native-shadow-elevation-web',
    kind: 'visual-change',
    issue: '#881',
    platforms: ['web'],
    from: 'components.popover.shadow.native.elevation',
    approved: true,
    approvalEvidence: valueKindWebFixApproval,
  },
] satisfies readonly TokenMigrationEntry[];
