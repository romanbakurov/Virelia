import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import { afterEach, describe, expect, it } from 'vitest';

import { createComponentGenerationPlan } from './plan';
import { validateComponentGenerationPlan } from './preflight';

const roots: string[] = [];

function tempRoot() {
  const root = fs.mkdtempSync(
    path.join(os.tmpdir(), 'vellira-production-preflight-')
  );
  roots.push(root);
  return root;
}

function createRepositoryAuthorities(root: string) {
  for (const packageName of ['react', 'react-native']) {
    const layerDir = path.join(
      root,
      'packages',
      packageName,
      'src',
      'components'
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
  fs.writeFileSync(
    path.join(metadataDir, 'index.ts'),
    'export const componentMetadata = [\n] as const;\n'
  );

  const docsDir = path.join(root, 'apps', 'docs', 'src', 'component-docs');
  fs.mkdirSync(docsDir, { recursive: true });
  fs.writeFileSync(
    path.join(docsDir, 'index.ts'),
    'export const componentDocsContracts = [\n] as const;\n'
  );
}

function plan(
  root: string,
  overrides: Partial<
    Parameters<typeof createComponentGenerationPlan>[0]['options']
  > = {}
) {
  return createComponentGenerationPlan({
    root,
    options: {
      componentName: 'ContractProbe',
      platform: 'web',
      layer: 'components',
      category: 'utility',
      profile: 'base',
      capabilities: [],
      parts: [],
      force: false,
      ...overrides,
    },
  });
}

function expectError(result: ReturnType<typeof validateComponentGenerationPlan>) {
  expect(result.ok).toBe(false);
  if (result.ok) {
    throw new Error('Expected preflight to fail.');
  }
  return result.errors;
}

afterEach(() => {
  for (const root of roots.splice(0)) {
    fs.rmSync(root, { recursive: true, force: true });
  }
});

describe('component production dependency/resource preflight', () => {
  it('accepts existing canonical package, component, and asset dependencies', () => {
    const root = tempRoot();
    createRepositoryAuthorities(root);

    const coreDir = path.join(root, 'packages', 'core');
    fs.mkdirSync(coreDir, { recursive: true });
    fs.writeFileSync(
      path.join(coreDir, 'package.json'),
      JSON.stringify({ name: '@vellira-ui/core' })
    );

    fs.writeFileSync(
      path.join(
        root,
        'packages',
        'metadata',
        'src',
        'components',
        'Tooltip.metadata.ts'
      ),
      'export const tooltipMetadata = {};\n'
    );

    const assetFile = path.join(
      root,
      'packages',
      'assets',
      'styles',
      'contract-probe.css'
    );
    fs.mkdirSync(path.dirname(assetFile), { recursive: true });
    fs.writeFileSync(assetFile, '.probe {}\n');

    const result = validateComponentGenerationPlan(
      plan(root, {
        dependencies: {
          packages: ['@vellira-ui/core'],
          components: ['Tooltip'],
        },
        assets: [
          {
            path: 'styles/contract-probe.css',
            purpose: 'canonical probe surface',
          },
        ],
      })
    );

    expect(result).toEqual({ ok: true, existingTargets: [] });
  });

  it('fails closed for a missing declared canonical package before mutation', () => {
    const root = tempRoot();
    createRepositoryAuthorities(root);
    const result = validateComponentGenerationPlan(
      plan(root, {
        dependencies: { packages: ['@vellira-ui/core'] },
      })
    );

    expect(expectError(result).join('\n')).toContain(
      'missing-canonical-package-dependency: package="@vellira-ui/core"'
    );
    expect(
      fs.existsSync(
        path.join(
          root,
          'packages',
          'react',
          'src',
          'components',
          'ContractProbe'
        )
      )
    ).toBe(false);
  });

  it('fails closed for a missing declared canonical component before mutation', () => {
    const root = tempRoot();
    createRepositoryAuthorities(root);
    const result = validateComponentGenerationPlan(
      plan(root, {
        dependencies: { components: ['Tooltip'] },
      })
    );

    expect(expectError(result).join('\n')).toContain(
      'missing-component-dependency: component="Tooltip"'
    );
  });

  it('rejects self-dependencies deterministically', () => {
    const root = tempRoot();
    createRepositoryAuthorities(root);
    const result = validateComponentGenerationPlan(
      plan(root, {
        dependencies: { components: ['ContractProbe'] },
      })
    );

    expect(expectError(result)).toContain(
      'invalid-component-dependency: component="ContractProbe" cannot depend on itself'
    );
  });

  it('rejects renderer-specific dependencies for an unselected platform', () => {
    const root = tempRoot();
    createRepositoryAuthorities(root);
    const result = validateComponentGenerationPlan(
      plan(root, {
        dependencies: {
          platforms: {
            'react-native': { components: ['Tooltip'] },
          },
        },
      })
    );

    expect(expectError(result)).toContain(
      'invalid-platform-dependency: platform="react-native" is not selected for component="ContractProbe"'
    );
  });

  it('fails closed for a missing canonical asset before mutation', () => {
    const root = tempRoot();
    createRepositoryAuthorities(root);
    const result = validateComponentGenerationPlan(
      plan(root, {
        assets: [
          {
            path: 'styles/missing.css',
            purpose: 'canonical probe surface',
          },
        ],
      })
    );

    expect(expectError(result).join('\n')).toContain(
      'missing-design-asset: path="styles/missing.css" purpose="canonical probe surface"'
    );
  });

  it('rejects assets outside the canonical brand/fonts/styles authority', () => {
    const root = tempRoot();
    createRepositoryAuthorities(root);
    const result = validateComponentGenerationPlan(
      plan(root, {
        assets: [
          {
            path: '../private/probe.css',
            purpose: 'invalid private fallback',
          },
        ],
      })
    );

    expect(expectError(result)).toContain(
      'invalid-design-asset-path: path="../private/probe.css" purpose="invalid private fallback" — expected a canonical brand/, fonts/, or styles/ asset path'
    );
  });
});
