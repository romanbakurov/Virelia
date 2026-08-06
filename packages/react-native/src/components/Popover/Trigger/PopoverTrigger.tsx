import { cloneElement } from 'react';

import type { GestureResponderEvent } from 'react-native';
import { Pressable } from 'react-native';

import { usePopoverContext } from '../internal';

import type { PopoverTriggerProps } from './types';

export function PopoverTrigger({
  children,
  asChild = false,
  onPress,
  ...triggerProps
}: PopoverTriggerProps) {
  const { open, setOpen, triggerRef } = usePopoverContext('Popover.Trigger');

  const handlePress = (event: GestureResponderEvent) => {
    children.props.onPress?.(event);
    onPress?.(event);

    if (event.defaultPrevented) {
      return;
    }

    setOpen(!open, {
      reason: 'trigger',
    });
  };

  if (asChild) {
    return cloneElement(children, {
      ref: triggerRef,
      onPress: handlePress,
    });
  }

  return (
    <Pressable {...triggerProps} ref={triggerRef} onPress={handlePress}>
      {children}
    </Pressable>
  );
}
