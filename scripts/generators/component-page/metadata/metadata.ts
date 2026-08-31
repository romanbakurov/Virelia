import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

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

export function validateComponentMetadata(params: {
  componentName: string;
  metadata: ComponentPageMetadata;
}) {
  const { componentName, metadata } = params;
  const errors: string[] = [];
  const exampleTitles = new Set<string>();
  const apiSections = new Set<string>();

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
