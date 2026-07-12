import { forwardRef, useEffect } from 'react';

import { useControllableState } from '@vellira-ui/core';
import type { RadioSize } from '@vellira-ui/types';
import {
  Pressable,
  type PressableStateCallbackType,
  type StyleProp,
  Text,
  View,
  type ViewStyle,
} from 'react-native';

import { useRadioGroupContext } from '../../components/RadioGroup/RadioGroupContext';
import { useTheme } from '../../theme';

import { createStyles } from './Radio.styles';
import type { RadioProps } from './types';

const controlSizeBySize = {
  sm: 14,
  md: 16,
  lg: 20,
} satisfies Record<RadioSize, number>;

const indicatorSizeBySize = {
  sm: 6,
  md: 8,
  lg: 10,
} satisfies Record<RadioSize, number>;

export const Radio = forwardRef<View, RadioProps>(
  (
    {
      value,
      checked,
      defaultChecked = false,
      disabled: disabledProp = false,
      required: requiredProp = false,
      size: sizeProp,
      onCheckedChange,
      label,
      description,
      error,
      accessibilityLabel,
      accessibilityHint,
      containerStyle,
      labelStyle,
      descriptionStyle,
      errorStyle,
      style,
      ...rest
    },
    ref
  ) => {
    const { theme } = useTheme();
    const styles = createStyles(theme);

    const group = useRadioGroupContext();
    const isInsideGroup = group !== null;

    const [standaloneChecked, setStandaloneChecked] = useControllableState({
      value: checked,
      defaultValue: defaultChecked,
      onChange: onCheckedChange,
    });

    const resolvedChecked = isInsideGroup
      ? group.value === value
      : standaloneChecked;

    const resolvedDisabled = Boolean(group?.disabled) || disabledProp;
    const resolvedRequired = Boolean(group?.required) || requiredProp;
    const resolvedInvalid = Boolean(group?.invalid) || Boolean(error);
    const resolvedSize = sizeProp ?? group?.size ?? 'md';

    const controlSize = controlSizeBySize[resolvedSize];
    const indicatorSize = indicatorSizeBySize[resolvedSize];

    const typographySizeByRadioSize = {
      sm: {
        labelSize: theme.tokens.typography.size.sm,
        labelLineHeight: theme.tokens.typography.lineHeight.sm,
        descriptionSize: theme.tokens.typography.size.xs,
        descriptionLineHeight: theme.tokens.typography.lineHeight.xs,
      },
      md: {
        labelSize: theme.tokens.typography.size.md,
        labelLineHeight: theme.tokens.typography.lineHeight.md,
        descriptionSize: theme.tokens.typography.size.sm,
        descriptionLineHeight: theme.tokens.typography.lineHeight.sm,
      },
      lg: {
        labelSize: theme.tokens.typography.size.lg,
        labelLineHeight: theme.tokens.typography.lineHeight.lg,
        descriptionSize: theme.tokens.typography.size.md,
        descriptionLineHeight: theme.tokens.typography.lineHeight.md,
      },
    } as const;

    const typographySize = typographySizeByRadioSize[resolvedSize];
    const controlMarginTop = (typographySize.labelLineHeight - controlSize) / 2;

    useEffect(() => {
      if (__DEV__ && !label && !accessibilityLabel) {
        console.warn(
          'Radio requires either a visible label or accessibilityLabel.'
        );
      }
    }, [accessibilityLabel, label]);

    const resolvedAccessibilityLabel =
      accessibilityLabel ?? (typeof label === 'string' ? label : undefined);

    const resolvedAccessibilityHint =
      (accessibilityHint ??
        [
          typeof description === 'string' ? description : undefined,
          resolvedRequired ? 'Required.' : undefined,
          error,
        ]
          .filter((item): item is string => Boolean(item))
          .join(' ')) ||
      undefined;

    const handlePress = () => {
      if (resolvedDisabled || resolvedChecked) {
        return;
      }

      if (isInsideGroup) {
        group.onValueChange(value);
        return;
      }

      setStandaloneChecked(true);
    };

    const resolvePressableStyle = (
      state: PressableStateCallbackType
    ): StyleProp<ViewStyle> => [
      styles.pressable,
      resolvedDisabled && styles.pressableDisabled,
      state.pressed && !resolvedDisabled && styles.pressablePressed,
      typeof style === 'function' ? style(state) : style,
    ];

    return (
      <View style={[styles.root, containerStyle]}>
        <Pressable
          {...rest}
          ref={ref}
          accessibilityRole='radio'
          accessibilityLabel={resolvedAccessibilityLabel}
          accessibilityHint={resolvedAccessibilityHint}
          accessibilityState={{
            checked: resolvedChecked,
            disabled: resolvedDisabled,
          }}
          disabled={resolvedDisabled}
          onPress={handlePress}
          style={resolvePressableStyle}
        >
          <View
            pointerEvents='none'
            style={[
              styles.control,
              {
                width: controlSize,
                height: controlSize,
                marginTop: controlMarginTop,
              },
              resolvedChecked && styles.controlChecked,
              resolvedInvalid && styles.controlInvalid,
              resolvedDisabled && styles.controlDisabled,
            ]}
          >
            {resolvedChecked && (
              <View
                style={[
                  styles.indicator,
                  {
                    width: indicatorSize,
                    height: indicatorSize,
                  },
                  resolvedDisabled && styles.indicatorDisabled,
                ]}
              />
            )}
          </View>

          {(label || description) && (
            <View pointerEvents='none' style={styles.content}>
              {label &&
                (typeof label === 'string' ? (
                  <Text
                    style={[
                      styles.label,
                      {
                        fontSize: typographySize.labelSize,
                        lineHeight: typographySize.labelLineHeight,
                      },
                      resolvedChecked && styles.labelChecked,
                      resolvedInvalid && styles.labelInvalid,
                      resolvedDisabled && styles.textDisabled,
                      labelStyle,
                    ]}
                  >
                    {label}
                  </Text>
                ) : (
                  label
                ))}

              {description &&
                (typeof description === 'string' ? (
                  <Text
                    style={[
                      styles.description,
                      {
                        fontSize: typographySize.descriptionSize,
                        lineHeight: typographySize.descriptionLineHeight,
                      },
                      resolvedDisabled && styles.textDisabled,
                      descriptionStyle,
                    ]}
                  >
                    {description}
                  </Text>
                ) : (
                  description
                ))}
            </View>
          )}
        </Pressable>

        {error && (
          <Text
            accessibilityLiveRegion='polite'
            style={[
              styles.error,
              {
                marginLeft: controlSize + theme.tokens.spacing[2],
                fontSize: typographySize.descriptionSize,
                lineHeight: typographySize.descriptionLineHeight,
              },
              errorStyle,
            ]}
          >
            {error}
          </Text>
        )}
      </View>
    );
  }
);

Radio.displayName = 'Radio';
