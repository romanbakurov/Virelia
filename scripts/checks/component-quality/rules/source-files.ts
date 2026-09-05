import fs from 'node:fs';
import path from 'node:path';

import type {
  ComponentMetadata,
  ComponentPlatform,
} from '@vellira-ui/metadata';

function platformPackage(platform: ComponentPlatform) {
  return platform === 'react' ? 'react' : 'react-native';
}

export function componentDirectory(
  root: string,
  metadata: ComponentMetadata,
  platform: ComponentPlatform
) {
  return path.join(
    root,
    'packages',
    platformPackage(platform),
    'src',
    metadata.layer,
    metadata.name
  );
}

export function collectFiles(
  directory: string,
  predicate: (fileName: string) => boolean
): string[] {
  if (!fs.existsSync(directory)) return [];

  return fs
    .readdirSync(directory, { withFileTypes: true })
    .flatMap((entry) => {
      const fullPath = path.join(directory, entry.name);

      if (entry.isDirectory()) {
        return collectFiles(fullPath, predicate);
      }

      return predicate(entry.name) ? [fullPath] : [];
    })
    .sort((left, right) => left.localeCompare(right));
}
