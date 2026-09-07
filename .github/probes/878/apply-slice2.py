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


# 1. Extract generator dependency/resource validation into one reusable authority.
preflight_path = "scripts/generators/component/preflight.ts"
preflight = read(preflight_path)

helper = r'''
export function validateComponentGenerationAuthorities(
  plan: ComponentGenerationPlan
): string[] {
  const errors: string[] = [];
  const selectedPlatforms = plan.targets.map(
    (target) => target.packageName as ComponentDependencyPlatform
  );
  const selectedPlatformSet = new Set(selectedPlatforms);

  validateDependencySet({
    root: plan.root,
    packages: plan.dependencies.packages,
    components: plan.dependencies.components,
    componentName: plan.componentName,
    requiredPlatforms: selectedPlatforms,
    errors,
  });

  for (const [platform, dependencies] of Object.entries(
    plan.dependencies.platforms ?? {}
  )) {
    if (!selectedPlatformSet.has(platform as ComponentDependencyPlatform)) {
      errors.push(
        `invalid-platform-dependency: platform="${platform}" is not selected for component="${plan.componentName}"`
      );
      continue;
    }

    validateDependencySet({
      root: plan.root,
      packages: dependencies?.packages,
      components: dependencies?.components,
      componentName: plan.componentName,
      requiredPlatforms: [platform as ComponentDependencyPlatform],
      errors,
    });
  }

  for (const asset of plan.assets) {
    const assetPath = canonicalAssetPath({
      root: plan.root,
      assetPath: asset.path,
    });

    if (!assetPath) {
      errors.push(
        `invalid-design-asset-path: path="${asset.path}" purpose="${asset.purpose}" — expected a canonical brand/, fonts/, or styles/ asset path`
      );
      continue;
    }

    if (
      !canonicalAssetExists({
        root: plan.root,
        assetPath: asset.path,
      })
    ) {
      errors.push(
        `missing-design-asset: path="${asset.path}" purpose="${asset.purpose}" expected="${assetPath}"`
      );
    }
  }

  if (plan.icons.length > 0) {
    for (const target of plan.targets) {
      const platform = target.packageName;
      const registryPath = canonicalIconSourcePath({
        root: plan.root,
        platform,
      });
      const exports = canonicalIconExports({
        root: plan.root,
        platform,
      });

      if (!exports) {
        errors.push(
          `missing-icon-resource-registry: component="${plan.componentName}" platform="${platform}" registry="${registryPath}"`
        );
        continue;
      }

      for (const requirement of plan.icons) {
        if (!exports.has(requirement.name)) {
          errors.push(
            `missing-icon-resource: name="${requirement.name}" purpose="${requirement.purpose}" platform="${platform}" — expected canonical export from @vellira-ui/icons`
          );
        }
      }
    }
  }

  if (plan.tokens.length > 0) {
    const registryPath = canonicalTokenRegistryPath(plan.root);
    const tokenPaths = canonicalTokenPaths(plan.root);

    if (!tokenPaths) {
      errors.push(
        `missing-design-token-registry: component="${plan.componentName}" registry="${registryPath}"`
      );
    } else {
      for (const target of plan.targets) {
        for (const token of plan.tokens) {
          if (!tokenPaths.has(token)) {
            errors.push(
              `missing-design-token: path="${token}" component="${plan.componentName}" part="component" platform="${target.packageName}" — expected canonical token path in @vellira-ui/tokens`
            );
          }
        }
      }
    }
  }

  return errors;
}
'''

anchor = "\nexport function validateComponentGenerationPlan(\n"
if "export function validateComponentGenerationAuthorities(" not in preflight:
    preflight = replace_once(
        preflight,
        anchor,
        f"\n{helper}{anchor}",
        "preflight helper insertion",
    )

validate_start = preflight.index("export function validateComponentGenerationPlan(")
authority_start = preflight.index(
    "  const selectedPlatforms = plan.targets.map(", validate_start
)
authority_end = preflight.index(
    "  for (const target of plan.targets) {", authority_start
)
preflight = (
    preflight[:authority_start]
    + "  errors.push(...validateComponentGenerationAuthorities(plan));\n\n"
    + preflight[authority_end:]
)
write(preflight_path, preflight)


# 2. Extend machine-readable completeness check names.
types_path = "scripts/checks/component-completeness/types.ts"
types = read(types_path)
types = replace_once(
    types,
    "export type ComponentCheckName =\n  | 'implementation'",
    "export type ComponentCheckName =\n  | 'metadata'\n  | 'type-ownership'\n  | 'production-authorities'\n  | 'component-tokens'\n  | 'implementation'",
    "completeness check names",
)
write(types_path, types)


# 3. Make completeness consume generator/design-resource authorities.
checker_path = "scripts/checks/component-completeness/check-component.ts"
checker = read(checker_path)

checker = replace_once(
    checker,
    "import type {\n  ComponentMetadata,\n  ComponentPlatform,\n} from '@vellira-ui/metadata';\n\nimport { checkTestCoverageContract } from './check-test-coverage';",
    "import type {\n  ComponentMetadata,\n  ComponentPlatform,\n} from '@vellira-ui/metadata';\n\nimport {\n  canonicalTokenPaths,\n  canonicalTokenRegistryPath,\n} from '../../design-resources/authority';\nimport { createComponentGenerationPlan } from '../../generators/component/plan';\nimport type { ComponentGenerationPlan } from '../../generators/component/plan';\nimport { validateComponentGenerationAuthorities } from '../../generators/component/preflight';\nimport {\n  renderComponentTokenBarrelExport,\n  renderComponentTokenFactoryBarrelExport,\n} from '../../generators/component/templates';\nimport { checkTestCoverageContract } from './check-test-coverage';",
    "checker imports",
)

helpers = r'''
function metadataPlatformToGeneratorPlatform(
  platforms: readonly ComponentPlatform[]
): 'web' | 'native' | 'both' {
  const web = platforms.includes('react');
  const native = platforms.includes('react-native');

  if (web && native) return 'both';
  if (web) return 'web';
  if (native) return 'native';

  throw new Error('Component metadata must declare at least one platform.');
}

function createCompletenessGenerationPlan(params: {
  root: string;
  metadata: ComponentMetadata;
}): ComponentGenerationPlan {
  const { root, metadata } = params;
  const componentTokens = metadata.requirements.componentTokens;

  return createComponentGenerationPlan({
    root,
    options: {
      componentName: metadata.name,
      platform: metadataPlatformToGeneratorPlatform(metadata.platforms),
      layer: metadata.layer,
      category: metadata.category,
      profile: metadata.profile,
      capabilities: metadata.capabilities ?? [],
      dependencies: metadata.dependencies,
      icons: metadata.requirements.icons ?? [],
      tokens: metadata.requirements.tokens ?? [],
      assets: metadata.requirements.assets ?? [],
      ...(componentTokens !== undefined ? { componentTokens } : {}),
      parts: [],
      force: false,
      dryRun: false,
      check: false,
    },
  });
}

function checkMetadataRegistration(
  plan: ComponentGenerationPlan
): ComponentCheckResult {
  if (!fs.existsSync(plan.metadataFile)) {
    return {
      name: 'metadata',
      ok: false,
      details: `Missing canonical metadata file: ${plan.metadataFile}`,
    };
  }

  if (!fs.existsSync(plan.metadataBarrelFile)) {
    return {
      name: 'metadata',
      ok: false,
      details: `Missing canonical metadata registry: ${plan.metadataBarrelFile}`,
    };
  }

  const metadataName = `${plan.componentName[0].toLowerCase()}${plan.componentName.slice(1)}Metadata`;
  const metadataImport = `import { ${metadataName} } from './${plan.componentName}.metadata';`;
  const metadataEntry = `  ${metadataName},`;
  const registry = fs.readFileSync(plan.metadataBarrelFile, 'utf8');

  if (!registry.includes(metadataImport) || !registry.includes(metadataEntry)) {
    return {
      name: 'metadata',
      ok: false,
      details: `Missing canonical metadata registration for ${plan.componentName} in ${plan.metadataBarrelFile}`,
    };
  }

  return {
    name: 'metadata',
    ok: true,
  };
}

function checkTypeOwnership(params: {
  plan: ComponentGenerationPlan;
  metadata: ComponentMetadata;
}): ComponentCheckResult {
  const { plan, metadata } = params;

  if (plan.typeOwnership !== 'shared') {
    return {
      name: 'type-ownership',
      ok: true,
    };
  }

  const errors: string[] = [];

  if (!(metadata.dependencies?.packages ?? []).includes('@vellira-ui/types')) {
    errors.push(
      'Shared component semantics must declare @vellira-ui/types as a canonical package dependency.'
    );
  }

  if (!fs.existsSync(plan.sharedTypesFile)) {
    errors.push(`Missing shared type authority: ${plan.sharedTypesFile}`);
  }

  if (!fs.existsSync(plan.sharedTypesBarrelFile)) {
    errors.push(`Missing shared types barrel: ${plan.sharedTypesBarrelFile}`);
  } else {
    const barrel = fs.readFileSync(plan.sharedTypesBarrelFile, 'utf8');
    const sharedFileName = path.basename(plan.sharedTypesFile, '.ts');
    const expectedExport = `export * from './${sharedFileName}';`;

    if (!barrel.includes(expectedExport)) {
      errors.push(
        `Missing shared type export for ${plan.componentName} in ${plan.sharedTypesBarrelFile}`
      );
    }
  }

  for (const target of plan.targets) {
    const localTypesFile = path.join(target.componentDir, 'types.ts');

    if (!fs.existsSync(localTypesFile)) {
      continue;
    }

    const source = fs.readFileSync(localTypesFile, 'utf8');

    if (
      !source.includes("from '@vellira-ui/types'") &&
      !source.includes('from "@vellira-ui/types"')
    ) {
      errors.push(
        `Renderer types must derive shared semantics from @vellira-ui/types: ${localTypesFile}`
      );
    }
  }

  return {
    name: 'type-ownership',
    ok: errors.length === 0,
    ...(errors.length > 0 ? { details: errors.join('\n') } : {}),
  };
}

function checkProductionAuthorities(
  plan: ComponentGenerationPlan
): ComponentCheckResult {
  const errors = validateComponentGenerationAuthorities(plan);

  return {
    name: 'production-authorities',
    ok: errors.length === 0,
    ...(errors.length > 0 ? { details: errors.join('\n') } : {}),
  };
}

function checkComponentTokenStructure(
  plan: ComponentGenerationPlan
): ComponentCheckResult {
  const errors: string[] = [];
  const expectedFactoryExport = renderComponentTokenFactoryBarrelExport(
    plan.componentName
  );
  const expectedThemeExport = renderComponentTokenBarrelExport(
    plan.componentName
  );
  const factoryBarrel = fs.existsSync(plan.tokenFactoryBarrelFile)
    ? fs.readFileSync(plan.tokenFactoryBarrelFile, 'utf8')
    : '';

  if (plan.componentTokens === false) {
    if (fs.existsSync(plan.tokenFactoryFile)) {
      errors.push(`Unexpected component token factory: ${plan.tokenFactoryFile}`);
    }

    if (factoryBarrel.includes(expectedFactoryExport)) {
      errors.push(
        `Unexpected component token factory export in ${plan.tokenFactoryBarrelFile}`
      );
    }

    for (const target of plan.tokenThemeTargets) {
      if (fs.existsSync(target.componentFile)) {
        errors.push(`Unexpected component token theme file: ${target.componentFile}`);
      }

      const barrel = fs.existsSync(target.barrelFile)
        ? fs.readFileSync(target.barrelFile, 'utf8')
        : '';

      if (barrel.includes(expectedThemeExport)) {
        errors.push(`Unexpected component token export in ${target.barrelFile}`);
      }
    }
  } else {
    if (!fs.existsSync(plan.tokenFactoryFile)) {
      errors.push(`Missing component token factory: ${plan.tokenFactoryFile}`);
    }

    if (!factoryBarrel.includes(expectedFactoryExport)) {
      errors.push(
        `Missing component token factory export in ${plan.tokenFactoryBarrelFile}`
      );
    }

    for (const target of plan.tokenThemeTargets) {
      if (!fs.existsSync(target.componentFile)) {
        errors.push(`Missing component token theme file: ${target.componentFile}`);
      }

      const barrel = fs.existsSync(target.barrelFile)
        ? fs.readFileSync(target.barrelFile, 'utf8')
        : '';

      if (!barrel.includes(expectedThemeExport)) {
        errors.push(`Missing component token export in ${target.barrelFile}`);
      }
    }
  }

  return {
    name: 'component-tokens',
    ok: errors.length === 0,
    ...(errors.length > 0 ? { details: errors.join('\n') } : {}),
  };
}
'''

checker = replace_once(
    checker,
    "\nexport function checkComponentCompleteness(params: {",
    f"\n{helpers}\nexport function checkComponentCompleteness(params: {{",
    "checker helpers",
)

checker = replace_once(
    checker,
    "  const { root, metadata } = params;\n  const checks: ComponentCheckResult[] = [];\n\n  for (const platform of metadata.platforms) {",
    "  const { root, metadata } = params;\n  const checks: ComponentCheckResult[] = [];\n  const plan = createCompletenessGenerationPlan({ root, metadata });\n\n  checks.push(checkMetadataRegistration(plan));\n  checks.push(checkTypeOwnership({ plan, metadata }));\n  checks.push(checkProductionAuthorities(plan));\n\n  if (metadata.requirements.componentTokens !== undefined) {\n    checks.push(checkComponentTokenStructure(plan));\n  }\n\n  for (const platform of metadata.platforms) {",
    "checker authority integration",
)

# Keep the legacy `tokens` check name but make it consume the canonical token registry parser.
old_token_start = checker.index("function checkTokenRequirements(params: {")
old_token_end = len(checker)
old_token_function = checker[old_token_start:old_token_end]
new_token_function = r'''function checkTokenRequirements(params: {
  root: string;
  requiredTokens: readonly string[];
}): ComponentCheckResult {
  const { root, requiredTokens } = params;

  if (requiredTokens.length === 0) {
    return {
      name: 'tokens',
      ok: true,
    };
  }

  const tokenPaths = canonicalTokenPaths(root);

  if (!tokenPaths) {
    return {
      name: 'tokens',
      ok: false,
      details: `Missing generated token registry: ${canonicalTokenRegistryPath(root)}`,
    };
  }

  const missingTokens = requiredTokens.filter((token) => !tokenPaths.has(token));

  if (missingTokens.length > 0) {
    return {
      name: 'tokens',
      ok: false,
      details: `Missing required tokens: ${missingTokens.join(', ')}`,
    };
  }

  return {
    name: 'tokens',
    ok: true,
  };
}
'''
checker = checker[:old_token_start] + new_token_function
write(checker_path, checker)


# 4. Add structural-authority regression fixtures and cases.
test_path = "scripts/checks/component-completeness/check-component.test.ts"
test = read(test_path)

metadata_fixture_helper = r'''
function createMetadataRegistrationFixture(params: {
  root: string;
  componentName: string;
}) {
  const { root, componentName } = params;
  const metadataDir = path.join(root, 'packages', 'metadata', 'src', 'components');
  const metadataFile = path.join(metadataDir, `${componentName}.metadata.ts`);
  const registryFile = path.join(metadataDir, 'index.ts');
  const metadataName = `${componentName[0].toLowerCase()}${componentName.slice(1)}Metadata`;
  const importLine = `import { ${metadataName} } from './${componentName}.metadata';`;

  fs.mkdirSync(metadataDir, { recursive: true });
  fs.writeFileSync(metadataFile, `export const ${metadataName} = {};\n`);

  if (!fs.existsSync(registryFile)) {
    fs.writeFileSync(
      registryFile,
      `${importLine}\n\nexport const componentMetadata = [\n  ${metadataName},\n] as const;\n`
    );
    return;
  }

  let registry = fs.readFileSync(registryFile, 'utf8');

  if (!registry.includes(importLine)) {
    registry = `${importLine}\n${registry}`;
    registry = registry.replace(
      'export const componentMetadata = [\n',
      `export const componentMetadata = [\n  ${metadataName},\n`
    );
    fs.writeFileSync(registryFile, registry);
  }
}

function createCanonicalPackageFixture(params: {
  root: string;
  packageName: string;
}) {
  const packageDir = params.packageName.replace('@vellira-ui/', '');
  const packageRoot = path.join(params.root, 'packages', packageDir);
  fs.mkdirSync(packageRoot, { recursive: true });
  fs.writeFileSync(
    path.join(packageRoot, 'package.json'),
    `${JSON.stringify({ name: params.packageName })}\n`
  );
}

function createComponentDependencyMetadataFixture(params: {
  root: string;
  componentName: string;
  platforms: readonly ('react' | 'react-native')[];
}) {
  const metadataDir = path.join(
    params.root,
    'packages',
    'metadata',
    'src',
    'components'
  );
  fs.mkdirSync(metadataDir, { recursive: true });
  fs.writeFileSync(
    path.join(metadataDir, `${params.componentName}.metadata.ts`),
    `import { defineComponentMetadata } from '../defineComponentMetadata';\n\nexport const dependencyMetadata = defineComponentMetadata({\n  name: '${params.componentName}',\n  platforms: [${params.platforms.map((platform) => `'${platform}'`).join(', ')}],\n});\n`
  );
}

function createComponentTokenStructureFixture(params: {
  root: string;
  componentName: string;
}) {
  const lowerName = `${params.componentName[0].toLowerCase()}${params.componentName.slice(1)}`;
  const factoriesDir = path.join(params.root, 'packages', 'tokens', 'src', 'factories');
  fs.mkdirSync(factoriesDir, { recursive: true });
  fs.writeFileSync(path.join(factoriesDir, `create${params.componentName}Tokens.ts`), '');
  fs.writeFileSync(
    path.join(factoriesDir, 'index.ts'),
    `export * from './create${params.componentName}Tokens';\n`
  );

  for (const theme of ['light', 'dark', 'highContrast']) {
    const themeDir = path.join(
      params.root,
      'packages',
      'tokens',
      'src',
      theme,
      'components'
    );
    fs.mkdirSync(themeDir, { recursive: true });
    fs.writeFileSync(path.join(themeDir, `${lowerName}.ts`), '');
    fs.writeFileSync(
      path.join(themeDir, 'index.ts'),
      `export * from './${lowerName}';\n`
    );
  }
}
'''

test = replace_once(
    test,
    "\nfunction createComponentFixture(params: {",
    f"\n{metadata_fixture_helper}\nfunction createComponentFixture(params: {{",
    "test metadata fixture helpers",
)

test = replace_once(
    test,
    "  fs.writeFileSync(\n    path.join(layerDir, 'index.ts'),\n    `export * from './${componentName}';\n`\n  );\n\n  return componentDir;",
    "  fs.writeFileSync(\n    path.join(layerDir, 'index.ts'),\n    `export * from './${componentName}';\n`\n  );\n\n  createMetadataRegistrationFixture({ root, componentName });\n\n  return componentDir;",
    "component fixture metadata registration",
)

new_tests = r'''

  it('reports missing canonical metadata registration', () => {
    const root = createTempRoot();

    createComponentFixture({
      root,
      packageName: 'react',
      layer: 'primitives',
      componentName: 'Avatar',
    });

    fs.writeFileSync(
      path.join(root, 'packages', 'metadata', 'src', 'components', 'index.ts'),
      'export const componentMetadata = [] as const;\n'
    );

    const metadata: ComponentMetadata = {
      name: 'Avatar',
      layer: 'primitives',
      category: 'data-display',
      platforms: ['react'],
      profile: 'base',
      status: 'experimental',
      requirements: {
        tests: false,
        storybook: false,
        docs: false,
        accessibility: false,
      },
    };

    const result = checkComponentCompleteness({ root, metadata });

    expect(result.ready).toBe(false);
    expect(result.checks).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          name: 'metadata',
          ok: false,
        }),
      ])
    );
  });

  it('enforces shared type ownership through the canonical generator plan', () => {
    const root = createTempRoot();

    for (const packageName of ['react', 'react-native'] as const) {
      const componentDir = createComponentFixture({
        root,
        packageName,
        layer: 'components',
        componentName: 'Disclosure',
      });

      fs.writeFileSync(
        path.join(componentDir, 'types.ts'),
        "import type { BaseDisclosureProps } from '@vellira-ui/types';\nexport type DisclosureProps = BaseDisclosureProps;\n"
      );
    }

    createCanonicalPackageFixture({
      root,
      packageName: '@vellira-ui/types',
    });

    const sharedTypesDir = path.join(root, 'packages', 'types', 'src');
    fs.mkdirSync(sharedTypesDir, { recursive: true });
    fs.writeFileSync(
      path.join(sharedTypesDir, 'disclosure.ts'),
      'export interface BaseDisclosureProps {}\n'
    );
    fs.writeFileSync(
      path.join(sharedTypesDir, 'index.ts'),
      "export * from './disclosure';\n"
    );

    const metadata: ComponentMetadata = {
      name: 'Disclosure',
      layer: 'components',
      category: 'navigation',
      platforms: ['react', 'react-native'],
      profile: 'compound',
      status: 'experimental',
      capabilities: ['compound-api', 'controlled', 'uncontrolled'],
      dependencies: {
        packages: ['@vellira-ui/types'],
      },
      requirements: {
        tests: false,
        storybook: false,
        docs: false,
        accessibility: false,
      },
    };

    expect(
      checkComponentCompleteness({ root, metadata }).checks.find(
        (check) => check.name === 'type-ownership'
      )
    ).toMatchObject({ ok: true });

    fs.rmSync(path.join(sharedTypesDir, 'disclosure.ts'));

    expect(
      checkComponentCompleteness({ root, metadata }).checks.find(
        (check) => check.name === 'type-ownership'
      )
    ).toMatchObject({ ok: false });
  });

  it('reuses generator authority validation for dependency renderer availability', () => {
    const root = createTempRoot();

    createComponentFixture({
      root,
      packageName: 'react',
      layer: 'components',
      componentName: 'Dialog',
    });
    createComponentFixture({
      root,
      packageName: 'react-native',
      layer: 'components',
      componentName: 'Dialog',
    });
    createComponentDependencyMetadataFixture({
      root,
      componentName: 'Tooltip',
      platforms: ['react'],
    });

    const metadata: ComponentMetadata = {
      name: 'Dialog',
      layer: 'components',
      category: 'overlay',
      platforms: ['react', 'react-native'],
      profile: 'base',
      status: 'experimental',
      dependencies: {
        components: ['Tooltip'],
      },
      requirements: {
        tests: false,
        storybook: false,
        docs: false,
        accessibility: false,
      },
    };

    const authority = checkComponentCompleteness({ root, metadata }).checks.find(
      (check) => check.name === 'production-authorities'
    );

    expect(authority).toMatchObject({ ok: false });
    expect(authority?.details).toContain(
      'unsupported-component-dependency-platform'
    );
    expect(authority?.details).toContain('requiredPlatform="react-native"');
  });

  it('validates declared canonical icons, assets and tokens through shared authorities', () => {
    const root = createTempRoot();

    createComponentFixture({
      root,
      packageName: 'react',
      layer: 'primitives',
      componentName: 'Avatar',
    });
    createTokenRegistryFixture({
      root,
      tokens: ['semantic.text.primary'],
    });

    const iconDir = path.join(root, 'packages', 'icons', 'src');
    fs.mkdirSync(iconDir, { recursive: true });
    fs.writeFileSync(
      path.join(iconDir, 'web.source.ts'),
      "export { default as Search } from './Search';\n"
    );

    const assetDir = path.join(root, 'packages', 'assets', 'brand');
    fs.mkdirSync(assetDir, { recursive: true });
    fs.writeFileSync(path.join(assetDir, 'avatar.svg'), '<svg />');

    const metadata: ComponentMetadata = {
      name: 'Avatar',
      layer: 'primitives',
      category: 'data-display',
      platforms: ['react'],
      profile: 'base',
      status: 'experimental',
      requirements: {
        tests: false,
        storybook: false,
        docs: false,
        accessibility: false,
        tokens: ['semantic.text.primary'],
        icons: [{ name: 'Search', purpose: 'search affordance' }],
        assets: [{ path: 'brand/avatar.svg', purpose: 'avatar fallback' }],
      },
    };

    const result = checkComponentCompleteness({ root, metadata });

    expect(
      result.checks.find((check) => check.name === 'production-authorities')
    ).toMatchObject({ ok: true });
    expect(result.checks.find((check) => check.name === 'tokens')).toMatchObject({
      ok: true,
    });
  });

  it('checks explicit component-token structure without duplicating token semantics', () => {
    const root = createTempRoot();

    createComponentFixture({
      root,
      packageName: 'react',
      layer: 'primitives',
      componentName: 'Avatar',
    });
    createComponentTokenStructureFixture({
      root,
      componentName: 'Avatar',
    });

    const metadata: ComponentMetadata = {
      name: 'Avatar',
      layer: 'primitives',
      category: 'data-display',
      platforms: ['react'],
      profile: 'base',
      status: 'experimental',
      requirements: {
        tests: false,
        storybook: false,
        docs: false,
        accessibility: false,
        componentTokens: 'standard',
      },
    };

    expect(
      checkComponentCompleteness({ root, metadata }).checks.find(
        (check) => check.name === 'component-tokens'
      )
    ).toMatchObject({ ok: true });

    fs.rmSync(
      path.join(
        root,
        'packages',
        'tokens',
        'src',
        'dark',
        'components',
        'avatar.ts'
      )
    );

    expect(
      checkComponentCompleteness({ root, metadata }).checks.find(
        (check) => check.name === 'component-tokens'
      )
    ).toMatchObject({ ok: false });
  });
'''

end_anchor = "\n});"
last = test.rfind(end_anchor)
if last == -1:
    raise SystemExit("test append: describe closing anchor not found")
test = test[:last] + new_tests + test[last:]
write(test_path, test)
