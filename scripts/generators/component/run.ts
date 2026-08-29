import path from 'node:path';

import { getComponentApiDocsTargets, getComponentDocsTargets } from './docs';
import { createComponentGenerationPlan } from './plan';
import { validateComponentGenerationPlan } from './preflight';
import { writeComponentGenerationPlan } from './write';
import { generateComponentWebsitePage } from './website';

import type { ComponentGeneratorOptions } from './cli';

export type RunComponentGeneratorResult = {
  plan: ReturnType<typeof createComponentGenerationPlan>;
  createdFiles: string[];
  updatedFiles: string[];
  dryRun: boolean;
};

function getPlannedCreatedFiles(
  plan: ReturnType<typeof createComponentGenerationPlan>
) {
  const files: string[] = [
    plan.metadataFile,
    plan.docsContractFile,
    plan.tokenFactoryFile,
    ...plan.tokenThemeTargets.map((target) => target.componentFile),
    ...getComponentDocsTargets(plan).map((target) => target.docsFile),
  ];

  if (plan.profile === 'form-control') {
    files.push(plan.sharedTypesFile);
  }

  for (const target of plan.targets) {
    const { componentDir, isNative } = target;
    const { componentName } = plan;

    files.push(
      path.join(componentDir, 'types.ts'),
      path.join(componentDir, 'index.ts'),
      path.join(componentDir, `${componentName}.tsx`),
      path.join(componentDir, `${componentName}.stories.tsx`),
      path.join(componentDir, `${componentName}.test.tsx`),
      path.join(componentDir, `${componentName}.test-contract.json`),
      path.join(
        componentDir,
        isNative ? `${componentName}.styles.ts` : `${componentName}.module.scss`
      )
    );

    for (const partName of plan.parts) {
      const partDir = path.join(componentDir, partName);

      files.push(
        path.join(partDir, 'types.ts'),
        path.join(partDir, 'index.ts'),
        path.join(partDir, `${componentName}${partName}.tsx`)
      );
    }
  }

  return files;
}

function getPlannedUpdatedFiles(
  plan: ReturnType<typeof createComponentGenerationPlan>
) {
  const files = [
    ...plan.targets.flatMap((target) => [
      target.barrelFile,
      target.packageBarrelFile,
    ]),
    plan.metadataBarrelFile,
    plan.docsContractRegistryFile,
    ...getComponentApiDocsTargets(plan).map((target) => target.apiFile),
    plan.tokenFactoryBarrelFile,
    ...plan.tokenThemeTargets.map((target) => target.barrelFile),
  ];

  if (plan.profile === 'form-control') {
    files.push(plan.sharedTypesBarrelFile);
  }

  return [...new Set(files)];
}

export async function runComponentGenerator(params: {
  root: string;
  options: ComponentGeneratorOptions;
}): Promise<RunComponentGeneratorResult> {
  const plan = createComponentGenerationPlan(params);

  const preflight = validateComponentGenerationPlan(plan);

  if (!preflight.ok) {
    throw new Error(preflight.errors.join('\n'));
  }

  if (params.options.dryRun) {
    return {
      plan,
      createdFiles: getPlannedCreatedFiles(plan),
      updatedFiles: getPlannedUpdatedFiles(plan),
      dryRun: true,
    };
  }

  const result = await writeComponentGenerationPlan(plan);

  generateComponentWebsitePage({
    root: params.root,
    componentName: plan.componentName,
  });

  return {
    plan,
    ...result,
    dryRun: false,
  };
}
