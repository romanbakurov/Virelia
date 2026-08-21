import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import { afterEach, describe, expect, it } from 'vitest';

import {
  preserveManualComponentTests,
  restoreManualComponentTests,
} from './manual-test-ownership';

const tempRoots: string[] = [];

function createTempRoot() {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'vellira-manual-tests-'));
  tempRoots.push(root);
  return root;
}

afterEach(() => {
  for (const root of tempRoots.splice(0)) {
    fs.rmSync(root, { recursive: true, force: true });
  }
});

describe('manual test ownership', () => {
  it('preserves only explicitly manual component tests', () => {
    const root = createTempRoot();
    const nested = path.join(root, 'behavior');

    fs.mkdirSync(nested, { recursive: true });
    fs.writeFileSync(path.join(root, 'Switch.test.tsx'), 'generated baseline');
    fs.writeFileSync(
      path.join(root, 'Switch.manual.test.tsx'),
      'manual root test'
    );
    fs.writeFileSync(
      path.join(nested, 'Switch.keyboard.manual.test.tsx'),
      'manual keyboard test'
    );

    const preserved = preserveManualComponentTests(root);

    expect(preserved).toEqual([
      {
        relativePath: 'behavior/Switch.keyboard.manual.test.tsx',
        content: 'manual keyboard test',
      },
      {
        relativePath: 'Switch.manual.test.tsx',
        content: 'manual root test',
      },
    ]);
  });

  it('restores preserved manual tests byte-for-byte after regeneration', () => {
    const root = createTempRoot();
    const manualFile = path.join(root, 'Switch.manual.test.tsx');
    const manualContent = "describe('manual regression', () => {});\n";

    fs.writeFileSync(manualFile, manualContent);

    const preserved = preserveManualComponentTests(root);

    fs.rmSync(root, { recursive: true, force: true });
    fs.mkdirSync(root, { recursive: true });
    fs.writeFileSync(path.join(root, 'Switch.test.tsx'), 'new baseline');

    restoreManualComponentTests({
      componentDir: root,
      tests: preserved,
    });

    expect(fs.readFileSync(manualFile, 'utf8')).toBe(manualContent);
    expect(fs.readFileSync(path.join(root, 'Switch.test.tsx'), 'utf8')).toBe(
      'new baseline'
    );
  });
});
