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

export const tokenValueKinds = [
  'color',
  'length',
  'unitless-number',
  'opacity',
  'scale',
  'z-index',
  'duration',
  'easing',
  'shadow',
  'font-family',
  'font-weight',
  'font-size',
  'line-height',
  'raw-string',
] as const;

export type TokenValueKind = (typeof tokenValueKinds)[number];

export const tokenValueKindWebContract = {
  color: { numericUnit: null },
  length: { numericUnit: 'px' },
  'unitless-number': { numericUnit: '' },
  opacity: { numericUnit: '' },
  scale: { numericUnit: '' },
  'z-index': { numericUnit: '' },
  duration: { numericUnit: 'ms' },
  easing: { numericUnit: null },
  shadow: { numericUnit: null },
  'font-family': { numericUnit: null },
  'font-weight': { numericUnit: '' },
  'font-size': { numericUnit: 'px' },
  'line-height': { numericUnit: 'px' },
  'raw-string': { numericUnit: null },
} as const satisfies Record<
  TokenValueKind,
  { readonly numericUnit: string | null }
>;

/**
 * Canonical numeric role families. Matching is by semantic role words, not by
 * one-off full token paths. Compound roles may put the semantic family at
 * either edge (`paddingBottom`, `borderWidth`, `contentScale`), and nested
 * scales may inherit meaning from their nearest parent role (`size.sm`).
 */
export const canonicalComponentNumericRoleFamilies = {
  scale: ['scale'],
  opacity: ['opacity'],
  'z-index': ['zIndex', 'zIndexOffset', 'order'],
  'unitless-number': ['elevation'],
  'font-weight': ['fontWeight'],
  'font-size': ['fontSize'],
  'line-height': ['lineHeight'],
  duration: ['duration'],
  length: [
    'width',
    'height',
    'size',
    'gap',
    'padding',
    'paddingX',
    'paddingY',
    'radius',
    'margin',
    'marginX',
    'marginY',
    'offset',
    'blur',
    'translateX',
    'translateY',
    'travel',
  ],
} as const satisfies Partial<Record<TokenValueKind, readonly string[]>>;

const componentStringRoleFamilies = {
  duration: ['duration'],
  easing: ['easing'],
  shadow: ['shadow'],
  color: [
    'bg',
    'fg',
    'border',
    'ring',
    'color',
    'placeholder',
    'icon',
    'indicator',
    'divider',
  ],
} as const satisfies Partial<Record<TokenValueKind, readonly string[]>>;

function lastTokenPathSegment(tokenPath: string): string {
  return tokenPath.split('.').at(-1) ?? '';
}

function splitRoleWords(role: string): string[] {
  return role
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/[^a-zA-Z0-9]+/g, ' ')
    .trim()
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean);
}

function matchesRoleFamily(role: string, families: readonly string[]): boolean {
  const roleWords = splitRoleWords(role);

  return families.some((family) => {
    const familyWords = splitRoleWords(family);

    if (familyWords.length > roleWords.length) return false;

    const prefixMatches = familyWords.every(
      (word, index) => roleWords[index] === word
    );
    const suffixStart = roleWords.length - familyWords.length;
    const suffixMatches = familyWords.every(
      (word, index) => roleWords[suffixStart + index] === word
    );

    return prefixMatches || suffixMatches;
  });
}

function resolveRoleKind(
  role: string,
  families: Partial<Record<TokenValueKind, readonly string[]>>
): TokenValueKind | null {
  for (const [kind, roleFamilies] of Object.entries(families) as Array<
    [TokenValueKind, readonly string[]]
  >) {
    if (matchesRoleFamily(role, roleFamilies)) return kind;
  }

  return null;
}

function resolveShadowLeafKind(tokenPath: string): TokenValueKind | null {
  const role = lastTokenPathSegment(tokenPath).toLowerCase();

  if (role === 'x' || role === 'y' || role === 'blur') return 'length';
  if (role === 'opacity') return 'opacity';
  if (role === 'elevation') return 'unitless-number';
  if (role === 'color') return 'color';

  return null;
}

function componentRoleSegments(tokenPath: string): string[] {
  const segments = tokenPath.split('.');

  if (
    tokenPath.startsWith('components.') ||
    tokenPath.startsWith('tokens.controlSizes.')
  ) {
    return segments.slice(2);
  }

  return segments;
}

function resolveComponentValueKind(
  tokenPath: string,
  value: string | number
): TokenValueKind | null {
  if (tokenPath.includes('.shadow.native.')) {
    const shadowKind = resolveShadowLeafKind(tokenPath);
    if (shadowKind) return shadowKind;
  }

  const roleSegments = componentRoleSegments(tokenPath);

  if (typeof value === 'number') {
    for (let index = roleSegments.length - 1; index >= 0; index -= 1) {
      const numericRoleKind = resolveRoleKind(
        roleSegments[index]!,
        canonicalComponentNumericRoleFamilies
      );

      if (numericRoleKind) return numericRoleKind;
    }

    return null;
  }

  const role = roleSegments.at(-1) ?? '';
  return resolveRoleKind(role, componentStringRoleFamilies) ?? 'raw-string';
}

/**
 * Resolve the canonical value kind for a scalar token path.
 *
 * Unknown strings remain explicit raw strings because CSS accepts many
 * renderer-specific string representations. Unknown numeric paths are rejected
 * by `requireTokenValueKind`: a number must always declare meaning through the
 * canonical namespace or role vocabulary before it can reach a renderer.
 */
export function resolveTokenValueKind(
  tokenPath: string,
  value: string | number
): TokenValueKind | null {
  if (tokenPath.startsWith('colors.')) return 'color';
  if (tokenPath.startsWith('primitives.overlay.')) return 'color';

  if (tokenPath.startsWith('semantic.')) {
    if (
      tokenPath.startsWith('semantic.shadow.') ||
      tokenPath.endsWith('.shadow')
    ) {
      return 'shadow';
    }

    if (tokenPath === 'semantic.focus.ring.width') return 'length';

    return 'color';
  }

  if (tokenPath.startsWith('tokens.spacing.')) return 'length';
  if (tokenPath.startsWith('tokens.radius.')) return 'length';
  if (tokenPath.startsWith('tokens.zIndex.')) return 'z-index';
  if (tokenPath.startsWith('tokens.typography.family.')) return 'font-family';
  if (tokenPath.startsWith('tokens.typography.weight.')) return 'font-weight';
  if (tokenPath.startsWith('tokens.typography.size.')) return 'font-size';
  if (tokenPath.startsWith('tokens.typography.lineHeight.')) {
    return 'line-height';
  }

  if (tokenPath.startsWith('tokens.shadows.')) {
    return resolveShadowLeafKind(tokenPath);
  }

  if (tokenPath.startsWith('tokens.controlSizes.')) {
    return resolveComponentValueKind(tokenPath, value);
  }

  if (tokenPath.startsWith('components.')) {
    return resolveComponentValueKind(tokenPath, value);
  }

  return typeof value === 'number' ? null : 'raw-string';
}

export function requireTokenValueKind(
  tokenPath: string,
  value: string | number
): TokenValueKind {
  const kind = resolveTokenValueKind(tokenPath, value);

  if (kind) return kind;

  throw new Error(
    `Unknown numeric token value kind for "${tokenPath}". Add a canonical namespace or role rule before serializing this token.`
  );
}

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
