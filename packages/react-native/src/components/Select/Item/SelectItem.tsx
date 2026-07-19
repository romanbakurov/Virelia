import { cloneElement, isValidElement } from 'react';

import { Check } from '@vellira-ui/icons';
import type { ReactElement, ReactNode } from 'react';
import { Pressable, Text, View } from 'react-native';

import { useTheme, useThemeStyles } from '../../../theme';
import { createSelectSlot } from '../internal/SelectCollection';
import { useSelectContext } from '../internal/SelectContext';
import type { SelectItemProps } from '../types';

import { createItemStyles } from './SelectItem.styles';
import type { SelectItemRowProps } from './types';

const renderNodeOrText = (
  node: ReactNode,
  textStyle: object,
  fallback?: string
) => {
  if (typeof node === 'string' || typeof node === 'number') {
    return <Text style={textStyle}>{node}</Text>;
  }

  if (isValidElement<{ style?: object }>(node) && node.type === Text) {
    return cloneElement(node, {
      style: [textStyle, node.props.style],
    });
  }

  return node ?? (fallback ? <Text style={textStyle}>{fallback}</Text> : null);
};

export const SelectItem = createSelectSlot<SelectItemProps>(
  'item',
  'Select.Item'
);

export const SelectItemRow = ({
  option,
  isSelected,
  isDisabled,
  optionStyle,
  onSelect,
}: SelectItemRowProps) => {
  const { theme } = useTheme();
  const styles = useThemeStyles(createItemStyles);
  const { color, variant, renderOption } = useSelectContext();
  const optionPalette =
    theme.components.select[option.color ?? color][variant].option;
  const optionState = isSelected ? optionPalette.selected : optionPalette.hover;
  const optionFg = isDisabled
    ? theme.components.select.option.disabled.fg
    : isSelected
      ? optionState.fg
      : theme.components.select.option.default.fg;

  return (
    <Pressable
      disabled={isDisabled}
      accessibilityRole='button'
      accessibilityLabel={option.accessibilityLabel ?? option.label}
      accessibilityHint={option.accessibilityHint}
      accessibilityState={{
        selected: isSelected,
        disabled: isDisabled,
      }}
      onPress={() => onSelect(option)}
      style={[
        styles.option,
        {
          backgroundColor: isSelected
            ? optionState.bg
            : theme.components.select.option.default.bg,
          borderColor: isSelected ? optionState.border : 'transparent',
        },
        isDisabled && styles.optionDisabled,
        optionStyle,
      ]}
    >
      {renderOption ? (
        renderNodeOrText(
          renderOption(option, {
            selected: isSelected,
            disabled: isDisabled,
          }),
          [styles.optionLabel, { color: optionFg }]
        )
      ) : (
        <>
          {option.icon && (
            <View style={styles.optionIcon}>
              {isValidElement(option.icon)
                ? cloneElement(
                    option.icon as ReactElement<{
                      color?: string;
                      size?: number;
                    }>,
                    {
                      color: optionFg,
                      size: 18,
                    }
                  )
                : option.icon}
            </View>
          )}

          <View style={styles.optionTextWrap}>
            <Text
              numberOfLines={1}
              style={[styles.optionLabel, { color: optionFg }]}
            >
              {option.label}
            </Text>
            {option.description && (
              <Text numberOfLines={2} style={styles.optionDescription}>
                {option.description}
              </Text>
            )}
          </View>

          {option.badge && (
            <View
              style={[
                styles.badge,
                {
                  backgroundColor: optionPalette.badge.bg,
                  borderColor: optionPalette.badge.border,
                },
              ]}
            >
              {renderNodeOrText(option.badge, [
                styles.badgeText,
                { color: optionPalette.badge.fg },
              ])}
            </View>
          )}

          {isSelected && (
            <View style={styles.check}>
              <Check width={16} height={16} color={optionFg} />
            </View>
          )}
        </>
      )}
    </Pressable>
  );
};

SelectItemRow.displayName = 'Select.ItemRow';
