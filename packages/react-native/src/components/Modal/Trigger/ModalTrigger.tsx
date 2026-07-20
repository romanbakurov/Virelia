import { cloneElement, isValidElement } from 'react';

import type { GestureResponderEvent } from 'react-native';
import { Pressable, Text } from 'react-native';

import { useModalContext } from '../internal/ModalContext';

import type { ModalTriggerChild, ModalTriggerProps } from './types';

export const ModalTrigger = ({
  children,
  asChild = false,
  disabled = false,
  accessibilityLabel,
  style,
  testID,
}: ModalTriggerProps) => {
  const root = useModalContext();
  const child =
    asChild && isValidElement(children)
      ? (children as ModalTriggerChild)
      : undefined;

  const handlePress = (event: GestureResponderEvent) => {
    if (disabled || child?.props.disabled) return;

    child?.props.onPress?.(event);
    root.setOpen(true);
  };

  if (child) {
    return cloneElement(child, {
      onPress: handlePress,
      accessibilityRole: child.props.accessibilityRole ?? 'button',
      accessibilityState: {
        ...child.props.accessibilityState,
        expanded: root.open,
        disabled: disabled || child.props.disabled,
      },
      accessibilityLabel: accessibilityLabel ?? child.props.accessibilityLabel,
      disabled: disabled || child.props.disabled,
      style: child.props.style,
    });
  }

  return (
    <Pressable
      accessibilityRole='button'
      accessibilityState={{ expanded: root.open, disabled }}
      accessibilityLabel={accessibilityLabel}
      disabled={disabled}
      onPress={handlePress}
      style={style}
      testID={testID}
    >
      {typeof children === 'string' ? <Text>{children}</Text> : children}
    </Pressable>
  );
};

ModalTrigger.displayName = 'Modal.Trigger';
