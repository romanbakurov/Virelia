import fs from 'node:fs';
import path from 'node:path';

import {
  renderComponentTokenBarrelExport,
  renderComponentTokenFactoryBarrelExport,
  renderComponentTokenFactoryTemplate,
  renderIndexTemplate,
  renderMetadataTemplate,
  renderNativeStylesTemplate,
  renderSharedFormControlTypesTemplate,
  renderStoryTemplate,
  renderStylesTemplate,
  renderTestTemplate,
  renderThemeComponentTokensTemplate,
} from './templates';

import {
  createComponentTestCoverageContract,
  renderComponentTestCoverageContract,
} from './coverage-contract';
import {
  preserveManualComponentTests,
  restoreManualComponentTests,
} from './manual-test-ownership';
import {
  createComponentMetadataFromPlan,
  generateComponentDocumentation,
  registerComponentDocsContract,
  renderComponentDocsContract,
  resolvePlanCapabilities,
} from './docs';
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

function writeFile(params: {
  filePath: string;
  content: string;
  createdFiles: string[];
}) {
  const { filePath, content, createdFiles } = params;

  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content);
  createdFiles.push(filePath);
}

function writeGeneratedFile(params: {
  filePath: string;
  content: string;
  createdFiles: string[];
  updatedFiles: string[];
}) {
  const { filePath, content, createdFiles, updatedFiles } = params;
  const exists = fs.existsSync(filePath);

  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content);

  if (exists) {
    if (!updatedFiles.includes(filePath)) {
      updatedFiles.push(filePath);
    }

    return;
  }

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

  const content = fs.existsSync(barrelFile)
    ? fs.readFileSync(barrelFile, 'utf8')
    : '';

  if (content.includes(exportLine)) {
    return;
  }

  const nextContent =
    content.length === 0
      ? `${exportLine}\n`
      : `${content.trimEnd()}\n${exportLine}\n`;

  fs.mkdirSync(path.dirname(barrelFile), { recursive: true });
  fs.writeFileSync(barrelFile, nextContent);
  updatedFiles.push(barrelFile);
}

function registerPackageRootExports(params: {
  plan: ComponentGenerationPlan;
  target: ComponentGenerationTarget;
  result: ComponentGenerationResult;
}) {
  const { plan, target, result } = params;
  const exportPath = `./${plan.layer}/${plan.componentName}`;

  updateBarrel({
    barrelFile: target.packageBarrelFile,
    exportLine: `export type { ${plan.componentName}Props } from '${exportPath}';`,
    updatedFiles: result.updatedFiles,
  });

  updateBarrel({
    barrelFile: target.packageBarrelFile,
    exportLine: `export { ${plan.componentName} } from '${exportPath}';`,
    updatedFiles: result.updatedFiles,
  });
}

function writeSharedTypes(params: {
  plan: ComponentGenerationPlan;
  result: ComponentGenerationResult;
}) {
  const { plan, result } = params;

  if (plan.profile !== 'form-control') {
    return;
  }

  writeFile({
    filePath: plan.sharedTypesFile,
    content: renderSharedFormControlTypesTemplate({
      componentName: plan.componentName,
      control: plan.control,
    }),
    createdFiles: result.createdFiles,
  });

  const sharedFileName = path.basename(plan.sharedTypesFile, '.ts');

  updateBarrel({
    barrelFile: plan.sharedTypesBarrelFile,
    exportLine: `export * from './${sharedFileName}';`,
    updatedFiles: result.updatedFiles,
  });
}

function writeComponentTokens(params: {
  plan: ComponentGenerationPlan;
  result: ComponentGenerationResult;
}) {
  const { plan, result } = params;

  writeFile({
    filePath: plan.tokenFactoryFile,
    content: renderComponentTokenFactoryTemplate({
      componentName: plan.componentName,
      profile: plan.profile,
      control: plan.control,
    }),
    createdFiles: result.createdFiles,
  });

  updateBarrel({
    barrelFile: plan.tokenFactoryBarrelFile,
    exportLine: renderComponentTokenFactoryBarrelExport(plan.componentName),
    updatedFiles: result.updatedFiles,
  });

  for (const tokenTarget of plan.tokenThemeTargets) {
    writeFile({
      filePath: tokenTarget.componentFile,
      content: renderThemeComponentTokensTemplate({
        componentName: plan.componentName,
        profile: plan.profile,
        control: plan.control,
      }),
      createdFiles: result.createdFiles,
    });

    updateBarrel({
      barrelFile: tokenTarget.barrelFile,
      exportLine: renderComponentTokenBarrelExport(plan.componentName),
      updatedFiles: result.updatedFiles,
    });
  }
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
      ? renderNativeStylesTemplate({
          componentName,
          profile: plan.profile,
          control: plan.control,
        })
      : renderStylesTemplate({
          componentName,
          profile: plan.profile,
          control: plan.control,
        }),
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

  registerPackageRootExports({ plan, target, result });
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

async function writeComponentDocs(params: {
  plan: ComponentGenerationPlan;
  result: ComponentGenerationResult;
}) {
  const { plan, result } = params;

  writeGeneratedFile({
    filePath: plan.docsContractFile,
    content: renderComponentDocsContract(plan),
    createdFiles: result.createdFiles,
    updatedFiles: result.updatedFiles,
  });

  registerComponentDocsContract({
    registryFile: plan.docsContractRegistryFile,
    componentName: plan.componentName,
    updatedFiles: result.updatedFiles,
  });

  await generateComponentDocumentation({
    root: plan.root,
    plan,
    metadata: createComponentMetadataFromPlan(plan),
    createdFiles: result.createdFiles,
    updatedFiles: result.updatedFiles,
  });
}

export async function writeComponentGenerationPlan(
  plan: ComponentGenerationPlan
): Promise<ComponentGenerationResult> {
  const result: ComponentGenerationResult = {
    createdFiles: [],
    updatedFiles: [],
  };

  writeSharedTypes({ plan, result });
  writeComponentTokens({ plan, result });

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

  await writeComponentDocs({
    plan,
    result,
  });

  return result;
}
