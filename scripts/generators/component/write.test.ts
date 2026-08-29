import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import { describe, expect, it } from 'vitest';

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

function createLayerBarrels(
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
}

describe('component generator writer', () => {
  it('writes canonical React and React Native component files', async () => {
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
        parts: [],
        force: false,
      },
    });

    const result = await writeComponentGenerationPlan(plan);

    expect(result.createdFiles).toHaveLength(22);

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

  it('registers package layer exports once', async () => {
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
        parts: [],
        force: false,
      },
    });

    await writeComponentGenerationPlan(plan);

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
        /import \{ avatarMetadata \} from '\.\/Avatar\.metadata';/g
      )
    ).toHaveLength(1);

    expect(metadataBarrel.match(/ {2}avatarMetadata,/g)).toHaveLength(1);
  });

  it('overwrites component files without duplicating barrel exports', async () => {
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
        parts: [],
        force: true,
      },
    });

    await writeComponentGenerationPlan(plan);
    await writeComponentGenerationPlan(plan);

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

  it('generates platform-specific style files', async () => {
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
        parts: [],
        force: false,
      },
    });

    await writeComponentGenerationPlan(plan);

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

  it('writes and registers component metadata', async () => {
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
        parts: [],
        force: false,
      },
    });

    await writeComponentGenerationPlan(plan);

    const metadata = fs.readFileSync(plan.metadataFile, 'utf8');

    expect(metadata).toContain("name: 'Avatar'");
    expect(metadata).toContain("status: 'experimental'");
    expect(metadata).toContain("layer: 'primitives'");
    expect(metadata).toContain("category: 'data-display'");
    expect(metadata).toContain("'react'");
    expect(metadata).toContain("'react-native'");

    const barrel = fs.readFileSync(plan.metadataBarrelFile, 'utf8');

    expect(barrel).toContain(
      "import { avatarMetadata } from './Avatar.metadata';"
    );
    expect(barrel).toContain('export const componentMetadata = [');
    expect(barrel).toContain('  avatarMetadata,');
    expect(
      barrel.match(/import \{ avatarMetadata \} from '\.\/Avatar\.metadata';/g)
    ).toHaveLength(1);
    expect(barrel.match(/ {2}avatarMetadata,/g)).toHaveLength(1);
  });

  it('generates capabilities from the selected profile', async () => {
    const root = createTempRoot();

    createLayerBarrels(root, 'components');

    const plan = createComponentGenerationPlan({
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

    const result = await writeComponentGenerationPlan(plan);
    const metadata = fs.readFileSync(plan.metadataFile, 'utf8');

    expect(result.createdFiles).toContain(plan.metadataFile);
    expect(metadata).toContain("profile: 'overlay'");
    expect(metadata).toContain("'controlled'");
    expect(metadata).toContain("'uncontrolled'");
    expect(metadata).toContain("'keyboard'");
    expect(metadata).toContain("'focus-management'");
    expect(metadata).toContain("'compound-api'");
    expect(metadata).toContain("'portal'");
  });

  it('generates form-control capabilities in metadata', async () => {
    const root = createTempRoot();

    createLayerBarrels(root, 'primitives');

    const plan = createComponentGenerationPlan({
      root,
      options: {
        componentName: 'FieldControl',
        platform: 'both',
        layer: 'primitives',
        category: 'form',
        profile: 'form-control',
        parts: [],
        force: false,
      },
    });

    await writeComponentGenerationPlan(plan);

    const metadata = fs.readFileSync(plan.metadataFile, 'utf8');

    expect(metadata).toContain("profile: 'form-control'");
    expect(metadata).toContain("'controlled'");
    expect(metadata).toContain("'uncontrolled'");
    expect(metadata).toContain("'disabled'");
    expect(metadata).toContain("'required'");
    expect(metadata).toContain("'invalid'");
  });

  it('generates compound component parts for each target platform', async () => {
    const root = createTempRoot();

    createLayerBarrels(root, 'components');

    const plan = createComponentGenerationPlan({
      root,
      options: {
        componentName: 'Tabs',
        platform: 'both',
        layer: 'components',
        category: 'navigation',
        profile: 'compound',
        parts: ['Root', 'List', 'Trigger', 'Content'],
        force: false,
      },
    });

    await writeComponentGenerationPlan(plan);

    for (const packageName of ['react', 'react-native']) {
      const componentDir = path.join(
        root,
        'packages',
        packageName,
        'src',
        'components',
        'Tabs'
      );

      for (const partName of ['Root', 'List', 'Trigger', 'Content']) {
        const partDir = path.join(componentDir, partName);

        expect(fs.existsSync(path.join(partDir, 'types.ts'))).toBe(true);
        expect(fs.existsSync(path.join(partDir, 'index.ts'))).toBe(true);
        expect(fs.existsSync(path.join(partDir, `Tabs${partName}.tsx`))).toBe(
          true
        );
      }

      const componentSource = fs.readFileSync(
        path.join(componentDir, 'Tabs.tsx'),
        'utf8'
      );

      expect(componentSource).toContain(
        'export const Tabs = Object.assign(TabsRoot, {'
      );
      expect(componentSource).toContain('List: TabsList');
      expect(componentSource).toContain('Trigger: TabsTrigger');
      expect(componentSource).toContain('Content: TabsContent');
      expect(componentSource).not.toContain('Root: TabsRoot');

      const componentIndex = fs.readFileSync(
        path.join(componentDir, 'index.ts'),
        'utf8'
      );

      expect(componentIndex).toContain("export * from './Root';");
      expect(componentIndex).toContain("export * from './List';");
      expect(componentIndex).toContain("export * from './Trigger';");
      expect(componentIndex).toContain("export * from './Content';");
    }
  });

  it('generates platform-specific form-control implementations', async () => {
    const root = createTempRoot();

    createLayerBarrels(root, 'primitives');

    const plan = createComponentGenerationPlan({
      root,
      options: {
        componentName: 'FieldControl',
        platform: 'both',
        layer: 'primitives',
        category: 'form',
        profile: 'form-control',
        parts: [],
        force: false,
      },
    });

    await writeComponentGenerationPlan(plan);

    const webSource = fs.readFileSync(
      path.join(
        root,
        'packages/react/src/primitives/FieldControl/FieldControl.tsx'
      ),
      'utf8'
    );

    const nativeSource = fs.readFileSync(
      path.join(
        root,
        'packages/react-native/src/primitives/FieldControl/FieldControl.tsx'
      ),
      'utf8'
    );

    const webTypes = fs.readFileSync(
      path.join(root, 'packages/react/src/primitives/FieldControl/types.ts'),
      'utf8'
    );

    const nativeTypes = fs.readFileSync(
      path.join(
        root,
        'packages/react-native/src/primitives/FieldControl/types.ts'
      ),
      'utf8'
    );

    const sharedTypes = fs.readFileSync(plan.sharedTypesFile, 'utf8');

    expect(webSource).toContain('<button');
    expect(webSource).toContain('aria-required');
    expect(webSource).toContain('aria-invalid');

    expect(nativeSource).toContain('<Pressable');
    expect(nativeSource).toContain("accessibilityRole='button'");
    expect(nativeSource).toContain('accessibilityState');

    expect(webTypes).toContain(
      "import type { BaseFieldControlProps } from '@vellira-ui/types';"
    );
    expect(nativeTypes).toContain(
      "import type { BaseFieldControlProps } from '@vellira-ui/types';"
    );
    expect(webTypes).toContain(
      'export type FieldControlProps = BaseFieldControlProps;'
    );
    expect(nativeTypes).toContain(
      'export type FieldControlProps = BaseFieldControlProps;'
    );

    expect(sharedTypes).toContain('value?: string');
    expect(sharedTypes).toContain('onValueChange?: (value: string) => void');
  });

  it('generates composed platform-specific overlay parts', async () => {
    const root = createTempRoot();

    createLayerBarrels(root, 'components');

    const plan = createComponentGenerationPlan({
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

    await writeComponentGenerationPlan(plan);

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
    expect(nativeComponent).toContain(
      'export const Dialog = Object.assign(DialogRoot, {'
    );

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

    expect(webTrigger).toContain("aria-haspopup='dialog'");
    expect(nativeTrigger).toContain("accessibilityRole='button'");
  });

  it('writes and registers single-platform component metadata', async () => {
    const root = createTempRoot();
    createLayerBarrels(root, 'components');

    const plan = createComponentGenerationPlan({
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

    await writeComponentGenerationPlan(plan);

    const metadata = fs.readFileSync(plan.metadataFile, 'utf8');
    const barrel = fs.readFileSync(plan.metadataBarrelFile, 'utf8');

    expect(metadata).toContain("name: 'Dialog'");
    expect(metadata).toContain("platforms: ['react']");
    expect(metadata).not.toContain("'react-native'");

    expect(barrel).toContain(
      "import { dialogMetadata } from './Dialog.metadata';"
    );

    expect(barrel).toContain('  dialogMetadata,');
    expect(
      barrel.match(/import \{ dialogMetadata \} from '\.\/Dialog\.metadata';/g)
    ).toHaveLength(1);
    expect(barrel.match(/ {2}dialogMetadata,/g)).toHaveLength(1);
  });
});
