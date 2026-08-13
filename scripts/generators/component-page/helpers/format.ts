import path from 'node:path';

export function slugify(componentName: string) {
  return componentName.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
}

export function identifierFromSlug(slug: string) {
  return slug.replace(/-([a-z0-9])/g, (_, character: string) =>
    character.toUpperCase()
  );
}

export function objectPropertyKey(value: string) {
  return /^[A-Za-z_$][\w$]*$/.test(value) ? value : toTsString(value);
}

export function capitalize(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

export function toLabel(value: string) {
  return value
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/^./, (character) => character.toUpperCase());
}

export function toTsString(value: string) {
  return `'${value
    .replaceAll('\\', '\\\\')
    .replaceAll("'", "\\'")
    .replaceAll('\n', '\\n')}'`;
}

export function toTsLiteral(value: unknown) {
  if (typeof value === 'string') {
    return toTsString(value);
  }

  if (
    typeof value === 'number' ||
    typeof value === 'boolean' ||
    value === null
  ) {
    return String(value);
  }

  return JSON.stringify(value);
}

export function toTemplateLiteral(value: string) {
  return `\`${value
    .replaceAll('\\', '\\\\')
    .replaceAll('`', '\\`')
    .replaceAll('${', '\\${')}\``;
}

export function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export function applyChildPropBindings(
  children: string,
  bindings: readonly {
    target: string;
    props: readonly string[];
  }[]
) {
  return bindings.reduce((currentChildren, binding) => {
    if (binding.props.length === 0) {
      return currentChildren;
    }

    return applySingleChildPropBinding(currentChildren, binding);
  }, children);
}

function applySingleChildPropBinding(
  children: string,
  binding: {
    target: string;
    props: readonly string[];
  }
) {
  let output = '';
  let cursor = 0;
  const targetStart = `<${binding.target}`;

  while (cursor < children.length) {
    const start = children.indexOf(targetStart, cursor);

    if (start === -1) {
      output += children.slice(cursor);
      break;
    }

    const nextCharacter = children[start + targetStart.length];

    if (
      nextCharacter &&
      ![' ', '\n', '\t', '\r', '>', '/'].includes(nextCharacter)
    ) {
      output += children.slice(cursor, start + targetStart.length);
      cursor = start + targetStart.length;
      continue;
    }

    const end = findJsxOpeningTagEnd(children, start + targetStart.length);

    if (end === -1) {
      output += children.slice(cursor);
      break;
    }

    const openingTag = children.slice(start, end);
    const propsToAdd = binding.props.filter(
      (prop) =>
        !new RegExp(`\\b${escapeRegExp(prop.split('=')[0])}\\b`).test(
          openingTag
        )
    );

    output += children.slice(cursor, end);

    if (propsToAdd.length > 0) {
      output += `\n  ${propsToAdd.join('\n  ')}`;
    }

    cursor = end;
  }

  return output;
}

function findJsxOpeningTagEnd(source: string, start: number) {
  let braceDepth = 0;
  let quote: '"' | "'" | '`' | null = null;
  let escaped = false;

  for (let index = start; index < source.length; index += 1) {
    const character = source[index];

    if (quote) {
      if (escaped) {
        escaped = false;
      } else if (character === '\\') {
        escaped = true;
      } else if (character === quote) {
        quote = null;
      }

      continue;
    }

    if (character === '"' || character === "'" || character === '`') {
      quote = character;
      continue;
    }

    if (character === '{') {
      braceDepth += 1;
      continue;
    }

    if (character === '}') {
      braceDepth = Math.max(0, braceDepth - 1);
      continue;
    }

    if (character === '>' && braceDepth === 0) {
      return index;
    }
  }

  return -1;
}

export function isPathInside(filePath: string, directoryPath: string) {
  const relativePath = path.relative(directoryPath, filePath);

  return (
    Boolean(relativePath) &&
    !relativePath.startsWith('..') &&
    !path.isAbsolute(relativePath)
  );
}
