from pathlib import Path


def read(path: str) -> str:
    return Path(path).read_text()


def write(path: str, content: str) -> None:
    Path(path).write_text(content)


def replace_once(content: str, old: str, new: str, label: str) -> str:
    count = content.count(old)
    if count != 1:
        raise SystemExit(f"{label}: expected one anchor, found {count}")
    return content.replace(old, new, 1)


# Slice 1 extended the versioned production stage contract. Keep the real CLI
# integration assertion aligned with that canonical contract.
path = "scripts/component-production/cli.integration.test.ts"
source = read(path)
source = replace_once(
    source,
    "      'completeness',\n      'quality',\n    ]);",
    "      'completeness',\n      'quality',\n      'public-api',\n      'tooling',\n      'visual',\n      'smoke',\n    ]);",
    "production CLI stage list",
)
write(path, source)


# Coverage integration fixtures now model the structural authorities that a
# complete shared-semantics component must actually own.
path = "scripts/checks/component-completeness/check-test-coverage-integration.test.ts"
source = read(path)
source = replace_once(
    source,
    "  fs.writeFileSync(path.join(componentDir, 'types.ts'), '');",
    "  fs.writeFileSync(\n    path.join(componentDir, 'types.ts'),\n    \"import type { BaseSwitchProps } from '@vellira-ui/types';\\nexport type SwitchProps = BaseSwitchProps;\\n\"\n  );",
    "coverage fixture local shared types",
)
source = replace_once(
    source,
    "  fs.writeFileSync(\n    path.join(root, 'packages', 'react', 'src', 'components', 'index.ts'),\n    `export * from './${componentName}';\\n`\n  );\n\n  const contract = createComponentTestCoverageContract({",
    "  fs.writeFileSync(\n    path.join(root, 'packages', 'react', 'src', 'components', 'index.ts'),\n    `export * from './${componentName}';\\n`\n  );\n\n  const metadataDir = path.join(\n    root,\n    'packages',\n    'metadata',\n    'src',\n    'components'\n  );\n  fs.mkdirSync(metadataDir, { recursive: true });\n  fs.writeFileSync(\n    path.join(metadataDir, `${componentName}.metadata.ts`),\n    `export const switchMetadata = {};\\n`\n  );\n  fs.writeFileSync(\n    path.join(metadataDir, 'index.ts'),\n    `import { switchMetadata } from './${componentName}.metadata';\\n\\nexport const componentMetadata = [\\n  switchMetadata,\\n] as const;\\n`\n  );\n\n  const typesRoot = path.join(root, 'packages', 'types');\n  fs.mkdirSync(path.join(typesRoot, 'src'), { recursive: true });\n  fs.writeFileSync(\n    path.join(typesRoot, 'package.json'),\n    `${JSON.stringify({ name: '@vellira-ui/types' })}\\n`\n  );\n  fs.writeFileSync(\n    path.join(typesRoot, 'src', 'switch.ts'),\n    'export interface BaseSwitchProps {}\\n'\n  );\n  fs.writeFileSync(\n    path.join(typesRoot, 'src', 'index.ts'),\n    \"export * from './switch';\\n\"\n  );\n\n  const contract = createComponentTestCoverageContract({",
    "coverage fixture canonical authorities",
)
source = replace_once(
    source,
    "    capabilities,\n    requirements: {",
    "    capabilities,\n    dependencies: {\n      packages: ['@vellira-ui/types'],\n    },\n    requirements: {",
    "coverage metadata shared dependency",
)
write(path, source)


# The CLI uses real Button metadata from packages/metadata. Its synthetic repo
# therefore needs the canonical metadata registration and every declared package
# dependency to be structurally present.
path = "scripts/checks/component-completeness/cli.test.ts"
source = read(path)
source = replace_once(
    source,
    "  const registryDir = path.join(\n    root,\n    'apps',",
    "  const metadataDir = path.join(\n    root,\n    'packages',\n    'metadata',\n    'src',\n    'components'\n  );\n  fs.mkdirSync(metadataDir, { recursive: true });\n  fs.writeFileSync(\n    path.join(metadataDir, 'Button.metadata.ts'),\n    'export const buttonMetadata = {};\\n'\n  );\n  fs.writeFileSync(\n    path.join(metadataDir, 'index.ts'),\n    `import { buttonMetadata } from './Button.metadata';\\n\\nexport const componentMetadata = [\\n  buttonMetadata,\\n] as const;\\n`\n  );\n\n  for (const packageName of ['@vellira-ui/types', '@vellira-ui/tokens']) {\n    const packageDir = packageName.replace('@vellira-ui/', '');\n    const packageRoot = path.join(root, 'packages', packageDir);\n    fs.mkdirSync(packageRoot, { recursive: true });\n    fs.writeFileSync(\n      path.join(packageRoot, 'package.json'),\n      `${JSON.stringify({ name: packageName })}\\n`\n    );\n  }\n\n  const registryDir = path.join(\n    root,\n    'apps',",
    "CLI fixture canonical metadata and dependencies",
)
write(path, source)
