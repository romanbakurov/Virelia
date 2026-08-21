import fs from 'node:fs';
import path from 'node:path';

import {
  renderIndexTemplate,
  renderMetadataTemplate,
  renderNativeStylesTemplate,
  renderReadmeTemplate,
  renderStoryTemplate,
  renderStylesTemplate,
  renderTestTemplate,
} from './templates';

import {
  createComponentTestCoverageContract,
  renderComponentTestCoverageContract,
} from './coverage-contract';
import {
  preserveManualComponentTests,
  restoreManualComponentTests,
} from './manual-test-ownership';
import { getComponentProfile } from './profiles';
import { resolveComponentTemplates } from './resolve-templates';
import { resolvePartTemplates } from './resolve-part-templates';

import type {
  ComponentGenerationPlan,
  ComponentGenerationTarget,
} from './plan';

export type ComponentGenerationResult = {
  createdFiles: string[];
  updatedFiles: string[];
};

function resolvePlanCapabilities(plan: ComponentGenerationPlan) {
  const profile = getComponentProfile(plan.profile);

  return [...new Set([...profile.capabilities, ...plan.capabilities])];
}

function writeFile(params: {
  filePath: string;
  content: string;
  createdFiles: string[];
}) {
  const { filePath, content, createdFiles } = params;

  fs.writeFileSync(filePath, content);
  createdFiles.push(filePath);
}

function writePart(params: {
  plan: ComponentGenerationPlan;
  target: ComponentGenerationTarget;
  partName: string;
  result: ComponentGenerationResult;
}) {
  const { plan, target, partName, result } = params;

  const partDir = path.join(target.componentDir, partName);
  const partComponentName = `${plan.componentName}${partName}`;

  const templates = resolvePartTemplates({
    plan,
    target,
    partName,
  });

  fs.mkdirSync(partDir, { recursive: true });

  writeFile({
    filePath: path.join(partDir, 'types.ts'),
    content: templates.types,
    createdFiles: result.createdFiles,
  });

  writeFile({
    filePath: path.join(partDir, 'index.ts'),
    content: templates.index,
    createdFiles: result.createdFiles,
  });

  writeFile({
    filePath: path.join(partDir, `${partComponentName}.tsx`),
    content: templates.component,
    createdFiles: result.createdFiles,
  });
}

function updateBarrel(params: {
  barrelFile: string;
  exportLine: string;
  updatedFiles: string[];
}) {
  const { barrelFile, exportLine, updatedFiles } = params;

  const content = fs.readFileSync(barrelFile, 'utf8');

  if (content.includes(exportLine)) {
    return;
  }

  const nextContent =
    content.length === 0
      ? `${exportLine}\n`
      : `${content.trimEnd()}\n${exportLine}\n`;

  fs.writeFileSync(barrelFile, nextContent);
  updatedFiles.push(barrelFile);
}

function writeTarget(params: {
  plan: ComponentGenerationPlan;
  target: ComponentGenerationTarget;
  result: ComponentGenerationResult;
}) {
  const { plan, target, result } = params;
  const { componentName } = plan;
  const capabilities = resolvePlanCapabilities(plan);
  const preservedManualTests = preserveManualComponentTests(
    target.componentDir
  );

  if (fs.existsSync(target.componentDir)) {
    fs.rmSync(target.componentDir, {
      recursive: true,
      force: true,
    });
  }

  fs.mkdirSync(target.componentDir, { recursive: true });

  for (const partName of plan.parts) {
    writePart({
      plan,
      target,
      partName,
      result,
    });
  }

  const templates = resolveComponentTemplates({
    plan,
    target,
  });

  writeFile({
    filePath: path.join(target.componentDir, 'types.ts'),
    content: templates.types,
    createdFiles: result.createdFiles,
  });

  writeFile({
    filePath: path.join(target.componentDir, 'index.ts'),
    content: renderIndexTemplate({ componentName, parts: plan.parts }),
    createdFiles: result.createdFiles,
  });

  writeFile({
    filePath: path.join(target.componentDir, `${componentName}.tsx`),
    content: templates.component,
    createdFiles: result.createdFiles,
  });

  writeFile({
    filePath: path.join(target.componentDir, `${componentName}.stories.tsx`),
    content: renderStoryTemplate({
      componentName,
      layer: plan.layer,
      isNative: target.isNative,
      profile: plan.profile,
      control: plan.control,
    }),
    createdFiles: result.createdFiles,
  });

  writeFile({
    filePath: path.join(target.componentDir, `${componentName}.test.tsx`),
    content: renderTestTemplate({
      componentName,
      isNative: target.isNative,
      profile: plan.profile,
      control: plan.control,
      capabilities,
      parts: plan.parts,
    }),
    createdFiles: result.createdFiles,
  });

  const coverageContract = createComponentTestCoverageContract({
    componentName,
    profile: plan.profile,
    control: plan.control,
    capabilities,
    parts: plan.parts,
    isNative: target.isNative,
  });

  writeFile({
    filePath: path.join(
      target.componentDir,
      `${componentName}.test-contract.json`
    ),
    content: renderComponentTestCoverageContract(coverageContract),
    createdFiles: result.createdFiles,
  });

  writeFile({
    filePath: path.join(
      target.componentDir,
      target.isNative
        ? `${componentName}.styles.ts`
        : `${componentName}.module.scss`
    ),
    content: target.isNative
      ? renderNativeStylesTemplate({ componentName })
      : renderStylesTemplate({ componentName }),
    createdFiles: result.createdFiles,
  });

  writeFile({
    filePath: path.join(target.componentDir, 'README.md'),
    content: renderReadmeTemplate({ componentName }),
    createdFiles: result.createdFiles,
  });

  restoreManualComponentTests({
    componentDir: target.componentDir,
    tests: preservedManualTests,
  });

  for (const test of preservedManualTests) {
    const restoredPath = path.join(target.componentDir, test.relativePath);

    if (!result.updatedFiles.includes(restoredPath)) {
      result.updatedFiles.push(restoredPath);
    }
  }

  updateBarrel({
    barrelFile: target.barrelFile,
    exportLine: `export * from './${componentName}';`,
    updatedFiles: result.updatedFiles,
  });
}

function registerMetadata(params: {
  metadataBarrelFile: string;
  componentName: string;
  updatedFiles: string[];
}) {
  const { metadataBarrelFile, componentName, updatedFiles } = params;

  const metadataName = `${componentName[0].toLowerCase()}${componentName.slice(1)}Metadata`;
  const importLine = `import { ${metadataName} } from './${componentName}.metadata';`;

  let content = fs.readFileSync(metadataBarrelFile, 'utf8');

  if (!content.includes(importLine)) {
    const importMatches = [...content.matchAll(/^import .*;$/gm)];

    if (importMatches.length > 0) {
      const lastImport = importMatches.at(-1);

      if (!lastImport || lastImport.index === undefined) {
        throw new Error('Unable to locate metadata imports.');
      }

      const insertAt = lastImport.index + lastImport[0].length;

      content =
        content.slice(0, insertAt) +
        `\n${importLine}` +
        content.slice(insertAt);
    } else {
      content = `${importLine}\n\n${content}`;
    }
  }

  const registryMarker = 'export const componentMetadata = [';
  const registryStart = content.indexOf(registryMarker);

  if (registryStart === -1) {
    throw new Error(
      `Missing componentMetadata registry in ${metadataBarrelFile}`
    );
  }

  const registryEnd = content.indexOf('] as const;', registryStart);

  if (registryEnd === -1) {
    throw new Error(
      `Invalid componentMetadata registry in ${metadataBarrelFile}`
    );
  }

  const registryContent = content.slice(registryStart, registryEnd);
  const registryEntry = `  ${metadataName},`;

  if (!registryContent.includes(registryEntry)) {
    content =
      content.slice(0, registryEnd) +
      `${registryEntry}\n` +
      content.slice(registryEnd);
  }

  fs.writeFileSync(metadataBarrelFile, content);

  if (!updatedFiles.includes(metadataBarrelFile)) {
    updatedFiles.push(metadataBarrelFile);
  }
}

function writeMetadata(params: {
  plan: ComponentGenerationPlan;
  result: ComponentGenerationResult;
}) {
  const { plan, result } = params;

  const platforms = plan.targets.map((target) =>
    target.packageName === 'react'
      ? ('react' as const)
      : ('react-native' as const)
  );

  const capabilities = resolvePlanCapabilities(plan);

  writeFile({
    filePath: plan.metadataFile,
    content: renderMetadataTemplate({
      componentName: plan.componentName,
      layer: plan.layer,
      category: plan.category,
      platforms,
      profile: plan.profile,
      capabilities,
    }),
    createdFiles: result.createdFiles,
  });

  registerMetadata({
    metadataBarrelFile: plan.metadataBarrelFile,
    componentName: plan.componentName,
    updatedFiles: result.updatedFiles,
  });
}

export function writeComponentGenerationPlan(
  plan: ComponentGenerationPlan
): ComponentGenerationResult {
  const result: ComponentGenerationResult = {
    createdFiles: [],
    updatedFiles: [],
  };

  for (const target of plan.targets) {
    writeTarget({
      plan,
      target,
      result,
    });
  }

  writeMetadata({
    plan,
    result,
  });

  return result;
}
