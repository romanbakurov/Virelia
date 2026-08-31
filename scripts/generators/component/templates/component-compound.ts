import type { ComponentTemplateParams } from './component-types';

export type CompoundComponentTemplateParams = ComponentTemplateParams & {
  parts: readonly string[];
};

export function renderCompoundComponentTemplate({
  componentName,
  parts,
}: CompoundComponentTemplateParams) {
  if (!parts.includes('Root')) {
    throw new Error(
      `Compound component "${componentName}" requires a Root part.`
    );
  }

  const attachedParts = parts.filter((partName) => partName !== 'Root');

  const imports = parts
    .map(
      (partName) =>
        `import { ${componentName}${partName} } from './${partName}';`
    )
    .join('\n');

  const assignments = attachedParts
    .map((partName) => `  ${partName}: ${componentName}${partName},`)
    .join('\n');

  return `${imports}

export const ${componentName} = Object.assign(${componentName}Root, {
  displayName: '${componentName}',
${assignments}
});
`;
}
