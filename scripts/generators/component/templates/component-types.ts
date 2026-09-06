export type ComponentTemplateParams = {
  componentName: string;
  parts?: readonly string[];
};

export function renderTypesTemplate({
  componentName,
}: ComponentTemplateParams) {
  return `import type { ReactNode } from 'react';

export type ${componentName}Props = {
  children?: ReactNode;
};
`;
}

function renderSharedCompoundPartType(params: {
  componentName: string;
  partName: string;
}) {
  const { componentName, partName } = params;
  const typeName = `Base${componentName}${partName}Props`;

  if (partName === 'Trigger') {
    return `export type ${typeName} = {
  disabled?: boolean;
  onActivate?: () => void;
};`;
  }

  if (partName === 'Content') {
    return `export type ${typeName} = {
  hidden?: boolean;
};`;
  }

  return `export type ${typeName} = unknown;`;
}

export function renderSharedCompoundTypesTemplate({
  componentName,
  parts = [],
}: ComponentTemplateParams) {
  const partTypes = parts
    .filter((partName) => partName !== 'Root')
    .map((partName) =>
      renderSharedCompoundPartType({ componentName, partName })
    )
    .join('\n\n');

  return `/**
 * Shared cross-platform API contract for ${componentName}.
 * Component-specific platform-neutral props belong in this file.
 */
export type Base${componentName}Props = unknown;
${partTypes ? `\n\n${partTypes}` : ''}
`;
}

export function renderCompoundTypesTemplate({
  componentName,
  parts = [],
}: ComponentTemplateParams) {
  const partExports = parts
    .filter((partName) => partName !== 'Root')
    .map(
      (partName) =>
        `export type { ${componentName}${partName}Props } from './${partName}';`
    )
    .join('\n');

  return `import type { Base${componentName}Props } from '@vellira-ui/types';
import type { ReactNode } from 'react';

export type ${componentName}Props = Base${componentName}Props & {
  children?: ReactNode;
};
${partExports ? `\n${partExports}\n` : ''}`;
}
