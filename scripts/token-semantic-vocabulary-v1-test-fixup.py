from pathlib import Path

ROOT = Path('.')


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


test_path = 'packages/tokens/src/component-token-factories.test.ts'
test = read(test_path)
import_marker = "import { describe, expect, it } from 'vitest';\n\n"
if test.count(import_marker) != 1:
    raise SystemExit(f'{test_path}: import marker mismatch')
test = test.replace(
    import_marker,
    import_marker
    + "import { createComponentFocusRing } from './factories/createComponentFocusRing.js';\n",
    1,
)
test = test.replace(
    "  offset: 'synthetic-focus-offset',",
    "  offsetColor: 'synthetic-focus-offset',",
    1,
)
test = test.replace('  modal: {', '  dialog: {', 1)
if test.count('itemFocusRing: lightFocus.ring,') != 1:
    raise SystemExit(f'{test_path}: item focus fixture marker mismatch')
test = test.replace(
    'itemFocusRing: lightFocus.ring,',
    'itemFocusRing: createComponentFocusRing(lightFocus.ring),',
    1,
)
if test.count('triggerFocusRing: lightFocus.ring,') != 1:
    raise SystemExit(f'{test_path}: trigger focus fixture marker mismatch')
test = test.replace(
    'triggerFocusRing: lightFocus.ring,',
    'triggerFocusRing: createComponentFocusRing(lightFocus.ring),',
    1,
)
if test.count('modalOverlay.modal.') != 4:
    raise SystemExit(
        f'{test_path}: expected 4 old modal overlay fixture reads, found {test.count("modalOverlay.modal.")}'
    )
test = test.replace('modalOverlay.modal.', 'modalOverlay.dialog.')
if test.count('closeButtonFocusRing: modalFocusRing,') != 2:
    raise SystemExit(f'{test_path}: modal component focus fixture marker mismatch')
test = test.replace(
    'closeButtonFocusRing: modalFocusRing,',
    'closeButtonFocusRing: createComponentFocusRing(modalFocusRing),',
)
write(test_path, test)

# Physical close-button press must use the canonical pressed surface state.
modal_theme_path = 'packages/tokens/src/dark/components/modal.ts'
replace_exact(
    modal_theme_path,
    'const closeButtonPressedBg = surface.active;',
    'const closeButtonPressedBg = surface.pressed;',
)

# The regression fixture must describe the same corrected semantic mapping.
test = read(test_path)
if test.count('closeButtonPressedBg: modalSurface.active,') != 2:
    raise SystemExit(f'{test_path}: expected 2 old pressed override assertions')
test = test.replace(
    'closeButtonPressedBg: modalSurface.active,',
    'closeButtonPressedBg: modalSurface.pressed,',
)
replace_exact(
    test_path,
    "it('preserves the existing dark Modal hover and pressed semantic overrides', () => {",
    "it('keeps Dark Modal pressed overrides on the canonical pressed surface state', () => {",
)
