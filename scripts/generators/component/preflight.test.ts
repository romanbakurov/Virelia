import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import { afterEach, describe, expect, it } from 'vitest';

import { createComponentGenerationPlan } from './plan';
import { validateComponentGenerationPlan } from './preflight';

const tempRoots: string[] = [];

function createTempRoot() {
  const root = fs.mkdtempSync(
    path.join(os.tmpdir(), 'vellira-component-generator-')
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
}

afterEach(() => {
  for (const root of tempRoots.splice(0)) {
    fs.rmSync(root, { recursive: true, force: true });
  }
});

describe('component generator preflight', () => {
  it('accepts a clean generation plan', () => {
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

    expect(validateComponentGenerationPlan(plan)).toEqual({
      ok: true,
      existingTargets: [],
    });
  });

  it('rejects an existing target without --force', () => {
    const root = createTempRoot();
    createLayerBarrels(root);

    const existingDir = path.join(root, 'packages/react/src/primitives/Avatar');

    fs.mkdirSync(existingDir, { recursive: true });

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

    const result = validateComponentGenerationPlan(plan);

    expect(result.ok).toBe(false);

    if (!result.ok) {
      expect(result.errors.join('\n')).toContain(
        'Use --force to overwrite existing component files.'
      );
    }
  });

  it('accepts an existing target with --force', () => {
    const root = createTempRoot();
    createLayerBarrels(root);

    const existingDir = path.join(root, 'packages/react/src/primitives/Avatar');

    fs.mkdirSync(existingDir, { recursive: true });

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

    const result = validateComponentGenerationPlan(plan);

    expect(result).toEqual({
      ok: true,
      existingTargets: [existingDir],
    });
  });

  it('rejects missing layer barrels before writing anything', () => {
    const root = createTempRoot();

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

    const result = validateComponentGenerationPlan(plan);

    expect(result.ok).toBe(false);

    if (!result.ok) {
      expect(result.errors).toContain(
        `Missing layer barrel file: ${plan.targets[0]?.barrelFile}`
      );

      expect(result.errors).toContain(
        `Missing layer barrel file: ${plan.targets[1]?.barrelFile}`
      );

      expect(result.errors).toContain(
        `Missing metadata barrel file: ${plan.metadataBarrelFile}`
      );
    }
  });

  it('rejects existing metadata without --force', () => {
    const root = createTempRoot();
    createLayerBarrels(root);

    const metadataFile = path.join(
      root,
      'packages/metadata/src/components/Avatar.metadata.ts'
    );

    fs.writeFileSync(metadataFile, '');

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

    const result = validateComponentGenerationPlan(plan);

    expect(result.ok).toBe(false);

    if (!result.ok) {
      expect(result.errors.join('\n')).toContain(metadataFile);
      expect(result.errors.join('\n')).toContain(
        'Use --force to overwrite existing component files.'
      );
    }
  });

  it('rejects a missing metadata barrel before writing anything', () => {
    const root = createTempRoot();

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

    const result = validateComponentGenerationPlan(plan);

    expect(result.ok).toBe(false);

    if (!result.ok) {
      expect(result.errors).toContain(
        `Missing metadata barrel file: ${plan.metadataBarrelFile}`
      );
    }
  });

  it('rejects compound components without a Root part', () => {
    const root = createTempRoot();

    createLayerBarrels(root, 'components');

    const plan = createComponentGenerationPlan({
      root,
      options: {
        componentName: 'Tabs',
        platform: 'web',
        layer: 'components',
        category: 'navigation',
        profile: 'compound',
        parts: ['List', 'Trigger', 'Content'],
        force: false,
      },
    });

    const result = validateComponentGenerationPlan(plan);

    expect(result.ok).toBe(false);

    if (!result.ok) {
      expect(result.errors).toContain(
        'Component profile "compound" requires a Root part when parts are provided.'
      );
    }
  });

  it('rejects parts for non-compound profiles', () => {
    const root = createTempRoot();

    createLayerBarrels(root, 'primitives');

    const plan = createComponentGenerationPlan({
      root,
      options: {
        componentName: 'Avatar',
        platform: 'web',
        layer: 'primitives',
        category: 'data-display',
        profile: 'base',
        parts: ['Root', 'Image'],
        force: false,
      },
    });

    const result = validateComponentGenerationPlan(plan);

    expect(result.ok).toBe(false);

    if (!result.ok) {
      expect(result.errors).toContain(
        'Component parts are not supported by the base profile.'
      );
    }
  });

  it('allows parts for overlay profiles', () => {
    const root = createTempRoot();

    createLayerBarrels(root, 'components');

    const plan = createComponentGenerationPlan({
      root,
      options: {
        componentName: 'Popover',
        platform: 'both',
        layer: 'components',
        category: 'overlay',
        profile: 'overlay',
        parts: ['Root', 'Trigger', 'Content'],
        force: false,
      },
    });

    const result = validateComponentGenerationPlan(plan);

    expect(result.ok).toBe(true);
  });

  it('rejects a metadata barrel without the componentMetadata registry', () => {
    const root = createTempRoot();

    createLayerBarrels(root);

    const metadataBarrelFile = path.join(
      root,
      'packages',
      'metadata',
      'src',
      'components',
      'index.ts'
    );

    fs.writeFileSync(metadataBarrelFile, `export const somethingElse = [];\n`);

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

    const result = validateComponentGenerationPlan(plan);

    expect(result.ok).toBe(false);

    if (!result.ok) {
      expect(result.errors).toContain(
        `Missing componentMetadata registry in ${plan.metadataBarrelFile}`
      );
    }
  });

  it('rejects an invalid componentMetadata registry', () => {
    const root = createTempRoot();

    createLayerBarrels(root);

    const metadataBarrelFile = path.join(
      root,
      'packages',
      'metadata',
      'src',
      'components',
      'index.ts'
    );

    fs.writeFileSync(
      metadataBarrelFile,
      `export const componentMetadata = [
`
    );

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

    const result = validateComponentGenerationPlan(plan);

    expect(result.ok).toBe(false);

    if (!result.ok) {
      expect(result.errors).toContain(
        `Invalid componentMetadata registry in ${plan.metadataBarrelFile}`
      );
    }
  });

  it('rejects conflicting metadata registration before writing anything', () => {
    const root = createTempRoot();

    createLayerBarrels(root);

    const metadataBarrelFile = path.join(
      root,
      'packages',
      'metadata',
      'src',
      'components',
      'index.ts'
    );

    fs.writeFileSync(
      metadataBarrelFile,
      `import { avatarMetadata } from './Avatar.metadata';

export const componentMetadata = [
  avatarMetadata,
] as const;
`
    );

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

    const result = validateComponentGenerationPlan(plan);

    expect(result.ok).toBe(false);

    if (!result.ok) {
      expect(result.errors).toContain(
        `Conflicting metadata registration for Avatar in ${plan.metadataBarrelFile}`
      );
    }

    expect(fs.existsSync(plan.metadataFile)).toBe(false);

    for (const target of plan.targets) {
      expect(fs.existsSync(target.componentDir)).toBe(false);
    }
  });
});
