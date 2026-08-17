import fs from 'node:fs';
import path from 'node:path';

import {
  renderIndexTemplate,
  renderMetadataTemplate,
  renderNativeStylesTemplate,
  renderPartComponentTemplate,
  renderPartIndexTemplate,
  renderPartTypesTemplate,
  renderReadmeTemplate,
  renderStoryTemplate,
  renderStylesTemplate,
  renderTestTemplate,
} from './templates';

import { getComponentProfile } from './profiles';
import { resolveComponentTemplates } from './resolve-templates';

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

  fs.mkdirSync(partDir, { recursive: true });

  writeFile({
    filePath: path.join(partDir, 'types.ts'),
    content: renderPartTypesTemplate({
      componentName: plan.componentName,
      partName,
      isNative: target.isNative,
    }),
    createdFiles: result.createdFiles,
  });

  writeFile({
    filePath: path.join(partDir, 'index.ts'),
    content: renderPartIndexTemplate({
      componentName: plan.componentName,
      partName,
      isNative: target.isNative,
    }),
    createdFiles: result.createdFiles,
  });

  writeFile({
    filePath: path.join(partDir, `${partComponentName}.tsx`),
    content: renderPartComponentTemplate({
      componentName: plan.componentName,
      partName,
      isNative: target.isNative,
    }),
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
    }),
    createdFiles: result.createdFiles,
  });

  writeFile({
    filePath: path.join(target.componentDir, `${componentName}.test.tsx`),
    content: renderTestTemplate({
      componentName,
      isNative: target.isNative,
    }),
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

  updateBarrel({
    barrelFile: target.barrelFile,
    exportLine: `export * from './${componentName}';`,
    updatedFiles: result.updatedFiles,
  });
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

  const profile = getComponentProfile(plan.profile);

  writeFile({
    filePath: plan.metadataFile,
    content: renderMetadataTemplate({
      componentName: plan.componentName,
      layer: plan.layer,
      category: plan.category,
      platforms,
      profile: plan.profile,
      capabilities: profile.capabilities,
    }),
    createdFiles: result.createdFiles,
  });

  const metadataName = `${plan.componentName[0].toLowerCase()}${plan.componentName.slice(1)}Metadata`;

  updateBarrel({
    barrelFile: plan.metadataBarrelFile,
    exportLine: `export { ${metadataName} } from './${plan.componentName}.metadata';`,
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
