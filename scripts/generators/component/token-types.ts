import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

export type GeneratedTokenTypesSynchronizationResult = {
  createdFiles: string[];
  updatedFiles: string[];
};

export function getGeneratedTokenTypesFile(root: string): string {
  return path.join(
    path.resolve(root),
    'packages',
    'tokens',
    'src',
    'generated',
    'token-types.ts'
  );
}

export function synchronizeGeneratedTokenTypes(params: {
  root: string;
}): GeneratedTokenTypesSynchronizationResult {
  const root = path.resolve(params.root);
  const outputFile = getGeneratedTokenTypesFile(root);
  const existedBefore = fs.existsSync(outputFile);
  const before = existedBefore ? fs.readFileSync(outputFile) : null;

  const result = spawnSync(
    'pnpm',
    ['--filter', '@vellira-ui/tokens', 'generate:types'],
    {
      cwd: root,
      encoding: 'utf8',
      stdio: 'pipe',
    }
  );

  if (result.error) {
    throw new Error(
      `Generated token type synchronization failed: ${result.error.message}`
    );
  }

  if (result.status !== 0) {
    const output = [result.stdout, result.stderr]
      .filter(Boolean)
      .join('\n')
      .trim();

    throw new Error(
      ['Generated token type synchronization failed.', output]
        .filter(Boolean)
        .join('\n')
    );
  }

  if (!fs.existsSync(outputFile)) {
    throw new Error(
      `Generated token type synchronization did not produce ${path.relative(
        root,
        outputFile
      )}.`
    );
  }

  const after = fs.readFileSync(outputFile);

  if (before !== null && before.equals(after)) {
    return {
      createdFiles: [],
      updatedFiles: [],
    };
  }

  if (existedBefore) {
    return {
      createdFiles: [],
      updatedFiles: [outputFile],
    };
  }

  return {
    createdFiles: [outputFile],
    updatedFiles: [],
  };
}
