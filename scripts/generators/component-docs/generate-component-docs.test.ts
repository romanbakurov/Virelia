import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

import { afterEach, describe, expect, it } from 'vitest';

import type {
  ComponentMetadata,
  ComponentPlatform,
} from '@vellira-ui/metadata';

import type { ComponentDocsContract } from '../../../apps/docs/src/component-docs';

import {
  createGeneratedComponentDocsSidebarItems,
  resolveComponentDocsRoot,
} from '../../../apps/docs/src/component-docs';
import {
  authoredRegionEndMarker,
  defaultAuthoredRegionPlaceholder,
  authoredRegionStartMarker,
} from './authored-region';
import { generateComponentDocs } from './generate-component-docs';

const tempRoots: string[] = [];

afterEach(() => {
  for (const tempRoot of tempRoots.splice(0)) {
    fs.rmSync(tempRoot, { recursive: true, force: true });
  }
});

describe('generateComponentDocs', () => {
  it('generates React and React Native pages for a cross-platform component', async () => {
    const fixture = createFixture({
      componentName: 'FixtureSwitch',
      platforms: ['react', 'react-native'],
    });

    const result = await generateComponentDocs({
      root: fixture.root,
      docsRoot: fixture.docsRoot,
      metadata: [fixture.metadata],
      contracts: [fixture.contract],
    });

    expect(result.status).toBe('updated');
    expect(fs.existsSync(fixture.reactDoc)).toBe(true);
    expect(fs.existsSync(fixture.nativeDoc)).toBe(true);
  });

  it('generates only the React page for a React-only component', async () => {
    const fixture = createFixture({
      componentName: 'FixtureSwitch',
      platforms: ['react'],
    });

    await generateComponentDocs({
      root: fixture.root,
      docsRoot: fixture.docsRoot,
      metadata: [fixture.metadata],
      contracts: [fixture.contract],
    });

    expect(fs.existsSync(fixture.reactDoc)).toBe(true);
    expect(fs.existsSync(fixture.nativeDoc)).toBe(false);
  });

  it('generates only the React Native page for a React Native-only component', async () => {
    const fixture = createFixture({
      componentName: 'FixtureSwitch',
      platforms: ['react-native'],
    });

    await generateComponentDocs({
      root: fixture.root,
      docsRoot: fixture.docsRoot,
      metadata: [fixture.metadata],
      contracts: [fixture.contract],
    });

    expect(fs.existsSync(fixture.reactDoc)).toBe(false);
    expect(fs.existsSync(fixture.nativeDoc)).toBe(true);
  });

  it('does not generate unsupported platform pages', async () => {
    const fixture = createFixture({
      componentName: 'FixtureSwitch',
      platforms: ['react'],
    });

    const result = await generateComponentDocs({
      root: fixture.root,
      docsRoot: fixture.docsRoot,
      metadata: [fixture.metadata],
      contracts: [fixture.contract],
    });

    expect(result.changedFiles).toEqual([
      'apps/docs/src/react/fixture-switch.md',
    ]);
    expect(fs.existsSync(fixture.nativeDoc)).toBe(false);
  });

  it('includes a React generated page in React navigation', async () => {
    const fixture = createFixture({
      componentName: 'FixtureSwitch',
      platforms: ['react'],
    });

    await generateComponentDocs({
      root: fixture.root,
      docsRoot: fixture.docsRoot,
      metadata: [fixture.metadata],
      contracts: [fixture.contract],
    });

    expect(
      createGeneratedComponentDocsSidebarItems({
        docsRoot: fixture.docsRoot,
        platform: 'react',
        metadata: [fixture.metadata],
        contracts: [fixture.contract],
      })
    ).toEqual([
      {
        text: 'FixtureSwitch',
        link: '/react/fixture-switch',
      },
    ]);
  });

  it('includes a React Native generated page in React Native navigation', async () => {
    const fixture = createFixture({
      componentName: 'FixtureSwitch',
      platforms: ['react-native'],
    });

    await generateComponentDocs({
      root: fixture.root,
      docsRoot: fixture.docsRoot,
      metadata: [fixture.metadata],
      contracts: [fixture.contract],
    });

    expect(
      createGeneratedComponentDocsSidebarItems({
        docsRoot: fixture.docsRoot,
        platform: 'react-native',
        metadata: [fixture.metadata],
        contracts: [fixture.contract],
      })
    ).toEqual([
      {
        text: 'FixtureSwitch',
        link: '/react-native/fixture-switch',
      },
    ]);
  });

  it('includes cross-platform generated pages in both navigation groups', async () => {
    const fixture = createFixture({
      componentName: 'FixtureSwitch',
      platforms: ['react', 'react-native'],
    });

    await generateComponentDocs({
      root: fixture.root,
      docsRoot: fixture.docsRoot,
      metadata: [fixture.metadata],
      contracts: [fixture.contract],
    });

    expect(
      createGeneratedComponentDocsSidebarItems({
        docsRoot: fixture.docsRoot,
        platform: 'react',
        metadata: [fixture.metadata],
        contracts: [fixture.contract],
      })
    ).toEqual([{ text: 'FixtureSwitch', link: '/react/fixture-switch' }]);
    expect(
      createGeneratedComponentDocsSidebarItems({
        docsRoot: fixture.docsRoot,
        platform: 'react-native',
        metadata: [fixture.metadata],
        contracts: [fixture.contract],
      })
    ).toEqual([
      { text: 'FixtureSwitch', link: '/react-native/fixture-switch' },
    ]);
  });

  it('omits React-only generated pages from React Native navigation', async () => {
    const fixture = createFixture({
      componentName: 'FixtureSwitch',
      platforms: ['react'],
    });

    await generateComponentDocs({
      root: fixture.root,
      docsRoot: fixture.docsRoot,
      metadata: [fixture.metadata],
      contracts: [fixture.contract],
    });

    expect(
      createGeneratedComponentDocsSidebarItems({
        docsRoot: fixture.docsRoot,
        platform: 'react-native',
        metadata: [fixture.metadata],
        contracts: [fixture.contract],
      })
    ).toEqual([]);
  });

  it('omits React Native-only generated pages from React navigation', async () => {
    const fixture = createFixture({
      componentName: 'FixtureSwitch',
      platforms: ['react-native'],
    });

    await generateComponentDocs({
      root: fixture.root,
      docsRoot: fixture.docsRoot,
      metadata: [fixture.metadata],
      contracts: [fixture.contract],
    });

    expect(
      createGeneratedComponentDocsSidebarItems({
        docsRoot: fixture.docsRoot,
        platform: 'react',
        metadata: [fixture.metadata],
        contracts: [fixture.contract],
      })
    ).toEqual([]);
  });

  it('never emits navigation links to nonexistent generated pages', () => {
    const fixture = createFixture({
      componentName: 'FixtureSwitch',
      platforms: ['react'],
    });

    expect(() =>
      createGeneratedComponentDocsSidebarItems({
        docsRoot: fixture.docsRoot,
        platform: 'react',
        metadata: [fixture.metadata],
        contracts: [fixture.contract],
      })
    ).toThrow(
      'Cannot create component docs navigation for FixtureSwitch react: missing generated docs page react/fixture-switch.md.'
    );
  });

  it('orders generated navigation by canonical metadata order', async () => {
    const zulu = createFixture({
      componentName: 'FixtureZulu',
      platforms: ['react'],
    });
    const alpha = createFixture({
      componentName: 'FixtureAlpha',
      platforms: ['react'],
      root: zulu.root,
      docsRoot: zulu.docsRoot,
    });

    await generateComponentDocs({
      root: zulu.root,
      docsRoot: zulu.docsRoot,
      metadata: [zulu.metadata, alpha.metadata],
      contracts: [alpha.contract, zulu.contract],
    });

    expect(
      createGeneratedComponentDocsSidebarItems({
        docsRoot: zulu.docsRoot,
        platform: 'react',
        metadata: [zulu.metadata, alpha.metadata],
        contracts: [alpha.contract, zulu.contract],
      })
    ).toEqual([
      { text: 'FixtureZulu', link: '/react/fixture-zulu' },
      { text: 'FixtureAlpha', link: '/react/fixture-alpha' },
    ]);
  });

  it('resolves generated navigation independently of process cwd', async () => {
    const fixture = createFixture({
      componentName: 'FixtureSwitch',
      platforms: ['react', 'react-native'],
    });
    const otherCwd = fs.mkdtempSync(
      path.join(os.tmpdir(), 'vellira-component-docs-cwd-')
    );
    tempRoots.push(otherCwd);

    await generateComponentDocs({
      root: fixture.root,
      docsRoot: fixture.docsRoot,
      metadata: [fixture.metadata],
      contracts: [fixture.contract],
    });

    const configModuleUrl = pathToFileURL(
      path.join(fixture.docsRoot, '.vitepress', 'config.ts')
    ).href;
    const originalCwd = process.cwd();

    try {
      process.chdir(fixture.root);
      const rootResolvedFromFixtureRoot =
        resolveComponentDocsRoot(configModuleUrl);
      const reactFromFixtureRoot = createGeneratedComponentDocsSidebarItems({
        docsRoot: rootResolvedFromFixtureRoot,
        platform: 'react',
        metadata: [fixture.metadata],
        contracts: [fixture.contract],
      });
      const nativeFromFixtureRoot = createGeneratedComponentDocsSidebarItems({
        docsRoot: rootResolvedFromFixtureRoot,
        platform: 'react-native',
        metadata: [fixture.metadata],
        contracts: [fixture.contract],
      });

      process.chdir(otherCwd);
      const rootResolvedFromOtherCwd =
        resolveComponentDocsRoot(configModuleUrl);
      const reactFromOtherCwd = createGeneratedComponentDocsSidebarItems({
        docsRoot: rootResolvedFromOtherCwd,
        platform: 'react',
        metadata: [fixture.metadata],
        contracts: [fixture.contract],
      });
      const nativeFromOtherCwd = createGeneratedComponentDocsSidebarItems({
        docsRoot: rootResolvedFromOtherCwd,
        platform: 'react-native',
        metadata: [fixture.metadata],
        contracts: [fixture.contract],
      });

      expect(rootResolvedFromOtherCwd).toBe(rootResolvedFromFixtureRoot);
      expect(reactFromOtherCwd).toEqual(reactFromFixtureRoot);
      expect(nativeFromOtherCwd).toEqual(nativeFromFixtureRoot);
    } finally {
      process.chdir(originalCwd);
    }
  });

  it('check mode detects missing generated pages needed by navigation without writing', async () => {
    const fixture = createFixture({
      componentName: 'FixtureSwitch',
      platforms: ['react'],
    });

    await expect(
      generateComponentDocs({
        root: fixture.root,
        docsRoot: fixture.docsRoot,
        check: true,
        metadata: [fixture.metadata],
        contracts: [fixture.contract],
      })
    ).rejects.toThrow(
      'Cannot create component docs navigation for FixtureSwitch react: missing generated docs page react/fixture-switch.md.'
    );
    expect(fs.existsSync(fixture.reactDoc)).toBe(false);
  });

  it('does not invent Switch-specific usage for other components', async () => {
    const fixture = createFixture({
      componentName: 'FixtureButton',
      platforms: ['react'],
    });

    await generateComponentDocs({
      root: fixture.root,
      docsRoot: fixture.docsRoot,
      metadata: [fixture.metadata],
      contracts: [fixture.contract],
    });

    const content = fs.readFileSync(fixture.reactDoc, 'utf8');

    expect(content).not.toContain('defaultChecked');
    expect(content).not.toContain('accessibilityLabel');
    expect(content).not.toContain('## Basic Usage');
  });

  it('fails clearly when required platform docs metadata is missing', async () => {
    const fixture = createFixture({
      componentName: 'FixtureSwitch',
      platforms: ['react', 'react-native'],
      contractPlatforms: ['react'],
    });

    await expect(
      generateComponentDocs({
        root: fixture.root,
        docsRoot: fixture.docsRoot,
        metadata: [fixture.metadata],
        contracts: [fixture.contract],
      })
    ).rejects.toThrow(
      'Cannot generate docs for FixtureSwitch react-native: missing editorial docs for supported platform.'
    );
  });

  it('fails clearly when required editorial fields are malformed', async () => {
    const fixture = createFixture({
      componentName: 'FixtureSwitch',
      platforms: ['react'],
    });
    const reactDocs = fixture.contract.platforms.react;

    if (!reactDocs) {
      throw new Error('React docs fixture is required.');
    }

    const malformedContract: ComponentDocsContract = {
      ...fixture.contract,
      platforms: {
        react: {
          ...reactDocs,
          title: '',
        },
      },
    };

    await expect(
      generateComponentDocs({
        root: fixture.root,
        docsRoot: fixture.docsRoot,
        metadata: [fixture.metadata],
        contracts: [malformedContract],
      })
    ).rejects.toThrow(
      'FixtureSwitch: platforms.react.title must be a non-empty string.'
    );
  });

  it('is idempotent after a successful generation', async () => {
    const fixture = createFixture({
      componentName: 'FixtureSwitch',
      platforms: ['react', 'react-native'],
    });

    await generateComponentDocs({
      root: fixture.root,
      docsRoot: fixture.docsRoot,
      metadata: [fixture.metadata],
      contracts: [fixture.contract],
    });

    const firstReactContent = fs.readFileSync(fixture.reactDoc, 'utf8');
    const firstNativeContent = fs.readFileSync(fixture.nativeDoc, 'utf8');
    const result = await generateComponentDocs({
      root: fixture.root,
      docsRoot: fixture.docsRoot,
      metadata: [fixture.metadata],
      contracts: [fixture.contract],
    });

    expect(result).toMatchObject({
      status: 'up-to-date',
      changedFiles: [],
    });
    expect(fs.readFileSync(fixture.reactDoc, 'utf8')).toBe(firstReactContent);
    expect(fs.readFileSync(fixture.nativeDoc, 'utf8')).toBe(firstNativeContent);
  });

  it('--check detects stale output without mutating files', async () => {
    const fixture = createFixture({
      componentName: 'FixtureSwitch',
      platforms: ['react'],
    });
    const staleContent = [
      '# Stale',
      authoredRegionStartMarker,
      'Keep this content.',
      authoredRegionEndMarker,
      '',
    ].join('\n');

    fs.mkdirSync(path.dirname(fixture.reactDoc), { recursive: true });
    fs.writeFileSync(fixture.reactDoc, staleContent);

    const result = await generateComponentDocs({
      root: fixture.root,
      docsRoot: fixture.docsRoot,
      check: true,
      metadata: [fixture.metadata],
      contracts: [fixture.contract],
    });

    expect(result.status).toBe('stale');
    expect(result.changedFiles).toEqual([
      'apps/docs/src/react/fixture-switch.md',
    ]);
    expect(fs.readFileSync(fixture.reactDoc, 'utf8')).toBe(staleContent);
  });

  it('preserves authored regions across regeneration', async () => {
    const fixture = createFixture({
      componentName: 'FixtureSwitch',
      platforms: ['react'],
    });

    await generateComponentDocs({
      root: fixture.root,
      docsRoot: fixture.docsRoot,
      metadata: [fixture.metadata],
      contracts: [fixture.contract],
    });

    const authoredContent =
      '\n## Local Guidance\n\nKeep this hand-authored note.\n';
    const generatedContent = fs.readFileSync(fixture.reactDoc, 'utf8');
    const nextContent = generatedContent.replace(
      `${authoredRegionStartMarker}\n${defaultAuthoredRegionPlaceholder}\n${authoredRegionEndMarker}`,
      `${authoredRegionStartMarker}${authoredContent}${authoredRegionEndMarker}`
    );

    fs.writeFileSync(fixture.reactDoc, nextContent);

    await generateComponentDocs({
      root: fixture.root,
      docsRoot: fixture.docsRoot,
      metadata: [fixture.metadata],
      contracts: [fixture.contract],
    });

    expect(fs.readFileSync(fixture.reactDoc, 'utf8')).toContain(
      'Keep this hand-authored note.'
    );
  });

  it('fails safely when authored-region markers are malformed', async () => {
    const fixture = createFixture({
      componentName: 'FixtureSwitch',
      platforms: ['react'],
    });

    fs.mkdirSync(path.dirname(fixture.reactDoc), { recursive: true });
    fs.writeFileSync(
      fixture.reactDoc,
      [
        authoredRegionStartMarker,
        authoredRegionStartMarker,
        'Ambiguous content.',
        authoredRegionEndMarker,
        '',
      ].join('\n')
    );

    await expect(
      generateComponentDocs({
        root: fixture.root,
        docsRoot: fixture.docsRoot,
        force: true,
        metadata: [fixture.metadata],
        contracts: [fixture.contract],
      })
    ).rejects.toThrow(
      'apps/docs/src/react/fixture-switch.md contains multiple authored region start markers.'
    );
  });

  it('fails safely when authored-region end markers are duplicated', async () => {
    const fixture = createFixture({
      componentName: 'FixtureSwitch',
      platforms: ['react'],
    });

    fs.mkdirSync(path.dirname(fixture.reactDoc), { recursive: true });
    fs.writeFileSync(
      fixture.reactDoc,
      [
        authoredRegionStartMarker,
        'Ambiguous content.',
        authoredRegionEndMarker,
        authoredRegionEndMarker,
        '',
      ].join('\n')
    );

    await expect(
      generateComponentDocs({
        root: fixture.root,
        docsRoot: fixture.docsRoot,
        metadata: [fixture.metadata],
        contracts: [fixture.contract],
      })
    ).rejects.toThrow(
      'apps/docs/src/react/fixture-switch.md contains multiple authored region end markers.'
    );
  });

  it('fails safely when authored-region start marker is unmatched', async () => {
    const fixture = createFixture({
      componentName: 'FixtureSwitch',
      platforms: ['react'],
    });

    fs.mkdirSync(path.dirname(fixture.reactDoc), { recursive: true });
    fs.writeFileSync(
      fixture.reactDoc,
      [authoredRegionStartMarker, 'Unmatched content.', ''].join('\n')
    );

    await expect(
      generateComponentDocs({
        root: fixture.root,
        docsRoot: fixture.docsRoot,
        metadata: [fixture.metadata],
        contracts: [fixture.contract],
      })
    ).rejects.toThrow(
      'apps/docs/src/react/fixture-switch.md contains unmatched authored region markers.'
    );
  });

  it('fails safely when authored-region end marker is unmatched', async () => {
    const fixture = createFixture({
      componentName: 'FixtureSwitch',
      platforms: ['react'],
    });

    fs.mkdirSync(path.dirname(fixture.reactDoc), { recursive: true });
    fs.writeFileSync(
      fixture.reactDoc,
      ['Unmatched content.', authoredRegionEndMarker, ''].join('\n')
    );

    await expect(
      generateComponentDocs({
        root: fixture.root,
        docsRoot: fixture.docsRoot,
        metadata: [fixture.metadata],
        contracts: [fixture.contract],
      })
    ).rejects.toThrow(
      'apps/docs/src/react/fixture-switch.md contains unmatched authored region markers.'
    );
  });

  it('fails safely when authored-region markers are reversed', async () => {
    const fixture = createFixture({
      componentName: 'FixtureSwitch',
      platforms: ['react'],
    });

    fs.mkdirSync(path.dirname(fixture.reactDoc), { recursive: true });
    fs.writeFileSync(
      fixture.reactDoc,
      [
        authoredRegionEndMarker,
        'Reversed content.',
        authoredRegionStartMarker,
        '',
      ].join('\n')
    );

    await expect(
      generateComponentDocs({
        root: fixture.root,
        docsRoot: fixture.docsRoot,
        metadata: [fixture.metadata],
        contracts: [fixture.contract],
      })
    ).rejects.toThrow(
      'apps/docs/src/react/fixture-switch.md contains an authored region end marker before its start marker.'
    );
  });
});

function createFixture(params: {
  componentName: string;
  platforms: readonly ComponentPlatform[];
  contractPlatforms?: readonly ComponentPlatform[];
  root?: string;
  docsRoot?: string;
}) {
  const {
    componentName,
    platforms,
    contractPlatforms = platforms,
    root = fs.mkdtempSync(path.join(os.tmpdir(), 'vellira-component-docs-')),
    docsRoot = path.join(root, 'apps', 'docs', 'src'),
  } = params;
  const slug = slugifyComponentName(componentName);
  const metadata: ComponentMetadata = {
    name: componentName,
    layer: 'primitives',
    category: 'form',
    platforms,
    profile: 'form-control',
    status: 'experimental',
    capabilities: ['controlled'],
    requirements: {
      tests: true,
      storybook: true,
      docs: true,
      accessibility: true,
    },
  };
  const contract: ComponentDocsContract = {
    component: componentName,
    platforms: Object.fromEntries(
      contractPlatforms.map((platform) => [
        platform,
        {
          title:
            platform === 'react'
              ? `${componentName} - React Component`
              : `React Native ${componentName}`,
          description: `Generated docs for ${componentName} on ${platform}.`,
          summary: `${componentName} toggles an immediate boolean setting.`,
          whenToUse: ['Use for immediate settings.'],
          accessibility: ['Provide an accessible name.'],
          notes: ['Do not use for submitted form selections.'],
          storybook:
            platform === 'react'
              ? {
                  story: 'Default',
                  title: `Primitives/${componentName}`,
                }
              : undefined,
          seeAlso: [
            {
              component: 'Checkbox',
              label: 'Use for submitted form selections.',
            },
          ],
        },
      ])
    ),
  };

  if (!tempRoots.includes(root)) {
    tempRoots.push(root);
  }
  writeApiFixtures(root, componentName, platforms);

  return {
    root,
    docsRoot,
    metadata,
    contract,
    reactDoc: path.join(docsRoot, 'react', `${slug}.md`),
    nativeDoc: path.join(docsRoot, 'react-native', `${slug}.md`),
  };
}

function writeApiFixtures(
  root: string,
  componentName: string,
  platforms: readonly ComponentPlatform[]
) {
  for (const platform of platforms) {
    const packageDir =
      platform === 'react' ? 'packages/react' : 'packages/react-native';
    const apiPrefix = platform === 'react' ? 'web' : 'native';
    const apiFile = path.join(root, packageDir, 'API.md');
    const apiId = `${apiPrefix}.${componentName}Props.${componentName}`;

    fs.mkdirSync(path.dirname(apiFile), { recursive: true });
    const existingContent = fs.existsSync(apiFile)
      ? fs.readFileSync(apiFile, 'utf8')
      : `# ${platform} API\n\n`;

    fs.writeFileSync(
      apiFile,
      [
        existingContent.trimEnd(),
        `<!-- api-docgen:start ${apiId} -->`,
        '',
        '| Prop | Type | Required | Description |',
        '| ---- | ---- | -------- | ----------- |',
        '| `checked` | `boolean` | No | Controlled checked state. |',
        '',
        `<!-- api-docgen:end ${apiId} -->`,
        '',
      ].join('\n')
    );
  }
}

function slugifyComponentName(componentName: string) {
  return componentName
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .toLowerCase();
}
