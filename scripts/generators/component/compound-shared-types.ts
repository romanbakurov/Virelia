import fs from 'node:fs';
import path from 'node:path';

import { renderSharedCompoundTypesTemplate } from './templates';

import type { ComponentGenerationPlan } from './plan';

export type CompoundSharedTypesResult = {
  createdFiles: string[];
  updatedFiles: string[];
};

function insertSharedTypesExport(content: string, exportLine: string) {
  if (content.includes(exportLine)) {
    return content;
  }

  const matches = [
    ...content.matchAll(/^export \* from '([^']+)';$/gm),
  ];

  if (matches.length === 0) {
    return content.length === 0
      ? `${exportLine}\n`
      : `${content.trimEnd()}\n${exportLine}\n`;
  }

  const source = exportLine.match(/'([^']+)'/)?.[1];

  if (!source) {
    throw new Error(`Invalid shared type export: ${exportLine}`);
  }

  for (const match of matches) {
    const matchedSource = match[1];

    if (matchedSource > source) {
      if (match.index === undefined) {
        throw new Error('Unable to resolve shared type export insertion point.');
      }

      return (
        content.slice(0, match.index) +
        `${exportLine}\n` +
        content.slice(match.index)
      );
    }
  }

  const last = matches.at(-1);

  if (!last || last.index === undefined) {
    throw new Error('Unable to resolve shared type export append point.');
  }

  const insertAt = last.index + last[0].length;
  const nextContent =
    content.slice(0, insertAt) + `\n${exportLine}` + content.slice(insertAt);

  return nextContent.endsWith('\n') ? nextContent : `${nextContent}\n`;
}

export function writeCompoundSharedTypes(
  plan: ComponentGenerationPlan
): CompoundSharedTypesResult {
  const result: CompoundSharedTypesResult = {
    createdFiles: [],
    updatedFiles: [],
  };

  if (plan.profile !== 'compound') {
    return result;
  }

  const nextSharedTypes = renderSharedCompoundTypesTemplate({
    componentName: plan.componentName,
    parts: plan.parts,
  });
  const sharedTypesExists = fs.existsSync(plan.sharedTypesFile);
  const currentSharedTypes = sharedTypesExists
    ? fs.readFileSync(plan.sharedTypesFile, 'utf8')
    : '';

  fs.mkdirSync(path.dirname(plan.sharedTypesFile), { recursive: true });

  if (currentSharedTypes !== nextSharedTypes) {
    fs.writeFileSync(plan.sharedTypesFile, nextSharedTypes);

    if (sharedTypesExists) {
      result.updatedFiles.push(plan.sharedTypesFile);
    } else {
      result.createdFiles.push(plan.sharedTypesFile);
    }
  }

  const sharedFileName = path.basename(plan.sharedTypesFile, '.ts');
  const exportLine = `export * from './${sharedFileName}';`;
  const currentBarrel = fs.existsSync(plan.sharedTypesBarrelFile)
    ? fs.readFileSync(plan.sharedTypesBarrelFile, 'utf8')
    : '';
  const nextBarrel = insertSharedTypesExport(currentBarrel, exportLine);

  if (currentBarrel !== nextBarrel) {
    fs.mkdirSync(path.dirname(plan.sharedTypesBarrelFile), { recursive: true });
    fs.writeFileSync(plan.sharedTypesBarrelFile, nextBarrel);
    result.updatedFiles.push(plan.sharedTypesBarrelFile);
  }

  return result;
}

export function checkCompoundSharedTypesContract(
  plan: ComponentGenerationPlan
): string[] {
  if (plan.profile !== 'compound') {
    return [];
  }

  const driftedFiles: string[] = [];
  const sharedFileName = path.basename(plan.sharedTypesFile, '.ts');
  const expectedBarrelExport = `export * from './${sharedFileName}';`;

  if (!fs.existsSync(plan.sharedTypesFile)) {
    driftedFiles.push(plan.sharedTypesFile);
  }

  if (
    !fs.existsSync(plan.sharedTypesBarrelFile) ||
    !fs
      .readFileSync(plan.sharedTypesBarrelFile, 'utf8')
      .includes(expectedBarrelExport)
  ) {
    driftedFiles.push(plan.sharedTypesBarrelFile);
  }

  for (const target of plan.targets) {
    const componentTypesFile = path.join(target.componentDir, 'types.ts');
    const componentTypes = fs.existsSync(componentTypesFile)
      ? fs.readFileSync(componentTypesFile, 'utf8')
      : '';

    if (
      !componentTypes.includes('@vellira-ui/types') ||
      !componentTypes.includes(`Base${plan.componentName}Props`)
    ) {
      driftedFiles.push(componentTypesFile);
    }

    const rootTypesFile = path.join(target.componentDir, 'Root', 'types.ts');

    if (!fs.existsSync(rootTypesFile)) {
      driftedFiles.push(rootTypesFile);
    }

    const rootComponentFile = path.join(
      target.componentDir,
      'Root',
      `${plan.componentName}Root.tsx`
    );
    const rootComponent = fs.existsSync(rootComponentFile)
      ? fs.readFileSync(rootComponentFile, 'utf8')
      : '';

    if (
      !rootComponent.includes(`${plan.componentName}Props`) ||
      !rootComponent.includes("from '../types'") ||
      rootComponent.includes(`${plan.componentName}RootProps`)
    ) {
      driftedFiles.push(rootComponentFile);
    }

    for (const partName of plan.parts.filter(
      (candidate) => candidate !== 'Root'
    )) {
      const partTypesFile = path.join(
        target.componentDir,
        partName,
        'types.ts'
      );
      const partTypes = fs.existsSync(partTypesFile)
        ? fs.readFileSync(partTypesFile, 'utf8')
        : '';

      if (
        !partTypes.includes('@vellira-ui/types') ||
        !partTypes.includes(`Base${plan.componentName}${partName}Props`)
      ) {
        driftedFiles.push(partTypesFile);
      }
    }
  }

  return [...new Set(driftedFiles)];
}
