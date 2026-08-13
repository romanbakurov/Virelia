import path from 'node:path';

export function slugify(componentName: string) {
  return componentName.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
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

export function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export function isPathInside(filePath: string, directoryPath: string) {
  const relativePath = path.relative(directoryPath, filePath);

  return (
    Boolean(relativePath) &&
    !relativePath.startsWith('..') &&
    !path.isAbsolute(relativePath)
  );
}
