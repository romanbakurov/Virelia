from pathlib import Path

ROOT = Path('.')


def read(path: str) -> str:
    return (ROOT / path).read_text()


def write(path: str, text: str) -> None:
    (ROOT / path).write_text(text)


def replace_once(path: str, old: str, new: str) -> None:
    text = read(path)
    count = text.count(old)
    if count != 1:
        raise SystemExit(f'{path}: expected one exact match, found {count}: {old[:80]!r}')
    write(path, text.replace(old, new, 1))


# 1. Make the platform intent adapter type-honest and give it one deterministic
#    source mapping. #885 owns later shadow/elevation authority consolidation.
write(
    'packages/tokens/src/platform-output/component-token-intents.ts',
    r'''export const componentShadowLevels = ['sm', 'md', 'lg', 'xl'] as const;

export type ComponentShadowLevel = (typeof componentShadowLevels)[number];

export type ComponentShadowIntent = Readonly<{
  kind: 'shadow';
  level: ComponentShadowLevel;
}>;

export type ComponentViewportHeightIntent = Readonly<{
  kind: 'viewport-height';
  ratio: number;
}>;

export type ComponentPlatformIntent =
  | ComponentShadowIntent
  | ComponentViewportHeightIntent;

export type ReactNativeShadowOutput = Readonly<{
  x: number;
  y: number;
  blur: number;
  color: string;
  opacity: number;
  elevation: number;
}>;

export type ComponentPlatformOutputSources = Readonly<{
  web: {
    shadow: Readonly<Record<ComponentShadowLevel, string>>;
  };
  reactNative: {
    shadow: Readonly<Record<ComponentShadowLevel, ReactNativeShadowOutput>>;
  };
}>;

type ComponentOutputThemeSources = Readonly<{
  semantic: {
    shadow: Readonly<Record<ComponentShadowLevel, string>>;
  };
  tokens: {
    shadows: Readonly<
      Record<'sm' | 'md' | 'lg', ReactNativeShadowOutput>
    >;
  };
}>;

export type AdaptedComponentTokenValue<T, TShadow> =
  T extends ComponentShadowIntent
    ? TShadow
    : T extends ComponentViewportHeightIntent
      ? string
      : T extends readonly (infer TEntry)[]
        ? readonly AdaptedComponentTokenValue<TEntry, TShadow>[]
        : T extends object
          ? { readonly [K in keyof T]: AdaptedComponentTokenValue<T[K], TShadow> }
          : T;

export type WebComponentTokens<T> = AdaptedComponentTokenValue<T, string>;
export type ReactNativeComponentTokens<T> = AdaptedComponentTokenValue<
  T,
  ReactNativeShadowOutput
>;

export function createComponentShadowIntent(
  level: ComponentShadowLevel
): ComponentShadowIntent {
  return { kind: 'shadow', level };
}

export function createComponentViewportHeightIntent(
  ratio: number
): ComponentViewportHeightIntent {
  if (!Number.isFinite(ratio) || ratio <= 0 || ratio > 1) {
    throw new Error(
      `Component viewport-height ratio must be finite and within (0, 1], received ${ratio}.`
    );
  }

  return { kind: 'viewport-height', ratio };
}

export function isComponentPlatformIntent(
  value: unknown
): value is ComponentPlatformIntent {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    return false;
  }

  const candidate = value as Record<string, unknown>;

  if (
    candidate.kind === 'shadow' &&
    typeof candidate.level === 'string' &&
    componentShadowLevels.includes(candidate.level as ComponentShadowLevel)
  ) {
    return true;
  }

  return (
    candidate.kind === 'viewport-height' &&
    typeof candidate.ratio === 'number' &&
    Number.isFinite(candidate.ratio) &&
    candidate.ratio > 0 &&
    candidate.ratio <= 1
  );
}

export function createComponentPlatformOutputSources(
  theme: ComponentOutputThemeSources
): ComponentPlatformOutputSources {
  return {
    web: {
      shadow: {
        sm: theme.semantic.shadow.sm,
        md: theme.semantic.shadow.md,
        lg: theme.semantic.shadow.lg,
        xl: theme.semantic.shadow.xl,
      },
    },
    reactNative: {
      shadow: {
        sm: theme.tokens.shadows.sm,
        md: theme.tokens.shadows.md,
        lg: theme.tokens.shadows.lg,
        // Existing native Modal behavior uses the current lg structured shadow
        // while its Web representation uses semantic xl. #885 owns authority
        // consolidation; #884 preserves that output intentionally.
        xl: theme.tokens.shadows.lg,
      },
    },
  };
}

function formatPercentage(ratio: number): string {
  const percentage = ratio * 100;
  return Number.isInteger(percentage)
    ? String(percentage)
    : String(Number(percentage.toFixed(4)));
}

export function resolveComponentIntentForWeb(
  intent: ComponentPlatformIntent,
  sources: ComponentPlatformOutputSources
): string {
  if (intent.kind === 'shadow') {
    return sources.web.shadow[intent.level];
  }

  return `${formatPercentage(intent.ratio)}vh`;
}

export function resolveComponentIntentForReactNative(
  intent: ComponentPlatformIntent,
  sources: ComponentPlatformOutputSources
): string | ReactNativeShadowOutput {
  if (intent.kind === 'shadow') {
    return sources.reactNative.shadow[intent.level];
  }

  return `${formatPercentage(intent.ratio)}%`;
}

function adaptComponentTokenTree(
  value: unknown,
  resolveIntent: (intent: ComponentPlatformIntent) => unknown
): unknown {
  if (isComponentPlatformIntent(value)) {
    return resolveIntent(value);
  }

  if (Array.isArray(value)) {
    return value.map((entry) => adaptComponentTokenTree(entry, resolveIntent));
  }

  if (typeof value === 'object' && value !== null) {
    return Object.fromEntries(
      Object.entries(value).map(([key, entry]) => [
        key,
        adaptComponentTokenTree(entry, resolveIntent),
      ])
    );
  }

  return value;
}

export function adaptComponentTokensForWeb<T>(
  components: T,
  sources: ComponentPlatformOutputSources
): WebComponentTokens<T> {
  return adaptComponentTokenTree(components, (intent) =>
    resolveComponentIntentForWeb(intent, sources)
  ) as WebComponentTokens<T>;
}

export function adaptComponentTokensForReactNative<T>(
  components: T,
  sources: ComponentPlatformOutputSources
): ReactNativeComponentTokens<T> {
  return adaptComponentTokenTree(components, (intent) =>
    resolveComponentIntentForReactNative(intent, sources)
  ) as ReactNativeComponentTokens<T>;
}
''',
)

# 2. Canonical factories keep only renderer-neutral intent.
replace_once(
    'packages/tokens/src/factories/createPopoverTokens.ts',
    "import type { shadows } from '../tokens/shadows.js';\n\ntype NativeShadowToken = (typeof shadows)[keyof typeof shadows];\n",
    "import { createComponentShadowIntent } from '../platform-output/component-token-intents.js';\n",
)
replace_once(
    'packages/tokens/src/factories/createPopoverTokens.ts',
    '  contentWebShadow: string;\n  contentNativeShadow: NativeShadowToken;\n',
    '',
)
replace_once(
    'packages/tokens/src/factories/createPopoverTokens.ts',
    "  shadow: {\n    lg: string;\n  };\n  shadows: {\n    lg: NativeShadowToken;\n  };\n",
    '',
)
replace_once(
    'packages/tokens/src/factories/createPopoverTokens.ts',
    "      shadow: {\n        web: config.contentWebShadow,\n        native: config.contentNativeShadow,\n      },\n",
    "      shadow: createComponentShadowIntent('lg'),\n",
)
replace_once(
    'packages/tokens/src/factories/createPopoverTokens.ts',
    '  shadow,\n  shadows,\n',
    '',
)
replace_once(
    'packages/tokens/src/factories/createPopoverTokens.ts',
    '    contentWebShadow: shadow.lg,\n    contentNativeShadow: shadows.lg,\n',
    '',
)

replace_once(
    'packages/tokens/src/factories/createTooltipTokens.ts',
    'type TooltipContentTokens = {\n',
    "import {\n  createComponentShadowIntent,\n  type ComponentShadowIntent,\n} from '../platform-output/component-token-intents.js';\n\ntype TooltipContentTokens = {\n",
)
replace_once(
    'packages/tokens/src/factories/createTooltipTokens.ts',
    '  shadow: string;\n',
    '  shadow: ComponentShadowIntent;\n',
)
replace_once(
    'packages/tokens/src/factories/createTooltipTokens.ts',
    '  contentShadow: string;\n',
    '',
)
replace_once(
    'packages/tokens/src/factories/createTooltipTokens.ts',
    "  shadow: {\n    md: string;\n  };\n",
    '',
)
replace_once(
    'packages/tokens/src/factories/createTooltipTokens.ts',
    '  contentShadow,\n',
    '',
)
replace_once(
    'packages/tokens/src/factories/createTooltipTokens.ts',
    '      shadow: contentShadow,\n',
    "      shadow: createComponentShadowIntent('md'),\n",
)
replace_once(
    'packages/tokens/src/factories/createTooltipTokens.ts',
    '  shadow,\n',
    '',
)
replace_once(
    'packages/tokens/src/factories/createTooltipTokens.ts',
    '    contentShadow: shadow.md,\n',
    '',
)

replace_once(
    'packages/tokens/src/factories/createModalTokens.ts',
    "import {\n  createComponentFocusRing,\n  type SemanticFocusRing,\n} from './componentFocusRing.js';\n",
    "import {\n  createComponentShadowIntent,\n  createComponentViewportHeightIntent,\n} from '../platform-output/component-token-intents.js';\n\nimport {\n  createComponentFocusRing,\n  type SemanticFocusRing,\n} from './componentFocusRing.js';\n",
)
replace_once(
    'packages/tokens/src/factories/createModalTokens.ts',
    '  contentShadow: string;\n',
    '',
)
replace_once(
    'packages/tokens/src/factories/createModalTokens.ts',
    "  shadow: {\n    xl: string;\n  };\n",
    '',
)
replace_once(
    'packages/tokens/src/factories/createModalTokens.ts',
    "const modalLayout = {\n  maxHeight: '90vh',\n  nativeMaxHeight: '90%',\n  zIndexOffset: 1,\n} as const;\n",
    "const modalLayout = {\n  maxHeight: createComponentViewportHeightIntent(0.9),\n  zIndexOffset: 1,\n} as const;\n",
)
replace_once(
    'packages/tokens/src/factories/createModalTokens.ts',
    '      shadow: config.contentShadow,\n',
    "      shadow: createComponentShadowIntent('xl'),\n",
)
replace_once(
    'packages/tokens/src/factories/createModalTokens.ts',
    '      nativeMaxHeight: modalLayout.nativeMaxHeight,\n',
    '',
)
replace_once(
    'packages/tokens/src/factories/createModalTokens.ts',
    '  shadow,\n',
    '',
)
replace_once(
    'packages/tokens/src/factories/createModalTokens.ts',
    '    contentShadow: shadow.xl,\n',
    '',
)

replace_once(
    'packages/tokens/src/factories/createContextMenuTokens.ts',
    "import {\n  createComponentFocusRing,\n  type SemanticFocusRing,\n} from './componentFocusRing.js';\n",
    "import { createComponentShadowIntent } from '../platform-output/component-token-intents.js';\n\nimport {\n  createComponentFocusRing,\n  type SemanticFocusRing,\n} from './componentFocusRing.js';\n",
)
replace_once(
    'packages/tokens/src/factories/createContextMenuTokens.ts',
    '  contentShadow: string;\n',
    '',
)
replace_once(
    'packages/tokens/src/factories/createContextMenuTokens.ts',
    "  shadow: {\n    lg: string;\n  };\n",
    '',
)
replace_once(
    'packages/tokens/src/factories/createContextMenuTokens.ts',
    '      shadow: config.contentShadow,\n',
    "      shadow: createComponentShadowIntent('lg'),\n",
)
replace_once(
    'packages/tokens/src/factories/createContextMenuTokens.ts',
    '  shadow,\n',
    '',
)
replace_once(
    'packages/tokens/src/factories/createContextMenuTokens.ts',
    '    contentShadow: shadow.lg,\n',
    '',
)

# 3. Theme component modules stop supplying renderer-specific shadow sources.
for theme in ('light', 'dark', 'highContrast'):
    base = f'packages/tokens/src/{theme}/components'
    popover = f'{base}/popover.ts'
    text = read(popover)
    text = text.replace("import { shadows } from '../../tokens/shadows.js';\n", '')
    text = text.replace("import { shadow } from '../semantic/shadow.js';\n", '')
    text = text.replace('  shadow,\n  shadows,\n', '')
    write(popover, text)

    for name in ('tooltip', 'modal', 'contextMenu'):
        path = f'{base}/{name}.ts'
        text = read(path)
        text = text.replace("import { shadow } from '../semantic/shadow.js';\n", '')
        text = text.replace('  shadow,\n', '')
        write(path, text)

# 4. Web CSS output adapts canonical component intent after component resolution.
replace_once(
    'packages/tokens/scripts/token-css-output.ts',
    "import { lightTheme } from '../src/light/theme.js';\n",
    "import { lightTheme } from '../src/light/theme.js';\nimport {\n  adaptComponentTokensForWeb,\n  createComponentPlatformOutputSources,\n} from '../src/platform-output/component-token-intents.js';\n",
)
replace_once(
    'packages/tokens/scripts/token-css-output.ts',
    "  collectVariables(theme.components, '', 'components', output);\n",
    "  const webComponents = adaptComponentTokensForWeb(\n    theme.components,\n    createComponentPlatformOutputSources(theme)\n  );\n  collectVariables(webComponents, '', 'components', output);\n",
)

# 5. Generated token walkers treat platform intent as one canonical token path.
replace_once(
    'packages/tokens/scripts/generate-token-types.ts',
    "import { lightTheme } from '../src/light/theme.js';\n",
    "import { lightTheme } from '../src/light/theme.js';\nimport { isComponentPlatformIntent } from '../src/platform-output/component-token-intents.js';\n",
)
replace_once(
    'packages/tokens/scripts/generate-token-types.ts',
    "    if (isPlainObject(value)) {\n      paths.push(...collectTokenPaths(value, name));\n      continue;\n    }\n",
    "    if (isComponentPlatformIntent(value)) {\n      paths.push(name);\n      continue;\n    }\n\n    if (isPlainObject(value)) {\n      paths.push(...collectTokenPaths(value, name));\n      continue;\n    }\n",
)
replace_once(
    'packages/tokens/scripts/generate-token-types.ts',
    "    if (isPlainObject(value)) {\n      names.push(...collectCssVariableNames(value, name));\n      continue;\n    }\n\n    if (typeof value === 'string' || typeof value === 'number') {\n      names.push(`--${name}`);\n    }\n",
    "    if (isComponentPlatformIntent(value)) {\n      names.push(`--${name}`);\n      continue;\n    }\n\n    if (isPlainObject(value)) {\n      names.push(...collectCssVariableNames(value, name));\n      continue;\n    }\n\n    if (typeof value === 'string' || typeof value === 'number') {\n      names.push(`--${name}`);\n    }\n",
)
replace_once(
    'packages/tokens/scripts/generate-token-types.ts',
    "import type { lightTheme } from '../light/theme.js';\n\n",
    "import type { lightTheme } from '../light/theme.js';\nimport type { ComponentPlatformIntent } from '../platform-output/component-token-intents.js';\n\n",
)
replace_once(
    'packages/tokens/scripts/generate-token-types.ts',
    "export type WidenTokenValues<T> = {\n  readonly [K in keyof T]: T[K] extends string\n",
    "export type WidenTokenValues<T> = T extends ComponentPlatformIntent\n  ? T\n  : {\n  readonly [K in keyof T]: T[K] extends string\n",
)
replace_once(
    'packages/tokens/scripts/generate-token-types.ts',
    "          : T[K];\n};\n\nexport type LightTheme",
    "          : T[K];\n    };\n\nexport type LightTheme",
)

# 6. Preservation hashes an intent atomically at the original component path.
replace_once(
    'packages/tokens/scripts/token-preservation.ts',
    "import { lightTheme } from '../src/light/theme.js';\n",
    "import { lightTheme } from '../src/light/theme.js';\nimport { isComponentPlatformIntent } from '../src/platform-output/component-token-intents.js';\n",
)
replace_once(
    'packages/tokens/scripts/token-preservation.ts',
    "function normalizeLeaf(value: unknown): string {\n  if (value === null) return 'null:null';\n",
    "function normalizeLeaf(value: unknown): string {\n  if (isComponentPlatformIntent(value)) {\n    return `component-intent:${JSON.stringify(value)}`;\n  }\n\n  if (value === null) return 'null:null';\n",
)
replace_once(
    'packages/tokens/scripts/token-preservation.ts',
    "function collectLeafHashes(\n  value: unknown,\n  prefix: string,\n  result: Map<string, string>\n): void {\n  if (Array.isArray(value)) {\n",
    "function collectLeafHashes(\n  value: unknown,\n  prefix: string,\n  result: Map<string, string>\n): void {\n  if (isComponentPlatformIntent(value)) {\n    if (!prefix) {\n      throw new Error('Token preservation encountered an intent without a path.');\n    }\n\n    result.set(prefix, hashLeaf(value));\n    return;\n  }\n\n  if (Array.isArray(value)) {\n",
)

# 7. Numeric audits treat intent metadata as atomic, not token leaves.
replace_once(
    'packages/tokens/src/token-value-kinds.test.ts',
    "import { lightTheme } from './light/theme.js';\n",
    "import { lightTheme } from './light/theme.js';\nimport { isComponentPlatformIntent } from './platform-output/component-token-intents.js';\n",
)
replace_once(
    'packages/tokens/src/token-value-kinds.test.ts',
    "function collectNumericLeaves(\n  value: unknown,\n  prefix: string,\n  result: NumericLeaf[]\n): void {\n  if (typeof value === 'number') {\n",
    "function collectNumericLeaves(\n  value: unknown,\n  prefix: string,\n  result: NumericLeaf[]\n): void {\n  if (isComponentPlatformIntent(value)) return;\n\n  if (typeof value === 'number') {\n",
)
old_native_assertions = """    expect(requireTokenValueKind('components.popover.shadow.native.x', 0)).toBe(\n      'length'\n    );\n    expect(\n      requireTokenValueKind('components.popover.shadow.native.opacity', 0.1)\n    ).toBe('opacity');\n    expect(\n      requireTokenValueKind('components.popover.shadow.native.elevation', 8)\n    ).toBe('unitless-number');\n"""
text = read('packages/tokens/src/token-value-kinds.test.ts')
if text.count(old_native_assertions) != 1:
    raise SystemExit('token-value-kinds.test.ts: expected legacy popover native assertions')
write('packages/tokens/src/token-value-kinds.test.ts', text.replace(old_native_assertions, '', 1))

# 8. Export the reusable platform-output layer for renderer packages.
replace_once(
    'packages/tokens/src/index.ts',
    "export { overlay } from './primitives/overlay.js';\n",
    "export {\n  adaptComponentTokensForReactNative,\n  adaptComponentTokensForWeb,\n  createComponentPlatformOutputSources,\n  createComponentShadowIntent,\n  createComponentViewportHeightIntent,\n} from './platform-output/component-token-intents.js';\nexport type {\n  ComponentPlatformIntent,\n  ComponentPlatformOutputSources,\n  ReactNativeComponentTokens,\n  ReactNativeShadowOutput,\n  WebComponentTokens,\n} from './platform-output/component-token-intents.js';\nexport { overlay } from './primitives/overlay.js';\n",
)

# 9. RN uses the same canonical contract and one reusable boundary adapter.
write(
    'packages/react-native/src/theme/componentTokenOutput.ts',
    r'''import {
  adaptComponentTokensForReactNative,
  adaptComponentTokensForWeb,
  createComponentPlatformOutputSources,
} from '@vellira-ui/tokens';

import type { NativeTheme } from './themes';

export function resolveComponentTokenPlatformOutputs<T>(
  theme: NativeTheme,
  componentTokens: T
) {
  const sources = createComponentPlatformOutputSources(theme);

  return {
    web: adaptComponentTokensForWeb(componentTokens, sources),
    reactNative: adaptComponentTokensForReactNative(componentTokens, sources),
  } as const;
}
''',
)
replace_once(
    'packages/react-native/src/theme/index.ts',
    "export * from './fontWeight';\n",
    "export * from './componentTokenOutput';\nexport * from './fontWeight';\n",
)

# Popover RN style consumes only renderer output, never canonical branches.
write(
    'packages/react-native/src/components/Popover/Content/PopoverContent.styles.ts',
    r'''import { Platform, StyleSheet } from 'react-native';

import {
  resolveComponentTokenPlatformOutputs,
  type NativeTheme,
} from '../../../theme';

export const styles = StyleSheet.create({
  root: {
    flex: 1,
    ...(Platform.OS === 'web'
      ? {
          pointerEvents: 'box-none',
        }
      : {}),
  },

  backdrop: StyleSheet.absoluteFill,

  content: {
    position: 'absolute',
  },
});

export function createPopoverContentStyles(theme: NativeTheme) {
  const canonical = theme.components.popover.content;
  const output = resolveComponentTokenPlatformOutputs(theme, canonical);
  const nativeShadow = output.reactNative.shadow;

  return StyleSheet.create({
    content: {
      minWidth: canonical.minWidth,
      maxWidth: canonical.maxWidth,
      padding: canonical.padding,
      gap: canonical.gap,

      backgroundColor: canonical.bg,
      borderColor: canonical.border,
      borderWidth: canonical.borderWidth,
      borderRadius: canonical.radius,

      ...(Platform.OS === 'web'
        ? {
            boxShadow: output.web.shadow,
          }
        : {
            shadowColor: nativeShadow.color,
            shadowOpacity: nativeShadow.opacity,
            shadowRadius: nativeShadow.blur,
            shadowOffset: {
              width: nativeShadow.x,
              height: nativeShadow.y,
            },
            elevation: nativeShadow.elevation,
          }),
    },
  });
}
''',
)

write(
    'packages/react-native/src/components/Tooltip/Tooltip.styles.ts',
    r'''import { Platform, StyleSheet } from 'react-native';

import {
  resolveComponentTokenPlatformOutputs,
  type NativeTheme,
} from '../../theme';

export const createStyles = (theme: NativeTheme) => {
  const canonical = theme.components.tooltip.content;
  const output = resolveComponentTokenPlatformOutputs(theme, canonical);
  const nativeShadow = output.reactNative.shadow;

  return StyleSheet.create({
    root: {
      alignSelf: Platform.select({
        web: 'auto',
        default: 'flex-start',
      }),
    },

    overlay: {
      ...StyleSheet.absoluteFill,
    },

    bubble: {
      position: 'absolute',
      maxWidth: canonical.maxWidth,

      paddingHorizontal: canonical.paddingX,
      paddingVertical: canonical.paddingY,

      backgroundColor: canonical.bg,
      borderColor: canonical.border,
      borderRadius: canonical.radius,
      borderWidth: canonical.borderWidth,

      ...Platform.select({
        web: {
          boxShadow: output.web.shadow,
        },
        default: {
          shadowColor: nativeShadow.color,
          shadowOffset: {
            width: nativeShadow.x,
            height: nativeShadow.y,
          },
          shadowOpacity: nativeShadow.opacity,
          shadowRadius: nativeShadow.blur,
          elevation: nativeShadow.elevation,
        },
      }),
    },

    text: {
      flexShrink: 1,
      color: canonical.fg,
      fontFamily: theme.tokens.typography.family.regular,
      fontSize: canonical.fontSize,
      lineHeight: canonical.lineHeight,
      textAlign: 'center',
    },
  });
};
''',
)

write(
    'packages/react-native/src/components/Modal/Content/ModalContent.styles.ts',
    r'''import { type DimensionValue, Platform, StyleSheet } from 'react-native';

import {
  resolveComponentTokenPlatformOutputs,
  type NativeTheme,
} from '../../../theme';

export const createStyles = (theme: NativeTheme) => {
  const canonical = theme.components.modal.content;
  const output = resolveComponentTokenPlatformOutputs(theme, canonical);
  const nativeShadow = output.reactNative.shadow;

  return StyleSheet.create({
    content: {
      width: '100%',
      maxWidth: canonical.size.md,
      maxHeight: Platform.select({
        web: output.web.maxHeight as DimensionValue,
        default: output.reactNative.maxHeight as DimensionValue,
      }),
      padding: canonical.padding,
      gap: canonical.gap,

      backgroundColor: canonical.bg,
      borderColor: canonical.border,
      borderRadius: canonical.radius,
      borderWidth: canonical.borderWidth,

      ...Platform.select({
        web: {
          boxShadow: output.web.shadow,
        },
        default: {
          shadowColor: nativeShadow.color,
          shadowOffset: {
            width: nativeShadow.x,
            height: nativeShadow.y,
          },
          shadowOpacity: nativeShadow.opacity,
          shadowRadius: nativeShadow.blur,
          elevation: nativeShadow.elevation,
        },
      }),
    },
  });
};
''',
)

# 10. Deterministic canonical leakage audit across every component family.
write(
    'packages/tokens/src/component-token-platform-boundary.test.ts',
    r'''import { describe, expect, it } from 'vitest';

import { darkTheme } from './dark/theme.js';
import { highContrastTheme } from './highContrast/theme.js';
import { lightTheme } from './light/theme.js';
import { isComponentPlatformIntent } from './platform-output/component-token-intents.js';

type Finding = {
  path: string;
  reason: string;
};

const rendererKeys = new Set(['web', 'native', 'reactNative', 'nativeMaxHeight']);

function scanCanonicalComponentTokens(
  value: unknown,
  path: string,
  findings: Finding[]
): void {
  if (isComponentPlatformIntent(value)) return;

  if (Array.isArray(value)) {
    value.forEach((entry, index) =>
      scanCanonicalComponentTokens(entry, `${path}.${index}`, findings)
    );
    return;
  }

  if (typeof value !== 'object' || value === null) {
    if (
      path.endsWith('.shadow') &&
      typeof value === 'string' &&
      /(?:rgba?\(|\b\d+(?:\.\d+)?px\b|\binset\b)/.test(value)
    ) {
      findings.push({
        path,
        reason: 'canonical shadow contains renderer-specific CSS syntax',
      });
    }
    return;
  }

  for (const [key, child] of Object.entries(value)) {
    const childPath = path ? `${path}.${key}` : key;

    if (rendererKeys.has(key)) {
      findings.push({
        path: childPath,
        reason: `renderer-specific canonical key "${key}"`,
      });
    }

    scanCanonicalComponentTokens(child, childPath, findings);
  }
}

const themes = [
  ['light', lightTheme],
  ['dark', darkTheme],
  ['high-contrast', highContrastTheme],
] as const;

describe('renderer-neutral canonical component token boundary', () => {
  it.each(themes)('has no platform leakage in %s components', (_name, theme) => {
    const findings: Finding[] = [];

    scanCanonicalComponentTokens(theme.components, 'components', findings);

    expect(findings).toEqual([]);
  });
});
''',
)

# 11. Generator V2 regression: generated canonical contracts stay renderer-neutral.
write(
    'scripts/generators/component/platform-neutral-component-tokens.test.ts',
    r'''import { describe, expect, it } from 'vitest';

import { renderComponentTokenFactoryTemplate } from './templates/component-tokens';

const forbiddenCanonicalRendererVocabulary =
  /\b(?:web|native|reactNative|nativeMaxHeight)\b/;

describe('Generator V2 renderer-neutral component token boundary', () => {
  it.each([
    ['standard', 'value'],
    ['form-control', 'boolean'],
    ['disclosure', 'value'],
  ] as const)(
    'keeps %s/%s canonical token factories renderer-neutral',
    (profile, control) => {
      const source = renderComponentTokenFactoryTemplate({
        componentName: 'Probe',
        profile,
        control,
      });

      expect(source).not.toMatch(forbiddenCanonicalRendererVocabulary);
    }
  );
});
''',
)

print('Renderer-neutral component token migration applied in workspace.')
