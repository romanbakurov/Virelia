import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import { afterEach, describe, expect, it } from 'vitest';

import { createComponentTestCoverageContract } from '../../generators/component/coverage-contract';
import { checkComponentCompleteness } from './check-component';

import type { ComponentMetadata } from '@vellira-ui/metadata';

const tempRoots: string[] = [];

function createTempRoot() {
  const root = fs.mkdtempSync(
    path.join(os.tmpdir(), 'vellira-test-coverage-integration-')
  );

  tempRoots.push(root);

  return root;
}

function createComponentFixture(params: {
  root: string;
  componentName: string;
  contractCapabilities?: readonly (
    'controlled' | 'uncontrolled' | 'disabled' | 'required' | 'invalid'
  )[];
}) {
  const { root, componentName, contractCapabilities = [] } = params;
  const componentDir = path.join(
    root,
    'packages',
    'react',
    'src',
    'components',
    componentName
  );

  fs.mkdirSync(componentDir, { recursive: true });
  fs.writeFileSync(path.join(componentDir, `${componentName}.tsx`), '');
  fs.writeFileSync(path.join(componentDir, 'types.ts'), '');
  fs.writeFileSync(path.join(componentDir, `${componentName}.stories.tsx`), '');
  fs.writeFileSync(
    path.join(componentDir, 'index.ts'),
    `export * from './${componentName}';\nexport * from './types';\n`
  );
  fs.writeFileSync(
    path.join(root, 'packages', 'react', 'src', 'components', 'index.ts'),
    `export * from './${componentName}';\n`
  );

  const contract = createComponentTestCoverageContract({
    componentName,
    profile: 'form-control',
    control: 'boolean',
    capabilities: contractCapabilities,
    isNative: false,
  });
  const marker = `// Baseline contract: ${contract.baseline.requirements.join(', ')}`;

  fs.writeFileSync(
    path.join(componentDir, `${componentName}.test.tsx`),
    `${marker}\n`
  );
  fs.writeFileSync(
    path.join(componentDir, `${componentName}.test-contract.json`),
    `${JSON.stringify(contract, null, 2)}\n`
  );

  return componentDir;
}

function createMetadata(
  capabilities: NonNullable<ComponentMetadata['capabilities']>
): ComponentMetadata {
  return {
    name: 'Switch',
    layer: 'components',
    category: 'form',
    platforms: ['react'],
    profile: 'form-control',
    status: 'experimental',
    capabilities,
    requirements: {
      tests: true,
      storybook: false,
      docs: false,
      accessibility: false,
    },
  };
}

afterEach(() => {
  for (const root of tempRoots.splice(0)) {
    fs.rmSync(root, { recursive: true, force: true });
  }
});

describe('component completeness test coverage integration', () => {
  it('uses semantic coverage validation when a contract sidecar exists', () => {
    const root = createTempRoot();
    const capabilities = [
      'controlled',
      'uncontrolled',
      'disabled',
      'required',
      'invalid',
    ] as const;

    createComponentFixture({
      root,
      componentName: 'Switch',
      contractCapabilities: capabilities,
    });

    const result = checkComponentCompleteness({
      root,
      metadata: createMetadata(capabilities),
    });

    expect(result.ready).toBe(true);
    expect(result.checks).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          name: 'tests',
          platform: 'react',
          ok: true,
        }),
      ])
    );
  });

  it('reports capability drift instead of accepting test-file presence', () => {
    const root = createTempRoot();

    createComponentFixture({
      root,
      componentName: 'Switch',
      contractCapabilities: ['controlled', 'uncontrolled'],
    });

    const result = checkComponentCompleteness({
      root,
      metadata: createMetadata(['controlled', 'uncontrolled', 'disabled']),
    });

    expect(result.ready).toBe(false);
    expect(result.checks).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          name: 'tests',
          platform: 'react',
          ok: false,
          details: expect.stringContaining(
            'Test coverage contract requirements drift'
          ),
        }),
      ])
    );
  });

  it('keeps legacy test-file presence behavior without a contract sidecar', () => {
    const root = createTempRoot();
    const componentDir = createComponentFixture({
      root,
      componentName: 'Switch',
    });

    fs.rmSync(path.join(componentDir, 'Switch.test-contract.json'));

    const result = checkComponentCompleteness({
      root,
      metadata: createMetadata([]),
    });

    expect(result.ready).toBe(true);
  });
});
