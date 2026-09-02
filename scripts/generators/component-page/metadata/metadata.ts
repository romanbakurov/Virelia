import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

import ts from 'typescript';

import type { ComponentPageMetadata } from '../../../../apps/website/src/component-catalog/metadata';

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

function importLocallyBindsName(source: string, localName: string) {
  const sourceFile = ts.createSourceFile(
    'component-page-metadata-import.ts',
    source,
    ts.ScriptTarget.Latest,
    true,
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

export function validateComponentMetadata(params: {
  componentName: string;
  metadata: ComponentPageMetadata;
}) {
  const { componentName, metadata } = params;
  const errors: string[] = [];
  const exampleTitles = new Set<string>();
  const apiSections = new Set<string>();

  for (const [platform, platformMetadata] of [
    ['react', metadata.react],
    ['react-native', metadata.native],
  ] as const) {
    for (const [index, source] of (platformMetadata?.imports ?? []).entries()) {
      if (importLocallyBindsName(source, componentName)) {
        errors.push(
          `${platform}.imports[${index}] must not bind generated component "${componentName}"`
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

    for (const [platform, platformSetup] of [
      ['react', example.reactSetup],
      ['react-native', example.nativeSetup],
    ] as const) {
      const setup = [...(example.setup ?? []), ...(platformSetup ?? [])]
        .map((statement) => statement.trim())
        .filter(Boolean);

      if (setup.length === 0) {
        continue;
      }

      const setupError = validateExampleSetupSyntax(setup.join('\n'));

      if (setupError) {
        errors.push(
          `examples[${index}] ${platform} setup has invalid TypeScript syntax: ${setupError}`
        );
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
