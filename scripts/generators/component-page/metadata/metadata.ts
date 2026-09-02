import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

import ts from 'typescript';

import type { ComponentPageMetadata } from '../../../../apps/website/src/component-catalog/metadata';
import type { ExtractedProp, Platform } from '../model/types';

export type { ComponentPageMetadata };

export type ComponentPageProfile = NonNullable<
  ComponentPageMetadata['profile']
>;

export function loadGeneratedComponentProfile(params: {
  root: string;
  componentName: string;
}): ComponentPageProfile | undefined {
  const metadataFile = path.join(
    params.root,
    'packages',
    'metadata',
    'src',
    'components',
    `${params.componentName}.metadata.ts`
  );

  if (!fs.existsSync(metadataFile)) {
    return undefined;
  }

  const source = fs.readFileSync(metadataFile, 'utf8');
  const match = source.match(
    /\bprofile:\s*['"](base|form-control|compound|overlay)['"]/
  );

  const profile = match?.[1];

  if (!profile) {
    return undefined;
  }

  return profile === 'base' ? 'primitive' : (profile as ComponentPageProfile);
}

export type GeneratedComponentCategory =
  | 'action'
  | 'form'
  | 'navigation'
  | 'overlay'
  | 'feedback'
  | 'data-display'
  | 'layout'
  | 'utility';

export function loadGeneratedComponentCategory(params: {
  root: string;
  componentName: string;
}): GeneratedComponentCategory | undefined {
  const metadataFile = path.join(
    params.root,
    'packages',
    'metadata',
    'src',
    'components',
    `${params.componentName}.metadata.ts`
  );

  if (!fs.existsSync(metadataFile)) {
    return undefined;
  }

  const source = fs.readFileSync(metadataFile, 'utf8');
  const match = source.match(
    /\bcategory:\s*['"](action|form|navigation|overlay|feedback|data-display|layout|utility)['"]/
  );

  return match?.[1] as GeneratedComponentCategory | undefined;
}

export function getComponentCatalogDir(params: {
  catalogComponentsRoot: string;
  componentName: string;
}) {
  return path.join(params.catalogComponentsRoot, params.componentName);
}

export function getComponentMetadataFile(params: {
  catalogComponentsRoot: string;
  componentName: string;
}) {
  return path.join(getComponentCatalogDir(params), 'metadata.ts');
}

export async function loadComponentMetadata(params: {
  catalogComponentsRoot: string;
  componentName: string;
}): Promise<ComponentPageMetadata> {
  const metadataFile = getComponentMetadataFile(params);

  if (!fs.existsSync(metadataFile)) {
    return {};
  }

  const metadataModule = (await import(pathToFileURL(metadataFile).href)) as {
    default?: ComponentPageMetadata;
    metadata?: ComponentPageMetadata;
  };

  return metadataModule.default ?? metadataModule.metadata ?? {};
}

function mergeObject<T extends Record<string, unknown>>(
  base: T | undefined,
  override: T | undefined
) {
  return {
    ...(base ?? {}),
    ...(override ?? {}),
  } as T;
}

export function mergeComponentMetadata(
  base: ComponentPageMetadata,
  override: ComponentPageMetadata
): ComponentPageMetadata {
  return {
    ...base,
    ...override,
    react: mergeObject(base.react, override.react),
    native: mergeObject(base.native, override.native),
    demo: {
      ...(base.demo ?? {}),
      ...(override.demo ?? {}),
      initialValues: mergeObject(
        base.demo?.initialValues,
        override.demo?.initialValues
      ),
      staticProps: mergeObject(
        base.demo?.staticProps,
        override.demo?.staticProps
      ),
    },
    defaults: {
      ...(base.defaults ?? {}),
      ...(override.defaults ?? {}),
      shared: mergeObject(base.defaults?.shared, override.defaults?.shared),
      react: mergeObject(base.defaults?.react, override.defaults?.react),
      native: mergeObject(base.defaults?.native, override.defaults?.native),
    },
    api: {
      ...(base.api ?? {}),
      ...(override.api ?? {}),
      descriptions: mergeObject(
        base.api?.descriptions,
        override.api?.descriptions
      ),
      sections: override.api?.sections ?? base.api?.sections,
    },
    examples: override.examples ?? base.examples,
    accessibility: {
      ...(base.accessibility ?? {}),
      ...(override.accessibility ?? {}),
      react: override.accessibility?.react ?? base.accessibility?.react,
      native: override.accessibility?.native ?? base.accessibility?.native,
    },
    related: override.related ?? base.related,
  };
}

function getParseDiagnostic(
  source: string,
  fileName: string,
  scriptKind: ts.ScriptKind
) {
  const sourceFile = ts.createSourceFile(
    fileName,
    source,
    ts.ScriptTarget.Latest,
    true,
    scriptKind
  );
  const diagnostics =
    (sourceFile as ts.SourceFile & { parseDiagnostics?: ts.Diagnostic[] })
      .parseDiagnostics ?? [];
  const diagnostic = diagnostics.find(
    (item) => item.category === ts.DiagnosticCategory.Error
  );

  return {
    sourceFile,
    error: diagnostic
      ? ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n')
      : null,
  };
}

function importLocallyBindsName(source: string, localName: string) {
  const { sourceFile } = getParseDiagnostic(
    source,
    'component-page-metadata-import.ts',
    ts.ScriptKind.TS
  );

  return sourceFile.statements.some((statement) => {
    if (!ts.isImportDeclaration(statement) || !statement.importClause) {
      return false;
    }

    const { importClause } = statement;

    if (importClause.name?.text === localName) {
      return true;
    }

    const { namedBindings } = importClause;

    if (!namedBindings) {
      return false;
    }

    if (ts.isNamespaceImport(namedBindings)) {
      return namedBindings.name.text === localName;
    }

    return namedBindings.elements.some(
      (element) => element.name.text === localName
    );
  });
}

function validateImportSyntax(source: string) {
  if (!source.trim()) {
    return 'import declaration must not be empty';
  }

  const { error, sourceFile } = getParseDiagnostic(
    source,
    'component-page-metadata-import.ts',
    ts.ScriptKind.TS
  );

  if (error) {
    return error;
  }

  if (
    sourceFile.statements.length === 0 ||
    sourceFile.statements.some((statement) => !ts.isImportDeclaration(statement))
  ) {
    return 'expected import declaration only';
  }

  return null;
}

function validateExpressionSyntax(source: string) {
  return getParseDiagnostic(
    `const value = (${source});`,
    'component-page-metadata-expression.tsx',
    ts.ScriptKind.TSX
  ).error;
}

function validateJsxChildrenSyntax(source: string) {
  return getParseDiagnostic(
    `const value = <>${source}</>;`,
    'component-page-metadata-children.tsx',
    ts.ScriptKind.TSX
  ).error;
}

function validateJsxAttributesSyntax(source: string) {
  const { error, sourceFile } = getParseDiagnostic(
    `const value = <Component ${source} />;`,
    'component-page-metadata-props.tsx',
    ts.ScriptKind.TSX
  );

  if (error) {
    return error;
  }

  const statement = sourceFile.statements[0];
  const declaration =
    statement && ts.isVariableStatement(statement)
      ? statement.declarationList.declarations[0]
      : null;
  const initializer = declaration?.initializer;

  if (!initializer || !ts.isJsxSelfClosingElement(initializer)) {
    return 'expected JSX prop fragments';
  }

  const seen = new Set<string>();

  for (const property of initializer.attributes.properties) {
    if (!ts.isJsxAttribute(property)) {
      continue;
    }

    const name = property.name.getText(sourceFile);

    if (seen.has(name)) {
      return `duplicate JSX prop "${name}"`;
    }

    seen.add(name);
  }

  return null;
}

function validateExampleSetupSyntax(source: string) {
  const result = ts.transpileModule(
    `function ComponentExamplePreview() {\n${source}\n}`,
    {
      compilerOptions: {
        jsx: ts.JsxEmit.Preserve,
        target: ts.ScriptTarget.ES2022,
      },
      fileName: 'component-page-example-setup.tsx',
      reportDiagnostics: true,
    }
  );

  const diagnostic = result.diagnostics?.find(
    (item) => item.category === ts.DiagnosticCategory.Error
  );

  return diagnostic
    ? ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n')
    : null;
}

function containsGeneratedComponentRoot(source: string, componentName: string) {
  const marker = `<${componentName}`;
  let index = source.indexOf(marker);

  while (index !== -1) {
    const nextCharacter = source[index + marker.length];

    if (
      nextCharacter === '>' ||
      (nextCharacter !== undefined && nextCharacter.trim() === '')
    ) {
      return true;
    }

    index = source.indexOf(marker, index + marker.length);
  }

  return false;
}

function normalizePropFragments(props: readonly string[]) {
  return props.flatMap((prop) =>
    prop
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean)
  );
}

function pushValidationError(
  errors: string[],
  field: string,
  error: string | null
) {
  if (error) {
    errors.push(`${field} has invalid syntax: ${error}`);
  }
}

function validateImportList(params: {
  componentName: string;
  errors: string[];
  field: string;
  imports: readonly string[];
}) {
  const reservedBindings = [
    params.componentName,
    `React${params.componentName}`,
    `Native${params.componentName}`,
  ];

  for (const [index, source] of params.imports.entries()) {
    const field = `${params.field}[${index}]`;
    const syntaxError = validateImportSyntax(source);

    if (syntaxError) {
      params.errors.push(`${field} has invalid syntax: ${syntaxError}`);
      continue;
    }

    const reservedBinding = reservedBindings.find((name) =>
      importLocallyBindsName(source, name)
    );

    if (reservedBinding) {
      params.errors.push(
        `${field} must not bind generator-owned name "${reservedBinding}"`
      );
    }
  }
}

export function validateComponentMetadata(params: {
  componentName: string;
  metadata: ComponentPageMetadata;
}) {
  const { componentName, metadata } = params;
  const errors: string[] = [];
  const exampleTitles = new Set<string>();
  const apiSections = new Set<string>();

  if (
    Object.prototype.hasOwnProperty.call(
      metadata.demo?.staticProps ?? {},
      'children'
    )
  ) {
    errors.push(
      'demo.staticProps.children is not supported; use react.children/native.children for inner JSX'
    );
  }

  for (const [name, source] of Object.entries(
    metadata.demo?.staticProps ?? {}
  )) {
    pushValidationError(
      errors,
      `demo.staticProps.${name}`,
      validateExpressionSyntax(source)
    );
  }

  for (const [platform, platformMetadata] of [
    ['react', metadata.react],
    ['react-native', metadata.native],
  ] as const) {
    validateImportList({
      componentName,
      errors,
      field: `${platform}.imports`,
      imports: platformMetadata?.imports ?? [],
    });

    if (platformMetadata?.demoProps) {
      pushValidationError(
        errors,
        `${platform}.demoProps`,
        validateJsxAttributesSyntax(platformMetadata.demoProps)
      );
    }

    if (platformMetadata?.children) {
      pushValidationError(
        errors,
        `${platform}.children`,
        validateJsxChildrenSyntax(platformMetadata.children)
      );

      if (containsGeneratedComponentRoot(platformMetadata.children, componentName)) {
        errors.push(
          `${platform}.children must contain inner child markup, not a second <${componentName}> root`
        );
      }
    }
  }

  for (const [index, example] of (metadata.examples ?? []).entries()) {
    if (exampleTitles.has(example.title)) {
      errors.push(`duplicate example title "${example.title}"`);
    }

    exampleTitles.add(example.title);

    for (const platform of example.platforms ?? []) {
      if (platform !== 'react' && platform !== 'react-native') {
        errors.push(
          `examples[${index}] has unsupported platform "${platform}"`
        );
      }
    }

    validateImportList({
      componentName,
      errors,
      field: `examples[${index}].imports`,
      imports: example.imports ?? [],
    });
    validateImportList({
      componentName,
      errors,
      field: `examples[${index}].reactImports`,
      imports: example.reactImports ?? [],
    });
    validateImportList({
      componentName,
      errors,
      field: `examples[${index}].nativeImports`,
      imports: example.nativeImports ?? [],
    });

    for (const [platform, platformProps, platformChildren, platformSetup] of [
      [
        'react',
        example.reactProps,
        example.reactChildren,
        example.reactSetup,
      ],
      [
        'react-native',
        example.nativeProps,
        example.nativeChildren,
        example.nativeSetup,
      ],
    ] as const) {
      const fragments = normalizePropFragments([
        ...example.props,
        ...(platformProps ?? []),
      ]);

      if (fragments.length > 0) {
        pushValidationError(
          errors,
          `examples[${index}] ${platform} props`,
          validateJsxAttributesSyntax(fragments.join('\n'))
        );
      }

      if (platformChildren) {
        pushValidationError(
          errors,
          `examples[${index}] ${platform} children`,
          validateJsxChildrenSyntax(platformChildren)
        );

        if (containsGeneratedComponentRoot(platformChildren, componentName)) {
          errors.push(
            `examples[${index}] ${platform} children must contain inner child markup, not a second <${componentName}> root`
          );
        }
      }

      const setup = [...(example.setup ?? []), ...(platformSetup ?? [])]
        .map((statement) => statement.trim())
        .filter(Boolean);

      if (setup.length > 0) {
        const setupError = validateExampleSetupSyntax(setup.join('\n'));

        if (setupError) {
          errors.push(
            `examples[${index}] ${platform} setup has invalid TypeScript syntax: ${setupError}`
          );
        }
      }
    }
  }

  for (const section of metadata.api?.sections ?? []) {
    if (apiSections.has(section.name)) {
      errors.push(`duplicate API section "${section.name}"`);
    }

    apiSections.add(section.name);
  }

  if (errors.length > 0) {
    throw new Error(
      `Invalid component page metadata for ${componentName}:\n${errors
        .map((error) => `  - ${error}`)
        .join('\n')}`
    );
  }
}

type ApiProp = Pick<ExtractedProp, 'name' | 'kind'>;

function isBarePropFragment(fragment: string) {
  return /^[A-Za-z_$][A-Za-z0-9_$]*$/.test(fragment);
}

export function validateComponentMetadataAgainstApi(params: {
  componentName: string;
  metadata: ComponentPageMetadata;
  platforms: readonly Platform[];
  reactApiProps: readonly ApiProp[];
  nativeApiProps: readonly ApiProp[];
}) {
  const { componentName, metadata } = params;
  const errors: string[] = [];
  const reactProps = new Map(
    params.reactApiProps.map((prop) => [prop.name, prop])
  );
  const nativeProps = new Map(
    params.nativeApiProps.map((prop) => [prop.name, prop])
  );
  const activePlatformProps = new Map<Platform, Map<string, ApiProp>>([
    ['react', reactProps],
    ['react-native', nativeProps],
  ]);
  const sharedPropNames = new Set(
    params.platforms.flatMap((platform) => [
      ...activePlatformProps.get(platform)!.keys(),
    ])
  );

  function validateSharedNames(
    field: string,
    names: readonly string[]
  ) {
    for (const name of names) {
      if (!sharedPropNames.has(name)) {
        errors.push(
          `${field}.${name} does not match any supported target API prop`
        );
      }
    }
  }

  validateSharedNames(
    'demo.initialValues',
    Object.keys(metadata.demo?.initialValues ?? {})
  );
  validateSharedNames(
    'demo.excludeControls',
    metadata.demo?.excludeControls ?? []
  );
  validateSharedNames(
    'demo.satisfiedRequiredProps',
    metadata.demo?.satisfiedRequiredProps ?? []
  );
  validateSharedNames(
    'defaults.shared',
    Object.keys(metadata.defaults?.shared ?? {})
  );

  for (const [platform, values] of [
    ['react', metadata.defaults?.react],
    ['react-native', metadata.defaults?.native],
  ] as const) {
    const props = activePlatformProps.get(platform)!;

    for (const name of Object.keys(values ?? {})) {
      if (!props.has(name)) {
        errors.push(
          `defaults.${platform === 'react-native' ? 'native' : platform}.${name} does not match the ${platform} target API`
        );
      }
    }
  }

  for (const [index, example] of (metadata.examples ?? []).entries()) {
    const targetPlatforms = (example.platforms ?? params.platforms).filter(
      (platform): platform is Platform => params.platforms.includes(platform)
    );

    for (const platform of targetPlatforms) {
      const apiProps = activePlatformProps.get(platform)!;
      const fragments = normalizePropFragments([
        ...example.props,
        ...(platform === 'react'
          ? (example.reactProps ?? [])
          : (example.nativeProps ?? [])),
      ]);

      for (const fragment of fragments) {
        if (!isBarePropFragment(fragment)) {
          continue;
        }

        const apiProp = apiProps.get(fragment);

        if (!apiProp) {
          errors.push(
            `examples[${index}] ${platform} bare prop "${fragment}" does not match the target API`
          );
        } else if (apiProp.kind !== 'boolean') {
          errors.push(
            `examples[${index}] ${platform} bare prop "${fragment}" requires an explicit assignment because it is not boolean`
          );
        }
      }
    }
  }

  if (errors.length > 0) {
    throw new Error(
      `Invalid component page metadata for ${componentName}:\n${errors
        .map((error) => `  - ${error}`)
        .join('\n')}`
    );
  }
}
