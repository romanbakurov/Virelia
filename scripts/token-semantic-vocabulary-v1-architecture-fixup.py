from pathlib import Path

ROOT = Path('.')

# The initial migration intentionally rewrites status.*.strong, but its broad
# temporary string transform also touches structural border/divider `strong`
# paths. Restore those two canonical structural roles explicitly.
arch_path = ROOT / 'packages/tokens/src/token-architecture.ts'
text = arch_path.read_text()
for old, new in (
    ("'border.emphasisFg'", "'border.strong'"),
    ("'divider.emphasisFg'", "'divider.strong'"),
):
    count = text.count(old)
    if count != 1:
        raise SystemExit(f'{arch_path}: expected exactly one temporary {old}, found {count}')
    text = text.replace(old, new, 1)
arch_path.write_text(text)

# This is a semantic-to-component boundary adapter, not a maintained component
# token factory. Keep it beside factory support code but outside the create*.ts
# source naming convention that the registry intentionally reserves for
# maintained component factories.
old_helper = ROOT / 'packages/tokens/src/factories/createComponentFocusRing.ts'
new_helper = ROOT / 'packages/tokens/src/factories/componentFocusRing.ts'
if not old_helper.exists():
    raise SystemExit(f'{old_helper}: expected temporary helper source')
if new_helper.exists():
    raise SystemExit(f'{new_helper}: destination unexpectedly already exists')
old_helper.rename(new_helper)

replacements = (
    ('./createComponentFocusRing.js', './componentFocusRing.js'),
    ('../../factories/createComponentFocusRing.js', '../../factories/componentFocusRing.js'),
    ('./factories/createComponentFocusRing.js', './factories/componentFocusRing.js'),
)
changed_imports = 0
for path in (ROOT / 'packages/tokens/src').rglob('*.ts'):
    content = path.read_text()
    next_content = content
    for old, new in replacements:
        count = next_content.count(old)
        changed_imports += count
        next_content = next_content.replace(old, new)
    if next_content != content:
        path.write_text(next_content)

if changed_imports < 6:
    raise SystemExit(
        f'expected at least 6 focus adapter import rewrites, found {changed_imports}'
    )
