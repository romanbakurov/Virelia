import type { ComponentTemplateParams } from './component-types';

export type FormControlTemplateParams = ComponentTemplateParams & {
  isNative: boolean;
};

export function renderFormControlTypesTemplate({
  componentName,
}: ComponentTemplateParams) {
  return `export type ${componentName}Props = {
  value?: string;
  defaultValue?: string;
  disabled?: boolean;
  required?: boolean;
  invalid?: boolean;
  onValueChange?: (value: string) => void;
};
`;
}

export function renderFormControlComponentTemplate({
  componentName,
  isNative,
}: FormControlTemplateParams) {
  if (isNative) {
    return `import { Pressable, Text } from 'react-native';

import type { ${componentName}Props } from './types';

export function ${componentName}({
  value,
  defaultValue,
  disabled = false,
  required = false,
  invalid = false,
  onValueChange,
}: ${componentName}Props) {
  const resolvedValue = value ?? defaultValue ?? '';

  return (
    <Pressable
      disabled={disabled}
      accessibilityRole='button'
      accessibilityState={{
        disabled,
      }}
      accessibilityHint={[
        required ? 'Required.' : undefined,
        invalid ? 'Invalid.' : undefined,
      ]
        .filter(Boolean)
        .join(' ') || undefined}
      onPress={() => onValueChange?.(resolvedValue)}
    >
      <Text>{resolvedValue}</Text>
    </Pressable>
  );
}
`;
  }

  return `import type { ${componentName}Props } from './types';

export function ${componentName}({
  value,
  defaultValue,
  disabled = false,
  required = false,
  invalid = false,
  onValueChange,
}: ${componentName}Props) {
  const resolvedValue = value ?? defaultValue ?? '';

  return (
    <button
      type='button'
      disabled={disabled}
      aria-required={required || undefined}
      aria-invalid={invalid || undefined}
      onClick={() => onValueChange?.(resolvedValue)}
    >
      {resolvedValue}
    </button>
  );
}
`;
}
