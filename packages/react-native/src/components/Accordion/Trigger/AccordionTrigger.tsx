import { ChevronDown } from '@vellira-ui/icons';
import { Pressable, Text, View } from 'react-native';

import { useTheme } from '../../../theme';
import { createStyles } from '../Accordion.styles';

import type { AccordionTriggerProps } from './types';

type InternalAccordionTriggerProps = AccordionTriggerProps & {
  expanded?: boolean;
  onActivate?: () => void;
};

export function AccordionTrigger({
  children,
  disabled = false,
  expanded = false,
  onActivate,
}: InternalAccordionTriggerProps) {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  return (
    <Pressable
      disabled={disabled}
      accessibilityRole='button'
      accessibilityState={{ disabled, expanded }}
      accessibilityHint={
        expanded ? 'Collapses this section' : 'Expands this section'
      }
      onPress={onActivate}
      style={({ pressed }) => [
        styles.trigger,
        expanded && styles.triggerExpanded,
        pressed && !disabled && styles.triggerPressed,
        disabled && styles.triggerDisabled,
      ]}
    >
      <View style={styles.triggerContent}>
        <Text
          style={[styles.triggerText, disabled && styles.triggerTextDisabled]}
        >
          {children}
        </Text>
        <View
          style={[styles.indicator, expanded && styles.indicatorExpanded]}
          accessibilityElementsHidden
          importantForAccessibility='no'
        >
          <ChevronDown
            width={16}
            height={16}
            color={
              disabled
                ? theme.semantic.text.disabled
                : theme.semantic.text.secondary
            }
          />
        </View>
      </View>
    </Pressable>
  );
}
