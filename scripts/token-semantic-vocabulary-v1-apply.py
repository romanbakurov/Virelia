from pathlib import Path
import re

ROOT = Path('.')
THEMES = ('light', 'dark', 'highContrast')


def read(path: str) -> str:
    return (ROOT / path).read_text()


def write(path: str, text: str) -> None:
    (ROOT / path).write_text(text)


def replace_exact(path: str, old: str, new: str, expected: int = 1) -> None:
    text = read(path)
    count = text.count(old)
    if count != expected:
        raise SystemExit(
            f'{path}: expected {expected} occurrences of {old!r}, found {count}'
        )
    write(path, text.replace(old, new))


def replace_regex(
    path: str,
    pattern: str,
    replacement: str,
    expected: int = 1,
    flags: int = 0,
) -> None:
    text = read(path)
    new_text, count = re.subn(pattern, replacement, text, flags=flags)
    if count != expected:
        raise SystemExit(
            f'{path}: expected {expected} matches for {pattern!r}, found {count}'
        )
    write(path, new_text)


# Canonical semantic namespaces: pure role renames/removals.
for theme in THEMES:
    base = f'packages/tokens/src/{theme}/semantic'
    replace_regex(
        f'{base}/surface.ts',
        r'^  background: .*\n',
        '',
        flags=re.MULTILINE,
    )
    replace_exact(f'{base}/action.ts', '\n  secondary: {\n', '\n  accent: {\n')
    replace_exact(f'{base}/action.ts', '\n  close: {\n', '\n  neutral: {\n')
    replace_exact(f'{base}/icons.ts', '\n  primary: ', '\n  interactive: ')
    replace_exact(f'{base}/icons.ts', '\n  hover: ', '\n  interactiveHover: ')
    replace_regex(
        f'{base}/status.ts',
        r'^    strong:',
        '    emphasisFg:',
        expected=4,
        flags=re.MULTILINE,
    )
    replace_exact(f'{base}/border.ts', '\n  focus: ', '\n  interactive: ')
    replace_exact(f'{base}/focus.ts', '\n    offset: ', '\n    offsetColor: ')
    replace_exact(f'{base}/overlay.ts', '\n  popover: {\n', '\n  floating: {\n')
    replace_exact(f'{base}/overlay.ts', '\n  modal: {\n', '\n  dialog: {\n')
    replace_exact(
        f'{base}/index.ts',
        "export { navigation } from './navigation.js';\n",
        '',
    )
    navigation = ROOT / f'{base}/navigation.ts'
    if not navigation.exists():
        raise SystemExit(f'{navigation}: expected legacy navigation source')
    navigation.unlink()

# Small correctness fixes identified by the semantic audit. No new colors.
replace_exact(
    'packages/tokens/src/dark/semantic/text.ts',
    '  muted: colors.vellira[400],\n  subtle: colors.mono[500],',
    '  muted: colors.mono[500],\n  subtle: colors.vellira[400],',
)
replace_exact(
    'packages/tokens/src/highContrast/semantic/icons.ts',
    '  muted: colors.gray[400],\n  subtle: colors.gray[300],',
    '  muted: colors.gray[300],\n  subtle: colors.gray[400],',
)
replace_regex(
    'packages/tokens/src/dark/semantic/status.ts',
    r'(warning: \{.*?ring:) colors\.error\[400\],',
    r'\1 colors.warning[300],',
    flags=re.DOTALL,
)
replace_regex(
    'packages/tokens/src/dark/semantic/status.ts',
    r'(info: \{.*?ring:) colors\.error\[400\],',
    r'\1 colors.info[200],',
    flags=re.DOTALL,
)

# Known semantic consumers. Preservation/generated sources stay untouched.
source_roots = [
    ROOT / 'packages/tokens/src/light/components',
    ROOT / 'packages/tokens/src/dark/components',
    ROOT / 'packages/tokens/src/highContrast/components',
    ROOT / 'packages/tokens/src/factories',
    ROOT / 'scripts/generators',
]
replacements = (
    ('.action.secondary', '.action.accent'),
    ('.action.close', '.action.neutral'),
    ('.icons.primary', '.icons.interactive'),
    ('.icons.hover', '.icons.interactiveHover'),
    ('.border.focus', '.border.interactive'),
    ('.overlay.popover', '.overlay.floating'),
    ('.overlay.modal', '.overlay.dialog'),
)
for root in source_roots:
    if not root.exists():
        continue
    for path in root.rglob('*'):
        if path.suffix not in {'.ts', '.tsx'}:
            continue
        text = path.read_text()
        next_text = text
        for old, new in replacements:
            next_text = next_text.replace(old, new)
        if next_text != text:
            path.write_text(next_text)

# Native playground used the ambiguous surface.background role exactly twice.
native_count = 0
for path in (ROOT / 'apps/native-playground').rglob('*'):
    if path.suffix not in {'.ts', '.tsx'}:
        continue
    text = path.read_text()
    count = text.count('.surface.background')
    if count:
        native_count += count
        path.write_text(text.replace('.surface.background', '.surface.canvas'))
if native_count != 2:
    raise SystemExit(f'expected 2 native surface.background consumers, found {native_count}')

# Architecture authority: remove obsolete navigation active-domain exceptions.
arch = 'packages/tokens/src/token-architecture.ts'
text = read(arch)
for pattern in (
    r"  \{\n    pattern: 'semantic\.navigation\.active',.*?\n  \},\n",
    r"  \{\n    pattern: 'semantic\.navigation\.optionActive',.*?\n  \},\n",
):
    text, count = re.subn(pattern, '', text, count=1, flags=re.DOTALL)
    if count != 1:
        raise SystemExit(f'{arch}: failed to remove navigation authority block {pattern}')

text = text.replace(
    "  border: ['subtle', 'muted', 'default', 'strong', 'elevated', 'disabled'],",
    "  border: [\n    'subtle',\n    'muted',\n    'default',\n    'strong',\n    'elevated',\n    'disabled',\n    'interactive',\n  ],",
)
text = text.replace(
    "  intent: ['primary', 'neutral', 'success', 'warning', 'danger'],",
    "  intent: ['primary', 'accent', 'neutral', 'success', 'warning', 'danger'],",
)
for old, new in (
    ("'border.focus'", "'border.interactive'"),
    ("'focus.ring.offset'", "'focus.ring.offsetColor'"),
    (".strong'", ".emphasisFg'"),
    ("'overlay.popover.bg'", "'overlay.floating.bg'"),
    ("'overlay.popover.border'", "'overlay.floating.border'"),
    ("'overlay.modal.bg'", "'overlay.dialog.bg'"),
    ("'overlay.modal.border'", "'overlay.dialog.border'"),
):
    text = text.replace(old, new)

vocabulary = """
export const semanticVocabularyV1 = {
  surface: {
    purpose: 'Layer and interaction backgrounds.',
    roles: [
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
  },
  text: {
    purpose: 'Text foreground hierarchy and text interaction roles.',
    roles: [
      'primary',
      'secondary',
      'muted',
      'subtle',
      'disabled',
      'brand',
      'interactive',
      'interactiveHover',
      'interactivePressed',
      'inverse',
    ],
  },
  icons: {
    purpose: 'Icon foreground hierarchy; interactive roles are distinct from brand identity.',
    roles: [
      'default',
      'secondary',
      'muted',
      'subtle',
      'disabled',
      'interactive',
      'brand',
      'interactiveHover',
      'success',
      'danger',
      'inverse',
    ],
  },
  border: {
    purpose: 'Structural border strength plus generic interactive border emphasis.',
    roles: ['subtle', 'muted', 'default', 'strong', 'elevated', 'disabled', 'interactive'],
  },
  divider: {
    purpose: 'Non-interactive separators.',
    roles: ['muted', 'default', 'strong'],
  },
  focus: {
    purpose: 'Input-focus indication only; independent from hover and pressed states.',
    roles: ['ring.color', 'ring.width', 'ring.shadow', 'ring.offsetColor'],
  },
  status: {
    purpose: 'Status intent paint using explicit consumption roles.',
    intents: ['success', 'error', 'warning', 'info'],
    roles: ['fg', 'bg', 'border', 'ring', 'emphasisFg'],
  },
  action: {
    purpose: 'Action intent palettes; accent is the cyan secondary-brand hue, neutral is non-brand action chrome.',
    roles: ['primary', 'accent', 'neutral', 'danger'],
    states: ['default', 'hover', 'pressed', 'muted', 'subtle'],
  },
  control: {
    purpose: 'Generic form-control state paint; pressed is physical press and selected is persistent choice.',
    roles: ['default', 'hover', 'pressed', 'selected', 'disabled', 'focus'],
  },
  menu: {
    purpose: 'Menu-item roles where active/current is a legitimate domain state.',
    roles: ['item', 'item.danger'],
  },
  overlay: {
    purpose: 'Reusable overlay surfaces named by presentation purpose, not component history.',
    roles: ['backdrop', 'tooltip', 'floating', 'dialog'],
  },
  shadow: {
    purpose: 'Semantic elevation references; renderer ownership is normalized separately.',
    roles: ['sm', 'md', 'lg', 'xl'],
  },
} as const;

"""
marker = 'export const canonicalTokenVocabulary = {'
if marker not in text or 'export const semanticVocabularyV1' in text:
    raise SystemExit(f'{arch}: canonical vocabulary insertion marker invalid')
text = text.replace(marker, vocabulary + marker, 1)

icon_paths = """  'icons.default',
  'icons.secondary',
  'icons.muted',
  'icons.subtle',
  'icons.disabled',
  'icons.interactive',
  'icons.brand',
  'icons.interactiveHover',
  'icons.success',
  'icons.danger',
  'icons.inverse',
"""
path_marker = "  'text.inverse',\n"
if path_marker not in text:
    raise SystemExit(f'{arch}: text.inverse path marker missing')
text = text.replace(path_marker, path_marker + icon_paths, 1)
write(arch, text)

# Human documentation; token-architecture.ts remains machine authority.
doc = ROOT / 'docs/architecture/token-semantic-vocabulary-v1.md'
doc.write_text(
    """# Token Semantic Vocabulary V1

## Status

Canonical semantic naming contract for Vellira token consumers, Generator V2, quality tooling, and agents. The machine-readable authority lives in `packages/tokens/src/token-architecture.ts` as `semanticVocabularyV1` and `canonicalSemanticRolePaths`.

## Rule

Semantic names describe **purpose**, not a primitive hue, renderer, interaction implementation, or the component that first introduced the value. Primitive values feed semantic roles; component factories consume semantic roles; platform adapters serialize component contracts.

## Canonical namespaces

- **surface** — canvas/layer backgrounds and generic interaction surfaces. `surface.background` is removed because it did not identify a distinct purpose; application roots use `surface.canvas`.
- **text** — foreground hierarchy (`primary → secondary → muted → subtle → disabled`) plus brand and interaction-specific text roles.
- **icons** — icon foreground hierarchy. `interactive`/`interactiveHover` describe interaction; `brand` remains a distinct identity role.
- **border / divider** — structural borders and separators. `border.interactive` is generic interaction emphasis; actual focus indication belongs to `focus.ring`.
- **focus** — focus indication only. `ring.offsetColor` is explicitly a color, not geometric spacing.
- **status** — success/error/warning/info paint with explicit `fg`, `bg`, `border`, `ring`, and `emphasisFg` consumption roles.
- **action** — reusable action palettes. `primary` is the main brand action, `accent` is the cyan secondary-brand hue, `neutral` is non-brand action chrome, and `danger` is destructive action paint.
- **control** — generic form-control state paint using the canonical interaction vocabulary from #882.
- **menu** — menu-specific current/highlighted semantics where `active` is a real persistent/current domain state.
- **overlay** — `backdrop`, `tooltip`, `floating`, and `dialog`; names describe presentation purpose rather than Popover/Modal component history.
- **shadow** — semantic elevation references. Renderer-neutral shadow/elevation ownership is handled by the later #885 boundary work.

## Migration policy

Legacy public names are tracked through the #880 preservation manifest. Renames are baseline-to-final: migration metadata never preserves intermediate historical names as permanent vocabulary. Pure renames preserve resolved values. The only visual corrections in #883 remain inside existing Vellira palettes and require explicit preservation evidence plus pinned visual regression.

## Theme hierarchy corrections

Semantic roles stay distinct even when a theme resolves some of them to equal values. V1 also corrects three pre-existing mapping errors without introducing new colors: Dark text `muted/subtle` ordering, High Contrast icon `muted/subtle` ordering, and Dark warning/info focus-ring palettes.
"""
)

# Focused regression contract for the normalized public vocabulary.
test = ROOT / 'packages/tokens/src/semantic-vocabulary-v1.test.ts'
test.write_text(
    """import { describe, expect, it } from 'vitest';

import { darkTheme } from './dark/theme.js';
import { highContrastTheme } from './highContrast/theme.js';
import { lightTheme } from './light/theme.js';
import { colors } from './primitives/colors.js';
import { semanticVocabularyV1 } from './token-architecture.js';

const themes = [
  ['light', lightTheme],
  ['dark', darkTheme],
  ['high-contrast', highContrastTheme],
] as const;

describe('Semantic Vocabulary V1', () => {
  it.each(themes)('%s exposes only canonical renamed roles', (_name, theme) => {
    expect(theme.semantic.surface).not.toHaveProperty('background');
    expect(theme.semantic.action).toHaveProperty('accent');
    expect(theme.semantic.action).toHaveProperty('neutral');
    expect(theme.semantic.action).not.toHaveProperty('secondary');
    expect(theme.semantic.action).not.toHaveProperty('close');
    expect(theme.semantic.icons).toHaveProperty('interactive');
    expect(theme.semantic.icons).toHaveProperty('interactiveHover');
    expect(theme.semantic.icons).not.toHaveProperty('primary');
    expect(theme.semantic.icons).not.toHaveProperty('hover');
    expect(theme.semantic.border).toHaveProperty('interactive');
    expect(theme.semantic.border).not.toHaveProperty('focus');
    expect(theme.semantic.focus.ring).toHaveProperty('offsetColor');
    expect(theme.semantic.focus.ring).not.toHaveProperty('offset');
    expect(theme.semantic.overlay).toHaveProperty('floating');
    expect(theme.semantic.overlay).toHaveProperty('dialog');
    expect(theme.semantic.overlay).not.toHaveProperty('popover');
    expect(theme.semantic.overlay).not.toHaveProperty('modal');
    expect(theme.semantic).not.toHaveProperty('navigation');

    for (const status of Object.values(theme.semantic.status)) {
      expect(status).toHaveProperty('emphasisFg');
      expect(status).not.toHaveProperty('strong');
    }
  });

  it('publishes machine-readable purpose boundaries for every V1 namespace', () => {
    expect(Object.keys(semanticVocabularyV1)).toEqual([
      'surface',
      'text',
      'icons',
      'border',
      'divider',
      'focus',
      'status',
      'action',
      'control',
      'menu',
      'overlay',
      'shadow',
    ]);
    expect(semanticVocabularyV1.action.roles).toEqual([
      'primary',
      'accent',
      'neutral',
      'danger',
    ]);
    expect(semanticVocabularyV1.focus.roles).toContain('ring.offsetColor');
  });

  it('keeps muted stronger than subtle in corrected dark foreground hierarchies', () => {
    expect(darkTheme.semantic.text.muted).toBe(colors.mono[500]);
    expect(darkTheme.semantic.text.subtle).toBe(colors.vellira[400]);
    expect(highContrastTheme.semantic.icons.muted).toBe(colors.gray[300]);
    expect(highContrastTheme.semantic.icons.subtle).toBe(colors.gray[400]);
  });

  it('uses each Dark status palette for its own ring', () => {
    expect(darkTheme.semantic.status.warning.ring).toBe(colors.warning[300]);
    expect(darkTheme.semantic.status.info.ring).toBe(colors.info[200]);
    expect(darkTheme.semantic.status.warning.ring).not.toBe(colors.error[400]);
    expect(darkTheme.semantic.status.info.ring).not.toBe(colors.error[400]);
  });
});
"""
)
