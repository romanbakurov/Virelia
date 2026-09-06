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

const stateVocabularyVisualApproval =
  '#879/#882 explicitly authorizes removal of pressed/active semantic conflation; the change stays inside the existing Vellira palette and requires pinned Linux visual regression.';

const stateVocabularyRenamePairsV1 = [
  [
    'control-active-bg',
    'semantic.control.active.bg',
    'semantic.control.pressed.bg',
  ],
  [
    'control-active-fg',
    'semantic.control.active.fg',
    'semantic.control.pressed.fg',
  ],
  [
    'control-active-border',
    'semantic.control.active.border',
    'semantic.control.pressed.border',
  ],
  [
    'control-selected-active-bg',
    'semantic.control.selected.active.bg',
    'semantic.control.selected.pressed.bg',
  ],
  [
    'control-selected-active-fg',
    'semantic.control.selected.active.fg',
    'semantic.control.selected.pressed.fg',
  ],
  [
    'control-selected-active-border',
    'semantic.control.selected.active.border',
    'semantic.control.selected.pressed.border',
  ],
  [
    'action-primary-active-bg',
    'semantic.action.primary.active.bg',
    'semantic.action.primary.pressed.bg',
  ],
  [
    'action-primary-active-fg',
    'semantic.action.primary.active.fg',
    'semantic.action.primary.pressed.fg',
  ],
  [
    'action-primary-active-border',
    'semantic.action.primary.active.border',
    'semantic.action.primary.pressed.border',
  ],
  [
    'action-secondary-active-bg',
    'semantic.action.secondary.active.bg',
    'semantic.action.secondary.pressed.bg',
  ],
  [
    'action-secondary-active-fg',
    'semantic.action.secondary.active.fg',
    'semantic.action.secondary.pressed.fg',
  ],
  [
    'action-secondary-active-border',
    'semantic.action.secondary.active.border',
    'semantic.action.secondary.pressed.border',
  ],
  [
    'action-close-active-bg',
    'semantic.action.close.active.bg',
    'semantic.action.close.pressed.bg',
  ],
  [
    'action-close-active-fg',
    'semantic.action.close.active.fg',
    'semantic.action.close.pressed.fg',
  ],
  [
    'action-close-active-border',
    'semantic.action.close.active.border',
    'semantic.action.close.pressed.border',
  ],
  [
    'action-danger-active-bg',
    'semantic.action.danger.active.bg',
    'semantic.action.danger.pressed.bg',
  ],
  [
    'action-danger-active-fg',
    'semantic.action.danger.active.fg',
    'semantic.action.danger.pressed.fg',
  ],
  [
    'action-danger-active-border',
    'semantic.action.danger.active.border',
    'semantic.action.danger.pressed.border',
  ],
  [
    'text-interactive-active',
    'semantic.text.interactiveActive',
    'semantic.text.interactivePressed',
  ],
] as const;

const stateVocabularyRenameMigrationsV1 = stateVocabularyRenamePairsV1.flatMap(
  ([id, from, to]) => [
    {
      id: `882-${id}-rename`,
      kind: 'rename',
      issue: '#882',
      reason:
        'Rename a transient physical-interaction role to canonical pressed while preserving its resolved design value.',
      platforms: ['react-native'],
      from,
      to,
    } as const,
    {
      id: `882-${id}-web-identity`,
      kind: 'representation-change',
      layer: 'platform-output',
      issue: '#882',
      reason:
        'Align the public Web CSS variable identity with the canonical pressed state name.',
      platforms: ['web'],
      from,
      to,
      equivalence:
        'The paired canonical #882 rename preserves the resolved design value; only the Web CSS variable identity changes from active to pressed.',
      evidence:
        'Token preservation validates the canonical/RN value-preserving rename; generated CSS checks and pinned Linux visual regression validate Web output.',
    } as const,
  ]
) satisfies readonly TokenMigrationEntry[];

/**
 * Migration/test metadata only. This is not a runtime token registry.
 *
 * Every #879 token rename, alias, removal, addition, representation-only
 * change, or intentionally approved visual change must be recorded here before
 * the preservation baseline is allowed to accept it.
 */
export const tokenMigrationManifestV1 = [
  ...stateVocabularyRenameMigrationsV1,
  {
    id: '882-radio-active-scale-remove',
    kind: 'remove',
    issue: '#882',
    reason:
      'Remove activeScale because it encoded transient physical press rather than a persistent active state.',
    from: 'components.radio.motion.activeScale',
  },
  {
    id: '882-radio-pressed-scale-own-effective-press',
    kind: 'visual-change',
    issue: '#882',
    reason:
      'Move the existing effective Radio press scale of 0.92 from misleading activeScale ownership to the canonical pressedScale token.',
    from: 'components.radio.motion.pressedScale',
    approved: true,
    approvalEvidence: stateVocabularyVisualApproval,
  },
  {
    id: '882-input-clear-button-pressed-surface',
    kind: 'visual-change',
    issue: '#882',
    reason:
      'Map Input clear-button physical press to surface.pressed instead of the persistent/current surface.active role.',
    from: 'components.input.clearButton.pressedBg',
    approved: true,
    approvalEvidence: stateVocabularyVisualApproval,
  },
  {
    id: '882-select-clear-button-pressed-surface',
    kind: 'visual-change',
    issue: '#882',
    reason:
      'Map Select clear-button physical press to surface.pressed instead of the persistent/current surface.active role.',
    from: 'components.select.clearButton.pressedBg',
    approved: true,
    approvalEvidence: stateVocabularyVisualApproval,
  },
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
    id: '881-radio-pressed-opacity-web',
    kind: 'visual-change',
    issue: '#881',
    platforms: ['web'],
    reason:
      'Correct Radio pressed opacity from invalid px-suffixed output to the intended unitless opacity.',
    from: 'components.radio.motion.pressedOpacity',
    approved: true,
    approvalEvidence: valueKindWebFixApproval,
  },
  {
    id: '881-tooltip-scale-web',
    kind: 'visual-change',
    issue: '#881',
    platforms: ['web'],
    reason:
      'Correct Tooltip content scale from invalid px-suffixed transform input to the intended unitless scale.',
    from: 'components.tooltip.content.scale',
    approved: true,
    approvalEvidence: valueKindWebFixApproval,
  },
  {
    id: '881-popover-native-shadow-opacity-web',
    kind: 'visual-change',
    issue: '#881',
    platforms: ['web'],
    reason:
      'Publish the native Popover shadow opacity with its canonical unitless representation instead of an invalid px suffix.',
    from: 'components.popover.content.shadow.native.opacity',
    approved: true,
    approvalEvidence: valueKindWebFixApproval,
  },
  {
    id: '881-popover-native-shadow-elevation-web',
    kind: 'visual-change',
    issue: '#881',
    platforms: ['web'],
    reason:
      'Publish the native Popover shadow elevation with its canonical unitless representation instead of an invalid px suffix.',
    from: 'components.popover.content.shadow.native.elevation',
    approved: true,
    approvalEvidence: valueKindWebFixApproval,
  },
] satisfies readonly TokenMigrationEntry[];
