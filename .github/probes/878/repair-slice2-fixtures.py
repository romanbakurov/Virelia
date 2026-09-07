from pathlib import Path

path = Path("scripts/checks/component-completeness/check-component.test.ts")
source = path.read_text()

old_factory = "`export * from './create${params.componentName}Tokens';\\n`"
new_factory = "`export * from './create${params.componentName}Tokens.js';\\n`"
if source.count(old_factory) != 1:
    raise SystemExit(
        f"factory fixture: expected one legacy barrel anchor, found {source.count(old_factory)}"
    )
source = source.replace(old_factory, new_factory, 1)

old_theme = "`export * from './${lowerName}';\\n`"
new_theme = (
    "`export { ${lowerName}Tokens as ${lowerName} } from './${lowerName}.js';\\n`"
)
if source.count(old_theme) != 1:
    raise SystemExit(
        f"theme fixture: expected one legacy barrel anchor, found {source.count(old_theme)}"
    )
source = source.replace(old_theme, new_theme, 1)

path.write_text(source)
