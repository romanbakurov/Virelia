import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import { afterEach, describe, expect, it } from 'vitest';

import { createComponentGenerationPlan } from './plan';
import { writeComponentGenerationPlan } from './write';

const tempRoots: string[] = [];

function createTempRoot() {
  const root = fs.mkdtempSync(
    path.join(os.tmpdir(), 'vellira-component-writer-')
  );

  tempRoots.push(root);

  return root;
}

function createLayerBarrels(root: string) {
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
}

afterEach(() => {
  for (const root of tempRoots.splice(0)) {
    fs.rmSync(root, { recursive: true, force: true });
  }
});

describe('component generator writer', () => {
  it('writes canonical React and React Native component files', () => {
    const root = createTempRoot();
    createLayerBarrels(root);

    const plan = createComponentGenerationPlan({
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

    const result = writeComponentGenerationPlan(plan);

    expect(result.createdFiles).toHaveLength(15);

    for (const packageName of ['react', 'react-native']) {
      const componentDir = path.join(
        root,
        'packages',
        packageName,
        'src',
        'primitives',
        'Avatar'
      );

      expect(
        fs.existsSync(
          path.join(root, 'packages/metadata/src/components/Avatar.metadata.ts')
        )
      ).toBe(true);

      expect(fs.existsSync(path.join(componentDir, 'types.ts'))).toBe(true);
      expect(fs.existsSync(path.join(componentDir, 'index.ts'))).toBe(true);
      expect(fs.existsSync(path.join(componentDir, 'Avatar.tsx'))).toBe(true);
      expect(fs.existsSync(path.join(componentDir, 'Avatar.stories.tsx'))).toBe(
        true
      );
      expect(fs.existsSync(path.join(componentDir, 'Avatar.test.tsx'))).toBe(
        true
      );
      expect(fs.existsSync(path.join(componentDir, 'README.md'))).toBe(true);
    }

    expect(
      fs.existsSync(
        path.join(
          root,
          'packages/react/src/primitives/Avatar/Avatar.module.scss'
        )
      )
    ).toBe(true);

    expect(
      fs.existsSync(
        path.join(
          root,
          'packages/react-native/src/primitives/Avatar/Avatar.styles.ts'
        )
      )
    ).toBe(true);
  });

  it('registers package layer exports once', () => {
    const root = createTempRoot();
    createLayerBarrels(root);

    const plan = createComponentGenerationPlan({
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

    writeComponentGenerationPlan(plan);

    for (const packageName of ['react', 'react-native']) {
      const barrelFile = path.join(
        root,
        'packages',
        packageName,
        'src',
        'primitives',
        'index.ts'
      );

      expect(fs.readFileSync(barrelFile, 'utf8')).toBe(
        "export * from './Avatar';\n"
      );
    }

    const metadataBarrel = fs.readFileSync(plan.metadataBarrelFile, 'utf8');

    expect(
      metadataBarrel.match(
        /export \{ avatarMetadata \} from '\.\/Avatar\.metadata';/g
      )
    ).toHaveLength(1);
  });

  it('overwrites component files without duplicating barrel exports', () => {
    const root = createTempRoot();
    createLayerBarrels(root);

    const plan = createComponentGenerationPlan({
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

    writeComponentGenerationPlan(plan);
    writeComponentGenerationPlan(plan);

    for (const packageName of ['react', 'react-native']) {
      const barrelFile = path.join(
        root,
        'packages',
        packageName,
        'src',
        'primitives',
        'index.ts'
      );

      const content = fs.readFileSync(barrelFile, 'utf8');

      expect(content.match(/export \* from '\.\/Avatar';/g)).toHaveLength(1);
    }
  });

  it('generates platform-specific style files', () => {
    const root = createTempRoot();
    createLayerBarrels(root);

    const plan = createComponentGenerationPlan({
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

    writeComponentGenerationPlan(plan);

    expect(
      fs.readFileSync(
        path.join(
          root,
          'packages/react/src/primitives/Avatar/Avatar.module.scss'
        ),
        'utf8'
      )
    ).toContain('.avatar');

    expect(
      fs.readFileSync(
        path.join(
          root,
          'packages/react-native/src/primitives/Avatar/Avatar.styles.ts'
        ),
        'utf8'
      )
    ).toContain('StyleSheet.create');
  });

  it('writes and registers component metadata', () => {
    const root = createTempRoot();
    createLayerBarrels(root);

    const plan = createComponentGenerationPlan({
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

    writeComponentGenerationPlan(plan);

    const metadata = fs.readFileSync(plan.metadataFile, 'utf8');

    expect(metadata).toContain("name: 'Avatar'");
    expect(metadata).toContain("layer: 'primitives'");
    expect(metadata).toContain("category: 'data-display'");
    expect(metadata).toContain("'react'");
    expect(metadata).toContain("'react-native'");
    expect(metadata).toContain("status: 'experimental'");

    const barrel = fs.readFileSync(plan.metadataBarrelFile, 'utf8');

    expect(barrel).toContain(
      "export { avatarMetadata } from './Avatar.metadata';"
    );
  });
});
