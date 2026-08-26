import fs from 'node:fs';
import path from 'node:path';

import type { ComponentPlatform } from '@vellira-ui/metadata';

const apiPlatformByComponentPlatform = {
  react: {
    prefix: 'web',
    packageDir: 'packages/react',
  },
  'react-native': {
    prefix: 'native',
    packageDir: 'packages/react-native',
  },
} as const satisfies Record<
  ComponentPlatform,
  {
    prefix: string;
    packageDir: string;
  }
>;

export function readComponentApiSection(params: {
  root: string;
  componentName: string;
  platform: ComponentPlatform;
}) {
  const { root, componentName, platform } = params;
  const apiPlatform = apiPlatformByComponentPlatform[platform];
  const apiId = `${apiPlatform.prefix}.${componentName}Props.${componentName}`;
  const relativeApiPath = path.join(apiPlatform.packageDir, 'API.md');
  const apiFile = path.join(root, relativeApiPath);

  if (!fs.existsSync(apiFile)) {
    throw new Error(
      `Cannot resolve API information for ${componentName} ${platform}: missing ${relativeApiPath}.`
    );
  }

  const content = fs.readFileSync(apiFile, 'utf8');
  const startMarker = `<!-- api-docgen:start ${apiId} -->`;
  const endMarker = `<!-- api-docgen:end ${apiId} -->`;
  const startIndexes = findMarkerIndexes(content, startMarker);
  const endIndexes = findMarkerIndexes(content, endMarker);

  if (startIndexes.length !== 1 || endIndexes.length !== 1) {
    throw new Error(
      `Cannot resolve API information for ${componentName} ${platform}: expected exactly one ${apiId} block in ${relativeApiPath}.`
    );
  }

  if (startIndexes[0] > endIndexes[0]) {
    throw new Error(
      `Cannot resolve API information for ${componentName} ${platform}: malformed ${apiId} block in ${relativeApiPath}.`
    );
  }

  const block = content
    .slice(startIndexes[0], endIndexes[0] + endMarker.length)
    .trim();

  return {
    apiId,
    relativeApiPath,
    block,
  };
}

function findMarkerIndexes(content: string, marker: string) {
  const indexes: number[] = [];
  let fromIndex = 0;

  while (fromIndex < content.length) {
    const index = content.indexOf(marker, fromIndex);

    if (index === -1) {
      break;
    }

    indexes.push(index);
    fromIndex = index + marker.length;
  }

  return indexes;
}
