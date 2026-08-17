import type { ComponentTemplateParams } from './component-types';

export type NativeOverlayPartTemplateParams = ComponentTemplateParams & {
  partName: string;
};

export function renderNativeOverlayPartTypesTemplate({
  componentName,
  partName,
}: NativeOverlayPartTemplateParams) {
  switch (partName) {
    case 'Root':
      return `import type { ReactNode } from 'react';

export type ${componentName}RootProps = {
  children?: ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
};
`;

    case 'Trigger':
      return `import type { ReactNode } from 'react';

export type ${componentName}TriggerProps = {
  children?: ReactNode;
  disabled?: boolean;
  accessibilityLabel?: string;
};
`;

    case 'Content':
      return `import type { ReactNode } from 'react';

export type ${componentName}ContentProps = {
  children?: ReactNode;
};
`;

    default:
      return `import type { ReactNode } from 'react';

export type ${componentName}${partName}Props = {
  children?: ReactNode;
};
`;
  }
}

export function renderNativeOverlayPartComponentTemplate({
  componentName,
  partName,
}: NativeOverlayPartTemplateParams) {
  switch (partName) {
    case 'Root':
      return `import type { ${componentName}RootProps } from './types';

export function ${componentName}Root({
  children,
}: ${componentName}RootProps) {
  return <>{children}</>;
}
`;

    case 'Trigger':
      return `import { Pressable } from 'react-native';

import type { ${componentName}TriggerProps } from './types';

export function ${componentName}Trigger({
  children,
  disabled = false,
  accessibilityLabel,
}: ${componentName}TriggerProps) {
  return (
    <Pressable
      disabled={disabled}
      accessibilityRole='button'
      accessibilityState={{ disabled }}
      accessibilityLabel={accessibilityLabel}
    >
      {children}
    </Pressable>
  );
}
`;

    case 'Content':
      return `import { View } from 'react-native';

import type { ${componentName}ContentProps } from './types';

export function ${componentName}Content({
  children,
}: ${componentName}ContentProps) {
  return <View accessibilityViewIsModal>{children}</View>;
}
`;

    default:
      return `import { View } from 'react-native';

import type { ${componentName}${partName}Props } from './types';

export function ${componentName}${partName}({
  children,
}: ${componentName}${partName}Props) {
  return <View>{children}</View>;
}
`;
  }
}
