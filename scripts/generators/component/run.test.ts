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

function createRequiredRepositoryStructure(
  root: string,
  layer: 'primitives' | 'components' | 'patterns' = 'primitives'
) {
  for (const packageName of ['react', 'react-native']) {
    const layerDir = path.join(root, 'packages', packageName, 'src', layer);

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
        profile: 'base',
        parts: [],
        force: false,
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
      profile: 'base',
      parts: [],
      force: false,
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
        profile: 'base',
        parts: [],
        force: false,
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
        /export \{ avatarMetadata \} from '\.\/Avatar\.metadata';/g
      )
    ).toHaveLength(1);
  });

  it('generates platform-specific overlay scaffolds through the full pipeline', () => {
    const root = createTempRoot();

    createRequiredRepositoryStructure(root, 'components');

    const result = runComponentGenerator({
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
});
