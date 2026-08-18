import fs from 'node:fs';
import path from 'node:path';

import ts from 'typescript';
import { describe, expect, it } from 'vitest';

const root = process.cwd();

const websiteRoot = path.join(root, 'apps', 'website');
const websiteTsconfig = path.join(websiteRoot, 'tsconfig.json');

function readWebsiteCompilerOptions(): ts.CompilerOptions {
  const configFile = ts.readConfigFile(websiteTsconfig, ts.sys.readFile);

  if (configFile.error) {
    throw new Error(
      ts.flattenDiagnosticMessageText(configFile.error.messageText, '\n')
    );
  }

  const parsed = ts.parseJsonConfigFileContent(
    configFile.config,
    ts.sys,
    websiteRoot
  );

  if (parsed.errors.length > 0) {
    throw new Error(
      parsed.errors
        .map((error) =>
          ts.flattenDiagnosticMessageText(error.messageText, '\n')
        )
        .join('\n')
    );
  }

  return parsed.options;
}

function resolvePackage(params: {
  packageName: string;
  containingFile: string;
  compilerOptions: ts.CompilerOptions;
}): string {
  const result = ts.resolveModuleName(
    params.packageName,
    params.containingFile,
    params.compilerOptions,
    ts.sys
  );

  const resolved = result.resolvedModule?.resolvedFileName;

  if (!resolved) {
    throw new Error(
      `Could not resolve ${params.packageName} from ${params.containingFile}`
    );
  }

  return fs.realpathSync(resolved);
}

function expected(relativePath: string): string {
  return fs.realpathSync(path.join(root, relativePath));
}

describe('workspace source resolution', () => {
  const websiteOptions = readWebsiteCompilerOptions();

  const consumers = [
    {
      packageName: '@vellira-ui/react',
      containingFile: path.join(
        websiteRoot,
        'src',
        '__workspace-resolution-test__.ts'
      ),
      source: 'packages/react/src/index.ts',
      dist: 'packages/react/dist/index.d.ts',
    },
    {
      packageName: '@vellira-ui/react-native',
      containingFile: path.join(
        websiteRoot,
        'src',
        '__workspace-resolution-test__.ts'
      ),
      source: 'packages/react-native/src/index.ts',
      dist: 'packages/react-native/dist/index.d.ts',
    },
    {
      packageName: '@vellira-ui/types',
      containingFile: path.join(root, 'packages/react/src/index.ts'),
      source: 'packages/types/src/index.ts',
      dist: 'packages/types/dist/index.d.ts',
    },
    {
      packageName: '@vellira-ui/core',
      containingFile: path.join(root, 'packages/react-native/src/index.ts'),
      source: 'packages/core/src/index.ts',
      dist: 'packages/core/dist/index.d.ts',
    },
    {
      packageName: '@vellira-ui/tokens',
      containingFile: path.join(root, 'packages/react-native/src/index.ts'),
      source: 'packages/tokens/src/index.ts',
      dist: 'packages/tokens/dist/index.d.ts',
    },
  ] as const;

  it('resolves workspace packages from source when vellira-source is enabled', () => {
    expect(websiteOptions.customConditions).toContain('vellira-source');

    for (const consumer of consumers) {
      expect(
        resolvePackage({
          packageName: consumer.packageName,
          containingFile: consumer.containingFile,
          compilerOptions: websiteOptions,
        })
      ).toBe(expected(consumer.source));
    }
  });

  it('falls back to dist when vellira-source is disabled', () => {
    const publishedOptions: ts.CompilerOptions = {
      ...websiteOptions,
      customConditions:
        websiteOptions.customConditions?.filter(
          (condition) => condition !== 'vellira-source'
        ) ?? [],
    };

    for (const consumer of consumers) {
      expect(
        resolvePackage({
          packageName: consumer.packageName,
          containingFile: consumer.containingFile,
          compilerOptions: publishedOptions,
        })
      ).toBe(expected(consumer.dist));
    }
  });
});
