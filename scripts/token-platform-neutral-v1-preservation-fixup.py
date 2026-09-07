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
        raise SystemExit(
            f'{path}: expected one exact match, found {count}: {old[:120]!r}'
        )
    write(path, text.replace(old, new, 1))


# Web compatibility is deliberately platform-output only. #889 owns public
# token API cleanup, so #884 removes renderer branches from canonical component
# tokens without silently deleting the already-published CSS identities.
write(
    'packages/tokens/src/platform-output/component-token-web-compatibility.ts',
    r'''/**
 * Legacy Web output identities retained by #884 only for compatibility.
 *
 * These paths are not canonical component tokens. They exist after the
 * renderer-neutral component boundary and are intentionally revisited by #889.
 */
export const componentTokenWebCompatibilityAliases = [
  {
    path: 'components.modal.content.nativeMaxHeight',
    variable: '--modal-content-native-max-height',
  },
  {
    path: 'components.popover.content.shadow.web',
    variable: '--popover-content-shadow-web',
  },
  {
    path: 'components.popover.content.shadow.native.x',
    variable: '--popover-content-shadow-native-x',
  },
  {
    path: 'components.popover.content.shadow.native.y',
    variable: '--popover-content-shadow-native-y',
  },
  {
    path: 'components.popover.content.shadow.native.blur',
    variable: '--popover-content-shadow-native-blur',
  },
  {
    path: 'components.popover.content.shadow.native.color',
    variable: '--popover-content-shadow-native-color',
  },
  {
    path: 'components.popover.content.shadow.native.opacity',
    variable: '--popover-content-shadow-native-opacity',
  },
  {
    path: 'components.popover.content.shadow.native.elevation',
    variable: '--popover-content-shadow-native-elevation',
  },
] as const;
''',
)


# Serialize the compatibility aliases from platform-output sources, never by
# restoring .web/.native branches inside theme.components.
path = 'packages/tokens/scripts/token-css-output.ts'
replace_once(
    path,
    "} from '../src/platform-output/component-token-intents.js';\n",
    "} from '../src/platform-output/component-token-intents.js';\n"
    "import { componentTokenWebCompatibilityAliases } from '../src/platform-output/component-token-web-compatibility.js';\n",
)
text = read(path)
marker = 'export function collectThemeCssOutput(\n'
if text.count(marker) != 1:
    raise SystemExit(f'{path}: collectThemeCssOutput marker mismatch')
helper = r'''function collectComponentWebCompatibilityAliases(
  theme: Theme,
  output: Map<string, CssOutputEntry>
): void {
  const nativeShadow = shadows.lg;
  const legacyValues = new Map<string, string | number>([
    ['components.modal.content.nativeMaxHeight', '90%'],
    ['components.popover.content.shadow.web', theme.semantic.shadow.lg],
    ['components.popover.content.shadow.native.x', nativeShadow.x],
    ['components.popover.content.shadow.native.y', nativeShadow.y],
    ['components.popover.content.shadow.native.blur', nativeShadow.blur],
    ['components.popover.content.shadow.native.color', nativeShadow.color],
    ['components.popover.content.shadow.native.opacity', nativeShadow.opacity],
    [
      'components.popover.content.shadow.native.elevation',
      nativeShadow.elevation,
    ],
  ]);

  for (const alias of componentTokenWebCompatibilityAliases) {
    const value = legacyValues.get(alias.path);

    if (value === undefined) {
      throw new Error(`Missing Web compatibility value for ${alias.path}.`);
    }

    output.set(alias.path, {
      variable: alias.variable,
      value: serializeCssTokenValue(alias.path, value),
    });
  }
}

'''
text = text.replace(marker, helper + marker, 1)
old = "  collectVariables(webComponents, '', 'components', output);\n\n  return output;\n"
new = (
    "  collectVariables(webComponents, '', 'components', output);\n"
    "  collectComponentWebCompatibilityAliases(theme, output);\n\n"
    "  return output;\n"
)
if text.count(old) != 1:
    raise SystemExit(f'{path}: adapted component collection marker mismatch')
write(path, text.replace(old, new, 1))


# Generated CSS variable names include the compatibility layer, while canonical
# componentTokenPaths remain renderer-neutral.
path = 'packages/tokens/scripts/generate-token-types.ts'
replace_once(
    path,
    "import { isComponentPlatformIntent } from '../src/platform-output/component-token-intents.js';\n",
    "import { isComponentPlatformIntent } from '../src/platform-output/component-token-intents.js';\n"
    "import { componentTokenWebCompatibilityAliases } from '../src/platform-output/component-token-web-compatibility.js';\n",
)
text = read(path)
old = """  themes.map((theme) => [
    ...collectCssVariableNames(theme.colors, 'color'),
    ...collectCssVariableNames(theme.semantic, ''),
    ...collectCssVariableNames(theme.components, ''),
  ])
"""
new = """  themes.map((theme) => [
    ...collectCssVariableNames(theme.colors, 'color'),
    ...collectCssVariableNames(theme.semantic, ''),
    ...collectCssVariableNames(theme.components, ''),
    ...componentTokenWebCompatibilityAliases.map(({ variable }) => variable),
  ])
"""
if text.count(old) != 1:
    raise SystemExit(f'{path}: theme CSS variable block mismatch')
write(path, text.replace(old, new, 1))


# The architecture test models the complete Web output surface, including the
# explicitly isolated compatibility aliases.
path = 'packages/tokens/src/token-architecture.test.ts'
replace_once(
    path,
    "} from './platform-output/component-token-intents.js';\n",
    "} from './platform-output/component-token-intents.js';\n"
    "import { componentTokenWebCompatibilityAliases } from './platform-output/component-token-web-compatibility.js';\n",
)
text = read(path)
old = """        ...collectCssVariables(theme.semantic),
        ...collectCssVariables(webComponents),
      ].sort();
"""
new = """        ...collectCssVariables(theme.semantic),
        ...collectCssVariables(webComponents),
        ...componentTokenWebCompatibilityAliases.map(({ variable }) => variable),
      ].sort();
"""
if text.count(old) != 1:
    raise SystemExit(f'{path}: Web object variables block mismatch')
write(path, text.replace(old, new, 1))


# #880 migration evidence: same logical canonical paths change storage
# representation only. Old renderer-specific Popover/Modal branches disappear
# from canonical/RN preservation while their Web output identities remain as
# isolated compatibility aliases until #889.
path = 'packages/tokens/src/preservation/token-migrations.ts'
text = read(path)
insert_marker = 'export const tokenMigrationManifestV1 = [\n'
if text.count(insert_marker) != 1:
    raise SystemExit(f'{path}: manifest export marker mismatch')
block = r'''const platformNeutralComponentRepresentationPathsV1 = [
  'components.contextMenu.content.shadow',
  'components.contextMenu.item.focus.ring.shadow',
  'components.contextMenu.trigger.focus.ring.shadow',
  'components.dropdown.content.shadow',
  'components.dropdown.item.focus.ring.shadow',
  'components.dropdown.trigger.focus.ring.shadow',
  'components.modal.closeButton.focus.ring.shadow',
  'components.modal.content.maxHeight',
  'components.modal.content.shadow',
  'components.select.dropdown.shadow',
  'components.select.option.selected.shadow',
  'components.tooltip.content.shadow',
] as const;

const platformNeutralComponentRepresentationMigrationsV1 =
  platformNeutralComponentRepresentationPathsV1.map(
    (from) =>
      ({
        id: `884-representation-${from.replaceAll('.', '-')}`,
        kind: 'representation-change',
        layer: 'canonical',
        issue: '#884',
        reason:
          'Replace renderer-shaped canonical component storage with a renderer-neutral intent at the same logical token path.',
        from,
        equivalence:
          'The canonical representation changes only; Web resolves the intent to the pre-#884 CSS value and React Native resolves consumed elevation/layout intents to the pre-#884 native presentation output.',
        evidence:
          '#880 preservation locks serialized Web output while component-token-output-equivalence regressions cover Web and React Native adapters for Light, Dark, and High Contrast themes.',
      }) as const
  ) satisfies readonly TokenMigrationEntry[];

const platformNeutralLegacyCanonicalRemovalsV1 = [
  'components.modal.content.nativeMaxHeight',
  'components.popover.content.shadow.native.x',
  'components.popover.content.shadow.native.y',
  'components.popover.content.shadow.native.blur',
  'components.popover.content.shadow.native.color',
  'components.popover.content.shadow.native.opacity',
  'components.popover.content.shadow.native.elevation',
] as const;

const platformNeutralLegacyCanonicalRemovalMigrationsV1 =
  platformNeutralLegacyCanonicalRemovalsV1.map(
    (from) =>
      ({
        id: `884-remove-${from.replaceAll('.', '-')}`,
        kind: 'remove',
        issue: '#884',
        reason:
          'Remove renderer-specific canonical storage after the same renderer output moved behind the platform-output adapter; the Web identity remains a compatibility alias until #889.',
        platforms: ['react-native'],
        from,
      }) as const
  ) satisfies readonly TokenMigrationEntry[];

const platformNeutralPopoverShadowMigrationV1 = {
  id: '884-popover-shadow-web-to-canonical-intent',
  kind: 'representation-change',
  layer: 'canonical',
  issue: '#884',
  reason:
    'Collapse the old Popover shadow.web branch into one renderer-neutral canonical shadow intent.',
  from: 'components.popover.content.shadow.web',
  to: 'components.popover.content.shadow',
  equivalence:
    'The new canonical lg elevation intent resolves to the same semantic lg Web shadow and the same structured native lg shadow used before #884.',
  evidence:
    '#880 preservation retains the legacy Web output identity and component-token-output-equivalence regressions lock the Web/RN adapter results for all three themes.',
} as const satisfies TokenMigrationEntry;

const platformNeutralPopoverWebAdditionV1 = {
  id: '884-popover-normalized-web-shadow-output',
  kind: 'addition',
  issue: '#884',
  reason:
    'Expose the normalized Popover shadow path in Web platform output while retaining the old renderer-shaped CSS identities as compatibility aliases until #889.',
  platforms: ['web'],
  to: 'components.popover.content.shadow',
} as const satisfies TokenMigrationEntry;

'''
text = text.replace(insert_marker, block + insert_marker, 1)
spread_marker = "export const tokenMigrationManifestV1 = [\n  ...stateVocabularyRenameMigrationsV1,\n"
spread_replacement = """export const tokenMigrationManifestV1 = [
  ...stateVocabularyRenameMigrationsV1,
  ...platformNeutralComponentRepresentationMigrationsV1,
  ...platformNeutralLegacyCanonicalRemovalMigrationsV1,
  platformNeutralPopoverShadowMigrationV1,
  platformNeutralPopoverWebAdditionV1,
"""
if text.count(spread_marker) != 1:
    raise SystemExit(f'{path}: manifest spread marker mismatch')
write(path, text.replace(spread_marker, spread_replacement, 1))


# Dedicated actual renderer-output proof. The legacy RN preservation mode in
# #880 hashes canonical-theme representation, so these regressions explicitly
# lock what first-party renderers consumed before #884.
write(
    'packages/tokens/src/platform-output/component-token-output-equivalence.test.ts',
    r'''import { describe, expect, it } from 'vitest';

import { darkTheme } from '../dark/theme.js';
import { highContrastTheme } from '../highContrast/theme.js';
import { lightTheme } from '../light/theme.js';
import {
  adaptComponentTokensForReactNative,
  adaptComponentTokensForWeb,
  createComponentPlatformOutputSources,
} from './component-token-intents.js';

const themes = [
  ['light', lightTheme],
  ['dark', darkTheme],
  ['high-contrast', highContrastTheme],
] as const;

describe('component token platform-output equivalence', () => {
  for (const [themeName, theme] of themes) {
    it(`preserves Web output for ${themeName}`, () => {
      const web = adaptComponentTokensForWeb(
        theme.components,
        createComponentPlatformOutputSources(theme)
      );

      expect(web.contextMenu.content.shadow).toBe(theme.semantic.shadow.lg);
      expect(web.contextMenu.item.focus.ring.shadow).toBe(
        theme.semantic.focus.ring.shadow
      );
      expect(web.contextMenu.trigger.focus.ring.shadow).toBe(
        theme.semantic.focus.ring.shadow
      );
      expect(web.dropdown.content.shadow).toBe(theme.semantic.shadow.lg);
      expect(web.dropdown.item.focus.ring.shadow).toBe(
        theme.semantic.focus.ring.shadow
      );
      expect(web.dropdown.trigger.focus.ring.shadow).toBe(
        theme.semantic.focus.ring.shadow
      );
      expect(web.modal.closeButton.focus.ring.shadow).toBe(
        theme.semantic.focus.ring.shadow
      );
      expect(web.modal.content.maxHeight).toBe('90vh');
      expect(web.modal.content.shadow).toBe(theme.semantic.shadow.xl);
      expect(web.popover.content.shadow).toBe(theme.semantic.shadow.lg);
      expect(web.select.dropdown.shadow).toBe(theme.semantic.shadow.lg);
      expect(web.select.option.selected.shadow).toBe('none');
      expect(web.tooltip.content.shadow).toBe(theme.semantic.shadow.md);
    });

    it(`preserves React Native output for ${themeName}`, () => {
      const native = adaptComponentTokensForReactNative(
        theme.components,
        createComponentPlatformOutputSources(theme)
      );

      expect(native.contextMenu.content.shadow).toEqual(theme.tokens.shadows.lg);
      expect(native.dropdown.content.shadow).toEqual(theme.tokens.shadows.lg);
      expect(native.modal.content.maxHeight).toBe('90%');
      // Existing native Modal used lg directly even though Web used xl.
      expect(native.modal.content.shadow).toEqual(theme.tokens.shadows.lg);
      expect(native.popover.content.shadow).toEqual(theme.tokens.shadows.lg);
      expect(native.select.dropdown.shadow).toEqual(theme.tokens.shadows.lg);
      expect(native.tooltip.content.shadow).toEqual(theme.tokens.shadows.md);

      expect(native.contextMenu.item.focus.ring.shadow).toBeNull();
      expect(native.contextMenu.trigger.focus.ring.shadow).toBeNull();
      expect(native.dropdown.item.focus.ring.shadow).toBeNull();
      expect(native.dropdown.trigger.focus.ring.shadow).toBeNull();
      expect(native.modal.closeButton.focus.ring.shadow).toBeNull();
      expect(native.select.option.selected.shadow).toBeNull();
    });
  }
});
''',
)

print('Token preservation and platform-output equivalence fixup applied in workspace.')
