import { cloneElement, forwardRef, useState } from 'react';

import type { TextInputProps } from 'react-native';
import { TextInput, View } from 'react-native';

import { FormField } from '../../patterns/FormField';
import { useTheme, useThemeStyles } from '../../theme';

import {
  createStyles,
  getDisabledPlaceholderTextColor,
  getPlaceholderTextColor,
} from './Input.styles';
import type { InputProps, NativeInputKeyboardType } from './types';

const keyboardTypeByInputType: Record<
  NonNullable<InputProps['type']>,
  NativeInputKeyboardType
> = {
  text: 'default',
  email: 'email-address',
  password: 'default',
  number: 'numeric',
  tel: 'phone-pad',
  url: 'url',
  search: 'web-search',
};

const autoCapitalizeByInputType: Record<
  NonNullable<InputProps['type']>,
  NonNullable<InputProps['autoCapitalize']>
> = {
  text: 'sentences',
  email: 'none',
  password: 'none',
  number: 'none',
  tel: 'none',
  url: 'none',
  search: 'none',
};

const autoCorrectByInputType: Record<
  NonNullable<InputProps['type']>,
  boolean
> = {
  text: true,
  email: false,
  password: false,
  number: false,
  tel: false,
  url: false,
  search: false,
};

export const Input = forwardRef<TextInput, InputProps>(
  (
    {
      label,
      value,
      onChange,
      placeholder,
      size = 'md',
      error,
      disabled = false,
      required = false,
      type = 'text',
      leftIcon,
      iconSize,
      containerStyle,
      inputStyle,
      keyboardType,
      secureTextEntry,
      autoCapitalize,
      autoCorrect,
      onBlur,
      onFocus,
      accessibilityLabel,
      accessibilityHint,
      ...props
    },
    ref
  ) => {
    const { theme } = useTheme();
    const styles = useThemeStyles(createStyles);
    const [isFocused, setIsFocused] = useState(false);
    const placeholderTextColor = disabled
      ? getDisabledPlaceholderTextColor(theme)
      : getPlaceholderTextColor(theme);
    const isPassword = type === 'password';
    const resolvedIconSize = iconSize ?? 16;
    const iconColor = disabled
      ? theme.components.input.disabled.fg
      : isFocused
        ? theme.components.input.focus.fg
        : theme.components.input.default.placeholder;

    const handleFocus: NonNullable<TextInputProps['onFocus']> = (event) => {
      setIsFocused(true);
      onFocus?.(event);
    };

    const handleBlur: NonNullable<TextInputProps['onBlur']> = (event) => {
      setIsFocused(false);
      onBlur?.(event);
    };

    return (
      <FormField
        label={label}
        error={error}
        required={required}
        disabled={disabled}
        style={containerStyle}
      >
        <View style={styles.inputWrapper}>
          {leftIcon && (
            <View
              pointerEvents='none'
              style={styles.leftIcon}
              accessibilityElementsHidden
              importantForAccessibility='no'
            >
              {cloneElement(leftIcon, {
                color: iconColor,
                size: resolvedIconSize,
              })}
            </View>
          )}

          <TextInput
            {...props}
            ref={ref}
            value={value}
            editable={!disabled}
            placeholder={placeholder}
            keyboardType={keyboardType ?? keyboardTypeByInputType[type]}
            secureTextEntry={secureTextEntry ?? isPassword}
            autoCapitalize={autoCapitalize ?? autoCapitalizeByInputType[type]}
            autoCorrect={autoCorrect ?? autoCorrectByInputType[type]}
            onChangeText={onChange}
            onBlur={handleBlur}
            onFocus={handleFocus}
            placeholderTextColor={placeholderTextColor}
            accessibilityLabel={accessibilityLabel ?? label}
            accessibilityHint={accessibilityHint}
            accessibilityState={{ disabled }}
            style={[
              styles.input,
              styles[size],
              inputStyle,
              leftIcon && styles.inputWithLeftIcon,
              isFocused && !disabled && styles.focused,
              error && styles.error,
              isFocused && error && !disabled && styles.errorFocused,
              disabled && styles.disabled,
            ]}
          />
        </View>
      </FormField>
    );
  }
);

Input.displayName = 'Input';
