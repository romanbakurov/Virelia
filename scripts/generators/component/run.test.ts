import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import { afterEach, describe, expect, it } from 'vitest';

import { runComponentGenerator } from './run';

const tempRoots: string[] = [];

function createTempRoot() {
  const root = fs.mkdtempSync(
    path.join(os.tmpdir(), 'vellira-component-generator-run-')
  );

  tempRoots.push(root);

  return root;
}

function createRequiredRepositoryStructure(root: string) {
  for (const packageName of ['react', 'react-native']) {
    const layerDir = path.join(
      root,
      'packages',
      packageName,
      'src',
      'primitives'
    );

    fs.mkdirSync(layerDir, { recursive: true });
    fs.writeFileSync(path.join(layerDir, 'index.ts'), '');
  }

  const metadataDir = path.join(
    root,
    'packages',
    'metadata',
    'src',
    'components'
  );

  fs.mkdirSync(metadataDir, { recursive: true });
  fs.writeFileSync(path.join(metadataDir, 'index.ts'), '');
}

afterEach(() => {
  for (const root of tempRoots.splice(0)) {
    fs.rmSync(root, {
      recursive: true,
      force: true,
    });
  }
});

describe('component generator', () => {
  it('generates a complete cross-platform component scaffold', () => {
    const root = createTempRoot();

    createRequiredRepositoryStructure(root);

    const result = runComponentGenerator({
      root,
      options: {
        componentName: 'Avatar',
        platform: 'both',
        layer: 'primitives',
        category: 'data-display',
        force: false,
        profile: 'base',
      },
    });

    expect(result.createdFiles).toHaveLength(15);

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
      'README.md',
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
      'README.md',
    ]) {
      expect(fs.existsSync(path.join(nativeDir, file))).toBe(true);
    }

    expect(fs.existsSync(result.plan.metadataFile)).toBe(true);

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

    expect(fs.readFileSync(result.plan.metadataBarrelFile, 'utf8')).toContain(
      "export { avatarMetadata } from './Avatar.metadata';"
    );
  });

  it('rejects a repeated run without --force', () => {
    const root = createTempRoot();

    createRequiredRepositoryStructure(root);

    const options = {
      componentName: 'Avatar',
      platform: 'both',
      layer: 'primitives',
      category: 'data-display',
      force: false,
      profile: 'base',
    } as const;

    runComponentGenerator({
      root,
      options,
    });

    expect(() =>
      runComponentGenerator({
        root,
        options,
      })
    ).toThrow('Use --force to overwrite existing component files.');
  });

  it('supports an explicit force overwrite without duplicating exports', () => {
    const root = createTempRoot();

    createRequiredRepositoryStructure(root);

    runComponentGenerator({
      root,
      options: {
        componentName: 'Avatar',
        platform: 'both',
        layer: 'primitives',
        category: 'data-display',
        force: false,
        profile: 'base',
      },
    });

    const result = runComponentGenerator({
      root,
      options: {
        componentName: 'Avatar',
        platform: 'both',
        layer: 'primitives',
        category: 'data-display',
        profile: 'base',
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
        /export \{ avatarMetadata \} from '\.\/Avatar\.metadata';/g
      )
    ).toHaveLength(1);
  });
});
