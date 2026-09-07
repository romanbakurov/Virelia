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
        raise SystemExit(f'{path}: expected one exact match, found {count}: {old[:100]!r}')
    write(path, text.replace(old, new, 1))


# The second pass extends the generic shadow intent beyond elevation so the
# canonical component tree never needs CSS 'none' or focus-glow syntax either.
write(
    'packages/tokens/src/platform-output/component-token-intents.ts',
    r'''export const componentShadowLevels = ['sm', 'md', 'lg', 'xl'] as const;

export type ComponentShadowLevel = (typeof componentShadowLevels)[number];

export type ComponentElevationShadowIntent = Readonly<{
  kind: 'shadow';
  role: 'elevation';
  level: ComponentShadowLevel;
}>;

export type ComponentFocusRingShadowIntent = Readonly<{
  kind: 'shadow';
  role: 'focus-ring';
}>;

export type ComponentNoShadowIntent = Readonly<{
  kind: 'shadow';
  role: 'none';
}>;

export type ComponentShadowIntent =
  | ComponentElevationShadowIntent
  | ComponentFocusRingShadowIntent
  | ComponentNoShadowIntent;

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
    focusRingShadow: string;
  };
  reactNative: {
    shadow: Readonly<Record<ComponentShadowLevel, ReactNativeShadowOutput>>;
  };
}>;

type ComponentOutputThemeSources = Readonly<{
  semantic: {
    focus: {
      ring: {
        shadow: string;
      };
    };
    shadow: Readonly<Record<ComponentShadowLevel, string>>;
  };
  tokens: {
    shadows: Readonly<Record<'sm' | 'md' | 'lg', ReactNativeShadowOutput>>;
  };
}>;

type WebAdaptedIntent<T> = T extends ComponentPlatformIntent ? string : never;

type ReactNativeAdaptedIntent<T> = T extends ComponentElevationShadowIntent
  ? ReactNativeShadowOutput
  : T extends ComponentFocusRingShadowIntent | ComponentNoShadowIntent
    ? null
    : T extends ComponentViewportHeightIntent
      ? string
      : never;

export type WebComponentTokens<T> = T extends ComponentPlatformIntent
  ? WebAdaptedIntent<T>
  : T extends readonly (infer TEntry)[]
    ? readonly WebComponentTokens<TEntry>[]
    : T extends object
      ? { readonly [K in keyof T]: WebComponentTokens<T[K]> }
      : T;

export type ReactNativeComponentTokens<T> = T extends ComponentPlatformIntent
  ? ReactNativeAdaptedIntent<T>
  : T extends readonly (infer TEntry)[]
    ? readonly ReactNativeComponentTokens<TEntry>[]
    : T extends object
      ? { readonly [K in keyof T]: ReactNativeComponentTokens<T[K]> }
      : T;

export function createComponentShadowIntent(
  level: ComponentShadowLevel
): ComponentElevationShadowIntent {
  return { kind: 'shadow', role: 'elevation', level };
}

export function createComponentFocusRingShadowIntent(): ComponentFocusRingShadowIntent {
  return { kind: 'shadow', role: 'focus-ring' };
}

export function createComponentNoShadowIntent(): ComponentNoShadowIntent {
  return { kind: 'shadow', role: 'none' };
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

  if (candidate.kind === 'shadow') {
    if (candidate.role === 'focus-ring' || candidate.role === 'none') {
      return true;
    }

    return (
      candidate.role === 'elevation' &&
      typeof candidate.level === 'string' &&
      componentShadowLevels.includes(candidate.level as ComponentShadowLevel)
    );
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
      focusRingShadow: theme.semantic.focus.ring.shadow,
    },
    reactNative: {
      shadow: {
        sm: theme.tokens.shadows.sm,
        md: theme.tokens.shadows.md,
        lg: theme.tokens.shadows.lg,
        // Preserve current native Modal output. #885 owns the later authority
        // decision for whether an independent structured xl shadow is needed.
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
  if (intent.kind === 'viewport-height') {
    return `${formatPercentage(intent.ratio)}vh`;
  }

  if (intent.role === 'focus-ring') return sources.web.focusRingShadow;
  if (intent.role === 'none') return 'none';
  return sources.web.shadow[intent.level];
}

export function resolveComponentIntentForReactNative(
  intent: ComponentPlatformIntent,
  sources: ComponentPlatformOutputSources
): string | ReactNativeShadowOutput | null {
  if (intent.kind === 'viewport-height') {
    return `${formatPercentage(intent.ratio)}%`;
  }

  if (intent.role === 'focus-ring' || intent.role === 'none') return null;
  return sources.reactNative.shadow[intent.level];
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

# Component focus rings now carry a renderer-neutral focus effect intent.
write(
    'packages/tokens/src/factories/componentFocusRing.ts',
    r'''import { createComponentFocusRingShadowIntent } from '../platform-output/component-token-intents.js';

export type SemanticFocusRing = {
  readonly color: string;
  readonly width: string;
  readonly offsetColor: string;
};

export const createComponentFocusRing = (ring: SemanticFocusRing) =>
  ({
    color: ring.color,
    width: ring.width,
    shadow: createComponentFocusRingShadowIntent(),
    offset: ring.offsetColor,
  }) as const;
''',
)

for factory in ('createContextMenuTokens.ts', 'createModalTokens.ts'):
    path = f'packages/tokens/src/factories/{factory}'
    text = read(path)
    if factory == 'createContextMenuTokens.ts':
        old = "type ContextMenuFocusRing = {\n  readonly color: string;\n  readonly width: string;\n  readonly shadow: string;\n  readonly offset: string;\n};\n"
        new = 'type ContextMenuFocusRing = ReturnType<typeof createComponentFocusRing>;\n'
    else:
        old = "type ModalFocusRing = {\n  color: string;\n  width: string;\n  shadow: string;\n  offset: string;\n};\n"
        new = 'type ModalFocusRing = ReturnType<typeof createComponentFocusRing>;\n'
    if text.count(old) != 1:
        raise SystemExit(f'{path}: focus ring type marker mismatch')
    write(path, text.replace(old, new, 1))

# Dropdown and Select overlay elevations become canonical elevation intents;
# Select's explicit CSS 'none' becomes a renderer-neutral no-shadow intent.
for theme in ('light', 'dark', 'highContrast'):
    dropdown = f'packages/tokens/src/{theme}/components/dropdown.ts'
    text = read(dropdown)
    import_marker = "import { createComponentFocusRing } from '../../factories/componentFocusRing.js';\n"
    if import_marker not in text:
        raise SystemExit(f'{dropdown}: focus import marker missing')
    text = text.replace(
        import_marker,
        import_marker
        + "import { createComponentShadowIntent } from '../../platform-output/component-token-intents.js';\n",
        1,
    )
    text = text.replace("import { shadow } from '../semantic/shadow.js';\n", '')
    if text.count('    shadow: shadow.lg,') != 1:
        raise SystemExit(f'{dropdown}: expected one dropdown shadow.lg')
    text = text.replace(
        '    shadow: shadow.lg,',
        "    shadow: createComponentShadowIntent('lg'),",
        1,
    )
    write(dropdown, text)

    select = f'packages/tokens/src/{theme}/components/select.ts'
    text = read(select)
    import_marker = "import { createSelectPalette } from '../../factories/createSelectPalette.js';\n"
    if import_marker not in text:
        raise SystemExit(f'{select}: select factory import marker missing')
    text = text.replace(
        import_marker,
        import_marker
        + "import {\n"
        + "  createComponentNoShadowIntent,\n"
        + "  createComponentShadowIntent,\n"
        + "} from '../../platform-output/component-token-intents.js';\n",
        1,
    )
    text = text.replace("import { shadow } from '../semantic/shadow.js';\n", '')
    if text.count('    shadow: shadow.lg,') != 1:
        raise SystemExit(f'{select}: expected one dropdown shadow.lg')
    text = text.replace(
        '    shadow: shadow.lg,',
        "    shadow: createComponentShadowIntent('lg'),",
        1,
    )
    if text.count("      shadow: 'none',") != 1:
        raise SystemExit(f'{select}: expected one selected shadow none')
    text = text.replace(
        "      shadow: 'none',",
        '      shadow: createComponentNoShadowIntent(),',
        1,
    )
    write(select, text)

# Generated/runtime architecture checks distinguish canonical component paths
# from Web platform-output paths.
path = 'packages/tokens/src/token-architecture.test.ts'
text = read(path)
import_marker = "import { lightTheme } from './light/theme.js';\n"
if text.count(import_marker) != 1:
    raise SystemExit('token-architecture.test.ts: light theme import marker mismatch')
text = text.replace(
    import_marker,
    import_marker
    + "import {\n"
    + "  adaptComponentTokensForWeb,\n"
    + "  createComponentPlatformOutputSources,\n"
    + "  isComponentPlatformIntent,\n"
    + "} from './platform-output/component-token-intents.js';\n",
    1,
)
leaf_marker = "    if (isPlainObject(value)) {\n      paths.push(...collectLeafPaths(value, name));\n      continue;\n    }\n\n    paths.push(name);\n"
if text.count(leaf_marker) != 1:
    raise SystemExit('token-architecture.test.ts: leaf walker marker mismatch')
text = text.replace(
    leaf_marker,
    "    if (isComponentPlatformIntent(value)) {\n"
    + "      paths.push(name);\n"
    + "      continue;\n"
    + "    }\n\n"
    + leaf_marker,
    1,
)
css_marker = "    if (isPlainObject(value)) {\n      variables.push(...collectCssVariables(value, name));\n      continue;\n    }\n\n    if (typeof value === 'string' || typeof value === 'number') {\n"
if text.count(css_marker) != 1:
    raise SystemExit('token-architecture.test.ts: css walker marker mismatch')
text = text.replace(
    css_marker,
    "    if (isComponentPlatformIntent(value)) {\n"
    + "      throw new Error(\n"
    + "        `collectCssVariables received canonical platform intent at ${name}; adapt components for Web first.`\n"
    + "      );\n"
    + "    }\n\n"
    + css_marker,
    1,
)
old_object = """      const objectVariables = [
        ...collectCssVariables(theme.colors, 'color'),
        ...collectCssVariables(theme.semantic),
        ...collectCssVariables(theme.components),
      ].sort();
"""
new_object = """      const webComponents = adaptComponentTokensForWeb(
        theme.components,
        createComponentPlatformOutputSources(theme)
      );
      const objectVariables = [
        ...collectCssVariables(theme.colors, 'color'),
        ...collectCssVariables(theme.semantic),
        ...collectCssVariables(webComponents),
      ].sort();
"""
if text.count(old_object) != 1:
    raise SystemExit('token-architecture.test.ts: Web component variable marker mismatch')
text = text.replace(old_object, new_object, 1)
write(path, text)

# The leakage rule is deliberately strict: any scalar string at a canonical
# *.shadow path is renderer representation, including CSS 'none'.
path = 'packages/tokens/src/component-token-platform-boundary.test.ts'
text = read(path)
old = """    if (
      path.endsWith('.shadow') &&
      typeof value === 'string' &&
      /(?:rgba?\\(|\\b\\d+(?:\\.\\d+)?px\\b|\\binset\\b)/.test(value)
    ) {
"""
new = """    if (path.endsWith('.shadow') && typeof value === 'string') {
"""
if text.count(old) != 1:
    raise SystemExit('component-token-platform-boundary.test.ts: shadow rule marker mismatch')
text = text.replace(old, new, 1)
write(path, text)

# Scaffold tests cover focus/no-shadow output as well as elevation/viewport.
write(
    'packages/tokens/src/platform-output/component-token-intents.test.ts',
    r'''import { describe, expect, it } from 'vitest';

import {
  adaptComponentTokensForReactNative,
  adaptComponentTokensForWeb,
  createComponentFocusRingShadowIntent,
  createComponentNoShadowIntent,
  createComponentShadowIntent,
  createComponentViewportHeightIntent,
  type ComponentPlatformOutputSources,
} from './component-token-intents.js';

const sources: ComponentPlatformOutputSources = {
  web: {
    shadow: {
      sm: 'web-sm',
      md: 'web-md',
      lg: 'web-lg',
      xl: 'web-xl',
    },
    focusRingShadow: 'web-focus-ring',
  },
  reactNative: {
    shadow: {
      sm: { x: 0, y: 1, blur: 2, color: '#000', opacity: 0.04, elevation: 1 },
      md: { x: 0, y: 4, blur: 12, color: '#000', opacity: 0.08, elevation: 4 },
      lg: { x: 0, y: 12, blur: 32, color: '#000', opacity: 0.1, elevation: 8 },
      xl: { x: 0, y: 12, blur: 32, color: '#000', opacity: 0.1, elevation: 8 },
    },
  },
};

describe('component platform-output intents', () => {
  it('keeps elevation intent renderer-neutral until Web output', () => {
    const components = {
      tooltip: { content: { shadow: createComponentShadowIntent('md') } },
    };

    expect(adaptComponentTokensForWeb(components, sources)).toEqual({
      tooltip: { content: { shadow: 'web-md' } },
    });
  });

  it('resolves elevation intent to React Native structured output', () => {
    const components = {
      popover: { content: { shadow: createComponentShadowIntent('lg') } },
    };

    expect(adaptComponentTokensForReactNative(components, sources)).toEqual({
      popover: { content: { shadow: sources.reactNative.shadow.lg } },
    });
  });

  it('keeps focus glow and no-shadow as intents until platform output', () => {
    const components = {
      focus: { shadow: createComponentFocusRingShadowIntent() },
      selected: { shadow: createComponentNoShadowIntent() },
    };

    expect(adaptComponentTokensForWeb(components, sources)).toEqual({
      focus: { shadow: 'web-focus-ring' },
      selected: { shadow: 'none' },
    });
    expect(adaptComponentTokensForReactNative(components, sources)).toEqual({
      focus: { shadow: null },
      selected: { shadow: null },
    });
  });

  it('adapts one viewport-height intent to platform-native units', () => {
    const components = {
      modal: {
        content: { maxHeight: createComponentViewportHeightIntent(0.9) },
      },
    };

    expect(adaptComponentTokensForWeb(components, sources)).toEqual({
      modal: { content: { maxHeight: '90vh' } },
    });
    expect(adaptComponentTokensForReactNative(components, sources)).toEqual({
      modal: { content: { maxHeight: '90%' } },
    });
  });

  it('rejects invalid viewport ratios before renderer adaptation', () => {
    expect(() => createComponentViewportHeightIntent(0)).toThrow(
      /viewport-height ratio/
    );
    expect(() => createComponentViewportHeightIntent(1.1)).toThrow(
      /viewport-height ratio/
    );
  });
});
''',
)

# Public exports include the new intent constructors/types.
path = 'packages/tokens/src/index.ts'
text = read(path)
text = text.replace(
    '  createComponentPlatformOutputSources,\n  createComponentShadowIntent,\n',
    '  createComponentFocusRingShadowIntent,\n  createComponentNoShadowIntent,\n  createComponentPlatformOutputSources,\n  createComponentShadowIntent,\n',
    1,
)
text = text.replace(
    '  ComponentPlatformIntent,\n  ComponentPlatformOutputSources,\n',
    '  ComponentElevationShadowIntent,\n  ComponentFocusRingShadowIntent,\n  ComponentNoShadowIntent,\n  ComponentPlatformIntent,\n  ComponentPlatformOutputSources,\n  ComponentShadowIntent,\n',
    1,
)
write(path, text)

print('Renderer-neutral boundary extension applied in workspace.')
