from pathlib import Path
import shutil
import sys

TEMPLATE_DIR = Path(sys.argv[1])


def replace_once(path: str, old: str, new: str) -> None:
    file = Path(path)
    text = file.read_text()
    count = text.count(old)
    if count != 1:
        raise SystemExit(f"{path}: expected one anchor, found {count}")
    file.write_text(text.replace(old, new, 1))


replace_once(
    "package.json",
    '    "test:unit": "pnpm test:tokens && pnpm test:web && pnpm test:native",\n',
    '    "test:unit": "pnpm test:tokens && pnpm test:core && pnpm test:metadata && pnpm test:web && pnpm test:native",\n'
    '    "test:core": "pnpm --filter @vellira-ui/core test",\n'
    '    "test:metadata": "pnpm --filter @vellira-ui/metadata test",\n',
)

replace_once(
    "scripts/component-production/contracts.ts",
    "  'completeness',\n  'quality',\n] as const;",
    "  'completeness',\n  'quality',\n  'public-api',\n  'tooling',\n  'visual',\n  'smoke',\n] as const;",
)

replace_once(
    "scripts/component-production/command-validation.ts",
    "    {\n      id: 'lint',\n      stage: 'lint',\n      command: ['pnpm', 'lint'],\n      timeoutMs: 120_000,\n    },\n    ...platformCommands(input),",
    "    {\n      id: 'lint',\n      stage: 'lint',\n      command: ['pnpm', 'lint'],\n      timeoutMs: 120_000,\n    },\n    {\n      id: 'core-tests',\n      stage: 'tests',\n      command: ['pnpm', 'test:core'],\n      timeoutMs: 180_000,\n    },\n    {\n      id: 'metadata-tests',\n      stage: 'tests',\n      command: ['pnpm', 'test:metadata'],\n      timeoutMs: 180_000,\n    },\n    ...platformCommands(input),",
)

command_tests = Path("scripts/component-production/command-validation.test.ts")
text = command_tests.read_text()
old = "      'lint',\n      'react-tests',"
new = "      'lint',\n      'core-tests',\n      'metadata-tests',\n      'react-tests',"
count = text.count(old)
if count != 3:
    raise SystemExit(f"{command_tests}: expected 3 command-list anchors, found {count}")
command_tests.write_text(text.replace(old, new))

shutil.copyfile(TEMPLATE_DIR / "run.ts", "scripts/component-production/run.ts")
shutil.copyfile(
    TEMPLATE_DIR / "final-validation.ts",
    "scripts/component-production/final-validation.ts",
)
shutil.copyfile(
    TEMPLATE_DIR / "final-validation.test.ts",
    "scripts/component-production/final-validation.test.ts",
)

run_test = Path("scripts/component-production/run.test.ts")
text = run_test.read_text()

marker = "  it('returns a versioned review-ready validation-only result', async () => {"
start = text.index(marker)
end = text.index(
    "  it('returns machine-readable blocking findings without generation'", start
)
block = text[start:end]
anchor = "          quality: passingQuality(),\n        }),\n      },\n"
if block.count(anchor) != 1:
    raise SystemExit("run.test.ts: ready validation dependency anchor mismatch")
block = block.replace(
    anchor,
    "          quality: passingQuality(),\n        }),\n        runFinalValidation: () => ({ stages: finalStages() }),\n      },\n",
    1,
)
text = text[:start] + block + text[end:]

marker = "  it('reruns deterministic validation without invoking generation', async () => {"
start = text.index(marker)
end = text.index("});\n\nfunction commandStages", start)
block = text[start:end]
anchor = "            quality: passingQuality(),\n          };\n        },\n      },\n"
if block.count(anchor) != 1:
    raise SystemExit("run.test.ts: candidate final validation anchor mismatch")
block = block.replace(
    anchor,
    "            quality: passingQuality(),\n          };\n        },\n        runFinalValidation: () => {\n          calls.push('final-validation');\n          return { stages: finalStages() };\n        },\n      },\n",
    1,
)
block = block.replace(
    "    expect(calls).toEqual(['command-validation', 'structured-validation']);",
    "    expect(calls).toEqual([\n      'command-validation',\n      'structured-validation',\n      'final-validation',\n    ]);",
    1,
)
text = text[:start] + block + text[end:]

old_stage_tail = "      'completeness',\n      'quality',\n    ]);"
new_stage_tail = "      'completeness',\n      'quality',\n      'public-api',\n      'tooling',\n      'visual',\n      'smoke',\n    ]);"
count = text.count(old_stage_tail)
if count != 2:
    raise SystemExit(f"run.test.ts: expected two stage-list tails, found {count}")
text = text.replace(old_stage_tail, new_stage_tail)

helper_anchor = "function passedStage(\n  id: ComponentProductionStageId\n): ComponentProductionStageResult {"
if text.count(helper_anchor) != 1:
    raise SystemExit("run.test.ts: passedStage helper anchor mismatch")
text = text.replace(
    helper_anchor,
    "function finalStages(): ComponentProductionStageResult[] {\n  return ['public-api', 'tooling', 'visual', 'smoke'].map((id) =>\n    passedStage(id as ComponentProductionStageId)\n  );\n}\n\n" + helper_anchor,
    1,
)
run_test.write_text(text)
