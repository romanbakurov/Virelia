/**
 * Canonical token architecture metadata for tooling, Generator V2, and agents.
 *
 * This file intentionally describes ownership, vocabulary, and audit findings
 * without changing any resolved token value.
 */

export const tokenArchitectureLayers = [
  'primitive',
  'semantic',
  'component-factory',
  'component',
  'platform-output',
  'consumer',
] as const;

export const tokenArchitectureFlow =
  'primitive -> semantic -> component-factory -> component -> platform-output -> consumer' as const;

export const canonicalTokenVocabulary = {
  surface: [
    'canvas',
    'default',
    'subtle',
    'muted',
    'elevated',
    'hover',
    'active',
    'pressed',
    'disabled',
    'danger',
    'inverse',
  ],
  state: [
    'default',
    'hover',
    'active',
    'pressed',
    'selected',
    'disabled',
    'focus',
  ],
  foreground: [
    'primary',
    'secondary',
    'muted',
    'subtle',
    'disabled',
    'brand',
    'interactive',
    'interactiveHover',
    'interactiveActive',
    'inverse',
  ],
  border: ['subtle', 'muted', 'default', 'strong', 'elevated', 'disabled'],
  intent: ['primary', 'neutral', 'success', 'warning', 'danger'],
  status: ['success', 'error', 'warning', 'info'],
} as const;

export const canonicalSemanticRolePaths = [
  'surface.canvas',
  'surface.default',
  'surface.subtle',
  'surface.muted',
  'surface.elevated',
  'surface.hover',
  'surface.active',
  'surface.pressed',
  'surface.disabled',
  'surface.danger',
  'surface.inverse',
  'text.primary',
  'text.secondary',
  'text.muted',
  'text.subtle',
  'text.disabled',
  'text.brand',
  'text.interactive',
  'text.interactiveHover',
  'text.interactiveActive',
  'text.inverse',
  'border.subtle',
  'border.muted',
  'border.default',
  'border.strong',
  'border.elevated',
  'border.disabled',
  'border.focus',
  'divider.muted',
  'divider.default',
  'divider.strong',
  'focus.ring.color',
  'focus.ring.width',
  'focus.ring.shadow',
  'focus.ring.offset',
  'status.success.fg',
  'status.success.bg',
  'status.success.border',
  'status.success.ring',
  'status.success.strong',
  'status.error.fg',
  'status.error.bg',
  'status.error.border',
  'status.error.ring',
  'status.error.strong',
  'status.warning.fg',
  'status.warning.bg',
  'status.warning.border',
  'status.warning.ring',
  'status.warning.strong',
  'status.info.fg',
  'status.info.bg',
  'status.info.border',
  'status.info.ring',
  'status.info.strong',
  'overlay.backdrop',
  'overlay.tooltip.bg',
  'overlay.tooltip.fg',
  'overlay.tooltip.border',
  'overlay.popover.bg',
  'overlay.popover.border',
  'overlay.modal.bg',
  'overlay.modal.border',
] as const;

export const componentTokenFactoryModel = {
  canonicalName: 'create<Component>Tokens',
  legacyPaletteName:
    'create<Component>Palette is retained when the component exposes intent palettes.',
  role: 'Factories compose semantic inputs and stable implementation primitives into component contracts.',
  transparentPrimitive:
    'transparent is an implementation primitive for absent paint, not a theme color.',
  generatorRule:
    'Reuse an existing factory when a generated component has equivalent state vocabulary; extend a reusable factory only when the existing component contract needs a stable shared state; introduce a component-specific factory only for a reusable component contract that generic semantic roles cannot express.',
} as const;

export const maintainedComponentFactories = [
  {
    name: 'createAccordionTokens',
    source: 'packages/tokens/src/factories/createAccordionTokens.ts',
    semanticAdapter: 'createAccordionTokensFromSemantics',
    stateKeys: ['default', 'expanded', 'hover', 'pressed', 'disabled'],
  },
  {
    name: 'createButtonPalette',
    source: 'packages/tokens/src/factories/createButtonPalette.ts',
    semanticAdapter: null,
    stateKeys: ['default', 'hover', 'pressed'],
  },
  {
    name: 'createCheckboxPalette',
    source: 'packages/tokens/src/factories/createCheckboxPalette.ts',
    semanticAdapter: null,
    stateKeys: ['default', 'hover', 'pressed'],
  },
  {
    name: 'createContextMenuTokens',
    source: 'packages/tokens/src/factories/createContextMenuTokens.ts',
    semanticAdapter: 'createContextMenuTokensFromSemantics',
    stateKeys: ['default', 'hover', 'active', 'pressed', 'focus', 'disabled'],
  },
  {
    name: 'createDropdownPalette',
    source: 'packages/tokens/src/factories/createDropdownPalette.ts',
    semanticAdapter: null,
    stateKeys: ['default', 'hover', 'focus', 'active', 'pressed'],
  },
  {
    name: 'createFormFieldTokensFromTheme',
    source: 'packages/tokens/src/factories/createFormFieldTokens.ts',
    semanticAdapter: 'createFormFieldTokensFromTheme',
    stateKeys: ['default', 'error', 'success', 'warning', 'info', 'disabled'],
  },
  {
    name: 'createInputPalette',
    source: 'packages/tokens/src/factories/createInputPalette.ts',
    semanticAdapter: null,
    stateKeys: ['default', 'hover', 'focus'],
  },
  {
    name: 'createModalTokens',
    source: 'packages/tokens/src/factories/createModalTokens.ts',
    semanticAdapter: 'createModalTokensFromSemantics',
    stateKeys: ['default', 'hover', 'pressed', 'focus', 'disabled'],
  },
  {
    name: 'createPopoverTokens',
    source: 'packages/tokens/src/factories/createPopoverTokens.ts',
    semanticAdapter: 'createPopoverTokensFromTheme',
    stateKeys: ['default'],
  },
  {
    name: 'createRadioGroupTokens',
    source: 'packages/tokens/src/factories/createRadioGroupTokens.ts',
    semanticAdapter: 'createRadioGroupTokensFromSpacing',
    stateKeys: ['default'],
  },
  {
    name: 'createRadioPalette',
    source: 'packages/tokens/src/factories/createRadioPalette.ts',
    semanticAdapter: null,
    stateKeys: ['default', 'hover', 'pressed'],
  },
  {
    name: 'createSelectPalette',
    source: 'packages/tokens/src/factories/createSelectPalette.ts',
    semanticAdapter: null,
    stateKeys: [
      'default',
      'hover',
      'focus',
      'active',
      'pressed',
      'selected',
      'selectedHover',
      'selectedActive',
      'selectedPressed',
    ],
  },
  {
    name: 'createSwitchTokens',
    source: 'packages/tokens/src/factories/createSwitchTokens.ts',
    semanticAdapter: 'createSwitchTokensFromSemantics',
    stateKeys: ['default', 'hover', 'pressed', 'disabled'],
  },
  {
    name: 'createTabsTokens',
    source: 'packages/tokens/src/factories/createTabsTokens.ts',
    semanticAdapter: null,
    stateKeys: ['default', 'hover', 'active', 'disabled'],
  },
  {
    name: 'createTooltipTokens',
    source: 'packages/tokens/src/factories/createTooltipTokens.ts',
    semanticAdapter: 'createTooltipTokensFromTheme',
    stateKeys: ['default'],
  },
] as const;

export const tokenArchitectureAuditFindings = [
  {
    id: 'semantic-shape-parity',
    classification: 'A',
    summary:
      'Light, dark, and high-contrast themes expose the same semantic token shape.',
  },
  {
    id: 'component-shape-parity',
    classification: 'A',
    summary:
      'Light, dark, and high-contrast themes expose the same component token shape.',
  },
  {
    id: 'factory-layer',
    classification: 'E',
    summary:
      'Component token factories are a first-class layer for stable component state contracts.',
  },
  {
    id: 'website-text-tertiary',
    classification: 'H',
    summary:
      'Website CSS references --text-tertiary, which is not a canonical semantic token. Adding or remapping it would visibly affect website text and should be handled by a focused visual issue.',
  },
  {
    id: 'website-demo-raw-border',
    classification: 'H',
    summary:
      'Some component catalog examples use raw demonstration border colors. Replacing them with tokens may alter examples and should be handled only with explicit visual approval.',
  },
] as const;
