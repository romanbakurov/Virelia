from pathlib import Path

path = Path('packages/tokens/src/component-token-factories.test.ts')
text = path.read_text()

replacements = [
    ("import { shadow as lightShadow } from './light/semantic/shadow.js';\n", ''),
    ("const modalShadow = {\n  xl: 'synthetic-shadow-xl',\n};\n\n", ''),
    ('        shadow: lightShadow,\n', ''),
    ('        contentShadow: lightShadow.lg,\n', ''),
    ('        shadow: modalShadow,\n', ''),
    ('        contentShadow: modalShadow.xl,\n', ''),
]

for old, new in replacements:
    if old not in text:
        raise SystemExit(f'expected fixture fragment missing: {old!r}')
    text = text.replace(old, new)

path.write_text(text)
