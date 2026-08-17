import type { ComponentTemplateParams } from './component-types';

export type ComponentPartTemplateParams = ComponentTemplateParams & {
  partName: string;
  isNative: boolean;
};

export function renderPartTypesTemplate({
  componentName,
  partName,
}: ComponentPartTemplateParams) {
  return `import type { ReactNode } from 'react';

export type ${componentName}${partName}Props = {
  children?: ReactNode;
};
`;
}

export function renderPartIndexTemplate({
  componentName,
  partName,
}: ComponentPartTemplateParams) {
  return `export * from './${componentName}${partName}';
export * from './types';
`;
}

export function renderPartComponentTemplate({
  componentName,
  partName,
  isNative,
}: ComponentPartTemplateParams) {
  if (isNative) {
    return `import { View } from 'react-native';

import type { ${componentName}${partName}Props } from './types';

export function ${componentName}${partName}({
  children,
}: ${componentName}${partName}Props) {
  return <View>{children}</View>;
}
`;
  }

  return `import type { ${componentName}${partName}Props } from './types';

export function ${componentName}${partName}({
  children,
}: ${componentName}${partName}Props) {
  return <div>{children}</div>;
}
`;
}
