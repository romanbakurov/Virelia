import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import type { ComponentMetadata } from '@vellira-ui/metadata';
import { afterEach, describe, expect, it, vi } from 'vitest';

import {
  controlledContractRule,
  declaredCapabilitiesRule,
  publicApiSurfaceRule,
  sharedTypeContractRule,
} from './api-feature';

const metadata: ComponentMetadata = {
  name: 'Example',
  layer: 'components',
  category: 'form',
  platforms: ['react', 'react-native'],
  profile: 'base',
  status: 'stable',
  capabilities: ['controlled', 'uncontrolled', 'disabled', 'loading'],
  requirements: {
    tests: true,
    storybook: true,
    docs: true,
    accessibility: true,
  },
};

const tempRoots: string[] = [];

function createComponent(params: {
  platform?: 'react' | 'react-native';
  indexSource?: string;
  typesSource?: string;
  implementationSource?: string;
  metadataOverride?: ComponentMetadata;
  sharedTypeSource?: string;
  sharedBarrelSource?: string;
}) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'vellira-quality-'));
  tempRoots.push(root);
  const platform = params.platform ?? 'react';
  const componentDir = path.join(
    root,
    'packages',
    platform,
    'src',
    'components',
    'Example'
  );

  fs.mkdirSync(componentDir, { recursive: true });
  fs.writeFileSync(
    path.join(componentDir, 'index.ts'),
    params.indexSource ?? "export { Example } from './Example';\n"
  );
  fs.writeFileSync(
    path.join(componentDir, 'types.ts'),
    params.typesSource ??
      'export interface ExampleProps { value?: string; defaultValue?: string; disabled?: boolean; loading?: boolean; onValueChange?: (value: string) => void; }\n'
  );
  fs.writeFileSync(
    path.join(componentDir, 'Example.tsx'),
    params.implementationSource ??
      "import type { ExampleProps } from './types';\nexport function Example(props: ExampleProps) { const disabled = props.disabled; const loading = props.loading; return null; }\n"
  );

  if (params.sharedTypeSource !== undefined) {
    const sharedDir = path.join(root, 'packages', 'types', 'src');
    fs.mkdirSync(sharedDir, { recursive: true });
    fs.writeFileSync(
      path.join(sharedDir, 'example.ts'),
      params.sharedTypeSource
    );
    fs.writeFileSync(
      path.join(sharedDir, 'index.ts'),
      params.sharedBarrelSource ?? "export * from './example';\n"
    );
  }

  vi.spyOn(process, 'cwd').mockReturnValue(root);

  return {
    root,
    componentDir,
    metadata: params.metadataOverride ?? metadata,
  };
}

afterEach(() => {
  vi.restoreAllMocks();
  for (const root of tempRoots.splice(0)) {
    fs.rmSync(root, { recursive: true, force: true });
  }
});

describe('API/feature quality rules', () => {
  it('passes a valid public API surface', async () => {
    createComponent({});

    const result = await publicApiSurfaceRule.evaluate({
      metadata,
      platform: 'react',
    });

    expect(result.status).toBe('pass');
  });

  it('fails when the public Props contract is missing', async () => {
    createComponent({ typesSource: 'export type SomethingElse = string;\n' });

    const result = await publicApiSurfaceRule.evaluate({
      metadata,
      platform: 'react',
    });

    expect(result.status).toBe('fail');
    expect(result.message).toContain('ExampleProps');
  });

  it('rejects an orphan Props export unrelated to the callable component', async () => {
    createComponent({
      implementationSource:
        'type LocalProps = { value?: string };\nexport function Example(_props: LocalProps) { return null; }\n',
    });

    const result = await publicApiSurfaceRule.evaluate({
      metadata,
      platform: 'react',
    });

    expect(result.status).toBe('fail');
    expect(result.message).toContain('callable');
  });

  it('passes canonical shared type ownership when metadata declares it', async () => {
    const sharedMetadata: ComponentMetadata = {
      ...metadata,
      dependencies: {
        packages: ['@vellira-ui/types'],
      },
    };

    createComponent({
      metadataOverride: sharedMetadata,
      typesSource:
        "import type { BaseExampleProps } from '@vellira-ui/types';\nexport type ExampleProps = BaseExampleProps;\n",
      implementationSource:
        "import type { ExampleProps } from './types';\nexport function Example(_props: ExampleProps) { return null; }\n",
      sharedTypeSource:
        'export interface BaseExampleProps { value?: string; defaultValue?: string; onValueChange?: (value: string) => void; }\n',
    });

    const result = await sharedTypeContractRule.evaluate({
      metadata: sharedMetadata,
      platform: 'react',
    });

    expect(result.status).toBe('pass');
  });

  it('fails shared ownership when the canonical file is missing', async () => {
    const sharedMetadata: ComponentMetadata = {
      ...metadata,
      dependencies: {
        packages: ['@vellira-ui/types'],
      },
    };

    createComponent({
      metadataOverride: sharedMetadata,
      typesSource:
        "import type { BaseExampleProps } from '@vellira-ui/types';\nexport type ExampleProps = BaseExampleProps;\n",
      implementationSource:
        "import type { ExampleProps } from './types';\nexport function Example(_props: ExampleProps) { return null; }\n",
    });

    const result = await sharedTypeContractRule.evaluate({
      metadata: sharedMetadata,
      platform: 'react',
    });

    expect(result.status).toBe('fail');
    expect(result.message).toContain('BaseExampleProps');
  });

  it('fails shared ownership when a renderer independently redeclares props', async () => {
    const sharedMetadata: ComponentMetadata = {
      ...metadata,
      dependencies: {
        packages: ['@vellira-ui/types'],
      },
    };

    createComponent({
      metadataOverride: sharedMetadata,
      sharedTypeSource:
        'export interface BaseExampleProps { value?: string; }\n',
    });

    const result = await sharedTypeContractRule.evaluate({
      metadata: sharedMetadata,
      platform: 'react',
    });

    expect(result.status).toBe('fail');
    expect(result.message).toContain('@vellira-ui/types');
  });

  it('checks controlled and uncontrolled contracts only when declared', async () => {
    createComponent({});

    const result = await controlledContractRule.evaluate({
      metadata,
      platform: 'react',
    });

    expect(result.status).toBe('pass');
  });

  it('fails when a declared controlled contract has no source evidence', async () => {
    createComponent({
      typesSource: 'export interface ExampleProps { disabled?: boolean; }\n',
    });

    const result = await controlledContractRule.evaluate({
      metadata,
      platform: 'react',
    });

    expect(result.status).toBe('fail');
    expect(result.message).toContain('controlled');
  });

  it('does not penalize controlled behavior when it is not applicable', async () => {
    createComponent({});
    const withoutControlled: ComponentMetadata = {
      ...metadata,
      capabilities: ['disabled'],
    };

    const result = await controlledContractRule.evaluate({
      metadata: withoutControlled,
      platform: 'react',
    });

    expect(result.status).toBe('not-applicable');
  });

  it('passes declared deterministic state capabilities', async () => {
    createComponent({});

    const result = await declaredCapabilitiesRule.evaluate({
      metadata,
      platform: 'react',
    });

    expect(result.status).toBe('pass');
  });

  it('reports implementation drift for a declared capability', async () => {
    createComponent({
      typesSource:
        'export interface ExampleProps { value?: string; defaultValue?: string; onValueChange?: (value: string) => void; }\n',
      implementationSource:
        "import type { ExampleProps } from './types';\nexport function Example(_props: ExampleProps) { return null; }\n",
    });

    const result = await declaredCapabilitiesRule.evaluate({
      metadata,
      platform: 'react',
    });

    expect(result.status).toBe('fail');
    expect(result.message).toContain('disabled');
    expect(result.message).toContain('loading');
  });
});
