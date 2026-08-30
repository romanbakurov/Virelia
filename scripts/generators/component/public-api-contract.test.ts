import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import { describe, expect, it } from 'vitest';

import { createComponentGenerationPlan } from './plan';
import { writeComponentGenerationPlan } from './write';

function createFixtureRoot() {
  const root = fs.mkdtempSync(
    path.join(os.tmpdir(), 'vellira-public-api-contract-')
  );

  for (const packageName of ['react', 'react-native']) {
    const sourceRoot = path.join(root, 'packages', packageName, 'src');
    const layerRoot = path.join(sourceRoot, 'primitives');

    fs.mkdirSync(layerRoot, { recursive: true });

    fs.writeFileSync(path.join(sourceRoot, 'index.ts'), '');
    fs.writeFileSync(path.join(layerRoot, 'index.ts'), '');
    fs.writeFileSync(path.join(root, 'packages', packageName, 'API.md'), '');

    fs.writeFileSync(
      path.join(sourceRoot, 'public-api.test.ts'),
      `import * as api from './index';

describe('public API', () => {
  it('exports only documented runtime entries', () => {
    expect(Object.keys(api).sort()).toEqual([
      'Button',
      'Tooltip',
      'useTheme',
    ]);
  });
});
`
    );
  }

  const metadataRoot = path.join(
    root,
    'packages',
    'metadata',
    'src',
    'components'
  );

  fs.mkdirSync(metadataRoot, { recursive: true });
  fs.writeFileSync(
    path.join(metadataRoot, 'index.ts'),
    `export const componentMetadata = [
] as const;
`
  );

  const docsContractRoot = path.join(
    root,
    'apps',
    'docs',
    'src',
    'component-docs'
  );

  fs.mkdirSync(docsContractRoot, { recursive: true });
  fs.writeFileSync(
    path.join(docsContractRoot, 'index.ts'),
    `export const componentDocsContracts = [
] as const;
`
  );

  return root;
}

function createPlan(
  root: string,
  platform: 'web' | 'native' | 'both',
  force = false
) {
  return createComponentGenerationPlan({
    root,
    options: {
      componentName: 'Avatar',
      platform,
      layer: 'primitives',
      category: 'data-display',
      profile: 'base',
      parts: [],
      force,
    },
  });
}

function readContract(root: string, packageName: 'react' | 'react-native') {
  return fs.readFileSync(
    path.join(root, 'packages', packageName, 'src', 'public-api.test.ts'),
    'utf8'
  );
}

describe('component generator public API contract synchronization', () => {
  it('updates both platform contracts for both generation', async () => {
    const root = createFixtureRoot();

    await writeComponentGenerationPlan(createPlan(root, 'both'));

    for (const packageName of ['react', 'react-native'] as const) {
      const contract = readContract(root, packageName);

      expect(contract).toContain("      'Avatar',");
      expect(contract.match(/ {6}'Avatar',/g)).toHaveLength(1);
      expect(contract.indexOf("'Avatar'")).toBeLessThan(
        contract.indexOf("'Button'")
      );
    }
  });

  it('updates only the React contract for web generation', async () => {
    const root = createFixtureRoot();

    await writeComponentGenerationPlan(createPlan(root, 'web'));

    expect(readContract(root, 'react')).toContain("      'Avatar',");
    expect(readContract(root, 'react-native')).not.toContain("      'Avatar',");
  });

  it('updates only the React Native contract for native generation', async () => {
    const root = createFixtureRoot();

    await writeComponentGenerationPlan(createPlan(root, 'native'));

    expect(readContract(root, 'react')).not.toContain("      'Avatar',");
    expect(readContract(root, 'react-native')).toContain("      'Avatar',");
  });

  it('is idempotent across repeated generation', async () => {
    const root = createFixtureRoot();
    const plan = createPlan(root, 'both');

    await writeComponentGenerationPlan(plan);
    await writeComponentGenerationPlan(plan);

    for (const packageName of ['react', 'react-native'] as const) {
      expect(
        readContract(root, packageName).match(/ {6}'Avatar',/g)
      ).toHaveLength(1);
    }
  });

  it('does not duplicate public API entries with force', async () => {
    const root = createFixtureRoot();
    const plan = createPlan(root, 'both', true);

    await writeComponentGenerationPlan(plan);
    await writeComponentGenerationPlan(plan);

    for (const packageName of ['react', 'react-native'] as const) {
      expect(
        readContract(root, packageName).match(/ {6}'Avatar',/g)
      ).toHaveLength(1);
    }
  });

  it('reports public API contracts as updated artifacts', async () => {
    const root = createFixtureRoot();
    const plan = createPlan(root, 'both');

    const result = await writeComponentGenerationPlan(plan);

    expect(result.updatedFiles).toContain(
      path.join(root, 'packages/react/src/public-api.test.ts')
    );
    expect(result.updatedFiles).toContain(
      path.join(root, 'packages/react-native/src/public-api.test.ts')
    );
  });

  it('fails closed when the public API contract cannot be found', async () => {
    const root = createFixtureRoot();
    const plan = createPlan(root, 'web');

    fs.rmSync(path.join(root, 'packages/react/src/public-api.test.ts'));

    await expect(writeComponentGenerationPlan(plan)).rejects.toThrow(
      'Missing public API contract test'
    );
  });
});
