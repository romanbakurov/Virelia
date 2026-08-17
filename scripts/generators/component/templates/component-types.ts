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
