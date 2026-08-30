import fs from 'node:fs';
import path from 'node:path';

import { generatedFileHeader } from './helpers/paths';

export function getGeneratedComponentPageComponents(
  root = process.cwd()
): string[] {
  const componentsRoot = path.join(
    root,
    'apps',
    'website',
    'src',
    'component-catalog',
    'components'
  );

  return fs
    .readdirSync(componentsRoot, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .filter((componentName) => {
      const indexFile = path.join(componentsRoot, componentName, 'index.ts');

      return (
        fs.existsSync(indexFile) &&
        fs.readFileSync(indexFile, 'utf8').startsWith(generatedFileHeader)
      );
    })
    .sort((left, right) => left.localeCompare(right));
}
