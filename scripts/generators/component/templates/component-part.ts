import type { ComponentTemplateParams } from './component-types';

export type ComponentPartTemplateParams = ComponentTemplateParams & {
  partName: string;
  isNative: boolean;
};

export function renderPartTypesTemplate({
  componentName,
  partName,
}: ComponentPartTemplateParams) {
  if (partName === 'Trigger') {
    return `import type { ReactNode } from 'react';

export type ${componentName}${partName}Props = {
  children?: ReactNode;
  disabled?: boolean;
  onActivate?: () => void;
};
`;
  }

  if (partName === 'Content') {
    return `import type { ReactNode } from 'react';

export type ${componentName}${partName}Props = {
  children?: ReactNode;
  hidden?: boolean;
};
`;
  }

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

function renderTriggerPartTemplate({
  componentName,
  isNative,
}: ComponentPartTemplateParams) {
  if (isNative) {
    return `import { Pressable } from 'react-native';

import type { ${componentName}TriggerProps } from './types';

export function ${componentName}Trigger({
  children,
  disabled = false,
  onActivate,
}: ${componentName}TriggerProps) {
  return (
    <Pressable
      disabled={disabled}
      accessibilityRole='button'
      accessibilityState={{ disabled }}
      onPress={onActivate}
    >
      {children}
    </Pressable>
  );
}
`;
  }

  return `import type { ${componentName}TriggerProps } from './types';

export function ${componentName}Trigger({
  children,
  disabled = false,
  onActivate,
}: ${componentName}TriggerProps) {
  return (
    <button type='button' disabled={disabled} onClick={onActivate}>
      {children}
    </button>
  );
}
`;
}

function renderContentPartTemplate({
  componentName,
  isNative,
}: ComponentPartTemplateParams) {
  if (isNative) {
    return `import { View } from 'react-native';

import type { ${componentName}ContentProps } from './types';

export function ${componentName}Content({
  children,
  hidden = false,
}: ${componentName}ContentProps) {
  if (hidden) {
    return null;
  }

  return <View>{children}</View>;
}
`;
  }

  return `import type { ${componentName}ContentProps } from './types';

export function ${componentName}Content({
  children,
  hidden = false,
}: ${componentName}ContentProps) {
  return <div hidden={hidden}>{children}</div>;
}
`;
}

export function renderPartComponentTemplate(
  params: ComponentPartTemplateParams
) {
  if (params.partName === 'Trigger') {
    return renderTriggerPartTemplate(params);
  }

  if (params.partName === 'Content') {
    return renderContentPartTemplate(params);
  }

  const { componentName, partName, isNative } = params;

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
