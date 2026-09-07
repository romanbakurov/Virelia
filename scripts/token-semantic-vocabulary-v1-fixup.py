from pathlib import Path

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


# Direct semantic references that are not preceded by a parent object chain.
source_roots = [
    *(ROOT / f'packages/tokens/src/{theme}/semantic' for theme in THEMES),
    *(ROOT / f'packages/tokens/src/{theme}/components' for theme in THEMES),
    ROOT / 'packages/tokens/src/factories',
    ROOT / 'scripts/generators',
]
replacements = (
    ('action.secondary', 'action.accent'),
    ('action.close', 'action.neutral'),
    ('icons.primary', 'icons.interactive'),
    ('icons.hover', 'icons.interactiveHover'),
    ('border.focus', 'border.interactive'),
    ('overlay.popover', 'overlay.floating'),
    ('overlay.modal', 'overlay.dialog'),
    ('status.error.strong', 'status.error.emphasisFg'),
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

replace_exact(
    'docs/TOKEN_CONVENTIONS.md',
    'theme.semantic.border.focus',
    'theme.semantic.border.interactive',
)

# Semantic focus uses offsetColor, while existing component contracts intentionally
# keep their renderer-neutral `offset` field. This adapter makes that boundary explicit.
helper = ROOT / 'packages/tokens/src/factories/createComponentFocusRing.ts'
if helper.exists():
    raise SystemExit(f'{helper}: helper unexpectedly already exists')
helper.write_text(
    """export type SemanticFocusRing = {
  readonly color: string;
  readonly width: string;
  readonly shadow: string;
  readonly offsetColor: string;
};

export const createComponentFocusRing = (ring: SemanticFocusRing) =>
  ({
    color: ring.color,
    width: ring.width,
    shadow: ring.shadow,
    offset: ring.offsetColor,
  }) as const;
"""
)

for theme in THEMES:
    path = f'packages/tokens/src/{theme}/components/dropdown.ts'
    text = read(path)
    import_marker = "import { createDropdownPalette } from '../../factories/createDropdownPalette.js';\n"
    if text.count(import_marker) != 1:
        raise SystemExit(f'{path}: dropdown import marker mismatch')
    text = text.replace(
        import_marker,
        "import { createComponentFocusRing } from '../../factories/createComponentFocusRing.js';\n"
        + import_marker,
        1,
    )
    count = text.count('ring: focus.ring,')
    if count != 2:
        raise SystemExit(f'{path}: expected 2 whole focus.ring consumers, found {count}')
    text = text.replace(
        'ring: focus.ring,',
        'ring: createComponentFocusRing(focus.ring),',
    )
    write(path, text)

context_path = 'packages/tokens/src/factories/createContextMenuTokens.ts'
context = read(context_path)
context = (
    "import {\n"
    "  createComponentFocusRing,\n"
    "  type SemanticFocusRing,\n"
    "} from './createComponentFocusRing.js';\n\n"
    + context
)
if context.count('ring: ContextMenuFocusRing;') != 1:
    raise SystemExit(f'{context_path}: semantic focus type marker mismatch')
context = context.replace('ring: ContextMenuFocusRing;', 'ring: SemanticFocusRing;', 1)
if context.count('itemFocusRing: focus.ring,') != 1:
    raise SystemExit(f'{context_path}: item focus ring marker mismatch')
context = context.replace(
    'itemFocusRing: focus.ring,',
    'itemFocusRing: createComponentFocusRing(focus.ring),',
    1,
)
if context.count('triggerFocusRing: focus.ring,') != 1:
    raise SystemExit(f'{context_path}: trigger focus ring marker mismatch')
context = context.replace(
    'triggerFocusRing: focus.ring,',
    'triggerFocusRing: createComponentFocusRing(focus.ring),',
    1,
)
write(context_path, context)

modal_path = 'packages/tokens/src/factories/createModalTokens.ts'
modal = read(modal_path)
modal = (
    "import {\n"
    "  createComponentFocusRing,\n"
    "  type SemanticFocusRing,\n"
    "} from './createComponentFocusRing.js';\n\n"
    + modal
)
if modal.count('ring: ModalFocusRing;') != 1:
    raise SystemExit(f'{modal_path}: semantic focus type marker mismatch')
modal = modal.replace('ring: ModalFocusRing;', 'ring: SemanticFocusRing;', 1)
if modal.count('    modal: {') != 1:
    raise SystemExit(f'{modal_path}: modal semantic overlay type marker mismatch')
modal = modal.replace('    modal: {', '    dialog: {', 1)
if modal.count('closeButtonFocusRing: focus.ring,') != 1:
    raise SystemExit(f'{modal_path}: close-button focus ring marker mismatch')
modal = modal.replace(
    'closeButtonFocusRing: focus.ring,',
    'closeButtonFocusRing: createComponentFocusRing(focus.ring),',
    1,
)
write(modal_path, modal)

popover_path = 'packages/tokens/src/factories/createPopoverTokens.ts'
popover = read(popover_path)
if popover.count('    popover: {') != 1:
    raise SystemExit(f'{popover_path}: popover semantic overlay type marker mismatch')
popover = popover.replace('    popover: {', '    floating: {', 1)
write(popover_path, popover)
