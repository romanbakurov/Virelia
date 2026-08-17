import type { ComponentTemplateParams } from './component-types';

export function renderNativeOverlayTypesTemplate({
  componentName,
}: ComponentTemplateParams) {
  return `import type { ReactNode } from 'react';

export type ${componentName}Props = {
  children?: ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  closeOnOutsidePress?: boolean;
  restoreFocus?: boolean;
};
`;
}

export function renderNativeOverlayComponentTemplate({
  componentName,
}: ComponentTemplateParams) {
  return `import { useState } from 'react';

import { View } from 'react-native';

import type { ${componentName}Props } from './types';

export function ${componentName}({
  children,
  open,
  defaultOpen = false,
  onOpenChange,
  closeOnOutsidePress = true,
  restoreFocus = true,
}: ${componentName}Props) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);

  const isControlled = open !== undefined;
  const resolvedOpen = isControlled ? open : uncontrolledOpen;

  const setOpen = (nextOpen: boolean) => {
    if (!isControlled) {
      setUncontrolledOpen(nextOpen);
    }

    onOpenChange?.(nextOpen);
  };

  void closeOnOutsidePress;
  void restoreFocus;
  void setOpen;

  return <View>{resolvedOpen ? children : null}</View>;
}
`;
}
