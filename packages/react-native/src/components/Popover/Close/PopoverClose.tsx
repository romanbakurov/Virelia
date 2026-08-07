import { cloneElement } from 'react';

import type { GestureResponderEvent } from 'react-native';
import { Pressable } from 'react-native';

import { usePopoverContext } from '../internal';

import type { PopoverCloseProps } from './types';

export const PopoverClose = ({
  children,
  asChild = false,
  onPress,
  ...closeProps
}: PopoverCloseProps) => {
  const { setOpen } = usePopoverContext('Popover.Close');

  const handlePress = (event: GestureResponderEvent) => {
    children.props.onPress?.(event);
    onPress?.(event);

    if (event.defaultPrevented) {
      return;
    }

    setOpen(false, {
      reason: 'close',
    });
  };

  if (asChild) {
    return cloneElement(children, {
      onPress: handlePress,
    });
  }

  return (
    <Pressable {...closeProps} onPress={handlePress}>
      {children}
    </Pressable>
  );
};

PopoverClose.displayName = 'PopoverClose';
