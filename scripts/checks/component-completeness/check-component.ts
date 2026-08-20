import fs from 'node:fs';
import path from 'node:path';

import type {
  ComponentMetadata,
  ComponentPlatform,
} from '@vellira-ui/metadata';

import { checkTestCoverageContract } from './check-test-coverage';
import type {
  ComponentCheckResult,
  ComponentCompletenessResult,
} from './types';

function checkFile(
  filePath: string,
  name: ComponentCheckResult['name'],
  platform?: ComponentPlatform
): ComponentCheckResult {
  return {
    name,
    platform,
    ok: fs.existsSync(filePath),
    details: fs.existsSync(filePath) ? undefined : `Missing file: ${filePath}`,
  };
}

function checkExports(params: {
  componentDir: string;
  layerBarrelFile: string;
  componentName: string;
  platform: ComponentPlatform;
}): ComponentCheckResult {
  const { componentDir, layerBarrelFile, componentName, platform } = params;

  const localIndexFile = path.join(componentDir, 'index.ts');

  if (!fs.existsSync(localIndexFile)) {
    return {
      name: 'exports',
      platform,
      ok: false,
      details: `Missing local export file: ${localIndexFile}`,
    };
  }

  if (!fs.existsSync(layerBarrelFile)) {
    return {
      name: 'exports',
      platform,
      ok: false,
      details: `Missing layer barrel file: ${layerBarrelFile}`,
    };
  }

  const localIndex = fs.readFileSync(localIndexFile, 'utf8');
  const layerBarrel = fs.readFileSync(layerBarrelFile, 'utf8');

  const exportsComponent =
    localIndex.includes(`export * from './${componentName}'`) ||
    localIndex.includes(
      `export { ${componentName} } from './${componentName}'`
    );

  if (!exportsComponent) {
    return {
      name: 'exports',
      ok: false,
      platform,
      details: `Missing component export in ${localIndexFile}`,
    };
  }

  const exportsTypes =
    localIndex.includes("export type * from './types'") ||
    localIndex.includes("export * from './types'") ||
    localIndex.includes("from './types'");

  if (!exportsTypes) {
    return {
      name: 'exports',
      ok: false,
      platform,
      details: `Missing public types export in ${localIndexFile}`,
    };
  }

  const layerExport = `export * from './${componentName}';`;

  if (!layerBarrel.includes(layerExport)) {
    return {
      name: 'exports',
      ok: false,
      platform,
      details: `Missing package export in ${layerBarrelFile}`,
    };
  }

  return {
    name: 'exports',
    platform,
    ok: true,
  };
}

export function checkComponentCompleteness(params: {
  root: string;
  metadata: ComponentMetadata;
}): ComponentCompletenessResult {
  const { root, metadata } = params;
  const checks: ComponentCheckResult[] = [];

  for (const platform of metadata.platforms) {
    const packageName = platform === 'react' ? 'react' : 'react-native';

    const componentDir = path.join(
      root,
      'packages',
      packageName,
      'src',
      metadata.layer,
      metadata.name
    );

    const layerBarrelFile = path.join(
      root,
      'packages',
      packageName,
      'src',
      metadata.layer,
      'index.ts'
    );

    checks.push(
      checkFile(
        path.join(componentDir, `${metadata.name}.tsx`),
        'implementation',
        platform
      )
    );

    checks.push(
      checkFile(path.join(componentDir, 'types.ts'), 'types', platform)
    );

    checks.push(
      checkExports({
        componentDir,
        layerBarrelFile,
        componentName: metadata.name,
        platform,
      })
    );

    if (metadata.requirements.tests) {
      const testFile = path.join(componentDir, `${metadata.name}.test.tsx`);
      const contractFile = path.join(
        componentDir,
        `${metadata.name}.test-contract.json`
      );

      checks.push(
        fs.existsSync(contractFile)
          ? checkTestCoverageContract({
              contractFile,
              testFile,
              metadata,
              platform,
            })
          : checkFile(testFile, 'tests', platform)
      );
    }

    if (metadata.requirements.storybook) {
      checks.push(
        checkFile(
          path.join(componentDir, `${metadata.name}.stories.tsx`),
          'storybook',
          platform
        )
      );
    }
  }

  if (metadata.requirements.docs) {
    checks.push(
      checkWebsiteDocumentation({
        root,
        componentName: metadata.name,
      })
    );

    checks.push(
      checkApiDocumentation({
        root,
        componentName: metadata.name,
        platforms: metadata.platforms,
      })
    );
  }

  if (metadata.requirements.accessibility) {
    checks.push(
      checkAccessibilityDocumentation({
        root,
        componentName: metadata.name,
      })
    );
  }

  if (metadata.requirements.tokens?.length) {
    checks.push(
      checkTokenRequirements({
        root,
        requiredTokens: metadata.requirements.tokens,
      })
    );
  }

  return {
    componentName: metadata.name,
    ready: checks.every((check) => check.ok),
    checks,
  };
}

function componentNameToSlug(componentName: string) {
  return componentName.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
}

function checkWebsiteDocumentation(params: {
  root: string;
  componentName: string;
}): ComponentCheckResult {
  const { root, componentName } = params;

  const slug = componentNameToSlug(componentName);

  const componentsRegistryFile = path.join(
    root,
    'apps',
    'website',
    'src',
    'component-catalog',
    'registry',
    'components.ts'
  );

  const componentPagesRegistryFile = path.join(
    root,
    'apps',
    'website',
    'src',
    'component-catalog',
    'registry',
    'componentPages.ts'
  );

  if (!fs.existsSync(componentsRegistryFile)) {
    return {
      name: 'website',
      ok: false,
      details: `Missing website component registry: ${componentsRegistryFile}`,
    };
  }

  if (!fs.existsSync(componentPagesRegistryFile)) {
    return {
      name: 'website',
      ok: false,
      details: `Missing website component pages registry: ${componentPagesRegistryFile}`,
    };
  }

  const componentsRegistry = fs.readFileSync(componentsRegistryFile, 'utf8');
  const componentPagesRegistry = fs.readFileSync(
    componentPagesRegistryFile,
    'utf8'
  );

  const catalogEntry = `slug: '${slug}'`;
  const quotedPageEntry = `'${slug}':`;
  const plainPageEntry = `${slug}:`;

  if (!componentsRegistry.includes(catalogEntry)) {
    return {
      name: 'website',
      ok: false,
      details: `Missing "${slug}" in website component catalog.`,
    };
  }

  if (
    !componentPagesRegistry.includes(quotedPageEntry) &&
    !componentPagesRegistry.includes(plainPageEntry)
  ) {
    return {
      name: 'website',
      ok: false,
      details: `Missing "${slug}" in website component pages registry.`,
    };
  }

  return {
    name: 'website',
    ok: true,
  };
}

function checkApiDocumentation(params: {
  root: string;
  componentName: string;
  platforms: readonly ('react' | 'react-native')[];
}): ComponentCheckResult {
  const { root, componentName, platforms } = params;

  const slug = componentNameToSlug(componentName);

  const componentPagesRegistryFile = path.join(
    root,
    'apps',
    'website',
    'src',
    'component-catalog',
    'registry',
    'componentPages.ts'
  );

  if (!fs.existsSync(componentPagesRegistryFile)) {
    return {
      name: 'api-docs',
      ok: false,
      details: `Missing website component pages registry: ${componentPagesRegistryFile}`,
    };
  }

  const content = fs.readFileSync(componentPagesRegistryFile, 'utf8');

  const quotedPageEntry = `'${slug}':`;
  const plainPageEntry = `${slug}:`;

  const pageStart = content.includes(quotedPageEntry)
    ? content.indexOf(quotedPageEntry)
    : content.indexOf(plainPageEntry);

  if (pageStart === -1) {
    return {
      name: 'api-docs',
      ok: false,
      details: `Missing "${slug}" component page registration.`,
    };
  }

  const nextEntryMatch = content
    .slice(pageStart + 1)
    .match(/\n\s{2}(?:'[^']+'|[a-zA-Z0-9-]+):\s*{/);

  const pageBlock =
    nextEntryMatch?.index !== undefined
      ? content.slice(pageStart, pageStart + 1 + nextEntryMatch.index)
      : content.slice(pageStart);

  if (!pageBlock.includes('api:')) {
    return {
      name: 'api-docs',
      ok: false,
      details: `Missing API documentation for "${slug}".`,
    };
  }

  for (const platform of platforms) {
    const platformKey =
      platform === 'react-native' ? `'react-native':` : 'react:';

    if (!pageBlock.includes(platformKey)) {
      return {
        name: 'api-docs',
        ok: false,
        details: `Missing ${platform} API documentation for "${slug}".`,
      };
    }
  }

  return {
    name: 'api-docs',
    ok: true,
  };
}

function checkAccessibilityDocumentation(params: {
  root: string;
  componentName: string;
}): ComponentCheckResult {
  const { root, componentName } = params;

  const slug = componentNameToSlug(componentName);

  const componentPagesRegistryFile = path.join(
    root,
    'apps',
    'website',
    'src',
    'component-catalog',
    'registry',
    'componentPages.ts'
  );

  if (!fs.existsSync(componentPagesRegistryFile)) {
    return {
      name: 'accessibility',
      ok: false,
      details: `Missing website component pages registry: ${componentPagesRegistryFile}`,
    };
  }

  const content = fs.readFileSync(componentPagesRegistryFile, 'utf8');

  const quotedPageEntry = `'${slug}':`;
  const plainPageEntry = `${slug}:`;

  const pageStart = content.includes(quotedPageEntry)
    ? content.indexOf(quotedPageEntry)
    : content.indexOf(plainPageEntry);

  if (pageStart === -1) {
    return {
      name: 'accessibility',
      ok: false,
      details: `Missing "${slug}" component page registration.`,
    };
  }

  const nextEntryMatch = content
    .slice(pageStart + 1)
    .match(/\n\s{2}(?:'[^']+'|[a-zA-Z0-9-]+):\s*{/);

  const pageBlock =
    nextEntryMatch?.index !== undefined
      ? content.slice(pageStart, pageStart + 1 + nextEntryMatch.index)
      : content.slice(pageStart);

  if (!pageBlock.includes('Accessibility:')) {
    return {
      name: 'accessibility',
      ok: false,
      details: `Missing accessibility documentation for "${slug}".`,
    };
  }

  return {
    name: 'accessibility',
    ok: true,
  };
}

function checkTokenRequirements(params: {
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

  const tokenTypesFile = path.join(
    root,
    'packages',
    'tokens',
    'src',
    'generated',
    'token-types.ts'
  );

  if (!fs.existsSync(tokenTypesFile)) {
    return {
      name: 'tokens',
      ok: false,
      details: `Missing generated token registry: ${tokenTypesFile}`,
    };
  }

  const content = fs.readFileSync(tokenTypesFile, 'utf8');

  const missingTokens = requiredTokens.filter(
    (token) => !content.includes(`'${token}'`)
  );

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
