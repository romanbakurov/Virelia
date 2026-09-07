from pathlib import Path
import subprocess

path = "scripts/generators/component/preflight.ts"
source = subprocess.check_output(
    ["git", "show", f"HEAD:{path}"], text=True
)

function_anchor = "export function validateComponentGenerationPlan("
function_start = source.index(function_anchor)
block_start = source.index(
    "  const selectedPlatforms = plan.targets.map(", function_start
)
block_end_anchor = (
    "  for (const target of plan.targets) {\n"
    "    if (!fs.existsSync(target.barrelFile)) {"
)
block_end = source.index(block_end_anchor, block_start)
block = source[block_start:block_end]

helper = (
    "export function validateComponentGenerationAuthorities(\n"
    "  plan: ComponentGenerationPlan\n"
    "): string[] {\n"
    "  const errors: string[] = [];\n"
    f"{block}"
    "  return errors;\n"
    "}\n\n"
)

source = source.replace(
    "export function validateComponentGenerationPlan(\n",
    helper + "export function validateComponentGenerationPlan(\n",
    1,
)

function_start = source.index(function_anchor)
block_start = source.index(
    "  const selectedPlatforms = plan.targets.map(", function_start
)
block_end = source.index(block_end_anchor, block_start)
source = (
    source[:block_start]
    + "  errors.push(...validateComponentGenerationAuthorities(plan));\n\n"
    + source[block_end:]
)

Path(path).write_text(source)
