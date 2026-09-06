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
    id: '882-control-active-bg-rename',
    kind: 'rename',
    issue: '#882',
    reason:
      'Rename a transient physical-interaction role to canonical pressed while preserving its resolved design value.',
    platforms: ['react-native'],
    from: 'semantic.control.active.bg',
    to: 'semantic.control.pressed.bg',
  },
  {
    id: '882-control-active-bg-web-identity',
    kind: 'representation-change',
    layer: 'platform-output',
    issue: '#882',
    reason:
      'Align the public Web CSS variable identity with the canonical pressed state name.',
    platforms: ['web'],
    from: 'semantic.control.active.bg',
    to: 'semantic.control.pressed.bg',
    equivalence:
      'The paired canonical #882 rename preserves the resolved design value; only the Web CSS variable identity changes from active to pressed.',
    evidence:
      'Token preservation validates the canonical/RN value-preserving rename; generated CSS checks and pinned Linux visual regression validate Web output.',
  },
  {
    id: '882-control-active-fg-rename',
    kind: 'rename',
    issue: '#882',
    reason:
      'Rename a transient physical-interaction role to canonical pressed while preserving its resolved design value.',
    platforms: ['react-native'],
    from: 'semantic.control.active.fg',
    to: 'semantic.control.pressed.fg',
  },
  {
    id: '882-control-active-fg-web-identity',
    kind: 'representation-change',
    layer: 'platform-output',
    issue: '#882',
    reason:
      'Align the public Web CSS variable identity with the canonical pressed state name.',
    platforms: ['web'],
    from: 'semantic.control.active.fg',
    to: 'semantic.control.pressed.fg',
    equivalence:
      'The paired canonical #882 rename preserves the resolved design value; only the Web CSS variable identity changes from active to pressed.',
    evidence:
      'Token preservation validates the canonical/RN value-preserving rename; generated CSS checks and pinned Linux visual regression validate Web output.',
  },
  {
    id: '882-control-active-border-rename',
    kind: 'rename',
    issue: '#882',
    reason:
      'Rename a transient physical-interaction role to canonical pressed while preserving its resolved design value.',
    platforms: ['react-native'],
    from: 'semantic.control.active.border',
    to: 'semantic.control.pressed.border',
  },
  {
    id: '882-control-active-border-web-identity',
    kind: 'representation-change',
    layer: 'platform-output',
    issue: '#882',
    reason:
      'Align the public Web CSS variable identity with the canonical pressed state name.',
    platforms: ['web'],
    from: 'semantic.control.active.border',
    to: 'semantic.control.pressed.border',
    equivalence:
      'The paired canonical #882 rename preserves the resolved design value; only the Web CSS variable identity changes from active to pressed.',
    evidence:
      'Token preservation validates the canonical/RN value-preserving rename; generated CSS checks and pinned Linux visual regression validate Web output.',
  },
  {
    id: '882-control-selected-active-bg-rename',
    kind: 'rename',
    issue: '#882',
    reason:
      'Rename a transient physical-interaction role to canonical pressed while preserving its resolved design value.',
    platforms: ['react-native'],
    from: 'semantic.control.selected.active.bg',
    to: 'semantic.control.selected.pressed.bg',
  },
  {
    id: '882-control-selected-active-bg-web-identity',
    kind: 'representation-change',
    layer: 'platform-output',
    issue: '#882',
    reason:
      'Align the public Web CSS variable identity with the canonical pressed state name.',
    platforms: ['web'],
    from: 'semantic.control.selected.active.bg',
    to: 'semantic.control.selected.pressed.bg',
    equivalence:
      'The paired canonical #882 rename preserves the resolved design value; only the Web CSS variable identity changes from active to pressed.',
    evidence:
      'Token preservation validates the canonical/RN value-preserving rename; generated CSS checks and pinned Linux visual regression validate Web output.',
  },
  {
    id: '882-control-selected-active-fg-rename',
    kind: 'rename',
    issue: '#882',
    reason:
      'Rename a transient physical-interaction role to canonical pressed while preserving its resolved design value.',
    platforms: ['react-native'],
    from: 'semantic.control.selected.active.fg',
    to: 'semantic.control.selected.pressed.fg',
  },
  {
    id: '882-control-selected-active-fg-web-identity',
    kind: 'representation-change',
    layer: 'platform-output',
    issue: '#882',
    reason:
      'Align the public Web CSS variable identity with the canonical pressed state name.',
    platforms: ['web'],
    from: 'semantic.control.selected.active.fg',
    to: 'semantic.control.selected.pressed.fg',
    equivalence:
      'The paired canonical #882 rename preserves the resolved design value; only the Web CSS variable identity changes from active to pressed.',
    evidence:
      'Token preservation validates the canonical/RN value-preserving rename; generated CSS checks and pinned Linux visual regression validate Web output.',
  },
  {
    id: '882-control-selected-active-border-rename',
    kind: 'rename',
    issue: '#882',
    reason:
      'Rename a transient physical-interaction role to canonical pressed while preserving its resolved design value.',
    platforms: ['react-native'],
    from: 'semantic.control.selected.active.border',
    to: 'semantic.control.selected.pressed.border',
  },
  {
    id: '882-control-selected-active-border-web-identity',
    kind: 'representation-change',
    layer: 'platform-output',
    issue: '#882',
    reason:
      'Align the public Web CSS variable identity with the canonical pressed state name.',
    platforms: ['web'],
    from: 'semantic.control.selected.active.border',
    to: 'semantic.control.selected.pressed.border',
    equivalence:
      'The paired canonical #882 rename preserves the resolved design value; only the Web CSS variable identity changes from active to pressed.',
    evidence:
      'Token preservation validates the canonical/RN value-preserving rename; generated CSS checks and pinned Linux visual regression validate Web output.',
  },
  {
    id: '882-action-primary-active-bg-rename',
    kind: 'rename',
    issue: '#882',
    reason:
      'Rename a transient physical-interaction role to canonical pressed while preserving its resolved design value.',
    platforms: ['react-native'],
    from: 'semantic.action.primary.active.bg',
    to: 'semantic.action.primary.pressed.bg',
  },
  {
    id: '882-action-primary-active-bg-web-identity',
    kind: 'representation-change',
    layer: 'platform-output',
    issue: '#882',
    reason:
      'Align the public Web CSS variable identity with the canonical pressed state name.',
    platforms: ['web'],
    from: 'semantic.action.primary.active.bg',
    to: 'semantic.action.primary.pressed.bg',
    equivalence:
      'The paired canonical #882 rename preserves the resolved design value; only the Web CSS variable identity changes from active to pressed.',
    evidence:
      'Token preservation validates the canonical/RN value-preserving rename; generated CSS checks and pinned Linux visual regression validate Web output.',
  },
  {
    id: '882-action-primary-active-fg-rename',
    kind: 'rename',
    issue: '#882',
    reason:
      'Rename a transient physical-interaction role to canonical pressed while preserving its resolved design value.',
    platforms: ['react-native'],
    from: 'semantic.action.primary.active.fg',
    to: 'semantic.action.primary.pressed.fg',
  },
  {
    id: '882-action-primary-active-fg-web-identity',
    kind: 'representation-change',
    layer: 'platform-output',
    issue: '#882',
    reason:
      'Align the public Web CSS variable identity with the canonical pressed state name.',
    platforms: ['web'],
    from: 'semantic.action.primary.active.fg',
    to: 'semantic.action.primary.pressed.fg',
    equivalence:
      'The paired canonical #882 rename preserves the resolved design value; only the Web CSS variable identity changes from active to pressed.',
    evidence:
      'Token preservation validates the canonical/RN value-preserving rename; generated CSS checks and pinned Linux visual regression validate Web output.',
  },
  {
    id: '882-action-primary-active-border-rename',
    kind: 'rename',
    issue: '#882',
    reason:
      'Rename a transient physical-interaction role to canonical pressed while preserving its resolved design value.',
    platforms: ['react-native'],
    from: 'semantic.action.primary.active.border',
    to: 'semantic.action.primary.pressed.border',
  },
  {
    id: '882-action-primary-active-border-web-identity',
    kind: 'representation-change',
    layer: 'platform-output',
    issue: '#882',
    reason:
      'Align the public Web CSS variable identity with the canonical pressed state name.',
    platforms: ['web'],
    from: 'semantic.action.primary.active.border',
    to: 'semantic.action.primary.pressed.border',
    equivalence:
      'The paired canonical #882 rename preserves the resolved design value; only the Web CSS variable identity changes from active to pressed.',
    evidence:
      'Token preservation validates the canonical/RN value-preserving rename; generated CSS checks and pinned Linux visual regression validate Web output.',
  },
  {
    id: '882-action-secondary-active-bg-rename',
    kind: 'rename',
    issue: '#882',
    reason:
      'Rename a transient physical-interaction role to canonical pressed while preserving its resolved design value.',
    platforms: ['react-native'],
    from: 'semantic.action.secondary.active.bg',
    to: 'semantic.action.secondary.pressed.bg',
  },
  {
    id: '882-action-secondary-active-bg-web-identity',
    kind: 'representation-change',
    layer: 'platform-output',
    issue: '#882',
    reason:
      'Align the public Web CSS variable identity with the canonical pressed state name.',
    platforms: ['web'],
    from: 'semantic.action.secondary.active.bg',
    to: 'semantic.action.secondary.pressed.bg',
    equivalence:
      'The paired canonical #882 rename preserves the resolved design value; only the Web CSS variable identity changes from active to pressed.',
    evidence:
      'Token preservation validates the canonical/RN value-preserving rename; generated CSS checks and pinned Linux visual regression validate Web output.',
  },
  {
    id: '882-action-secondary-active-fg-rename',
    kind: 'rename',
    issue: '#882',
    reason:
      'Rename a transient physical-interaction role to canonical pressed while preserving its resolved design value.',
    platforms: ['react-native'],
    from: 'semantic.action.secondary.active.fg',
    to: 'semantic.action.secondary.pressed.fg',
  },
  {
    id: '882-action-secondary-active-fg-web-identity',
    kind: 'representation-change',
    layer: 'platform-output',
    issue: '#882',
    reason:
      'Align the public Web CSS variable identity with the canonical pressed state name.',
    platforms: ['web'],
    from: 'semantic.action.secondary.active.fg',
    to: 'semantic.action.secondary.pressed.fg',
    equivalence:
      'The paired canonical #882 rename preserves the resolved design value; only the Web CSS variable identity changes from active to pressed.',
    evidence:
      'Token preservation validates the canonical/RN value-preserving rename; generated CSS checks and pinned Linux visual regression validate Web output.',
  },
  {
    id: '882-action-secondary-active-border-rename',
    kind: 'rename',
    issue: '#882',
    reason:
      'Rename a transient physical-interaction role to canonical pressed while preserving its resolved design value.',
    platforms: ['react-native'],
    from: 'semantic.action.secondary.active.border',
    to: 'semantic.action.secondary.pressed.border',
  },
  {
    id: '882-action-secondary-active-border-web-identity',
    kind: 'representation-change',
    layer: 'platform-output',
    issue: '#882',
    reason:
      'Align the public Web CSS variable identity with the canonical pressed state name.',
    platforms: ['web'],
    from: 'semantic.action.secondary.active.border',
    to: 'semantic.action.secondary.pressed.border',
    equivalence:
      'The paired canonical #882 rename preserves the resolved design value; only the Web CSS variable identity changes from active to pressed.',
    evidence:
      'Token preservation validates the canonical/RN value-preserving rename; generated CSS checks and pinned Linux visual regression validate Web output.',
  },
  {
    id: '882-action-close-active-bg-rename',
    kind: 'rename',
    issue: '#882',
    reason:
      'Rename a transient physical-interaction role to canonical pressed while preserving its resolved design value.',
    platforms: ['react-native'],
    from: 'semantic.action.close.active.bg',
    to: 'semantic.action.close.pressed.bg',
  },
  {
    id: '882-action-close-active-bg-web-identity',
    kind: 'representation-change',
    layer: 'platform-output',
    issue: '#882',
    reason:
      'Align the public Web CSS variable identity with the canonical pressed state name.',
    platforms: ['web'],
    from: 'semantic.action.close.active.bg',
    to: 'semantic.action.close.pressed.bg',
    equivalence:
      'The paired canonical #882 rename preserves the resolved design value; only the Web CSS variable identity changes from active to pressed.',
    evidence:
      'Token preservation validates the canonical/RN value-preserving rename; generated CSS checks and pinned Linux visual regression validate Web output.',
  },
  {
    id: '882-action-close-active-fg-rename',
    kind: 'rename',
    issue: '#882',
    reason:
      'Rename a transient physical-interaction role to canonical pressed while preserving its resolved design value.',
    platforms: ['react-native'],
    from: 'semantic.action.close.active.fg',
    to: 'semantic.action.close.pressed.fg',
  },
  {
    id: '882-action-close-active-fg-web-identity',
    kind: 'representation-change',
    layer: 'platform-output',
    issue: '#882',
    reason:
      'Align the public Web CSS variable identity with the canonical pressed state name.',
    platforms: ['web'],
    from: 'semantic.action.close.active.fg',
    to: 'semantic.action.close.pressed.fg',
    equivalence:
      'The paired canonical #882 rename preserves the resolved design value; only the Web CSS variable identity changes from active to pressed.',
    evidence:
      'Token preservation validates the canonical/RN value-preserving rename; generated CSS checks and pinned Linux visual regression validate Web output.',
  },
  {
    id: '882-action-close-active-border-rename',
    kind: 'rename',
    issue: '#882',
    reason:
      'Rename a transient physical-interaction role to canonical pressed while preserving its resolved design value.',
    platforms: ['react-native'],
    from: 'semantic.action.close.active.border',
    to: 'semantic.action.close.pressed.border',
  },
  {
    id: '882-action-close-active-border-web-identity',
    kind: 'representation-change',
    layer: 'platform-output',
    issue: '#882',
    reason:
      'Align the public Web CSS variable identity with the canonical pressed state name.',
    platforms: ['web'],
    from: 'semantic.action.close.active.border',
    to: 'semantic.action.close.pressed.border',
    equivalence:
      'The paired canonical #882 rename preserves the resolved design value; only the Web CSS variable identity changes from active to pressed.',
    evidence:
      'Token preservation validates the canonical/RN value-preserving rename; generated CSS checks and pinned Linux visual regression validate Web output.',
  },
  {
    id: '882-action-danger-active-bg-rename',
    kind: 'rename',
    issue: '#882',
    reason:
      'Rename a transient physical-interaction role to canonical pressed while preserving its resolved design value.',
    platforms: ['react-native'],
    from: 'semantic.action.danger.active.bg',
    to: 'semantic.action.danger.pressed.bg',
  },
  {
    id: '882-action-danger-active-bg-web-identity',
    kind: 'representation-change',
    layer: 'platform-output',
    issue: '#882',
    reason:
      'Align the public Web CSS variable identity with the canonical pressed state name.',
    platforms: ['web'],
    from: 'semantic.action.danger.active.bg',
    to: 'semantic.action.danger.pressed.bg',
    equivalence:
      'The paired canonical #882 rename preserves the resolved design value; only the Web CSS variable identity changes from active to pressed.',
    evidence:
      'Token preservation validates the canonical/RN value-preserving rename; generated CSS checks and pinned Linux visual regression validate Web output.',
  },
  {
    id: '882-action-danger-active-fg-rename',
    kind: 'rename',
    issue: '#882',
    reason:
      'Rename a transient physical-interaction role to canonical pressed while preserving its resolved design value.',
    platforms: ['react-native'],
    from: 'semantic.action.danger.active.fg',
    to: 'semantic.action.danger.pressed.fg',
  },
  {
    id: '882-action-danger-active-fg-web-identity',
    kind: 'representation-change',
    layer: 'platform-output',
    issue: '#882',
    reason:
      'Align the public Web CSS variable identity with the canonical pressed state name.',
    platforms: ['web'],
    from: 'semantic.action.danger.active.fg',
    to: 'semantic.action.danger.pressed.fg',
    equivalence:
      'The paired canonical #882 rename preserves the resolved design value; only the Web CSS variable identity changes from active to pressed.',
    evidence:
      'Token preservation validates the canonical/RN value-preserving rename; generated CSS checks and pinned Linux visual regression validate Web output.',
  },
  {
    id: '882-action-danger-active-border-rename',
    kind: 'rename',
    issue: '#882',
    reason:
      'Rename a transient physical-interaction role to canonical pressed while preserving its resolved design value.',
    platforms: ['react-native'],
    from: 'semantic.action.danger.active.border',
    to: 'semantic.action.danger.pressed.border',
  },
  {
    id: '882-action-danger-active-border-web-identity',
    kind: 'representation-change',
    layer: 'platform-output',
    issue: '#882',
    reason:
      'Align the public Web CSS variable identity with the canonical pressed state name.',
    platforms: ['web'],
    from: 'semantic.action.danger.active.border',
    to: 'semantic.action.danger.pressed.border',
    equivalence:
      'The paired canonical #882 rename preserves the resolved design value; only the Web CSS variable identity changes from active to pressed.',
    evidence:
      'Token preservation validates the canonical/RN value-preserving rename; generated CSS checks and pinned Linux visual regression validate Web output.',
  },
  {
    id: '882-text-interactive-active-rename',
    kind: 'rename',
    issue: '#882',
    reason:
      'Rename a transient physical-interaction role to canonical pressed while preserving its resolved design value.',
    platforms: ['react-native'],
    from: 'semantic.text.interactiveActive',
    to: 'semantic.text.interactivePressed',
  },
  {
    id: '882-text-interactive-active-web-identity',
    kind: 'representation-change',
    layer: 'platform-output',
    issue: '#882',
    reason:
      'Align the public Web CSS variable identity with the canonical pressed state name.',
    platforms: ['web'],
    from: 'semantic.text.interactiveActive',
    to: 'semantic.text.interactivePressed',
    equivalence:
      'The paired canonical #882 rename preserves the resolved design value; only the Web CSS variable identity changes from active to pressed.',
    evidence:
      'Token preservation validates the canonical/RN value-preserving rename; generated CSS checks and pinned Linux visual regression validate Web output.',
  },
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
    approvalEvidence:
      '#879/#882 explicitly authorizes removal of pressed/active semantic conflation; the change stays inside the existing Vellira palette and requires pinned Linux visual regression.',
  },
  {
    id: '882-input-clear-button-pressed-surface',
    kind: 'visual-change',
    issue: '#882',
    reason:
      'Map Input clear-button physical press to surface.pressed instead of the persistent/current surface.active role.',
    from: 'components.input.clearButton.pressedBg',
    approved: true,
    approvalEvidence:
      '#879/#882 explicitly authorizes removal of pressed/active semantic conflation; the change stays inside the existing Vellira palette and requires pinned Linux visual regression.',
  },
  {
    id: '882-select-clear-button-pressed-surface',
    kind: 'visual-change',
    issue: '#882',
    reason:
      'Map Select clear-button physical press to surface.pressed instead of the persistent/current surface.active role.',
    from: 'components.select.clearButton.pressedBg',
    approved: true,
    approvalEvidence:
      '#879/#882 explicitly authorizes removal of pressed/active semantic conflation; the change stays inside the existing Vellira palette and requires pinned Linux visual regression.',
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
