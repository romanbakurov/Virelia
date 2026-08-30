import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import {
  createComponentDocsContractFromPlan,
  createComponentMetadataFromPlan,
  getComponentDocsTargets,
} from './docs';
import { runComponentGenerator } from './run';
import { generateComponentWebsitePage } from './website';
import { checkGeneratedComponentDocsCompleteness } from '../../checks/component-completeness/check-generated-component-docs';
import { checkComponentCompleteness } from '../../checks/component-completeness/check-component';
import { validateComponentDocs } from '../../../apps/docs/src/component-docs';
import type { ComponentMetadata } from '@vellira-ui/metadata';

vi.mock('./website', () => ({
  generateComponentWebsitePage: vi.fn(),
}));

const tempRoots: string[] = [];

function createTempRoot() {
  const root = fs.mkdtempSync(
    path.join(os.tmpdir(), 'vellira-component-generator-run-')
  );

  tempRoots.push(root);

  return root;
}

function createRequiredRepositoryStructure(
  root: string,
  layer: 'primitives' | 'components' | 'patterns' = 'primitives'
) {
  for (const packageName of ['react', 'react-native']) {
    const layerDir = path.join(root, 'packages', packageName, 'src', layer);

    fs.mkdirSync(layerDir, { recursive: true });
    fs.writeFileSync(path.join(layerDir, 'index.ts'), '');
    fs.writeFileSync(path.join(root, 'packages', packageName, 'API.md'), '');
  }

  const metadataDir = path.join(
    root,
    'packages',
    'metadata',
    'src',
    'components'
  );

  fs.mkdirSync(metadataDir, { recursive: true });
  fs.writeFileSync(
    path.join(metadataDir, 'index.ts'),
    `export const componentMetadata = [
] as const;
`
  );

  const docsContractDir = path.join(
    root,
    'apps',
    'docs',
    'src',
    'component-docs'
  );

  fs.mkdirSync(docsContractDir, { recursive: true });
  fs.writeFileSync(
    path.join(docsContractDir, 'index.ts'),
    `export const componentDocsContracts = [
] as const;
`
  );

  fs.mkdirSync(path.join(root, 'apps', 'docs', 'src', 'react'), {
    recursive: true,
  });
  fs.mkdirSync(path.join(root, 'apps', 'docs', 'src', 'react-native'), {
    recursive: true,
  });
  fs.mkdirSync(path.join(root, 'apps', 'docs', 'src', '.vitepress'), {
    recursive: true,
  });
  fs.writeFileSync(
    path.join(root, 'apps', 'docs', 'src', '.vitepress', 'config.ts'),
    '// vitepress config sentinel\n'
  );
}

function readFile(filePath: string) {
  return fs.readFileSync(filePath, 'utf8');
}

function countOccurrences(source: string, pattern: RegExp) {
  return source.match(pattern)?.length ?? 0;
}

beforeEach(() => {
  vi.mocked(generateComponentWebsitePage).mockClear();
});

afterEach(() => {
  for (const root of tempRoots.splice(0)) {
    fs.rmSync(root, {
      recursive: true,
      force: true,
    });
  }
});

describe('component generator', () => {
  it('generates a complete cross-platform component scaffold', async () => {
    const root = createTempRoot();

    createRequiredRepositoryStructure(root);

    const result = await runComponentGenerator({
      root,
      options: {
        componentName: 'Avatar',
        platform: 'both',
        layer: 'primitives',
        category: 'data-display',
        profile: 'base',
        parts: [],
        force: false,
      },
    });

    expect(result.createdFiles).toHaveLength(22);

    expect(generateComponentWebsitePage).toHaveBeenCalledTimes(1);
    expect(generateComponentWebsitePage).toHaveBeenCalledWith({
      root,
      componentName: 'Avatar',
    });

    const webDir = path.join(root, 'packages/react/src/primitives/Avatar');

    const nativeDir = path.join(
      root,
      'packages/react-native/src/primitives/Avatar'
    );

    for (const file of [
      'Avatar.tsx',
      'Avatar.module.scss',
      'Avatar.test.tsx',
      'Avatar.stories.tsx',
      'types.ts',
      'index.ts',
    ]) {
      expect(fs.existsSync(path.join(webDir, file))).toBe(true);
    }

    for (const file of [
      'Avatar.tsx',
      'Avatar.styles.ts',
      'Avatar.test.tsx',
      'Avatar.stories.tsx',
      'types.ts',
      'index.ts',
    ]) {
      expect(fs.existsSync(path.join(nativeDir, file))).toBe(true);
    }

    expect(fs.existsSync(result.plan.metadataFile)).toBe(true);
    expect(fs.existsSync(result.plan.tokenFactoryFile)).toBe(true);
    expect(fs.existsSync(result.plan.docsContractFile)).toBe(true);

    for (const tokenTarget of result.plan.tokenThemeTargets) {
      expect(fs.existsSync(tokenTarget.componentFile)).toBe(true);
    }

    expect(fs.readFileSync(result.plan.metadataFile, 'utf8')).toContain(
      "name: 'Avatar'"
    );

    expect(fs.readFileSync(result.plan.metadataFile, 'utf8')).toContain(
      "status: 'experimental'"
    );

    expect(
      fs.readFileSync(
        path.join(root, 'packages/react/src/primitives/index.ts'),
        'utf8'
      )
    ).toContain("export * from './Avatar';");

    expect(
      fs.readFileSync(
        path.join(root, 'packages/react-native/src/primitives/index.ts'),
        'utf8'
      )
    ).toContain("export * from './Avatar';");

    const metadataRegistry = fs.readFileSync(
      result.plan.metadataBarrelFile,
      'utf8'
    );

    expect(metadataRegistry).toContain(
      "import { avatarMetadata } from './Avatar.metadata';"
    );

    expect(metadataRegistry).toContain('export const componentMetadata = [');

    expect(metadataRegistry).toContain('  avatarMetadata,');

    const docsContractRegistry = readFile(result.plan.docsContractRegistryFile);

    expect(docsContractRegistry).toContain(
      "import { avatarDocs } from './Avatar.docs';"
    );
    expect(docsContractRegistry).toContain('  avatarDocs,');

    const docsContract = readFile(result.plan.docsContractFile);

    expect(docsContract).toContain('component: "Avatar"');
    expect(docsContract).toContain('"react"');
    expect(docsContract).toContain('"react-native"');
    expect(docsContract).toContain("story: 'Default'");
    expect(docsContract).toContain('title: "Primitives/Avatar"');

    for (const target of getComponentDocsTargets(result.plan)) {
      expect(fs.existsSync(target.docsFile)).toBe(true);
      expect(readFile(target.docsFile)).toContain(
        'Generated by scripts/generators/component-docs/generate-component-docs.ts'
      );
    }
  });

  it('preserves and normalizes an existing populated docs contract registry', async () => {
    const root = createTempRoot();

    createRequiredRepositoryStructure(root);

    const docsContractRegistryFile = path.join(
      root,
      'apps',
      'docs',
      'src',
      'component-docs',
      'index.ts'
    );

    fs.writeFileSync(
      docsContractRegistryFile,
      `import { switchDocs } from './Switch.docs';

export const componentDocsContracts = [switchDocs] as const;

export { switchDocs };
`
    );

    await runComponentGenerator({
      root,
      options: {
        componentName: 'Avatar',
        platform: 'both',
        layer: 'primitives',
        category: 'data-display',
        profile: 'base',
        parts: [],
        force: false,
      },
    });

    expect(readFile(docsContractRegistryFile)).toBe(
      `import { switchDocs } from './Switch.docs';
import { avatarDocs } from './Avatar.docs';

export const componentDocsContracts = [
  switchDocs,
  avatarDocs,
] as const;

export { switchDocs };
`
    );
  });

  it('rejects a repeated run without --force', async () => {
    const root = createTempRoot();

    createRequiredRepositoryStructure(root);

    const options = {
      componentName: 'Avatar',
      platform: 'both',
      layer: 'primitives',
      category: 'data-display',
      profile: 'base',
      parts: [],
      force: false,
    } as const;

    await runComponentGenerator({
      root,
      options,
    });

    await expect(
      runComponentGenerator({
        root,
        options,
      })
    ).rejects.toThrow('Use --force to overwrite existing component files.');
  });

  it('supports an explicit force overwrite without duplicating exports', async () => {
    const root = createTempRoot();

    createRequiredRepositoryStructure(root);

    await runComponentGenerator({
      root,
      options: {
        componentName: 'Avatar',
        platform: 'both',
        layer: 'primitives',
        category: 'data-display',
        profile: 'base',
        parts: [],
        force: false,
      },
    });

    const result = await runComponentGenerator({
      root,
      options: {
        componentName: 'Avatar',
        platform: 'both',
        layer: 'primitives',
        category: 'data-display',
        profile: 'base',
        parts: [],
        force: true,
      },
    });

    const webBarrel = fs.readFileSync(
      path.join(root, 'packages/react/src/primitives/index.ts'),
      'utf8'
    );

    const nativeBarrel = fs.readFileSync(
      path.join(root, 'packages/react-native/src/primitives/index.ts'),
      'utf8'
    );

    const metadataBarrel = fs.readFileSync(
      result.plan.metadataBarrelFile,
      'utf8'
    );

    expect(webBarrel.match(/export \* from '\.\/Avatar';/g)).toHaveLength(1);

    expect(nativeBarrel.match(/export \* from '\.\/Avatar';/g)).toHaveLength(1);

    expect(
      metadataBarrel.match(
        /import \{ avatarMetadata \} from '\.\/Avatar\.metadata';/g
      )
    ).toHaveLength(1);

    expect(metadataBarrel.match(/ {2}avatarMetadata,/g)).toHaveLength(1);

    const tokenFactoryBarrel = fs.readFileSync(
      result.plan.tokenFactoryBarrelFile,
      'utf8'
    );

    expect(
      tokenFactoryBarrel.match(/export \* from '\.\/createAvatarTokens\.js';/g)
    ).toHaveLength(1);

    for (const tokenTarget of result.plan.tokenThemeTargets) {
      const tokenBarrel = fs.readFileSync(tokenTarget.barrelFile, 'utf8');

      expect(
        tokenBarrel.match(
          /export \{ avatarTokens as avatar \} from '\.\/avatar\.js';/g
        )
      ).toHaveLength(1);
    }

    const docsContractRegistry = readFile(result.plan.docsContractRegistryFile);

    expect(
      countOccurrences(
        docsContractRegistry,
        /import \{ avatarDocs \} from '\.\/Avatar\.docs';/g
      )
    ).toBe(1);
    expect(countOccurrences(docsContractRegistry, / {2}avatarDocs,/g)).toBe(1);
  });

  it('plans and generates only React documentation for React-only components', async () => {
    const root = createTempRoot();

    createRequiredRepositoryStructure(root);

    const result = await runComponentGenerator({
      root,
      options: {
        componentName: 'Avatar',
        platform: 'web',
        layer: 'primitives',
        category: 'data-display',
        profile: 'base',
        parts: [],
        force: false,
      },
    });

    const docsTargets = getComponentDocsTargets(result.plan);

    expect(docsTargets.map((target) => target.platform)).toEqual(['react']);
    expect(
      fs.existsSync(path.join(root, 'apps/docs/src/react/avatar.md'))
    ).toBe(true);
    expect(
      fs.existsSync(path.join(root, 'apps/docs/src/react-native/avatar.md'))
    ).toBe(false);
    expect(readFile(result.plan.docsContractFile)).toContain('"react"');
    expect(readFile(result.plan.docsContractFile)).not.toContain(
      '"react-native"'
    );
  });

  it('plans and generates only React Native documentation for React Native-only components', async () => {
    const root = createTempRoot();

    createRequiredRepositoryStructure(root);

    const result = await runComponentGenerator({
      root,
      options: {
        componentName: 'Avatar',
        platform: 'native',
        layer: 'primitives',
        category: 'data-display',
        profile: 'base',
        parts: [],
        force: false,
      },
    });

    const docsTargets = getComponentDocsTargets(result.plan);

    expect(docsTargets.map((target) => target.platform)).toEqual([
      'react-native',
    ]);
    expect(
      fs.existsSync(path.join(root, 'apps/docs/src/react/avatar.md'))
    ).toBe(false);
    expect(
      fs.existsSync(path.join(root, 'apps/docs/src/react-native/avatar.md'))
    ).toBe(true);
    expect(readFile(result.plan.docsContractFile)).not.toContain('"react"');
    expect(readFile(result.plan.docsContractFile)).toContain('"react-native"');
  });

  it('generates platform-specific overlay scaffolds through the full pipeline', async () => {
    const root = createTempRoot();

    createRequiredRepositoryStructure(root, 'components');

    const result = await runComponentGenerator({
      root,
      options: {
        componentName: 'Dialog',
        platform: 'both',
        layer: 'components',
        category: 'overlay',
        profile: 'overlay',
        parts: ['Root', 'Trigger', 'Content'],
        force: false,
      },
    });

    expect(result.createdFiles.length).toBeGreaterThan(0);

    const webComponent = fs.readFileSync(
      path.join(root, 'packages/react/src/components/Dialog/Dialog.tsx'),
      'utf8'
    );

    const nativeComponent = fs.readFileSync(
      path.join(root, 'packages/react-native/src/components/Dialog/Dialog.tsx'),
      'utf8'
    );

    expect(webComponent).toContain(
      'export const Dialog = Object.assign(DialogRoot, {'
    );
    expect(webComponent).toContain('Trigger: DialogTrigger');
    expect(webComponent).toContain('Content: DialogContent');

    expect(nativeComponent).toContain(
      'export const Dialog = Object.assign(DialogRoot, {'
    );
    expect(nativeComponent).toContain('Trigger: DialogTrigger');
    expect(nativeComponent).toContain('Content: DialogContent');

    const webTrigger = fs.readFileSync(
      path.join(
        root,
        'packages/react/src/components/Dialog/Trigger/DialogTrigger.tsx'
      ),
      'utf8'
    );

    const nativeTrigger = fs.readFileSync(
      path.join(
        root,
        'packages/react-native/src/components/Dialog/Trigger/DialogTrigger.tsx'
      ),
      'utf8'
    );

    const webContent = fs.readFileSync(
      path.join(
        root,
        'packages/react/src/components/Dialog/Content/DialogContent.tsx'
      ),
      'utf8'
    );

    const nativeContent = fs.readFileSync(
      path.join(
        root,
        'packages/react-native/src/components/Dialog/Content/DialogContent.tsx'
      ),
      'utf8'
    );

    expect(webTrigger).toContain('<button');
    expect(webTrigger).toContain("aria-haspopup='dialog'");

    expect(nativeTrigger).toContain('<Pressable');
    expect(nativeTrigger).toContain("accessibilityRole='button'");
    expect(nativeTrigger).not.toContain('<button');

    expect(webContent).toContain("role='dialog'");
    expect(webContent).toContain('tabIndex={-1}');

    expect(nativeContent).toContain('accessibilityViewIsModal');
    expect(nativeContent).not.toContain("role='dialog'");
  });

  it('generates metadata that can be consumed by the completeness checker', async () => {
    const root = createTempRoot();

    createRequiredRepositoryStructure(root);

    const result = await runComponentGenerator({
      root,
      options: {
        componentName: 'Avatar',
        platform: 'both',
        layer: 'primitives',
        category: 'data-display',
        profile: 'base',
        parts: [],
        force: false,
      },
    });

    const metadataSource = fs.readFileSync(result.plan.metadataFile, 'utf8');

    const registrySource = fs.readFileSync(
      result.plan.metadataBarrelFile,
      'utf8'
    );

    expect(metadataSource).toContain("name: 'Avatar'");
    expect(metadataSource).toContain("platforms: ['react', 'react-native']");
    expect(metadataSource).toContain("status: 'experimental'");

    expect(registrySource).toContain(
      "import { avatarMetadata } from './Avatar.metadata';"
    );

    expect(registrySource).toContain('  avatarMetadata,');

    const metadata: ComponentMetadata = {
      name: 'Avatar',
      layer: 'primitives',
      category: 'data-display',
      platforms: ['react', 'react-native'],
      profile: 'base',
      status: 'experimental',
      capabilities: [],
      requirements: {
        tests: true,
        storybook: true,
        docs: false,
        accessibility: false,
      },
    };

    const completeness = checkComponentCompleteness({
      root,
      metadata,
    });

    expect(completeness.ready).toBe(true);

    expect(completeness.checks).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          name: 'implementation',
          platform: 'react',
          ok: true,
        }),
        expect.objectContaining({
          name: 'implementation',
          platform: 'react-native',
          ok: true,
        }),
        expect.objectContaining({
          name: 'types',
          platform: 'react',
          ok: true,
        }),
        expect.objectContaining({
          name: 'types',
          platform: 'react-native',
          ok: true,
        }),
        expect.objectContaining({
          name: 'exports',
          platform: 'react',
          ok: true,
        }),
        expect.objectContaining({
          name: 'exports',
          platform: 'react-native',
          ok: true,
        }),
      ])
    );
  });

  it('plans metadata creation and registry updates in dry-run mode without writing files', async () => {
    const root = createTempRoot();

    createRequiredRepositoryStructure(root);

    const result = await runComponentGenerator({
      root,
      options: {
        componentName: 'Avatar',
        platform: 'both',
        layer: 'primitives',
        category: 'data-display',
        profile: 'base',
        parts: [],
        force: false,
        dryRun: true,
      },
    });

    expect(result.dryRun).toBe(true);
    expect(generateComponentWebsitePage).not.toHaveBeenCalled();

    expect(result.createdFiles).toContain(result.plan.metadataFile);
    expect(result.createdFiles).toContain(result.plan.docsContractFile);
    expect(result.createdFiles).toContain(result.plan.tokenFactoryFile);
    expect(result.createdFiles).toContain(
      path.join(root, 'apps/docs/src/react/avatar.md')
    );
    expect(result.createdFiles).toContain(
      path.join(root, 'apps/docs/src/react-native/avatar.md')
    );

    expect(result.updatedFiles).toContain(result.plan.metadataBarrelFile);
    expect(result.updatedFiles).toContain(result.plan.docsContractRegistryFile);
    expect(result.updatedFiles).toContain(result.plan.tokenFactoryBarrelFile);
    expect(result.updatedFiles).toContain(
      path.join(root, 'packages/react/API.md')
    );
    expect(result.updatedFiles).toContain(
      path.join(root, 'packages/react-native/API.md')
    );

    expect(fs.existsSync(result.plan.metadataFile)).toBe(false);
    expect(fs.existsSync(result.plan.docsContractFile)).toBe(false);
    expect(fs.existsSync(result.plan.tokenFactoryFile)).toBe(false);
    expect(
      fs.existsSync(path.join(root, 'apps/docs/src/react/avatar.md'))
    ).toBe(false);
    expect(
      fs.existsSync(path.join(root, 'apps/docs/src/react-native/avatar.md'))
    ).toBe(false);

    for (const target of result.plan.targets) {
      expect(fs.existsSync(target.componentDir)).toBe(false);
    }

    const metadataRegistry = fs.readFileSync(
      result.plan.metadataBarrelFile,
      'utf8'
    );

    expect(metadataRegistry).not.toContain('avatarMetadata');

    const docsContractRegistry = fs.readFileSync(
      result.plan.docsContractRegistryFile,
      'utf8'
    );

    expect(docsContractRegistry).not.toContain('avatarDocs');
  });

  it('creates a docs contract that passes component docs validation', async () => {
    const root = createTempRoot();

    createRequiredRepositoryStructure(root);

    const result = await runComponentGenerator({
      root,
      options: {
        componentName: 'Avatar',
        platform: 'both',
        layer: 'primitives',
        category: 'data-display',
        profile: 'base',
        parts: [],
        force: false,
      },
    });

    const validation = validateComponentDocs(
      createComponentDocsContractFromPlan(result.plan),
      createComponentMetadataFromPlan(result.plan)
    );

    expect(validation.valid).toBe(true);

    if (validation.valid) {
      expect(validation.value).toEqual(
        createComponentDocsContractFromPlan(result.plan)
      );
    }
  });

  it('derives Storybook references from the generated story convention', async () => {
    const root = createTempRoot();

    createRequiredRepositoryStructure(root, 'components');

    const result = await runComponentGenerator({
      root,
      options: {
        componentName: 'Dialog',
        platform: 'web',
        layer: 'components',
        category: 'overlay',
        profile: 'overlay',
        parts: [],
        force: false,
      },
    });

    const contract = createComponentDocsContractFromPlan(result.plan);
    const story = readFile(
      path.join(root, 'packages/react/src/components/Dialog/Dialog.stories.tsx')
    );

    expect(contract.platforms.react?.storybook).toEqual({
      story: 'Default',
      title: 'Components/Dialog',
    });
    expect(story).toContain("title: 'Components/Dialog'");
    expect(story).toContain('export const Default');
  });

  it('preserves authored docs regions when rerun with --force', async () => {
    const root = createTempRoot();

    createRequiredRepositoryStructure(root);

    await runComponentGenerator({
      root,
      options: {
        componentName: 'Avatar',
        platform: 'web',
        layer: 'primitives',
        category: 'data-display',
        profile: 'base',
        parts: [],
        force: false,
      },
    });

    const docsFile = path.join(root, 'apps/docs/src/react/avatar.md');
    const authoredBody = [
      '',
      '## Authored Examples',
      '',
      'Human-maintained Avatar guidance.',
      '',
    ].join('\n');
    const authoredContent = [
      '<!-- vellira-component-docs:authored:start -->',
      authoredBody.trimEnd(),
      '<!-- vellira-component-docs:authored:end -->',
    ].join('\n');

    fs.writeFileSync(
      docsFile,
      readFile(docsFile).replace(
        /<!-- vellira-component-docs:authored:start -->[\s\S]*?<!-- vellira-component-docs:authored:end -->/,
        authoredContent
      )
    );

    await runComponentGenerator({
      root,
      options: {
        componentName: 'Avatar',
        platform: 'web',
        layer: 'primitives',
        category: 'data-display',
        profile: 'base',
        parts: [],
        force: true,
      },
    });

    const regeneratedDocs = readFile(docsFile);

    expect(regeneratedDocs).toContain(authoredBody);
    expect(regeneratedDocs).toContain(authoredContent);
    expect(
      countOccurrences(
        regeneratedDocs,
        /vellira-component-docs:authored:start/g
      )
    ).toBe(1);
  });

  it('fails through component docs safety when authored markers are malformed', async () => {
    const root = createTempRoot();

    createRequiredRepositoryStructure(root);

    await runComponentGenerator({
      root,
      options: {
        componentName: 'Avatar',
        platform: 'web',
        layer: 'primitives',
        category: 'data-display',
        profile: 'base',
        parts: [],
        force: false,
      },
    });

    fs.writeFileSync(
      path.join(root, 'apps/docs/src/react/avatar.md'),
      '<!-- vellira-component-docs:authored:start -->\n'
    );

    await expect(
      runComponentGenerator({
        root,
        options: {
          componentName: 'Avatar',
          platform: 'web',
          layer: 'primitives',
          category: 'data-display',
          profile: 'base',
          parts: [],
          force: true,
        },
      })
    ).rejects.toThrow('contains unmatched authored region markers');
  });

  it('does not silently clobber an existing unowned docs page', async () => {
    const root = createTempRoot();

    createRequiredRepositoryStructure(root);

    const unownedDocsFile = path.join(root, 'apps/docs/src/react/avatar.md');
    const unownedContent = '# Existing Avatar docs\n';

    fs.writeFileSync(unownedDocsFile, unownedContent);

    await expect(
      runComponentGenerator({
        root,
        options: {
          componentName: 'Avatar',
          platform: 'web',
          layer: 'primitives',
          category: 'data-display',
          profile: 'base',
          parts: [],
          force: false,
        },
      })
    ).rejects.toThrow('Use --force for initial adoption');

    expect(readFile(unownedDocsFile)).toBe(unownedContent);
  });

  it('does not bypass malformed authored docs markers with --force', async () => {
    const root = createTempRoot();

    createRequiredRepositoryStructure(root);

    await runComponentGenerator({
      root,
      options: {
        componentName: 'Avatar',
        platform: 'web',
        layer: 'primitives',
        category: 'data-display',
        profile: 'base',
        parts: [],
        force: false,
      },
    });

    const docsFile = path.join(root, 'apps/docs/src/react/avatar.md');

    fs.writeFileSync(
      docsFile,
      `${readFile(docsFile)}\n<!-- vellira-component-docs:authored:end -->\n`
    );

    await expect(
      runComponentGenerator({
        root,
        options: {
          componentName: 'Avatar',
          platform: 'web',
          layer: 'primitives',
          category: 'data-display',
          profile: 'base',
          parts: [],
          force: true,
        },
      })
    ).rejects.toThrow('contains multiple authored region end markers');
  });

  it('does not mutate VitePress navigation when generating docs artifacts', async () => {
    const root = createTempRoot();

    createRequiredRepositoryStructure(root);

    const navConfigFile = path.join(
      root,
      'apps',
      'docs',
      'src',
      '.vitepress',
      'config.ts'
    );
    const before = readFile(navConfigFile);

    await runComponentGenerator({
      root,
      options: {
        componentName: 'Avatar',
        platform: 'both',
        layer: 'primitives',
        category: 'data-display',
        profile: 'base',
        parts: [],
        force: false,
      },
    });

    expect(readFile(navConfigFile)).toBe(before);
  });

  it('produces generated docs artifacts that pass generated docs completeness', async () => {
    const root = createTempRoot();

    createRequiredRepositoryStructure(root);

    const result = await runComponentGenerator({
      root,
      options: {
        componentName: 'Avatar',
        platform: 'both',
        layer: 'primitives',
        category: 'data-display',
        profile: 'base',
        parts: [],
        force: false,
      },
    });

    const metadata = createComponentMetadataFromPlan(result.plan);
    const contract = createComponentDocsContractFromPlan(result.plan);
    const completeness = await checkGeneratedComponentDocsCompleteness({
      root,
      metadata: [metadata],
      contracts: [contract],
    });

    expect(completeness.ready).toBe(true);
  });
});
