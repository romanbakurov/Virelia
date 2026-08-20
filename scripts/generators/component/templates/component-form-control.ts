import type { FormControlKindArg } from '../cli';
import type { ComponentTemplateParams } from './component-types';

export type FormControlTemplateParams = ComponentTemplateParams & {
  isNative: boolean;
  control: FormControlKindArg;
};

export type FormControlTypesTemplateParams = ComponentTemplateParams & {
  control: FormControlKindArg;
};

export function renderFormControlTypesTemplate({
  componentName,
  control,
}: FormControlTypesTemplateParams) {
  if (control === 'boolean') {
    return `export type ${componentName}Props = {
  checked?: boolean;
  defaultChecked?: boolean;
  disabled?: boolean;
  required?: boolean;
  invalid?: boolean;
  onCheckedChange?: (checked: boolean) => void;
};
`;
  }

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

function renderBooleanFormControlComponent({
  componentName,
  isNative,
}: FormControlTemplateParams) {
  if (isNative) {
    return `import { Pressable } from 'react-native';

import type { ${componentName}Props } from './types';

export function ${componentName}({
  checked,
  defaultChecked = false,
  disabled = false,
  required = false,
  invalid = false,
  onCheckedChange,
}: ${componentName}Props) {
  const resolvedChecked = checked ?? defaultChecked;

  return (
    <Pressable
      disabled={disabled}
      accessibilityRole='switch'
      accessibilityState={{
        checked: resolvedChecked,
        disabled,
      }}
      accessibilityHint={[
        required ? 'Required.' : undefined,
        invalid ? 'Invalid.' : undefined,
      ]
        .filter(Boolean)
        .join(' ') || undefined}
      onPress={() => onCheckedChange?.(!resolvedChecked)}
    />
  );
}
`;
  }

  return `import type { ${componentName}Props } from './types';

export function ${componentName}({
  checked,
  defaultChecked = false,
  disabled = false,
  required = false,
  invalid = false,
  onCheckedChange,
}: ${componentName}Props) {
  const resolvedChecked = checked ?? defaultChecked;

  return (
    <button
      type='button'
      role='switch'
      aria-checked={resolvedChecked}
      disabled={disabled}
      aria-required={required || undefined}
      aria-invalid={invalid || undefined}
      onClick={() => onCheckedChange?.(!resolvedChecked)}
    />
  );
}
`;
}

function renderTextFormControlComponent({
  componentName,
  isNative,
}: FormControlTemplateParams) {
  if (isNative) {
    return `import { TextInput } from 'react-native';

import type { ${componentName}Props } from './types';

export function ${componentName}({
  value,
  defaultValue,
  disabled = false,
  required = false,
  invalid = false,
  onValueChange,
}: ${componentName}Props) {
  return (
    <TextInput
      value={value}
      defaultValue={defaultValue}
      editable={!disabled}
      multiline
      accessibilityState={{ disabled }}
      accessibilityHint={[
        required ? 'Required.' : undefined,
        invalid ? 'Invalid.' : undefined,
      ]
        .filter(Boolean)
        .join(' ') || undefined}
      onChangeText={onValueChange}
    />
  );
}
`;
  }

  return `import type { ChangeEvent } from 'react';

import type { ${componentName}Props } from './types';

export function ${componentName}({
  value,
  defaultValue,
  disabled = false,
  required = false,
  invalid = false,
  onValueChange,
}: ${componentName}Props) {
  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    onValueChange?.(event.currentTarget.value);
  };

  return (
    <textarea
      value={value}
      defaultValue={defaultValue}
      disabled={disabled}
      required={required}
      aria-invalid={invalid || undefined}
      onChange={handleChange}
    />
  );
}
`;
}

export function renderFormControlComponentTemplate(
  params: FormControlTemplateParams
) {
  if (params.control === 'boolean') {
    return renderBooleanFormControlComponent(params);
  }

  if (params.control === 'text') {
    return renderTextFormControlComponent(params);
  }

  const { componentName, isNative } = params;

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
