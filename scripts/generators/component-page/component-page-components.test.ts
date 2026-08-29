import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import { afterEach, describe, expect, it } from 'vitest';

import { getGeneratedComponentPageComponents } from './component-page-components';
import { generatedFileHeader } from './helpers/paths';

const roots: string[] = [];

function createRoot() {
  const root = fs.mkdtempSync(
    path.join(os.tmpdir(), 'vellira-component-page-components-')
  );

  roots.push(root);

  const componentsRoot = path.join(
    root,
    'apps',
    'website',
    'src',
    'component-catalog',
    'components'
  );

  fs.mkdirSync(componentsRoot, { recursive: true });

  return { root, componentsRoot };
}

function writeComponentIndex(
  componentsRoot: string,
  componentName: string,
  source: string
) {
  const componentRoot = path.join(componentsRoot, componentName);

  fs.mkdirSync(componentRoot, { recursive: true });
  fs.writeFileSync(path.join(componentRoot, 'index.ts'), source);
}

afterEach(() => {
  for (const root of roots.splice(0)) {
    fs.rmSync(root, { recursive: true, force: true });
  }
});

describe('getGeneratedComponentPageComponents', () => {
  it('discovers generator-owned component page directories', () => {
    const { root, componentsRoot } = createRoot();

    writeComponentIndex(
      componentsRoot,
      'Button',
      `${generatedFileHeader}export * from './ButtonUsage';\n`
    );

    expect(getGeneratedComponentPageComponents(root)).toEqual(['Button']);
  });

  it('ignores component directories without the generated file header', () => {
    const { root, componentsRoot } = createRoot();

    writeComponentIndex(
      componentsRoot,
      'CuratedComponent',
      "export * from './CuratedComponentUsage';\n"
    );

    expect(getGeneratedComponentPageComponents(root)).toEqual([]);
  });

  it('returns component names in deterministic order', () => {
    const { root, componentsRoot } = createRoot();

    writeComponentIndex(
      componentsRoot,
      'Tooltip',
      `${generatedFileHeader}export * from './TooltipUsage';\n`
    );
    writeComponentIndex(
      componentsRoot,
      'Button',
      `${generatedFileHeader}export * from './ButtonUsage';\n`
    );
    writeComponentIndex(
      componentsRoot,
      'Switch',
      `${generatedFileHeader}export * from './SwitchUsage';\n`
    );

    expect(getGeneratedComponentPageComponents(root)).toEqual([
      'Button',
      'Switch',
      'Tooltip',
    ]);
  });
});
