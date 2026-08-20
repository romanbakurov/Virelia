import fs from 'node:fs';
import path from 'node:path';

import ts from 'typescript';

import type { ApiSectionConfig, ExtractedProp, Platform } from '../model/types';

export function findTypeSourceFile(params: { root: string; name: string }) {
  const typesRoot = path.join(params.root, 'packages', 'types', 'src');
  const { name } = params;
  const candidates = [
    path.join(typesRoot, `${name}.ts`),
    path.join(typesRoot, `${name.charAt(0).toLowerCase()}${name.slice(1)}.ts`),
  ];

  return candidates.find((filePath) => fs.existsSync(filePath));
}

export function findPlatformTypeSourceFile(params: {
  root: string;
  platform: Platform;
  name: string;
}): string | undefined {
  const packageName = params.platform === 'react' ? 'react' : 'react-native';

  const packageRoot = path.join(params.root, 'packages', packageName, 'src');
  const stack = [packageRoot];

  while (stack.length > 0) {
    const current = stack.pop();

    if (!current) continue;

    for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
      const fullPath = path.join(current, entry.name);

      if (entry.isDirectory()) {
        stack.push(fullPath);
        continue;
      }

      if (
        entry.name === 'types.ts' &&
        path.basename(path.dirname(fullPath)) === params.name
      ) {
        return fullPath;
      }
    }
  }

  return undefined;
}

export function listPlatformTypeSourceFiles(params: {
  root: string;
  platform: Platform;
}) {
  const packageName = params.platform === 'react' ? 'react' : 'react-native';
  const packageRoot = path.join(params.root, 'packages', packageName, 'src');
  const stack = [packageRoot];
  const files: string[] = [];

  while (stack.length > 0) {
    const current = stack.pop();

    if (!current) continue;

    for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
      const fullPath = path.join(current, entry.name);

      if (entry.isDirectory()) {
        stack.push(fullPath);
        continue;
      }

      if (entry.name === 'types.ts') {
        files.push(fullPath);
      }
    }
  }

  return files;
}

export function getSectionExportName(
  section: ApiSectionConfig,
  platform: Platform
) {
  if (typeof section.exportName === 'string') {
    return section.exportName;
  }

  return section.exportName[platform];
}

export function findPlatformExportSourceFile(params: {
  root: string;
  exportName: string;
  platform: Platform;
  program: ts.Program;
}) {
  const { exportName, platform, program, root } = params;
  const checker = program.getTypeChecker();

  for (const filePath of listPlatformTypeSourceFiles({ root, platform })) {
    const sourceFile = program.getSourceFile(filePath);

    if (!sourceFile) continue;

    const moduleSymbol = checker.getSymbolAtLocation(sourceFile);

    if (!moduleSymbol) continue;

    const hasExport = checker
      .getExportsOfModule(moduleSymbol)
      .some((symbol) => symbol.name === exportName);

    if (hasExport) {
      return filePath;
    }
  }

  return undefined;
}

export function createTypesProgram(root: string) {
  const tsconfigPath = path.join(root, 'packages', 'types', 'tsconfig.json');

  const configFile = ts.readConfigFile(tsconfigPath, ts.sys.readFile);

  if (configFile.error) {
    const message = ts.flattenDiagnosticMessageText(
      configFile.error.messageText,
      '\n'
    );

    throw new Error(`Failed to read ${tsconfigPath}: ${message}`);
  }

  const parsedConfig = ts.parseJsonConfigFileContent(
    configFile.config,
    ts.sys,
    path.dirname(tsconfigPath)
  );

  return ts.createProgram({
    rootNames: parsedConfig.fileNames,
    options: parsedConfig.options,
  });
}

export function createPackageProgram(params: {
  root: string;
  platform: Platform;
}) {
  const packageName = params.platform === 'react' ? 'react' : 'react-native';

  const tsconfigPath = path.join(
    params.root,
    'packages',
    packageName,
    'tsconfig.json'
  );

  const configFile = ts.readConfigFile(tsconfigPath, ts.sys.readFile);

  if (configFile.error) {
    const message = ts.flattenDiagnosticMessageText(
      configFile.error.messageText,
      '\n'
    );

    throw new Error(`Failed to read ${tsconfigPath}: ${message}`);
  }

  const parsedConfig = ts.parseJsonConfigFileContent(
    configFile.config,
    ts.sys,
    path.dirname(tsconfigPath)
  );

  const workspacePaths = {
    '@vellira-ui/core': [
      path.join(params.root, 'packages', 'core', 'src', 'index.ts'),
    ],
    '@vellira-ui/icons': [
      path.join(params.root, 'packages', 'icons', 'src', 'index.ts'),
    ],
    '@vellira-ui/icons/lottie': [
      path.join(params.root, 'packages', 'icons', 'src', 'lottie.ts'),
    ],
    '@vellira-ui/react-native': [
      path.join(params.root, 'packages', 'react-native', 'src', 'index.ts'),
    ],
    '@vellira-ui/tokens': [
      path.join(params.root, 'packages', 'tokens', 'src', 'index.ts'),
    ],
    '@vellira-ui/types': [
      path.join(params.root, 'packages', 'types', 'src', 'index.ts'),
    ],
  };

  return ts.createProgram({
    rootNames: parsedConfig.fileNames,
    options: {
      ...parsedConfig.options,
      baseUrl: parsedConfig.options.baseUrl ?? params.root,
      paths: {
        ...parsedConfig.options.paths,
        ...workspacePaths,
      },
    },
  });
}

function getLiteralUnionOptions(type: ts.Type) {
  if (!type.isUnion()) {
    return null;
  }

  const options: string[] = [];

  for (const item of type.types) {
    if (item.flags & ts.TypeFlags.Undefined) {
      continue;
    }

    if (!item.isStringLiteral()) {
      return null;
    }

    options.push(item.value);
  }

  return options.length > 0 ? options : null;
}

function extractPropSymbols(params: {
  checker: ts.TypeChecker;
  propSymbols: readonly ts.Symbol[];
}) {
  const { checker, propSymbols } = params;
  const extracted: ExtractedProp[] = [];

  for (const propSymbol of propSymbols) {
    const declaration =
      propSymbol.valueDeclaration ?? propSymbol.declarations?.[0];

    if (!declaration) {
      continue;
    }

    const type = checker.getTypeOfSymbolAtLocation(propSymbol, declaration);

    const typeText = checker.typeToString(
      type,
      declaration,
      ts.TypeFormatFlags.NoTruncation
    );

    const description = ts.displayPartsToString(
      propSymbol.getDocumentationComment(checker)
    );

    const unionOptions = getLiteralUnionOptions(type);
    const nonNullableType = checker.getNonNullableType(type);

    if (unionOptions) {
      extracted.push({
        name: propSymbol.name,
        kind: 'select',
        required: (propSymbol.flags & ts.SymbolFlags.Optional) === 0,
        type: typeText,
        description,
        sourceFilePath: declaration.getSourceFile().fileName,
        options: unionOptions,
      });

      continue;
    }

    let kind: Exclude<ExtractedProp['kind'], 'select'> = 'other';

    if (nonNullableType.flags & ts.TypeFlags.Boolean) {
      kind = 'boolean';
    } else if (
      nonNullableType.flags & ts.TypeFlags.String ||
      nonNullableType.flags & ts.TypeFlags.StringLiteral
    ) {
      kind = 'string';
    } else if (
      nonNullableType.flags & ts.TypeFlags.Number ||
      nonNullableType.flags & ts.TypeFlags.NumberLiteral
    ) {
      kind = 'number';
    }

    extracted.push({
      name: propSymbol.name,
      kind,
      required: (propSymbol.flags & ts.SymbolFlags.Optional) === 0,
      type: typeText,
      description,
      sourceFilePath: declaration.getSourceFile().fileName,
    });
  }

  return extracted;
}

export function extractComponentProps(params: {
  root: string;
  componentName: string;
}): ExtractedProp[] {
  const { root, componentName } = params;
  const sourceFilePath = findTypeSourceFile({
    root,
    name: componentName.charAt(0).toLowerCase() + componentName.slice(1),
  });

  if (!sourceFilePath) {
    console.log(`⚠️ Types source not found for ${componentName}`);
    return [];
  }

  const program = createTypesProgram(root);
  const checker = program.getTypeChecker();

  const sourceFile = program.getSourceFile(sourceFilePath);

  if (!sourceFile) {
    return [];
  }

  const typeNames = [`Base${componentName}Props`, `${componentName}BaseProps`];

  const moduleSymbol = checker.getSymbolAtLocation(sourceFile);

  if (!moduleSymbol) {
    console.log(`⚠️ Module symbol not found for ${sourceFilePath}`);
    return [];
  }

  const exportedSymbol = checker
    .getExportsOfModule(moduleSymbol)
    .find((symbol) => typeNames.includes(symbol.name));

  if (!exportedSymbol) {
    console.log(`⚠️ Export ${typeNames.join(' or ')} not found.`);
    return [];
  }

  const declaredType = checker.getDeclaredTypeOfSymbol(exportedSymbol);
  const propSymbols = checker.getPropertiesOfType(declaredType);

  return extractPropSymbols({ checker, propSymbols });
}

export function extractExportedProps(params: {
  sourceFilePath: string;
  exportName: string;
  program: ts.Program;
}): ExtractedProp[] {
  const { sourceFilePath, exportName, program } = params;

  const checker = program.getTypeChecker();
  const sourceFile = program.getSourceFile(sourceFilePath);

  if (!sourceFile) {
    return [];
  }

  const moduleSymbol = checker.getSymbolAtLocation(sourceFile);

  if (!moduleSymbol) {
    return [];
  }

  const exportedSymbol = checker
    .getExportsOfModule(moduleSymbol)
    .find((symbol) => symbol.name === exportName);

  if (!exportedSymbol) {
    console.log(`⚠️ Export ${exportName} not found in ${sourceFilePath}`);
    return [];
  }

  const declaredType = checker.getDeclaredTypeOfSymbol(exportedSymbol);
  const propSymbols = checker.getPropertiesOfType(declaredType);

  return extractPropSymbols({ checker, propSymbols });
}

export function existsInPackage(params: {
  root: string;
  packageName: 'react' | 'react-native';
  componentName: string;
}) {
  const packageRoot = path.join(
    params.root,
    'packages',
    params.packageName,
    'src'
  );

  const stack = [packageRoot];

  while (stack.length > 0) {
    const current = stack.pop();

    if (!current) continue;

    for (const entry of fs.readdirSync(current, {
      withFileTypes: true,
    })) {
      const fullPath = path.join(current, entry.name);

      if (entry.isDirectory()) {
        if (entry.name === params.componentName) {
          return true;
        }

        stack.push(fullPath);
      }
    }
  }

  return false;
}

export function extractPlatformProps(params: {
  root: string;
  componentName: string;
  platform: Platform;
}) {
  const { root, componentName, platform } = params;
  const sourceFilePath = findPlatformTypeSourceFile({
    root,
    platform,
    name: componentName,
  });

  if (!sourceFilePath) {
    console.log(`⚠️ Platform types not found for ${platform}/${componentName}`);
    return [];
  }

  return extractExportedProps({
    sourceFilePath,
    exportName: `${componentName}Props`,
    program: createPackageProgram({ root, platform }),
  });
}
