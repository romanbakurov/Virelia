import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import { afterEach, describe, expect, it, vi } from 'vitest';

import {
  createPackageProgram,
  extractComponentProps,
  extractPlatformDiscriminatedUnion,
  extractPlatformPartProps,
} from './source';

const tempRoots: string[] = [];

function createFixtureRoot() {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'vellira-source-'));
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
    const sourceRoot = path.join(root, 'packages', packageName, 'src');

    fs.mkdirSync(sourceRoot, { recursive: true });
    fs.writeFileSync(
      path.join(root, 'packages', packageName, 'tsconfig.json'),
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

function writeFixturePartTypes(params: {
  root: string;
  packageName: 'react' | 'react-native';
  componentName: string;
  partName: string;
  types: string;
}) {
  const componentRoot = path.join(
    params.root,
    'packages',
    params.packageName,
    'src',
    'components',
    params.componentName
  );
  const partRoot = path.join(componentRoot, params.partName);

  fs.mkdirSync(partRoot, { recursive: true });
  fs.writeFileSync(
    path.join(componentRoot, 'types.ts'),
    `export type ${params.componentName}Props = { children?: ReactNode };
type ReactNode = string;
`
  );
  fs.writeFileSync(
    path.join(partRoot, `${params.componentName}${params.partName}.tsx`),
    `export function ${params.componentName}${params.partName}() {
  return null;
}
`
  );
  fs.writeFileSync(path.join(partRoot, 'types.ts'), params.types);
}

function writeFixtureComponentTypes(params: {
  root: string;
  packageName: 'react' | 'react-native';
  componentName: string;
  types: string;
}) {
  const componentRoot = path.join(
    params.root,
    'packages',
    params.packageName,
    'src',
    'components',
    params.componentName
  );

  fs.mkdirSync(componentRoot, { recursive: true });
  fs.writeFileSync(path.join(componentRoot, 'types.ts'), params.types);
}

afterEach(() => {
  for (const root of tempRoots.splice(0)) {
    fs.rmSync(root, { recursive: true, force: true });
  }
});

describe('createPackageProgram', () => {
  it('resolves Vellira workspace packages from source instead of dist', () => {
    const root = process.cwd();

    const program = createPackageProgram({
      root,
      platform: 'react',
    });

    const sourceFiles = program
      .getSourceFiles()
      .map((sourceFile) => path.normalize(sourceFile.fileName));

    const typesSource = path.normalize(
      path.join(root, 'packages', 'types', 'src', 'index.ts')
    );

    expect(sourceFiles).toContain(typesSource);

    expect(
      sourceFiles.some((fileName) =>
        fileName.includes(path.normalize('packages/types/dist/'))
      )
    ).toBe(false);
  });
});

describe('extractComponentProps', () => {
  it('treats missing shared types as a valid platform-local types scenario', () => {
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

    try {
      expect(
        extractComponentProps({
          root: process.cwd(),
          componentName: '__GeneratedPlatformOnlyComponent__',
        })
      ).toEqual([]);

      expect(logSpy).not.toHaveBeenCalled();
    } finally {
      logSpy.mockRestore();
    }
  });
});

describe('extractPlatformPartProps', () => {
  it('extracts required status, kinds, and literal options from compound part props', () => {
    const root = createFixtureRoot();

    writeFixturePartTypes({
      root,
      packageName: 'react',
      componentName: 'Example',
      partName: 'Item',
      types: `type ReactNode = string;

export interface ExampleItemProps {
  value: string;
  count: number;
  disabled: boolean;
  mode: 'single' | 'multiple';
  optional?: string;
  children?: ReactNode;
}
`,
    });

    const props = extractPlatformPartProps({
      root,
      componentName: 'Example',
      platform: 'react',
      partName: 'Item',
    });

    expect(
      props.map((prop) => ({
        name: prop.name,
        required: prop.required,
        kind: prop.kind,
        options: prop.kind === 'select' ? prop.options : undefined,
      }))
    ).toEqual([
      {
        name: 'value',
        required: true,
        kind: 'string',
        options: undefined,
      },
      {
        name: 'count',
        required: true,
        kind: 'number',
        options: undefined,
      },
      {
        name: 'disabled',
        required: true,
        kind: 'boolean',
        options: undefined,
      },
      {
        name: 'mode',
        required: true,
        kind: 'select',
        options: ['single', 'multiple'],
      },
      {
        name: 'optional',
        required: false,
        kind: 'string',
        options: undefined,
      },
      {
        name: 'children',
        required: false,
        kind: 'string',
        options: undefined,
      },
    ]);
  });
});

describe('extractPlatformDiscriminatedUnion', () => {
  it('preserves branch order and branch-specific props for discriminated unions', () => {
    const root = createFixtureRoot();

    writeFixtureComponentTypes({
      root,
      packageName: 'react',
      componentName: 'Example',
      types: `export type ExampleProps =
  | {
      mode?: 'single';
      value?: string;
      collapsible?: boolean;
      disabled?: boolean;
    }
  | {
      mode: 'multiple';
      value?: string[];
      collapsible?: never;
      multipleOnly?: boolean;
      disabled?: boolean;
    };
`,
    });

    const union = extractPlatformDiscriminatedUnion({
      root,
      componentName: 'Example',
      platform: 'react',
    });

    expect(union?.discriminator).toBe('mode');
    expect(
      union?.branches.map((branch) => ({
        value: branch.discriminatorValue,
        required: branch.discriminatorRequired,
        props: branch.props.map((prop) => ({
          name: prop.name,
          kind: prop.kind,
          required: prop.required,
          type: prop.type,
        })),
      }))
    ).toEqual([
      {
        value: 'single',
        required: false,
        props: [
          {
            name: 'mode',
            kind: 'select',
            required: false,
            type: '"single" | undefined',
          },
          {
            name: 'value',
            kind: 'string',
            required: false,
            type: 'string | undefined',
          },
          {
            name: 'collapsible',
            kind: 'boolean',
            required: false,
            type: 'boolean | undefined',
          },
          {
            name: 'disabled',
            kind: 'boolean',
            required: false,
            type: 'boolean | undefined',
          },
        ],
      },
      {
        value: 'multiple',
        required: true,
        props: [
          {
            name: 'mode',
            kind: 'string',
            required: true,
            type: '"multiple"',
          },
          {
            name: 'value',
            kind: 'other',
            required: false,
            type: 'string[] | undefined',
          },
          {
            name: 'multipleOnly',
            kind: 'boolean',
            required: false,
            type: 'boolean | undefined',
          },
          {
            name: 'disabled',
            kind: 'boolean',
            required: false,
            type: 'boolean | undefined',
          },
        ],
      },
    ]);
  });
});
