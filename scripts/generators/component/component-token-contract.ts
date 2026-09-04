import fs from 'node:fs';
import path from 'node:path';

import {
  renderComponentTokenBarrelExport,
  renderComponentTokenFactoryBarrelExport,
  renderComponentTokenFactoryTemplate,
  renderThemeComponentTokensTemplate,
} from './templates';
import type { ComponentGenerationPlan } from './plan';

export type ComponentTokenContractMutationResult = {
  createdFiles: string[];
  updatedFiles: string[];
};

function writeCreatedFile(params: {
  filePath: string;
  content: string;
  result: ComponentTokenContractMutationResult;
}) {
  fs.mkdirSync(path.dirname(params.filePath), { recursive: true });
  fs.writeFileSync(params.filePath, params.content);

  if (!params.result.createdFiles.includes(params.filePath)) {
    params.result.createdFiles.push(params.filePath);
  }
}

function ensureExportLine(params: {
  filePath: string;
  exportLine: string;
  result: ComponentTokenContractMutationResult;
}) {
  const content = fs.existsSync(params.filePath)
    ? fs.readFileSync(params.filePath, 'utf8')
    : '';

  if (content.includes(params.exportLine)) return;

  const lines = content
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  lines.push(params.exportLine);
  lines.sort((left, right) => left.localeCompare(right, 'en'));

  fs.mkdirSync(path.dirname(params.filePath), { recursive: true });
  fs.writeFileSync(params.filePath, `${lines.join('\n')}\n`);

  if (!params.result.updatedFiles.includes(params.filePath)) {
    params.result.updatedFiles.push(params.filePath);
  }
}

export function ensureComponentTokenContract(params: {
  plan: ComponentGenerationPlan;
  result: ComponentTokenContractMutationResult;
}) {
  const { plan, result } = params;

  if (!fs.existsSync(plan.tokenFactoryFile)) {
    writeCreatedFile({
      filePath: plan.tokenFactoryFile,
      content: renderComponentTokenFactoryTemplate({
        componentName: plan.componentName,
        profile: plan.profile,
        control: plan.control,
      }),
      result,
    });
  }

  ensureExportLine({
    filePath: plan.tokenFactoryBarrelFile,
    exportLine: renderComponentTokenFactoryBarrelExport(plan.componentName),
    result,
  });

  for (const target of plan.tokenThemeTargets) {
    if (!fs.existsSync(target.componentFile)) {
      writeCreatedFile({
        filePath: target.componentFile,
        content: renderThemeComponentTokensTemplate({
          componentName: plan.componentName,
          profile: plan.profile,
          control: plan.control,
        }),
        result,
      });
    }

    ensureExportLine({
      filePath: target.barrelFile,
      exportLine: renderComponentTokenBarrelExport(plan.componentName),
      result,
    });
  }
}

export function checkComponentTokenContract(plan: ComponentGenerationPlan) {
  const drift: string[] = [];
  const expectedFactoryExport = renderComponentTokenFactoryBarrelExport(
    plan.componentName
  );

  if (!fs.existsSync(plan.tokenFactoryFile)) {
    drift.push(path.relative(plan.root, plan.tokenFactoryFile));
  }

  const factoryBarrel = fs.existsSync(plan.tokenFactoryBarrelFile)
    ? fs.readFileSync(plan.tokenFactoryBarrelFile, 'utf8')
    : '';

  if (!factoryBarrel.includes(expectedFactoryExport)) {
    drift.push(path.relative(plan.root, plan.tokenFactoryBarrelFile));
  }

  const expectedThemeExport = renderComponentTokenBarrelExport(
    plan.componentName
  );

  for (const target of plan.tokenThemeTargets) {
    if (!fs.existsSync(target.componentFile)) {
      drift.push(path.relative(plan.root, target.componentFile));
    }

    const barrel = fs.existsSync(target.barrelFile)
      ? fs.readFileSync(target.barrelFile, 'utf8')
      : '';

    if (!barrel.includes(expectedThemeExport)) {
      drift.push(path.relative(plan.root, target.barrelFile));
    }
  }

  return [...new Set(drift)].sort((left, right) => left.localeCompare(right));
}
