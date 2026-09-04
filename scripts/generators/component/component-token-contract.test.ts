import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import { afterEach, describe, expect, it } from 'vitest';

import {
  checkComponentTokenContract,
  ensureComponentTokenContract,
} from './component-token-contract';
import { createComponentGenerationPlan } from './plan';

const roots: string[] = [];

function createPlan() {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'vellira-token-contract-'));
  roots.push(root);

  return createComponentGenerationPlan({
    root,
    options: {
      componentName: 'Disclosure',
      platform: 'both',
      layer: 'components',
      category: 'navigation',
      profile: 'compound',
      capabilities: ['compound-api'],
      parts: ['Root', 'Item', 'Trigger', 'Content'],
      force: false,
    },
  });
}

afterEach(() => {
  for (const root of roots.splice(0)) {
    fs.rmSync(root, { recursive: true, force: true });
  }
});

describe('component token contract', () => {
  it('materializes factory and all theme targets for compound components', () => {
    const plan = createPlan();
    const result = { createdFiles: [] as string[], updatedFiles: [] as string[] };

    expect(checkComponentTokenContract(plan).length).toBeGreaterThan(0);

    ensureComponentTokenContract({ plan, result });

    expect(checkComponentTokenContract(plan)).toEqual([]);
    expect(fs.existsSync(plan.tokenFactoryFile)).toBe(true);
    expect(result.createdFiles).toContain(plan.tokenFactoryFile);

    for (const target of plan.tokenThemeTargets) {
      expect(fs.existsSync(target.componentFile)).toBe(true);
      expect(result.createdFiles).toContain(target.componentFile);
    }
  });

  it('preserves semantic token files on repeated reconciliation', () => {
    const plan = createPlan();
    const result = { createdFiles: [] as string[], updatedFiles: [] as string[] };

    ensureComponentTokenContract({ plan, result });
    fs.writeFileSync(plan.tokenFactoryFile, '// custom semantic token contract\n');

    ensureComponentTokenContract({
      plan,
      result: { createdFiles: [], updatedFiles: [] },
    });

    expect(fs.readFileSync(plan.tokenFactoryFile, 'utf8')).toBe(
      '// custom semantic token contract\n'
    );
    expect(checkComponentTokenContract(plan)).toEqual([]);
  });
});
