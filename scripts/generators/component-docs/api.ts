import fs from 'node:fs';
import path from 'node:path';

import type { ComponentPlatform } from '@vellira-ui/metadata';
import ts from 'typescript';

const apiPlatformByComponentPlatform = {
  react: {
    prefix: 'web',
    packageDir: 'packages/react',
  },
  'react-native': {
    prefix: 'native',
    packageDir: 'packages/react-native',
  },
} as const satisfies Record<
  ComponentPlatform,
  {
    prefix: string;
    packageDir: string;
  }
>;

export function readComponentApiSection(params: {
  root: string;
  componentName: string;
  platform: ComponentPlatform;
}) {
  return readComponentApiSections(params)[0];
}

export type ComponentApiSection = {
  apiId: string;
  relativeApiPath: string;
  typeName: string;
  title: string;
  block: string;
};

export function readComponentApiSections(params: {
  root: string;
  componentName: string;
  platform: ComponentPlatform;
}): ComponentApiSection[] {
  const { root, componentName, platform } = params;
  const apiPlatform = apiPlatformByComponentPlatform[platform];
  const relativeApiPath = path.join(apiPlatform.packageDir, 'API.md');
  const apiFile = path.join(root, relativeApiPath);

  if (!fs.existsSync(apiFile)) {
    throw new Error(
      `Cannot resolve API information for ${componentName} ${platform}: missing ${relativeApiPath}.`
    );
  }

  const content = fs.readFileSync(apiFile, 'utf8');
  const publicApi = readPublicComponentApi({
    root,
    componentName,
    platform,
  });

  return publicApi.typeNames.map((typeName, index) => {
    const apiId = resolveApiId({
      content,
      componentName,
      platform,
      relativeApiPath,
      typeName,
      isRoot: index === 0,
    });
    const block = readApiBlock({
      content,
      apiId,
      componentName,
      platform,
      relativeApiPath,
    });

    return {
      apiId,
      relativeApiPath,
      typeName,
      title: getApiSectionTitle({ componentName, typeName }),
      block,
    };
  });
}

function readApiBlock(params: {
  content: string;
  apiId: string;
  componentName: string;
  platform: ComponentPlatform;
  relativeApiPath: string;
}) {
  const { content, apiId, componentName, platform, relativeApiPath } = params;
  const startMarker = `<!-- api-docgen:start ${apiId} -->`;
  const endMarker = `<!-- api-docgen:end ${apiId} -->`;
  const startIndexes = findMarkerIndexes(content, startMarker);
  const endIndexes = findMarkerIndexes(content, endMarker);

  if (startIndexes.length !== 1 || endIndexes.length !== 1) {
    throw new Error(
      `Cannot resolve API information for ${componentName} ${platform}: expected exactly one ${apiId} block in ${relativeApiPath}.`
    );
  }

  if (startIndexes[0] > endIndexes[0]) {
    throw new Error(
      `Cannot resolve API information for ${componentName} ${platform}: malformed ${apiId} block in ${relativeApiPath}.`
    );
  }

  const block = content
    .slice(startIndexes[0], endIndexes[0] + endMarker.length)
    .trim();

  return block;
}

function resolveApiId(params: {
  content: string;
  componentName: string;
  platform: ComponentPlatform;
  relativeApiPath: string;
  typeName: string;
  isRoot: boolean;
}) {
  const {
    content,
    componentName,
    platform,
    relativeApiPath,
    typeName,
    isRoot,
  } = params;
  const apiPlatform = apiPlatformByComponentPlatform[platform];
  const candidateApiIds = [
    `${apiPlatform.prefix}.${typeName}.${isRoot ? componentName : typeName}`,
    `${apiPlatform.prefix}.${typeName}.${typeName}`,
  ].filter((apiId, index, apiIds) => apiIds.indexOf(apiId) === index);
  const matchingApiIds = candidateApiIds.filter((apiId) =>
    content.includes(`<!-- api-docgen:start ${apiId} -->`)
  );

  if (matchingApiIds.length !== 1) {
    throw new Error(
      `Cannot resolve API information for ${componentName} ${platform}: expected exactly one public ${typeName} API block in ${relativeApiPath}.`
    );
  }

  return matchingApiIds[0];
}

function readPublicComponentApi(params: {
  root: string;
  componentName: string;
  platform: ComponentPlatform;
}) {
  const { root, componentName, platform } = params;
  const apiPlatform = apiPlatformByComponentPlatform[platform];
  const packageIndexFile = path.join(
    root,
    apiPlatform.packageDir,
    'src',
    'index.ts'
  );

  if (!fs.existsSync(packageIndexFile)) {
    throw new Error(
      `Cannot resolve public API for ${componentName} ${platform}: missing ${path.relative(
        root,
        packageIndexFile
      )}.`
    );
  }

  const packageIndexSource = fs.readFileSync(packageIndexFile, 'utf8');
  const sourceFile = ts.createSourceFile(
    packageIndexFile,
    packageIndexSource,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TS
  );
  let publicComponentPath: string | null = null;
  const publicTypeNames = new Set<string>();

  for (const statement of sourceFile.statements) {
    if (
      !ts.isExportDeclaration(statement) ||
      !statement.moduleSpecifier ||
      !ts.isStringLiteral(statement.moduleSpecifier) ||
      !statement.exportClause ||
      !ts.isNamedExports(statement.exportClause)
    ) {
      continue;
    }

    for (const element of statement.exportClause.elements) {
      const exportedName = element.name.text;

      if (
        exportedName === componentName &&
        !statement.isTypeOnly &&
        !element.isTypeOnly &&
        statement.moduleSpecifier.text.endsWith(`/${componentName}`)
      ) {
        publicComponentPath = statement.moduleSpecifier.text;
      }

      if (statement.isTypeOnly || element.isTypeOnly) {
        publicTypeNames.add(exportedName);
      }
    }
  }

  const rootTypeName = `${componentName}Props`;

  if (!publicComponentPath || !publicTypeNames.has(rootTypeName)) {
    throw new Error(
      `Cannot resolve public API for ${componentName} ${platform}: expected package root to export ${componentName} and ${rootTypeName}.`
    );
  }

  const compoundPartNames = readPublicCompoundPartNames({
    componentName,
    packageIndexFile,
    publicComponentPath,
  });
  const typeNames = [
    rootTypeName,
    ...compoundPartNames
      .map((partName) => `${componentName}${partName}Props`)
      .filter((typeName) => publicTypeNames.has(typeName)),
  ];

  return {
    typeNames,
  };
}

function readPublicCompoundPartNames(params: {
  componentName: string;
  packageIndexFile: string;
  publicComponentPath: string;
}) {
  const componentFile = path.join(
    path.dirname(params.packageIndexFile),
    params.publicComponentPath,
    `${params.componentName}.tsx`
  );

  if (!fs.existsSync(componentFile)) {
    return [];
  }

  const sourceFile = ts.createSourceFile(
    componentFile,
    fs.readFileSync(componentFile, 'utf8'),
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TSX
  );

  for (const statement of sourceFile.statements) {
    if (!ts.isVariableStatement(statement)) {
      continue;
    }

    for (const declaration of statement.declarationList.declarations) {
      if (
        ts.isIdentifier(declaration.name) &&
        declaration.name.text === params.componentName &&
        declaration.initializer &&
        ts.isCallExpression(declaration.initializer) &&
        isObjectAssignExpression(declaration.initializer)
      ) {
        const parts = declaration.initializer.arguments[1];

        if (!parts || !ts.isObjectLiteralExpression(parts)) {
          return [];
        }

        return parts.properties.flatMap((property) => {
          if (!ts.isPropertyAssignment(property)) {
            return [];
          }

          const name = getPropertyNameText(property.name);

          return name && name !== 'displayName' ? [name] : [];
        });
      }
    }
  }

  return [];
}

function isObjectAssignExpression(expression: ts.CallExpression) {
  return (
    ts.isPropertyAccessExpression(expression.expression) &&
    expression.expression.expression.getText() === 'Object' &&
    expression.expression.name.text === 'assign'
  );
}

function getPropertyNameText(name: ts.PropertyName) {
  if (ts.isIdentifier(name) || ts.isStringLiteral(name)) {
    return name.text;
  }

  return null;
}

function getApiSectionTitle(params: {
  componentName: string;
  typeName: string;
}) {
  const { componentName, typeName } = params;

  if (typeName === `${componentName}Props`) {
    return `${componentName} Props`;
  }

  return `${componentName}.${typeName.slice(
    componentName.length,
    -'Props'.length
  )} Props`;
}

function findMarkerIndexes(content: string, marker: string) {
  const indexes: number[] = [];
  let fromIndex = 0;

  while (fromIndex < content.length) {
    const index = content.indexOf(marker, fromIndex);

    if (index === -1) {
      break;
    }

    indexes.push(index);
    fromIndex = index + marker.length;
  }

  return indexes;
}
