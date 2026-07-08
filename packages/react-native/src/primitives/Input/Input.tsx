import { cloneElement, forwardRef, useState } from 'react';

import type { TextInputProps } from 'react-native';
import { Pressable, Text, TextInput, View } from 'react-native';

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
      defaultValue,
      onChange,
      placeholder,
      size = 'md',
      error,
      disabled = false,
      required = false,
      readOnly = false,
      type = 'text',
      leftAdornment,
      rightAdornment,
      clearIcon,
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
      testID,
      autoFocus,
      maxLength,
      clearable,
      onClear,
      ...props
    },
    ref
  ) => {
    const { theme } = useTheme();
    const styles = useThemeStyles(createStyles);
    const [isFocused, setIsFocused] = useState(false);
    const [uncontrolledValue, setUncontrolledValue] = useState(
      defaultValue ?? ''
    );

    const isControlled = value !== undefined;
    const currentValue = isControlled ? value : uncontrolledValue;
    const hasValue = currentValue !== '';
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

    const handleChangeText = (nextValue: string) => {
      if (!isControlled) {
        setUncontrolledValue(nextValue);
      }

      onChange?.(nextValue);
    };

    const handleClear = () => {
      if (!isControlled) {
        setUncontrolledValue('');
      }

      onChange?.('');
      onClear?.();
    };

    const showClearButton = clearable && hasValue && !disabled && !readOnly;
    const showRightIcon = !showClearButton && Boolean(rightAdornment);

    return (
      <FormField
        label={label}
        error={error}
        required={required}
        disabled={disabled}
        style={containerStyle}
      >
        <View style={styles.inputWrapper}>
          {leftAdornment && (
            <View
              pointerEvents='none'
              style={styles.leftAdornment}
              accessibilityElementsHidden
              importantForAccessibility='no'
            >
              {cloneElement(leftAdornment, {
                color: iconColor,
                size: resolvedIconSize,
              })}
            </View>
          )}

          <TextInput
            {...props}
            ref={ref}
            value={currentValue}
            onChangeText={handleChangeText}
            editable={!disabled && !readOnly}
            placeholder={placeholder}
            keyboardType={keyboardType ?? keyboardTypeByInputType[type]}
            secureTextEntry={secureTextEntry ?? isPassword}
            autoCapitalize={autoCapitalize ?? autoCapitalizeByInputType[type]}
            autoCorrect={autoCorrect ?? autoCorrectByInputType[type]}
            onBlur={handleBlur}
            onFocus={handleFocus}
            autoFocus={autoFocus}
            maxLength={maxLength}
            testID={testID}
            placeholderTextColor={placeholderTextColor}
            accessibilityLabel={accessibilityLabel ?? label}
            accessibilityHint={accessibilityHint}
            accessibilityState={{ disabled }}
            style={[
              styles.input,
              styles[size],
              inputStyle,
              leftAdornment && styles.inputWithLeftIcon,
              (showRightIcon || showClearButton) && styles.inputWithRightIcon,
              isFocused && !disabled && styles.focused,
              error && styles.error,
              isFocused && error && !disabled && styles.errorFocused,
              disabled && styles.disabled,
              readOnly && styles.readOnly,
            ]}
          />

          {showClearButton ? (
            <Pressable
              accessibilityRole='button'
              accessibilityLabel='Clear input'
              hitSlop={8}
              onPress={handleClear}
              style={styles.clearButton}
            >
              {clearIcon ? (
                cloneElement(clearIcon, {
                  color: iconColor,
                  size: resolvedIconSize,
                })
              ) : (
                <Text style={styles.clearButtonText}>x</Text>
              )}
            </Pressable>
          ) : (
            showRightIcon &&
            rightAdornment && (
              <View
                pointerEvents='none'
                style={styles.rightAdornment}
                accessibilityElementsHidden
                importantForAccessibility='no'
              >
                {cloneElement(rightAdornment, {
                  color: iconColor,
                  size: resolvedIconSize,
                })}
              </View>
            )
          )}
        </View>
      </FormField>
    );
  }
);

Input.displayName = 'Input';
