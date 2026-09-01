import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import ts from 'typescript';
import { afterEach, describe, expect, it, vi } from 'vitest';

import {
  resolvePageInput,
  resolveComponentPageProfile,
  resolveExtractedProps,
} from './resolve-page-input';

import type { ExtractedProp } from './types';

const tempRoots: string[] = [];

function createFixtureRoot() {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'vellira-page-input-'));
  tempRoots.push(root);

  fs.writeFileSync(
    path.join(root, 'tsconfig.base.json'),
    JSON.stringify({
      compilerOptions: {
        target: 'ES2022',
        module: 'NodeNext',
        moduleResolution: 'NodeNext',
        strict: true,
        jsx: 'react-jsx',
      },
    })
  );

  for (const packageName of ['react', 'react-native']) {
    const packageRoot = path.join(root, 'packages', packageName);

    fs.mkdirSync(path.join(packageRoot, 'src'), { recursive: true });
    fs.writeFileSync(
      path.join(packageRoot, 'tsconfig.json'),
      JSON.stringify({
        extends: '../../tsconfig.base.json',
        compilerOptions: {
          rootDir: 'src',
          noEmit: true,
        },
        include: ['src/**/*.ts', 'src/**/*.tsx'],
      })
    );
  }

  const typesRoot = path.join(root, 'packages', 'types', 'src');

  fs.mkdirSync(typesRoot, { recursive: true });
  fs.writeFileSync(
    path.join(root, 'packages', 'types', 'tsconfig.json'),
    JSON.stringify({
      extends: '../../tsconfig.base.json',
      compilerOptions: {
        rootDir: 'src',
        noEmit: true,
      },
      include: ['src/**/*.ts'],
    })
  );
  fs.writeFileSync(path.join(typesRoot, 'index.ts'), '');

  return root;
}

function writeCompoundFixture(params: {
  root: string;
  packageName: 'react' | 'react-native';
  componentName?: string;
  itemProps: string;
}) {
  const componentName = params.componentName ?? 'Example';
  const componentRoot = path.join(
    params.root,
    'packages',
    params.packageName,
    'src',
    'components',
    componentName
  );

  fs.mkdirSync(componentRoot, { recursive: true });
  fs.writeFileSync(
    path.join(componentRoot, 'types.ts'),
    `export type ${componentName}Props = { children?: ReactNode };
type ReactNode = string;
`
  );

  for (const partName of ['Root', 'Item', 'Trigger', 'Content']) {
    const partRoot = path.join(componentRoot, partName);

    fs.mkdirSync(partRoot, { recursive: true });
    fs.writeFileSync(
      path.join(partRoot, `${componentName}${partName}.tsx`),
      `export function ${componentName}${partName}() {
  return null;
}
`
    );
    fs.writeFileSync(
      path.join(partRoot, 'types.ts'),
      partName === 'Item'
        ? params.itemProps
        : `export type ${componentName}${partName}Props = { children?: ReactNode };
type ReactNode = string;
`
    );
  }
}

function getCatalogComponentsRoot(root: string) {
  return path.join(
    root,
    'apps',
    'website',
    'src',
    'component-catalog',
    'components'
  );
}

function expectGeneratedChildrenToTypeCheck(params: {
  root: string;
  children: string;
  itemPropsSource: string;
}) {
  const filePath = path.join(params.root, 'generated-composition.tsx');

  fs.writeFileSync(
    filePath,
    `type ReactNode = string;
declare namespace JSX {
  type Element = unknown;
  interface IntrinsicElements {}
}

${params.itemPropsSource}
type ExampleTriggerProps = { children?: ReactNode };
type ExampleContentProps = { children?: ReactNode };

declare const Example: {
  Item: (props: ExampleItemProps) => JSX.Element;
  Trigger: (props: ExampleTriggerProps) => JSX.Element;
  Content: (props: ExampleContentProps) => JSX.Element;
};

const generated = (
  <>
    ${params.children}
  </>
);
void generated;
`
  );

  const program = ts.createProgram({
    rootNames: [filePath],
    options: {
      jsx: ts.JsxEmit.Preserve,
      strict: true,
      target: ts.ScriptTarget.ES2022,
      module: ts.ModuleKind.NodeNext,
      moduleResolution: ts.ModuleResolutionKind.NodeNext,
      skipLibCheck: true,
      noEmit: true,
    },
  });
  const diagnostics = ts.getPreEmitDiagnostics(program);

  expect(
    diagnostics.map((diagnostic) =>
      ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n')
    )
  ).toEqual([]);
}

afterEach(() => {
  vi.restoreAllMocks();

  for (const root of tempRoots.splice(0)) {
    fs.rmSync(root, { recursive: true, force: true });
  }
});

function prop(name: string): ExtractedProp {
  return {
    name,
    kind: 'boolean',
    required: false,
    type: 'boolean | undefined',
    description: '',
    sourceFilePath: `/tmp/${name}/types.ts`,
  };
}

describe('resolveExtractedProps', () => {
  it('prefers shared base props when they exist', () => {
    const sharedProps = [prop('disabled')];

    expect(
      resolveExtractedProps({
        sharedProps,
        reactApiProps: [prop('checked')],
        nativeApiProps: [prop('required')],
      })
    ).toEqual(sharedProps);
  });

  it('falls back to deduplicated platform props for Generator V2 components', () => {
    const checked = prop('checked');
    const disabled = prop('disabled');
    const required = prop('required');

    expect(
      resolveExtractedProps({
        sharedProps: [],
        reactApiProps: [checked, disabled],
        nativeApiProps: [checked, required],
      }).map((item) => item.name)
    ).toEqual(['checked', 'disabled', 'required']);
  });
});

describe('resolveComponentPageProfile', () => {
  it('uses the explicit Generator V2 profile before name inference', () => {
    expect(
      resolveComponentPageProfile({
        componentName: 'Accordion',
        requestedProfile: 'compound',
      })
    ).toBe('compound');
  });

  it('uses canonical Generator V2 metadata before legacy name inference', () => {
    expect(
      resolveComponentPageProfile({
        componentName: 'Accordion',
        generatedProfile: 'compound',
      })
    ).toBe('compound');
  });

  it('preserves curated component page metadata over the requested profile', () => {
    expect(
      resolveComponentPageProfile({
        componentName: 'Accordion',
        metadataProfile: 'navigation',
        requestedProfile: 'compound',
      })
    ).toBe('navigation');
  });
});

describe('resolvePageInput compound composition', () => {
  it('derives generated children from each platform compound part prop contract', async () => {
    const root = createFixtureRoot();
    const reactItemProps = `export interface ExampleItemProps {
  webValue: string;
  children?: ReactNode;
}
`;
    const nativeItemProps = `export interface ExampleItemProps {
  nativeCount: number;
  children?: ReactNode;
}
`;

    writeCompoundFixture({
      root,
      packageName: 'react',
      itemProps: `type ReactNode = string;

${reactItemProps}`,
    });
    writeCompoundFixture({
      root,
      packageName: 'react-native',
      itemProps: `type ReactNode = string;

${nativeItemProps}`,
    });

    const input = await resolvePageInput({
      root,
      catalogComponentsRoot: getCatalogComponentsRoot(root),
      componentName: 'Example',
      requestedProfile: 'compound',
    });

    expect(input.componentConfig.react?.children).toContain(
      "<Example.Item webValue='webValue-1'>"
    );
    expect(input.componentConfig.native?.children).toContain(
      '<Example.Item nativeCount={1}>'
    );
    expect(input.componentConfig.react?.children).not.toBe(
      input.componentConfig.native?.children
    );

    expectGeneratedChildrenToTypeCheck({
      root,
      children: input.componentConfig.react?.children ?? '',
      itemPropsSource: reactItemProps,
    });
    expectGeneratedChildrenToTypeCheck({
      root,
      children: input.componentConfig.native?.children ?? '',
      itemPropsSource: nativeItemProps,
    });
  });

  it('renders apostrophe literal union values as JSX-safe expressions', async () => {
    const root = createFixtureRoot();
    const reactItemProps = `export interface ExampleItemProps {
  mode: "can't" | 'normal';
  children?: ReactNode;
}
`;

    writeCompoundFixture({
      root,
      packageName: 'react',
      itemProps: `type ReactNode = string;

${reactItemProps}`,
    });

    const input = await resolvePageInput({
      root,
      catalogComponentsRoot: getCatalogComponentsRoot(root),
      componentName: 'Example',
      requestedProfile: 'compound',
    });

    expect(input.componentConfig.react?.children).toContain('mode={"can\'t"}');

    expectGeneratedChildrenToTypeCheck({
      root,
      children: input.componentConfig.react?.children ?? '',
      itemPropsSource: reactItemProps,
    });
  });

  it('preserves explicit metadata children instead of generating unsupported complex defaults', async () => {
    const root = createFixtureRoot();
    const catalogComponentsRoot = getCatalogComponentsRoot(root);
    const metadataRoot = path.join(catalogComponentsRoot, 'Example');
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    writeCompoundFixture({
      root,
      packageName: 'react',
      itemProps: `type ReactNode = string;

export interface ExampleItemProps {
  renderItem: (value: string) => ReactNode;
  children?: ReactNode;
}
`,
    });

    fs.mkdirSync(metadataRoot, { recursive: true });
    fs.writeFileSync(
      path.join(metadataRoot, 'metadata.ts'),
      `export default {
  profile: 'compound',
  react: {
    children: '<Example.Item renderItem={() => null}><Example.Trigger>Open</Example.Trigger><Example.Content>Content</Example.Content></Example.Item>',
  },
};
`
    );

    const input = await resolvePageInput({
      root,
      catalogComponentsRoot,
      componentName: 'Example',
      requestedProfile: 'compound',
    });

    expect(input.componentConfig.react?.children).toBe(
      '<Example.Item renderItem={() => null}><Example.Trigger>Open</Example.Trigger><Example.Content>Content</Example.Content></Example.Item>'
    );
    expect(warnSpy).not.toHaveBeenCalled();
  });
});
