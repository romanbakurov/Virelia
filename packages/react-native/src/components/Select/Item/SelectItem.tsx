import { cloneElement, isValidElement, useState } from 'react';

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
  itemIndex,
  selectedValues,
  multiple,
  optionStyle,
  onSelect,
}: SelectItemRowProps) => {
  const { theme } = useTheme();
  const styles = useThemeStyles(createItemStyles);
  const { color, variant, renderOption } = useSelectContext();
  const [isHovered, setIsHovered] = useState(false);
  const optionPalette =
    theme.components.select[option.color ?? color][variant].option;
  const getOptionState = (pressed: boolean) => {
    if (isDisabled) return theme.components.select.option.disabled;
    if (isSelected) {
      return pressed
        ? optionPalette.selectedPressed
        : isHovered
          ? optionPalette.selectedHover
          : optionPalette.selected;
    }

    return pressed
      ? optionPalette.pressed
      : isHovered
        ? optionPalette.hover
        : theme.components.select.option.default;
  };

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
      onHoverIn={() => setIsHovered(true)}
      onHoverOut={() => setIsHovered(false)}
      style={({ pressed }) => {
        const optionState = getOptionState(pressed);

        return [
          styles.option,
          {
            backgroundColor: optionState.bg,
            borderColor: optionState.border,
          },
          isDisabled && styles.optionDisabled,
          optionStyle,
        ];
      }}
    >
      {({ pressed }) => {
        const optionState = getOptionState(pressed);
        const optionFg = optionState.fg;
        const descriptionFg =
          isSelected || pressed
            ? optionFg
            : theme.components.select.option.description.fg;

        return renderOption ? (
          renderNodeOrText(
            renderOption({
              option,
              selected: isSelected,
              disabled: isDisabled,
              active: isHovered,
              index: itemIndex,
              values: selectedValues,
              multiple,
              pressed,
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
                <Text
                  numberOfLines={2}
                  style={[styles.optionDescription, { color: descriptionFg }]}
                >
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
        );
      }}
    </Pressable>
  );
};

SelectItemRow.displayName = 'Select.ItemRow';
