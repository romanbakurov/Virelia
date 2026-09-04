import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import { afterEach, describe, expect, it } from 'vitest';

import type { ComponentMetadata } from '@vellira-ui/metadata';

import { componentTokenContractRule } from './component-token-contract';

const roots: string[] = [];

function createRoot() {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'vellira-quality-tokens-'));
  roots.push(root);
  return root;
}

function metadata(): ComponentMetadata {
  return {
    name: 'Probe',
    layer: 'components',
    category: 'utility',
    platforms: ['react', 'react-native'],
    profile: 'compound',
    status: 'experimental',
    requirements: {
      tests: true,
      storybook: true,
      docs: true,
      accessibility: true,
      componentTokens: true,
    },
  };
}

function createTokenContract(root: string) {
  const factoryDir = path.join(root, 'packages/tokens/src/factories');
  fs.mkdirSync(factoryDir, { recursive: true });
  fs.writeFileSync(path.join(factoryDir, 'createProbeTokens.ts'), 'export {};\n');
  fs.writeFileSync(
    path.join(factoryDir, 'index.ts'),
    "export * from './createProbeTokens.js';\n"
  );

  for (const theme of ['light', 'dark', 'highContrast']) {
    const dir = path.join(root, 'packages/tokens/src', theme, 'components');
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, 'probe.ts'), 'export const probeTokens = {};\n');
    fs.writeFileSync(
      path.join(dir, 'index.ts'),
      "export { probeTokens as probe } from './probe.js';\n"
    );
  }
}

afterEach(() => {
  for (const root of roots.splice(0)) {
    fs.rmSync(root, { recursive: true, force: true });
  }
});

describe('component token contract quality rule', () => {
  it('rejects generic semantic variables as a substitute for component tokens', () => {
    const root = createRoot();
    createTokenContract(root);

    const componentDir = path.join(root, 'packages/react/src/components/Probe');
    fs.mkdirSync(componentDir, { recursive: true });
    fs.writeFileSync(
      path.join(componentDir, 'Probe.module.scss'),
      '.root { color: var(--text-primary); background: var(--surface-default); }\n'
    );

    const result = componentTokenContractRule.evaluate({
      metadata: metadata(),
      platform: 'react',
      rootDir: root,
    });

    expect(result).toMatchObject({ status: 'fail' });
  });

  it('accepts canonical component token consumption on Web and Native', () => {
    const root = createRoot();
    createTokenContract(root);

    const webDir = path.join(root, 'packages/react/src/components/Probe');
    fs.mkdirSync(webDir, { recursive: true });
    fs.writeFileSync(
      path.join(webDir, 'Probe.module.scss'),
      '.root { color: var(--probe-default-fg); }\n'
    );

    const nativeDir = path.join(
      root,
      'packages/react-native/src/components/Probe'
    );
    fs.mkdirSync(nativeDir, { recursive: true });
    fs.writeFileSync(
      path.join(nativeDir, 'Probe.styles.ts'),
      'export const createStyles = (theme: any) => ({ color: theme.components.probe.default.fg });\n'
    );

    expect(
      componentTokenContractRule.evaluate({
        metadata: metadata(),
        platform: 'react',
        rootDir: root,
      })
    ).toMatchObject({ status: 'pass' });

    expect(
      componentTokenContractRule.evaluate({
        metadata: metadata(),
        platform: 'react-native',
        rootDir: root,
      })
    ).toMatchObject({ status: 'pass' });
  });
});
