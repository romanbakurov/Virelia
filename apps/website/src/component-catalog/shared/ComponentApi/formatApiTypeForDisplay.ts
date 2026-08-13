const compactTypePreviewLength = 36;

export function formatApiTypeForDisplay(type: string) {
  let output = '';

  for (let index = 0; index < type.length; index += 1) {
    const character = type[index];

    if (character !== '"') {
      output += character;
      continue;
    }

    const literalEnd = findStringLiteralEnd(type, index);

    if (literalEnd === -1) {
      output += character;
      continue;
    }

    const literalContent = type.slice(index + 1, literalEnd);

    if (shouldPreserveDoubleQuotedLiteral(type, index, literalEnd)) {
      output += `"${literalContent}"`;
    } else {
      output += `'${escapeSingleQuotedLiteralContent(literalContent)}'`;
    }

    index = literalEnd;
  }

  return output;
}

function escapeSingleQuotedLiteralContent(content: string) {
  let output = '';

  for (let index = 0; index < content.length; index += 1) {
    const character = content[index];

    if (character === "'" && !isEscaped(content, index)) {
      output += "\\'";
    } else {
      output += character;
    }
  }

  return output;
}

function isEscaped(source: string, index: number) {
  let slashCount = 0;

  for (let cursor = index - 1; cursor >= 0; cursor -= 1) {
    if (source[cursor] !== '\\') {
      break;
    }

    slashCount += 1;
  }

  return slashCount % 2 === 1;
}

export function getApiTypePreview(type: string) {
  const formattedType = formatApiTypeForDisplay(type);

  if (formattedType.length <= compactTypePreviewLength) {
    return formattedType;
  }

  return `${formattedType.slice(0, compactTypePreviewLength - 1).trim()}...`;
}

function findStringLiteralEnd(source: string, start: number) {
  let escaped = false;

  for (let index = start + 1; index < source.length; index += 1) {
    const character = source[index];

    if (escaped) {
      escaped = false;
      continue;
    }

    if (character === '\\') {
      escaped = true;
      continue;
    }

    if (character === '"') {
      return index;
    }
  }

  return -1;
}

function shouldPreserveDoubleQuotedLiteral(
  source: string,
  start: number,
  end: number
) {
  const before = source.slice(0, start);
  const after = source.slice(end + 1);

  return /\bimport\s*\(\s*$/.test(before) || /^\s*\??\s*:/.test(after);
}
