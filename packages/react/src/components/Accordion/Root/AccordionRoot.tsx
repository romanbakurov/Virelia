import {
  Children,
  cloneElement,
  isValidElement,
  useCallback,
  useId,
  useMemo,
  useState,
} from 'react';

import type { ReactElement, ReactNode } from 'react';

import { AccordionContent } from '../Content';
import { AccordionItem } from '../Item';
import { AccordionTrigger } from '../Trigger';

import type { AccordionRootProps } from './types';

import styles from '../Accordion.module.scss';

type InternalProps = {
  className?: string;
  contentId?: string;
  disabled?: boolean;
  hidden?: boolean;
  expanded?: boolean;
  onActivate?: () => void;
};

type InternalItemProps = {
  children?: ReactNode;
  className?: string;
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
  const instanceId = useId();
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
      let nextValues: string[];

      if (type === 'multiple') {
        nextValues = isExpanded
          ? expandedValues.filter((current) => current !== itemValue)
          : [...expandedValues, itemValue];
      } else if (isExpanded) {
        nextValues = collapsible ? [] : expandedValues;
      } else {
        nextValues = [itemValue];
      }

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
    const contentId = `${instanceId}-accordion-content-${item.props.value}`;
    const itemChildren = Children.map(item.props.children, (child) => {
      if (!isValidElement(child)) return child;

      if (child.type === AccordionTrigger) {
        return cloneElement(child as ReactElement<InternalProps>, {
          contentId,
          disabled: itemDisabled,
          expanded,
          onActivate: itemDisabled
            ? undefined
            : () => selectValue(item.props.value),
        });
      }

      if (child.type === AccordionContent) {
        return cloneElement(child as ReactElement<InternalProps>, {
          contentId,
          hidden: !expanded,
        });
      }

      return child;
    });

    return cloneElement(item, {
      className: `${styles.item} ${expanded ? styles.expanded : ''}`,
      children: itemChildren,
    });
  };

  return (
    <div className={styles.root} data-disabled={disabled || undefined}>
      {Children.map(children, enhanceItem)}
    </div>
  );
}
