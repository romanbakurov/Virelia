export const authoredRegionStartMarker =
  '<!-- vellira-component-docs:authored:start -->';
export const authoredRegionEndMarker =
  '<!-- vellira-component-docs:authored:end -->';
export const defaultAuthoredRegionPlaceholder =
  '<!-- Add manually authored content for this component here. -->';

export type AuthoredRegionReadResult =
  | {
      valid: true;
      content: string;
      found: boolean;
    }
  | {
      valid: false;
      errors: string[];
    };

export function readAuthoredRegion(params: {
  content: string;
  filePath: string;
}): AuthoredRegionReadResult {
  const { content, filePath } = params;
  const startMatches = findMarkerIndexes(content, authoredRegionStartMarker);
  const endMatches = findMarkerIndexes(content, authoredRegionEndMarker);
  const errors: string[] = [];

  if (startMatches.length > 1) {
    errors.push(`${filePath} contains multiple authored region start markers.`);
  }

  if (endMatches.length > 1) {
    errors.push(`${filePath} contains multiple authored region end markers.`);
  }

  if (startMatches.length !== endMatches.length) {
    errors.push(`${filePath} contains unmatched authored region markers.`);
  }

  if (
    startMatches.length === 1 &&
    endMatches.length === 1 &&
    startMatches[0] > endMatches[0]
  ) {
    errors.push(
      `${filePath} contains an authored region end marker before its start marker.`
    );
  }

  if (errors.length > 0) {
    return {
      valid: false,
      errors,
    };
  }

  if (startMatches.length === 0) {
    return {
      valid: true,
      content: '',
      found: false,
    };
  }

  const contentStart = startMatches[0] + authoredRegionStartMarker.length;
  const contentEnd = endMatches[0];

  const regionContent = content.slice(contentStart, contentEnd);

  return {
    valid: true,
    content:
      regionContent.trim() === defaultAuthoredRegionPlaceholder
        ? ''
        : regionContent,
    found: true,
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
