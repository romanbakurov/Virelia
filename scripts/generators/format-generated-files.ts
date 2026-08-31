import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import prettier from 'prettier';

const PRETTIER_EXTENSIONS = new Set(['.css', '.json', '.scss', '.ts', '.tsx']);

const REPOSITORY_CONFIG_SEARCH_PATH = fileURLToPath(
  new URL('../../package.json', import.meta.url)
);

async function resolveGeneratedFileConfig(filePath: string) {
  const fileConfig = await prettier.resolveConfig(filePath);

  if (fileConfig) {
    return fileConfig;
  }

  const repositoryConfig = await prettier.resolveConfig(
    REPOSITORY_CONFIG_SEARCH_PATH
  );

  if (!repositoryConfig) {
    throw new Error(
      `Unable to resolve Vellira Prettier config for generated file: ${filePath}`
    );
  }

  return repositoryConfig;
}

export async function formatGeneratedFiles(
  filePaths: readonly string[]
): Promise<string[]> {
  const changedFiles: string[] = [];

  for (const filePath of [...new Set(filePaths)].sort()) {
    if (
      !fs.existsSync(filePath) ||
      !PRETTIER_EXTENSIONS.has(path.extname(filePath))
    ) {
      continue;
    }

    const currentContent = fs.readFileSync(filePath, 'utf8');
    const config = await resolveGeneratedFileConfig(filePath);

    const formattedContent = await prettier.format(currentContent, {
      ...config,
      filepath: filePath,
    });

    if (formattedContent === currentContent) {
      continue;
    }

    fs.writeFileSync(filePath, formattedContent);
    changedFiles.push(filePath);
  }

  return changedFiles;
}
