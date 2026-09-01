import fs from 'node:fs';
import path from 'node:path';

import ts from 'typescript';

import type {
  ApiSectionConfig,
  ExtractedDiscriminatedUnion,
  ExtractedProp,
  Platform,
} from '../model/types';

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

export function findPlatformPartTypeSourceFile(params: {
  root: string;
  platform: Platform;
  componentName: string;
  partName: string;
}): string | undefined {
  const componentTypeSource = findPlatformTypeSourceFile({
    root: params.root,
    platform: params.platform,
    name: params.componentName,
  });

  if (!componentTypeSource) {
    return undefined;
  }

  const candidate = path.join(
    path.dirname(componentTypeSource),
    params.partName,
    'types.ts'
  );

  return fs.existsSync(candidate) ? candidate : undefined;
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

function getSingleStringLiteralValue(checker: ts.TypeChecker, type: ts.Type) {
  const nonNullableType = checker.getNonNullableType(type);

  if (nonNullableType.isStringLiteral()) {
    return nonNullableType.value;
  }

  if (!nonNullableType.isUnion()) {
    return null;
  }

  const literals = nonNullableType.types.filter((item) =>
    item.isStringLiteral()
  );

  return literals.length === 1 &&
    literals.length === nonNullableType.types.length
    ? literals[0].value
    : null;
}

function isNeverProp(params: {
  checker: ts.TypeChecker;
  propSymbol: ts.Symbol;
}) {
  const declaration =
    params.propSymbol.valueDeclaration ?? params.propSymbol.declarations?.[0];

  if (!declaration) {
    return false;
  }

  const type = params.checker.getTypeOfSymbolAtLocation(
    params.propSymbol,
    declaration
  );
  const nonNullableType = params.checker.getNonNullableType(type);

  return (nonNullableType.flags & ts.TypeFlags.Never) !== 0;
}

function extractPropSymbols(params: {
  checker: ts.TypeChecker;
  propSymbols: readonly ts.Symbol[];
  excludeNever?: boolean;
}) {
  const { checker, propSymbols } = params;
  const extracted: ExtractedProp[] = [];

  for (const propSymbol of propSymbols) {
    if (
      params.excludeNever &&
      isNeverProp({
        checker,
        propSymbol,
      })
    ) {
      continue;
    }

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

export function extractExportedDiscriminatedUnion(params: {
  sourceFilePath: string;
  exportName: string;
  program: ts.Program;
}): ExtractedDiscriminatedUnion | null {
  const { sourceFilePath, exportName, program } = params;

  const checker = program.getTypeChecker();
  const sourceFile = program.getSourceFile(sourceFilePath);

  if (!sourceFile) {
    return null;
  }

  const moduleSymbol = checker.getSymbolAtLocation(sourceFile);

  if (!moduleSymbol) {
    return null;
  }

  const exportedSymbol = checker
    .getExportsOfModule(moduleSymbol)
    .find((symbol) => symbol.name === exportName);

  if (!exportedSymbol) {
    return null;
  }

  const declaredType = checker.getDeclaredTypeOfSymbol(exportedSymbol);

  if (!declaredType.isUnion()) {
    return null;
  }

  const branches = declaredType.types;

  if (branches.length < 2) {
    return null;
  }

  const branchPropMaps = branches.map((branch) => {
    const entries = checker
      .getPropertiesOfType(branch)
      .map((propSymbol) => [propSymbol.name, propSymbol] as const);

    return new Map(entries);
  });
  const candidateNames = [...branchPropMaps[0].keys()]
    .filter((name) => branchPropMaps.every((props) => props.has(name)))
    .sort((left, right) => left.localeCompare(right));

  for (const candidateName of candidateNames) {
    const values: string[] = [];

    for (const branchProps of branchPropMaps) {
      const propSymbol = branchProps.get(candidateName);
      const declaration =
        propSymbol?.valueDeclaration ?? propSymbol?.declarations?.[0];

      if (!propSymbol || !declaration) {
        values.length = 0;
        break;
      }

      const value = getSingleStringLiteralValue(
        checker,
        checker.getTypeOfSymbolAtLocation(propSymbol, declaration)
      );

      if (!value) {
        values.length = 0;
        break;
      }

      values.push(value);
    }

    if (
      values.length !== branches.length ||
      new Set(values).size !== values.length
    ) {
      continue;
    }

    return {
      discriminator: candidateName,
      branches: branches.map((branch, index) => {
        const propSymbol = branchPropMaps[index].get(candidateName);
        const discriminatorRequired = propSymbol
          ? (propSymbol.flags & ts.SymbolFlags.Optional) === 0
          : false;

        return {
          discriminatorValue: values[index],
          discriminatorRequired,
          props: extractPropSymbols({
            checker,
            propSymbols: checker.getPropertiesOfType(branch),
            excludeNever: true,
          }),
        };
      }),
    };
  }

  return null;
}

export function listComponentParts(params: {
  root: string;
  platform: Platform;
  componentName: string;
}) {
  const typeSource = findPlatformTypeSourceFile({
    root: params.root,
    platform: params.platform,
    name: params.componentName,
  });

  if (!typeSource) {
    return [];
  }

  const componentDir = path.dirname(typeSource);

  return fs
    .readdirSync(componentDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .filter((entry) =>
      fs.existsSync(
        path.join(
          componentDir,
          entry.name,
          `${params.componentName}${entry.name}.tsx`
        )
      )
    )
    .map((entry) => entry.name)
    .sort((left, right) => left.localeCompare(right));
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

export function extractPlatformDiscriminatedUnion(params: {
  root: string;
  componentName: string;
  platform: Platform;
  program?: ts.Program;
}) {
  const { root, componentName, platform } = params;
  const sourceFilePath = findPlatformTypeSourceFile({
    root,
    platform,
    name: componentName,
  });

  if (!sourceFilePath) {
    return null;
  }

  return extractExportedDiscriminatedUnion({
    sourceFilePath,
    exportName: `${componentName}Props`,
    program: params.program ?? createPackageProgram({ root, platform }),
  });
}

export function extractPlatformPartProps(params: {
  root: string;
  componentName: string;
  platform: Platform;
  partName: string;
  program?: ts.Program;
}) {
  const { root, componentName, platform, partName } = params;
  const sourceFilePath = findPlatformPartTypeSourceFile({
    root,
    platform,
    componentName,
    partName,
  });

  if (!sourceFilePath) {
    return [];
  }

  return extractExportedProps({
    sourceFilePath,
    exportName: `${componentName}${partName}Props`,
    program: params.program ?? createPackageProgram({ root, platform }),
  });
}
