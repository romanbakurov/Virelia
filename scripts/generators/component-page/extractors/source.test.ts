import path from 'node:path';

import { describe, expect, it, vi } from 'vitest';

import { createPackageProgram, extractComponentProps } from './source';

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
