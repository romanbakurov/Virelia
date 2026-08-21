import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import { describe, expect, it } from 'vitest';

import { createComponentGenerationPlan } from './plan';
import { writeComponentGenerationPlan } from './write';

function createFixtureRoot() {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'vellira-root-exports-'));

  for (const packageName of ['react', 'react-native']) {
    const sourceRoot = path.join(root, 'packages', packageName, 'src');
    const layerRoot = path.join(sourceRoot, 'primitives');

    fs.mkdirSync(layerRoot, { recursive: true });
    fs.writeFileSync(path.join(sourceRoot, 'index.ts'), '');
    fs.writeFileSync(path.join(layerRoot, 'index.ts'), '');
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

  return root;
}

describe('component generator package root exports', () => {
  it('registers public value and type exports exactly once for each target', () => {
    const root = createFixtureRoot();
    const plan = createComponentGenerationPlan({
      root,
      options: {
        componentName: 'Switch',
        platform: 'both',
        layer: 'primitives',
        category: 'form',
        profile: 'form-control',
        control: 'boolean',
        parts: [],
        force: true,
      },
    });

    writeComponentGenerationPlan(plan);
    writeComponentGenerationPlan(plan);

    for (const packageName of ['react', 'react-native']) {
      const source = fs.readFileSync(
        path.join(root, 'packages', packageName, 'src', 'index.ts'),
        'utf8'
      );

      expect(
        source.match(
          /export type \{ SwitchProps \} from '\.\/primitives\/Switch';/g
        )
      ).toHaveLength(1);
      expect(
        source.match(/export \{ Switch \} from '\.\/primitives\/Switch';/g)
      ).toHaveLength(1);
    }
  });
});
