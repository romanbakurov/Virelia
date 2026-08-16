import path from 'node:path';

import { describe, expect, it } from 'vitest';

import { createPackageProgram } from './source';

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
