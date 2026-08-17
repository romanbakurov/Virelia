import type { ComponentTemplateParams } from './component-types';

export type OverlayPartTemplateParams = ComponentTemplateParams & {
  partName: string;
};

export function renderWebOverlayPartTypesTemplate({
  componentName,
  partName,
}: OverlayPartTemplateParams) {
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

export function renderWebOverlayPartComponentTemplate({
  componentName,
  partName,
}: OverlayPartTemplateParams) {
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
      return `import type { ${componentName}TriggerProps } from './types';

export function ${componentName}Trigger({
  children,
  disabled = false,
}: ${componentName}TriggerProps) {
  return (
    <button
      type='button'
      disabled={disabled}
      aria-haspopup='dialog'
    >
      {children}
    </button>
  );
}
`;

    case 'Content':
      return `import type { ${componentName}ContentProps } from './types';

export function ${componentName}Content({
  children,
}: ${componentName}ContentProps) {
  return (
    <div role='dialog' tabIndex={-1}>
      {children}
    </div>
  );
}
`;

    default:
      return `import type { ${componentName}${partName}Props } from './types';

export function ${componentName}${partName}({
  children,
}: ${componentName}${partName}Props) {
  return <div>{children}</div>;
}
`;
  }
}
