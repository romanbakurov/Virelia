import { cloneElement, forwardRef, useState } from 'react';

import type { TextInputProps } from 'react-native';
import { Pressable, Text, TextInput, View } from 'react-native';

import { FormField, useFormFieldContext } from '../../patterns/FormField';
import { useTheme, useThemeStyles } from '../../theme';

import { createStyles, getDisabledPlaceholderTextColor } from './Input.styles';
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

const applyPatternMask = (value: string, pattern: string) => {
  const digits = value.replace(/\D/g, '');
  let digitIndex = 0;
  let maskedValue = '';

  for (const character of pattern) {
    if (character === '#') {
      const nextDigit = digits[digitIndex];

      if (!nextDigit) break;

      maskedValue += nextDigit;
      digitIndex += 1;
      continue;
    }

    if (digitIndex < digits.length) {
      maskedValue += character;
    }
  }

  return maskedValue;
};

const applyMask = (value: string, mask: InputProps['mask']) => {
  if (!mask) return value;

  return typeof mask === 'function'
    ? mask(value)
    : applyPatternMask(value, mask);
};

export const Input = forwardRef<TextInput, InputProps>(
  (
    {
      label,
      description,
      value,
      defaultValue,
      onValueChange,
      placeholder,
      size,
      error,
      invalid = false,
      disabled = false,
      required = false,
      loading = false,
      readOnly = false,
      type = 'text',
      startIcon,
      endIcon,
      startIconTone = 'default',
      endIconTone = 'default',
      clearIcon,
      clearIconTone = 'danger',
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
      color = 'primary',
      variant = 'outline',
      revealPassword = false,
      showCounter: _showCounter,
      mask,
      format,
      parse,
      ...props
    },
    ref
  ) => {
    const { theme } = useTheme();
    const styles = useThemeStyles(createStyles);
    const field = useFormFieldContext();
    const hasOwnField = Boolean(label || description || error);
    const [isFocused, setIsFocused] = useState(false);
    const [uncontrolledValue, setUncontrolledValue] = useState(
      defaultValue ?? ''
    );

    const isControlled = value !== undefined;
    const currentValue = isControlled ? value : uncontrolledValue;
    const displayValue = format ? format(currentValue) : currentValue;
    const hasValue = currentValue !== '';
    const resolvedSize = size ?? field?.size ?? 'md';
    const inputColorPalette = theme.components.input[color];
    const inputPalette = inputColorPalette[variant];
    const inputState = isFocused ? inputPalette.focus : inputPalette.default;
    const isInvalid =
      invalid || Boolean(error) || (!hasOwnField && Boolean(field?.invalid));
    const isDisabled = disabled || (!hasOwnField && Boolean(field?.disabled));
    const isRequired = required || (!hasOwnField && Boolean(field?.required));
    const isReadOnly = readOnly || loading;
    const placeholderTextColor = isDisabled
      ? getDisabledPlaceholderTextColor(theme)
      : readOnly
        ? theme.components.input.readOnly.placeholder
        : inputState.placeholder;

    const isPassword = type === 'password';
    const [isPasswordRevealed, setIsPasswordRevealed] = useState(false);
    const resolvedIconSize = iconSize ?? 16;

    const handleFocus: NonNullable<TextInputProps['onFocus']> = (event) => {
      setIsFocused(true);
      onFocus?.(event);
    };

    const handleBlur: NonNullable<TextInputProps['onBlur']> = (event) => {
      setIsFocused(false);
      onBlur?.(event);
    };

    const handleChangeText = (nextValue: string) => {
      const parsedValue = parse ? parse(nextValue) : nextValue;
      const maskedValue = applyMask(parsedValue, mask);

      if (!isControlled) {
        setUncontrolledValue(maskedValue);
      }

      onValueChange?.(maskedValue);
    };

    const handleClear = () => {
      if (!isControlled) {
        setUncontrolledValue('');
      }

      onValueChange?.('');
      onClear?.();
    };

    const showClearButton = clearable && hasValue && !isDisabled && !isReadOnly;
    const showRevealButton = revealPassword && isPassword && !isDisabled;
    const showRightIcon =
      !showClearButton && !showRevealButton && Boolean(endIcon);

    const startIconColor = isDisabled
      ? theme.components.input.disabled.icon
      : theme.components.input.icon[startIconTone];

    const endIconColor = isDisabled
      ? theme.components.input.disabled.icon
      : theme.components.input.icon[endIconTone];

    const clearIconColor = isDisabled
      ? theme.components.input.disabled.icon
      : theme.components.input.icon[clearIconTone];

    const control = (
      <View style={styles.inputWrapper}>
        {startIcon && (
          <View
            pointerEvents='none'
            style={styles.leftIcon}
            accessibilityElementsHidden
            importantForAccessibility='no'
          >
            {cloneElement(startIcon, {
              color: startIconColor,
              size: resolvedIconSize,
            })}
          </View>
        )}

        <TextInput
          {...props}
          ref={ref}
          nativeID={
            props.nativeID ?? (!hasOwnField ? field?.controlId : undefined)
          }
          value={displayValue}
          onChangeText={handleChangeText}
          editable={!isDisabled && !isReadOnly}
          placeholder={placeholder}
          keyboardType={keyboardType ?? keyboardTypeByInputType[type]}
          secureTextEntry={
            secureTextEntry ?? (isPassword && !isPasswordRevealed)
          }
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
          accessibilityState={{ disabled: isDisabled }}
          accessibilityLabelledBy={!hasOwnField ? field?.labelId : undefined}
          aria-describedby={!hasOwnField ? field?.ariaDescribedBy : undefined}
          style={[
            styles.input,
            {
              color: inputState.fg,
              backgroundColor: inputState.bg,
              borderColor: inputState.border,
            },
            styles[resolvedSize],
            inputStyle,
            startIcon && styles.inputWithLeftAdornment,
            (showRightIcon || showClearButton || showRevealButton) &&
              styles.inputWithRightAdornment,
            isFocused &&
              !isDisabled &&
              !isReadOnly && {
                color: inputPalette.focus.fg,
                backgroundColor: inputPalette.focus.bg,
                borderColor: inputPalette.focus.border,
                shadowColor: inputColorPalette.ring,
                shadowOffset: {
                  width: 0,
                  height: 0,
                },
                shadowOpacity: 0.18,
                shadowRadius: 6,
                elevation: 1,
              },
            isInvalid && styles.error,
            isFocused &&
              isInvalid &&
              !isDisabled &&
              !isReadOnly &&
              styles.errorFocused,
            isReadOnly && !isDisabled && styles.readOnly,
            isDisabled && styles.disabled,
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
                color: clearIconColor,
                size: resolvedIconSize,
              })
            ) : (
              <Text style={[styles.clearButtonText, { color: clearIconColor }]}>
                ×
              </Text>
            )}
          </Pressable>
        ) : showRevealButton ? (
          <Pressable
            accessibilityRole='button'
            accessibilityLabel={
              isPasswordRevealed ? 'Hide password' : 'Show password'
            }
            hitSlop={8}
            onPress={() => setIsPasswordRevealed((revealed) => !revealed)}
            style={styles.revealButton}
          >
            <Text style={styles.revealButtonText}>
              {isPasswordRevealed ? 'Hide' : 'Show'}
            </Text>
          </Pressable>
        ) : (
          showRightIcon &&
          endIcon && (
            <View
              pointerEvents='none'
              style={styles.rightIcon}
              accessibilityElementsHidden
              importantForAccessibility='no'
            >
              {cloneElement(endIcon, {
                color: endIconColor,
                size: resolvedIconSize,
              })}
            </View>
          )
        )}
      </View>
    );

    if (!hasOwnField && field) {
      return control;
    }

    return (
      <FormField
        label={label}
        description={description}
        error={error}
        required={isRequired}
        disabled={isDisabled}
        invalid={isInvalid}
        size={resolvedSize}
        style={containerStyle}
      >
        {control}
      </FormField>
    );
  }
);

Input.displayName = 'Input';
