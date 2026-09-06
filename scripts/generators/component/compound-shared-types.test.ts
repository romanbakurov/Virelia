import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import { afterEach, describe, expect, it } from 'vitest';

import {
  checkCompoundSharedTypesContract,
  writeCompoundSharedTypes,
} from './compound-shared-types';
import { createComponentGenerationPlan } from './plan';
import { resolvePartTemplates } from './resolve-part-templates';
import { resolveComponentTemplates } from './resolve-templates';

const tempRoots: string[] = [];

function createPlan() {
  const root = fs.mkdtempSync(
    path.join(os.tmpdir(), 'vellira-compound-shared-types-')
  );
  tempRoots.push(root);

  return createComponentGenerationPlan({
    root,
    options: {
      componentName: 'DisclosureProbe',
      platform: 'both',
      layer: 'components',
      category: 'utility',
      profile: 'compound',
      parts: ['Root', 'Item', 'Trigger', 'Content'],
      force: false,
    },
  });
}

afterEach(() => {
  for (const root of tempRoots.splice(0)) {
    fs.rmSync(root, { recursive: true, force: true });
  }
});

describe('compound shared type ownership', () => {
  it('writes a platform-neutral shared contract and registers its barrel', () => {
    const plan = createPlan();

    fs.mkdirSync(path.dirname(plan.sharedTypesBarrelFile), {
      recursive: true,
    });
    fs.writeFileSync(
      plan.sharedTypesBarrelFile,
      "export * from './button';\nexport * from './tabs';\n"
    );

    const result = writeCompoundSharedTypes(plan);
    const sharedTypes = fs.readFileSync(plan.sharedTypesFile, 'utf8');
    const sharedBarrel = fs.readFileSync(plan.sharedTypesBarrelFile, 'utf8');

    expect(result.createdFiles).toContain(plan.sharedTypesFile);
    expect(result.updatedFiles).toContain(plan.sharedTypesBarrelFile);
    expect(sharedTypes).toContain('BaseDisclosureProbeProps');
    expect(sharedTypes).toContain('BaseDisclosureProbeItemProps');
    expect(sharedTypes).toContain('BaseDisclosureProbeTriggerProps');
    expect(sharedTypes).toContain('BaseDisclosureProbeContentProps');
    expect(sharedTypes).not.toContain("from 'react'");
    expect(sharedTypes).not.toContain("from 'react-native'");
    expect(sharedBarrel).toBe(
      "export * from './button';\nexport * from './disclosureProbe';\nexport * from './tabs';\n"
    );
  });

  it('routes generated platform props through shared Base types', () => {
    const plan = createPlan();

    for (const target of plan.targets) {
      const componentTemplates = resolveComponentTemplates({ plan, target });

      expect(componentTemplates.types).toContain(
        "from '@vellira-ui/types'"
      );
      expect(componentTemplates.types).toContain(
        'BaseDisclosureProbeProps'
      );
      expect(componentTemplates.types).toContain(
        "export type { DisclosureProbeItemProps } from './Item';"
      );

      const rootTemplates = resolvePartTemplates({
        plan,
        target,
        partName: 'Root',
      });
      expect(rootTemplates.types).toBe(
        "export type { DisclosureProbeProps } from '../types';\n"
      );
      expect(rootTemplates.component).toContain(
        'DisclosureProbeProps'
      );
      expect(rootTemplates.component).not.toContain(
        'DisclosureProbeRootProps'
      );

      for (const partName of ['Item', 'Trigger', 'Content'] as const) {
        const partTemplates = resolvePartTemplates({
          plan,
          target,
          partName,
        });

        expect(partTemplates.types).toContain(
          `BaseDisclosureProbe${partName}Props`
        );
        expect(partTemplates.types).toContain(
          "from '@vellira-ui/types'"
        );
      }
    }
  });

  it('accepts a generated compound type topology in check mode', () => {
    const plan = createPlan();

    fs.mkdirSync(path.dirname(plan.sharedTypesBarrelFile), {
      recursive: true,
    });
    fs.writeFileSync(plan.sharedTypesBarrelFile, '');
    writeCompoundSharedTypes(plan);

    for (const target of plan.targets) {
      fs.mkdirSync(target.componentDir, { recursive: true });
      fs.writeFileSync(
        path.join(target.componentDir, 'types.ts'),
        resolveComponentTemplates({ plan, target }).types
      );

      for (const partName of plan.parts) {
        const partDir = path.join(target.componentDir, partName);
        fs.mkdirSync(partDir, { recursive: true });
        fs.writeFileSync(
          path.join(partDir, 'types.ts'),
          resolvePartTemplates({ plan, target, partName }).types
        );
      }
    }

    expect(checkCompoundSharedTypesContract(plan)).toEqual([]);
  });
});
