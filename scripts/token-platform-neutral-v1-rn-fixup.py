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
            f'{path}: expected one exact match, found {count}: {old[:100]!r}'
        )
    write(path, text.replace(old, new, 1))


# Tooltip always owns an elevation shadow, never the broader no-shadow/focus-ring
# union. Keep that invariant in the type so native output cannot be nullable.
replace_once(
    'packages/tokens/src/factories/createTooltipTokens.ts',
    '  type ComponentShadowIntent,\n',
    '  type ComponentElevationShadowIntent,\n',
)
replace_once(
    'packages/tokens/src/factories/createTooltipTokens.ts',
    '  shadow: ComponentShadowIntent;\n',
    '  shadow: ComponentElevationShadowIntent;\n',
)


# Dropdown is rendered by the React Native package on both native and web.
# Resolve canonical component intent once at the presentation boundary and feed
# each renderer only its adapted representation.
path = 'packages/react-native/src/components/Dropdown/Content/DropdownContent.styles.ts'
text = read(path)
old_import = "import type { NativeTheme } from '../../../theme';\n"
new_import = """import {
  resolveComponentTokenPlatformOutputs,
  type NativeTheme,
} from '../../../theme';
"""
if text.count(old_import) != 1:
    raise SystemExit(f'{path}: theme import marker mismatch')
text = text.replace(old_import, new_import, 1)
old_start = """export const createStyles = (theme: NativeTheme) =>
  StyleSheet.create({
"""
new_start = """export const createStyles = (theme: NativeTheme) => {
  const canonical = theme.components.dropdown.content;
  const output = resolveComponentTokenPlatformOutputs(theme, canonical);
  const nativeShadow = output.reactNative.shadow;

  if (nativeShadow === null || typeof nativeShadow === 'string') {
    throw new Error(
      'Dropdown content shadow must resolve to a structured React Native shadow.'
    );
  }

  return StyleSheet.create({
"""
if text.count(old_start) != 1:
    raise SystemExit(f'{path}: createStyles marker mismatch')
text = text.replace(old_start, new_start, 1)
replacements = [
    (
        '      backgroundColor: theme.components.dropdown.content.bg,',
        '      backgroundColor: canonical.bg,',
    ),
    (
        '      borderColor: theme.components.dropdown.content.border,',
        '      borderColor: canonical.border,',
    ),
    (
        '          boxShadow: theme.components.dropdown.content.shadow,',
        '          boxShadow: output.web.shadow,',
    ),
    (
        '          shadowColor: theme.tokens.shadows.lg.color,',
        '          shadowColor: nativeShadow.color,',
    ),
    (
        '            width: theme.tokens.shadows.lg.x,',
        '            width: nativeShadow.x,',
    ),
    (
        '            height: -theme.tokens.shadows.lg.y,',
        '            height: -nativeShadow.y,',
    ),
    (
        '          shadowOpacity: theme.tokens.shadows.lg.opacity,',
        '          shadowOpacity: nativeShadow.opacity,',
    ),
    (
        '          shadowRadius: theme.tokens.shadows.lg.blur,',
        '          shadowRadius: nativeShadow.blur,',
    ),
    (
        '          elevation: theme.tokens.shadows.lg.elevation,',
        '          elevation: nativeShadow.elevation,',
    ),
]
for old, new in replacements:
    if text.count(old) != 1:
        raise SystemExit(f'{path}: expected one exact marker: {old!r}')
    text = text.replace(old, new, 1)
if not text.rstrip().endswith('  });'):
    raise SystemExit(f'{path}: unexpected file ending')
text = text.rstrip() + '\n};\n'
write(path, text)


# Select follows the same boundary. The sheet-specific inverted shadow remains a
# presentation transform over the primitive native shadow and is not canonical
# component-token representation; #885 owns shadow authority consolidation.
path = 'packages/react-native/src/components/Select/Presentation/SelectPresentation.styles.ts'
text = read(path)
old_import = "import type { NativeTheme } from '../../../theme';\n"
new_import = """import {
  resolveComponentTokenPlatformOutputs,
  type NativeTheme,
} from '../../../theme';
"""
if text.count(old_import) != 1:
    raise SystemExit(f'{path}: theme import marker mismatch')
text = text.replace(old_import, new_import, 1)
old_start = """export const createPresentationStyles = (theme: NativeTheme) =>
  StyleSheet.create({
"""
new_start = """export const createPresentationStyles = (theme: NativeTheme) => {
  const canonical = theme.components.select.dropdown;
  const output = resolveComponentTokenPlatformOutputs(theme, canonical);
  const nativeShadow = output.reactNative.shadow;

  if (nativeShadow === null || typeof nativeShadow === 'string') {
    throw new Error(
      'Select dropdown shadow must resolve to a structured React Native shadow.'
    );
  }

  return StyleSheet.create({
"""
if text.count(old_start) != 1:
    raise SystemExit(f'{path}: createPresentationStyles marker mismatch')
text = text.replace(old_start, new_start, 1)
replacements = [
    (
        '      backgroundColor: theme.components.select.dropdown.bg,',
        '      backgroundColor: canonical.bg,',
    ),
    (
        '      borderColor: theme.components.select.dropdown.border,',
        '      borderColor: canonical.border,',
    ),
    (
        '          boxShadow: theme.components.select.dropdown.shadow,',
        '          boxShadow: output.web.shadow,',
    ),
    (
        '          shadowColor: theme.tokens.shadows.lg.color,',
        '          shadowColor: nativeShadow.color,',
    ),
    (
        '            width: theme.tokens.shadows.lg.x,',
        '            width: nativeShadow.x,',
    ),
    (
        '            height: theme.tokens.shadows.lg.y,',
        '            height: nativeShadow.y,',
    ),
    (
        '          shadowOpacity: theme.tokens.shadows.lg.opacity,',
        '          shadowOpacity: nativeShadow.opacity,',
    ),
    (
        '          shadowRadius: theme.tokens.shadows.lg.blur,',
        '          shadowRadius: nativeShadow.blur,',
    ),
    (
        '          elevation: theme.tokens.shadows.lg.elevation,',
        '          elevation: nativeShadow.elevation,',
    ),
]
for old, new in replacements:
    if text.count(old) != 1:
        raise SystemExit(f'{path}: expected one exact marker: {old!r}')
    text = text.replace(old, new, 1)
if not text.rstrip().endswith('  });'):
    raise SystemExit(f'{path}: unexpected file ending')
text = text.rstrip() + '\n};\n'
write(path, text)

print('React Native component output boundary fixup applied in workspace.')
