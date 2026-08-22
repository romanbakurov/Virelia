import type { FormControlKindArg } from '../cli';
import type { ComponentTemplateParams } from './component-types';

export type FormControlTemplateParams = ComponentTemplateParams & {
  isNative: boolean;
  control: FormControlKindArg;
};

export type FormControlTypesTemplateParams = ComponentTemplateParams & {
  control: FormControlKindArg;
};

export function renderSharedFormControlTypesTemplate({
  componentName,
  control,
}: FormControlTypesTemplateParams) {
  if (control === 'boolean') {
    return `export interface Base${componentName}Props {
  /** Accessible name announced by assistive technology. */
  accessibilityLabel?: string;
  /** Controlled checked state. */
  checked?: boolean;
  /** Initial checked state for uncontrolled usage. */
  defaultChecked?: boolean;
  /** Disables interaction. */
  disabled?: boolean;
  /** Marks the control as required. */
  required?: boolean;
  /** Marks the control as invalid. */
  invalid?: boolean;
  /** Called when the checked state changes. */
  onCheckedChange?: (checked: boolean) => void;
}
`;
  }

  return `export interface Base${componentName}Props {
  /** Controlled value. */
  value?: string;
  /** Initial value for uncontrolled usage. */
  defaultValue?: string;
  /** Disables interaction. */
  disabled?: boolean;
  /** Marks the control as required. */
  required?: boolean;
  /** Marks the control as invalid. */
  invalid?: boolean;
  /** Called when the value changes. */
  onValueChange?: (value: string) => void;
}
`;
}

export function renderFormControlTypesTemplate({
  componentName,
}: FormControlTypesTemplateParams) {
  return `import type { Base${componentName}Props } from '@vellira-ui/types';

export type ${componentName}Props = Base${componentName}Props;
`;
}

function renderBooleanFormControlComponent({
  componentName,
  isNative,
}: FormControlTemplateParams) {
  if (isNative) {
    return `import { useState } from 'react';

import { Pressable, View } from 'react-native';

import { useThemeStyles } from '../../theme';

import { createStyles } from './${componentName}.styles';
import type { ${componentName}Props } from './types';

export function ${componentName}({
  accessibilityLabel = '${componentName}',
  checked,
  defaultChecked = false,
  disabled = false,
  required = false,
  invalid = false,
  onCheckedChange,
}: ${componentName}Props) {
  const styles = useThemeStyles(createStyles);
  const [uncontrolledChecked, setUncontrolledChecked] = useState(defaultChecked);
  const isControlled = checked !== undefined;
  const resolvedChecked = isControlled ? checked : uncontrolledChecked;

  const handlePress = () => {
    const nextChecked = !resolvedChecked;

    if (!isControlled) {
      setUncontrolledChecked(nextChecked);
    }

    onCheckedChange?.(nextChecked);
  };

  return (
    <Pressable
      disabled={disabled}
      accessibilityLabel={accessibilityLabel}
      accessibilityRole='switch'
      accessibilityState={{ checked: resolvedChecked, disabled }}
      accessibilityHint={[
        required ? 'Required.' : undefined,
        invalid ? 'Invalid.' : undefined,
      ]
        .filter(Boolean)
        .join(' ') || undefined}
      onPress={handlePress}
      style={({ pressed }) => [
        styles.root,
        resolvedChecked && styles.checked,
        pressed && !disabled && styles.pressed,
        resolvedChecked && pressed && !disabled && styles.checkedPressed,
        invalid && styles.invalid,
        disabled && styles.disabled,
      ]}
    >
      {({ pressed }) => (
        <View
          style={[
            styles.thumb,
            resolvedChecked && styles.thumbChecked,
            resolvedChecked && pressed && !disabled && styles.thumbCheckedPressed,
            disabled && styles.thumbDisabled,
          ]}
        />
      )}
    </Pressable>
  );
}
`;
  }

  return `import { useState } from 'react';

import type { ${componentName}Props } from './types';

import styles from './${componentName}.module.scss';

export function ${componentName}({
  accessibilityLabel = '${componentName}',
  checked,
  defaultChecked = false,
  disabled = false,
  required = false,
  invalid = false,
  onCheckedChange,
}: ${componentName}Props) {
  const [uncontrolledChecked, setUncontrolledChecked] = useState(defaultChecked);
  const isControlled = checked !== undefined;
  const resolvedChecked = isControlled ? checked : uncontrolledChecked;

  const handleClick = () => {
    const nextChecked = !resolvedChecked;

    if (!isControlled) {
      setUncontrolledChecked(nextChecked);
    }

    onCheckedChange?.(nextChecked);
  };

  return (
    <button
      type='button'
      role='switch'
      aria-label={accessibilityLabel}
      aria-checked={resolvedChecked}
      disabled={disabled}
      aria-required={required || undefined}
      aria-invalid={invalid || undefined}
      data-state={resolvedChecked ? 'checked' : 'unchecked'}
      className={styles.root}
      onClick={handleClick}
    >
      <span className={styles.thumb} aria-hidden='true' />
    </button>
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
  if (params.control === 'boolean') return renderBooleanFormControlComponent(params);
  if (params.control === 'text') return renderTextFormControlComponent(params);

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
      accessibilityState={{ disabled }}
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
  defaultValue = '',
  disabled = false,
  required = false,
  invalid = false,
  onValueChange,
}: ${componentName}Props) {
  const resolvedValue = value ?? defaultValue;

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
