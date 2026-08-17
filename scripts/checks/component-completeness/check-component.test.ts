import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import { afterEach, describe, expect, it } from 'vitest';

import { checkComponentCompleteness } from './check-component';

import type { ComponentMetadata } from '@vellira-ui/metadata';

const tempRoots: string[] = [];

function createTempRoot() {
  const root = fs.mkdtempSync(
    path.join(os.tmpdir(), 'vellira-component-completeness-')
  );

  tempRoots.push(root);

  return root;
}

function createComponentFixture(params: {
  root: string;
  packageName: 'react' | 'react-native';
  layer: 'primitives' | 'components' | 'patterns';
  componentName: string;
}) {
  const { root, packageName, layer, componentName } = params;

  const componentDir = path.join(
    root,
    'packages',
    packageName,
    'src',
    layer,
    componentName
  );

  fs.mkdirSync(componentDir, { recursive: true });

  fs.writeFileSync(path.join(componentDir, `${componentName}.tsx`), '');

  fs.writeFileSync(path.join(componentDir, 'types.ts'), '');

  fs.writeFileSync(path.join(componentDir, `${componentName}.test.tsx`), '');

  fs.writeFileSync(path.join(componentDir, `${componentName}.stories.tsx`), '');

  // Local component barrel:
  // packages/react/src/primitives/Avatar/index.ts
  fs.writeFileSync(
    path.join(componentDir, 'index.ts'),
    `export * from './${componentName}';
export * from './types';
`
  );

  // Package layer barrel:
  // packages/react/src/primitives/index.ts
  const layerDir = path.dirname(componentDir);

  fs.writeFileSync(
    path.join(layerDir, 'index.ts'),
    `export * from './${componentName}';
`
  );

  return componentDir;
}

function createWebsiteDocumentationFixture(params: {
  root: string;
  componentName: string;
}) {
  const { root, componentName } = params;

  const slug = componentName
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .toLowerCase();

  const registryDir = path.join(
    root,
    'apps',
    'website',
    'src',
    'component-catalog',
    'registry'
  );

  fs.mkdirSync(registryDir, { recursive: true });

  fs.writeFileSync(
    path.join(registryDir, 'components.ts'),
    `export const webComponents = [
  {
    slug: '${slug}',
    name: '${componentName}',
  },
];
`
  );

  fs.writeFileSync(
    path.join(registryDir, 'componentPages.ts'),
    `export const componentPages = {
  '${slug}': {
    name: '${componentName}',
    Accessibility: () => null,
    api: {
      react: [],
      'react-native': [],
    },
  },
};
`
  );
}

function createTokenRegistryFixture(params: {
  root: string;
  tokens: readonly string[];
}) {
  const { root, tokens } = params;

  const generatedDir = path.join(
    root,
    'packages',
    'tokens',
    'src',
    'generated'
  );

  fs.mkdirSync(generatedDir, { recursive: true });

  fs.writeFileSync(
    path.join(generatedDir, 'token-types.ts'),
    `export const tokenPaths = [
${tokens.map((token) => `  '${token}',`).join('\n')}
] as const;
`
  );
}

afterEach(() => {
  for (const root of tempRoots.splice(0)) {
    fs.rmSync(root, {
      recursive: true,
      force: true,
    });
  }
});

describe('component completeness checker', () => {
  it('reports a complete single-platform component as ready', () => {
    const root = createTempRoot();

    createComponentFixture({
      root,
      packageName: 'react',
      layer: 'primitives',
      componentName: 'Avatar',
    });

    createWebsiteDocumentationFixture({
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
        tests: true,
        storybook: true,
        docs: true,
        accessibility: true,
      },
    };

    const result = checkComponentCompleteness({
      root,
      metadata,
    });

    expect(result.ready).toBe(true);

    expect(result.checks).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          name: 'implementation',
          ok: true,
        }),
        expect.objectContaining({
          name: 'types',
          ok: true,
        }),
        expect.objectContaining({
          name: 'tests',
          ok: true,
        }),
        expect.objectContaining({
          name: 'storybook',
          ok: true,
        }),
      ])
    );
  });

  it('reports missing required runtime files', () => {
    const root = createTempRoot();

    const componentDir = path.join(
      root,
      'packages/react/src/primitives/Avatar'
    );

    fs.mkdirSync(componentDir, { recursive: true });

    fs.writeFileSync(path.join(componentDir, 'Avatar.tsx'), '');

    const metadata: ComponentMetadata = {
      name: 'Avatar',
      layer: 'primitives',
      category: 'data-display',
      platforms: ['react'],
      profile: 'base',
      status: 'experimental',
      requirements: {
        tests: true,
        storybook: true,
        docs: true,
        accessibility: true,
      },
    };

    const result = checkComponentCompleteness({
      root,
      metadata,
    });

    expect(result.ready).toBe(false);

    expect(result.checks).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          name: 'types',
          ok: false,
        }),
        expect.objectContaining({
          name: 'tests',
          ok: false,
        }),
        expect.objectContaining({
          name: 'storybook',
          ok: false,
        }),
      ])
    );
  });

  it('checks every declared platform', () => {
    const root = createTempRoot();

    createComponentFixture({
      root,
      packageName: 'react',
      layer: 'components',
      componentName: 'Dialog',
    });

    const metadata: ComponentMetadata = {
      name: 'Dialog',
      layer: 'components',
      category: 'overlay',
      platforms: ['react', 'react-native'],
      profile: 'overlay',
      status: 'experimental',
      requirements: {
        tests: true,
        storybook: true,
        docs: true,
        accessibility: true,
      },
    };

    const result = checkComponentCompleteness({
      root,
      metadata,
    });

    expect(result.ready).toBe(false);

    const nativeImplementationFailure = result.checks.find(
      (check) =>
        check.name === 'implementation' &&
        check.platform === 'react-native' &&
        check.ok === false
    );

    expect(nativeImplementationFailure).toBeDefined();
  });

  it('reports missing package exports', () => {
    const root = createTempRoot();

    createComponentFixture({
      root,
      packageName: 'react',
      layer: 'primitives',
      componentName: 'Avatar',
    });

    const layerBarrelFile = path.join(
      root,
      'packages/react/src/primitives/index.ts'
    );

    fs.writeFileSync(layerBarrelFile, '');

    const metadata: ComponentMetadata = {
      name: 'Avatar',
      layer: 'primitives',
      category: 'data-display',
      platforms: ['react'],
      profile: 'base',
      status: 'experimental',
      requirements: {
        tests: true,
        storybook: true,
        docs: true,
        accessibility: true,
      },
    };

    const result = checkComponentCompleteness({
      root,
      metadata,
    });

    expect(result.ready).toBe(false);

    expect(result.checks).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          name: 'exports',
          ok: false,
        }),
      ])
    );
  });

  it('does not require tests or Storybook when metadata disables them', () => {
    const root = createTempRoot();

    const componentDir = createComponentFixture({
      root,
      packageName: 'react',
      layer: 'primitives',
      componentName: 'Avatar',
    });

    fs.rmSync(path.join(componentDir, 'Avatar.test.tsx'));

    fs.rmSync(path.join(componentDir, 'Avatar.stories.tsx'));

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

    const result = checkComponentCompleteness({
      root,
      metadata,
    });

    expect(result.ready).toBe(true);

    expect(result.checks.some((check) => check.name === 'tests')).toBe(false);

    expect(result.checks.some((check) => check.name === 'storybook')).toBe(
      false
    );
  });

  it('requires tests and Storybook when metadata enables them', () => {
    const root = createTempRoot();

    const componentDir = createComponentFixture({
      root,
      packageName: 'react',
      layer: 'primitives',
      componentName: 'Avatar',
    });

    fs.rmSync(path.join(componentDir, 'Avatar.test.tsx'));

    fs.rmSync(path.join(componentDir, 'Avatar.stories.tsx'));

    const metadata: ComponentMetadata = {
      name: 'Avatar',
      layer: 'primitives',
      category: 'data-display',
      platforms: ['react'],
      profile: 'base',
      status: 'experimental',
      requirements: {
        tests: true,
        storybook: true,
        docs: false,
        accessibility: false,
      },
    };

    const result = checkComponentCompleteness({
      root,
      metadata,
    });

    expect(result.ready).toBe(false);

    expect(result.checks).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          name: 'tests',
          ok: false,
        }),
        expect.objectContaining({
          name: 'storybook',
          ok: false,
        }),
      ])
    );
  });

  it('reports missing website catalog registration', () => {
    const root = createTempRoot();

    createComponentFixture({
      root,
      packageName: 'react',
      layer: 'primitives',
      componentName: 'Avatar',
    });

    const registryDir = path.join(
      root,
      'apps',
      'website',
      'src',
      'component-catalog',
      'registry'
    );

    fs.mkdirSync(registryDir, { recursive: true });

    fs.writeFileSync(
      path.join(registryDir, 'components.ts'),
      `export const webComponents = [];
`
    );

    fs.writeFileSync(
      path.join(registryDir, 'componentPages.ts'),
      `export const componentPages = {
  avatar: {
    name: 'Avatar',
  },
};
`
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
        docs: true,
        accessibility: false,
      },
    };

    const result = checkComponentCompleteness({
      root,
      metadata,
    });

    expect(result.ready).toBe(false);

    expect(result.checks).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          name: 'website',
          ok: false,
          details: 'Missing "avatar" in website component catalog.',
        }),
      ])
    );
  });

  it('reports missing website component page registration', () => {
    const root = createTempRoot();

    createComponentFixture({
      root,
      packageName: 'react',
      layer: 'primitives',
      componentName: 'Avatar',
    });

    const registryDir = path.join(
      root,
      'apps',
      'website',
      'src',
      'component-catalog',
      'registry'
    );

    fs.mkdirSync(registryDir, { recursive: true });

    fs.writeFileSync(
      path.join(registryDir, 'components.ts'),
      `export const webComponents = [
  {
    slug: 'avatar',
    name: 'Avatar',
  },
];
`
    );

    fs.writeFileSync(
      path.join(registryDir, 'componentPages.ts'),
      `export const componentPages = {};
`
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
        docs: true,
        accessibility: false,
      },
    };

    const result = checkComponentCompleteness({
      root,
      metadata,
    });

    expect(result.ready).toBe(false);

    expect(result.checks).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          name: 'website',
          ok: false,
          details: 'Missing "avatar" in website component pages registry.',
        }),
      ])
    );
  });

  it('reports missing API documentation', () => {
    const root = createTempRoot();

    createComponentFixture({
      root,
      packageName: 'react',
      layer: 'primitives',
      componentName: 'Avatar',
    });

    const registryDir = path.join(
      root,
      'apps',
      'website',
      'src',
      'component-catalog',
      'registry'
    );

    fs.mkdirSync(registryDir, { recursive: true });

    fs.writeFileSync(
      path.join(registryDir, 'components.ts'),
      `export const webComponents = [
  {
    slug: 'avatar',
    name: 'Avatar',
  },
];
`
    );

    fs.writeFileSync(
      path.join(registryDir, 'componentPages.ts'),
      `export const componentPages = {
  avatar: {
    name: 'Avatar',
  },
};
`
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
        docs: true,
        accessibility: false,
      },
    };

    const result = checkComponentCompleteness({
      root,
      metadata,
    });

    expect(result.ready).toBe(false);

    expect(result.checks).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          name: 'api-docs',
          ok: false,
        }),
      ])
    );
  });

  it('reports missing API documentation for a declared platform', () => {
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

    const registryDir = path.join(
      root,
      'apps',
      'website',
      'src',
      'component-catalog',
      'registry'
    );

    fs.mkdirSync(registryDir, { recursive: true });

    fs.writeFileSync(
      path.join(registryDir, 'components.ts'),
      `export const webComponents = [
  {
    slug: 'dialog',
    name: 'Dialog',
  },
];
`
    );

    fs.writeFileSync(
      path.join(registryDir, 'componentPages.ts'),
      `export const componentPages = {
  dialog: {
    name: 'Dialog',
    api: {
      react: [],
    },
  },
};
`
    );

    const metadata: ComponentMetadata = {
      name: 'Dialog',
      layer: 'components',
      category: 'overlay',
      platforms: ['react', 'react-native'],
      profile: 'overlay',
      status: 'experimental',
      requirements: {
        tests: false,
        storybook: false,
        docs: true,
        accessibility: false,
      },
    };

    const result = checkComponentCompleteness({
      root,
      metadata,
    });

    expect(result.ready).toBe(false);

    expect(result.checks).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          name: 'api-docs',
          ok: false,
          details: 'Missing react-native API documentation for "dialog".',
        }),
      ])
    );
  });

  it('reports missing accessibility documentation when required', () => {
    const root = createTempRoot();

    createComponentFixture({
      root,
      packageName: 'react',
      layer: 'primitives',
      componentName: 'Avatar',
    });

    const registryDir = path.join(
      root,
      'apps',
      'website',
      'src',
      'component-catalog',
      'registry'
    );

    fs.mkdirSync(registryDir, { recursive: true });

    fs.writeFileSync(
      path.join(registryDir, 'components.ts'),
      `export const webComponents = [
  {
    slug: 'avatar',
    name: 'Avatar',
  },
];
`
    );

    fs.writeFileSync(
      path.join(registryDir, 'componentPages.ts'),
      `export const componentPages = {
  avatar: {
    name: 'Avatar',
    api: {
      react: [],
    },
  },
};
`
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
        docs: true,
        accessibility: true,
      },
    };

    const result = checkComponentCompleteness({
      root,
      metadata,
    });

    expect(result.ready).toBe(false);

    expect(result.checks).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          name: 'accessibility',
          ok: false,
          details: 'Missing accessibility documentation for "avatar".',
        }),
      ])
    );
  });

  it('passes declared token requirements when all tokens exist', () => {
    const root = createTempRoot();

    createComponentFixture({
      root,
      packageName: 'react',
      layer: 'primitives',
      componentName: 'Avatar',
    });

    createTokenRegistryFixture({
      root,
      tokens: ['colors.gray.500', 'semantic.text.primary'],
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
        tokens: ['colors.gray.500', 'semantic.text.primary'],
      },
    };

    const result = checkComponentCompleteness({
      root,
      metadata,
    });

    expect(result.ready).toBe(true);

    expect(result.checks).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          name: 'tokens',
          ok: true,
        }),
      ])
    );
  });

  it('reports missing declared token requirements', () => {
    const root = createTempRoot();

    createComponentFixture({
      root,
      packageName: 'react',
      layer: 'primitives',
      componentName: 'Avatar',
    });

    createTokenRegistryFixture({
      root,
      tokens: ['colors.gray.500'],
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
        tokens: ['colors.gray.500', 'components.avatar.background'],
      },
    };

    const result = checkComponentCompleteness({
      root,
      metadata,
    });

    expect(result.ready).toBe(false);

    expect(result.checks).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          name: 'tokens',
          ok: false,
          details: 'Missing required tokens: components.avatar.background',
        }),
      ])
    );
  });
});
