import {
  Children,
  cloneElement,
  isValidElement,
  useCallback,
  useMemo,
  useState,
} from 'react';

import type { ReactElement, ReactNode } from 'react';
import { View } from 'react-native';

import { useTheme } from '../../../theme';
import { createStyles } from '../Accordion.styles';
import { AccordionContent } from '../Content';
import { AccordionItem } from '../Item';
import { AccordionTrigger } from '../Trigger';

import type { AccordionRootProps } from './types';

type InternalProps = {
  disabled?: boolean;
  hidden?: boolean;
  expanded?: boolean;
  onActivate?: () => void;
};

type InternalItemProps = {
  children?: ReactNode;
  disabled?: boolean;
  value: string;
};

export function AccordionRoot({
  children,
  type = 'single',
  value,
  defaultValue,
  onValueChange,
  collapsible = false,
  disabled = false,
}: AccordionRootProps) {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const isControlled = value !== undefined;
  const [uncontrolledValue, setUncontrolledValue] = useState<string | string[]>(
    defaultValue ?? (type === 'multiple' ? [] : '')
  );
  const expandedValues = useMemo(() => {
    const selectedValues = (isControlled ? value : uncontrolledValue) ?? [];

    return Array.isArray(selectedValues)
      ? selectedValues
      : selectedValues
        ? [selectedValues]
        : [];
  }, [isControlled, uncontrolledValue, value]);

  const selectValue = useCallback(
    (itemValue: string) => {
      if (disabled) return;

      const isExpanded = expandedValues.includes(itemValue);
      const nextValues =
        type === 'multiple'
          ? isExpanded
            ? expandedValues.filter((current) => current !== itemValue)
            : [...expandedValues, itemValue]
          : isExpanded
            ? collapsible
              ? []
              : expandedValues
            : [itemValue];
      const nextValue =
        type === 'multiple' ? nextValues : (nextValues[0] ?? '');

      if (!isControlled) setUncontrolledValue(nextValue);
      onValueChange?.(nextValue as never);
    },
    [collapsible, disabled, expandedValues, isControlled, onValueChange, type]
  );

  const enhanceItem = (node: ReactNode): ReactNode => {
    if (!isValidElement(node) || node.type !== AccordionItem) return node;

    const item = node as ReactElement<InternalItemProps>;
    const itemDisabled = disabled || Boolean(item.props.disabled);
    const expanded = expandedValues.includes(item.props.value);
    const itemChildren = Children.map(item.props.children, (child) => {
      if (!isValidElement(child)) return child;

      if (child.type === AccordionTrigger) {
        return cloneElement(child as ReactElement<InternalProps>, {
          disabled: itemDisabled,
          expanded,
          onActivate: itemDisabled
            ? undefined
            : () => selectValue(item.props.value),
        });
      }

      if (child.type === AccordionContent) {
        return cloneElement(child as ReactElement<InternalProps>, {
          hidden: !expanded,
        });
      }

      return child;
    });

    return cloneElement(item, { children: itemChildren });
  };

  return (
    <View
      style={[styles.root, disabled && styles.rootDisabled]}
      accessibilityState={{ disabled }}
    >
      {Children.map(children, enhanceItem)}
    </View>
  );
}
