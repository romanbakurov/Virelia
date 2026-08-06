import { cloneElement } from 'react';

import { View } from 'react-native';

import { usePopoverContext } from '../internal';

import type { PopoverAnchorProps } from './types';

export function PopoverAnchor({
  children,
  asChild = false,
  ...anchorProps
}: PopoverAnchorProps) {
  const { anchorRef } = usePopoverContext('Popover.Anchor');

  if (asChild) {
    return cloneElement(children, {
      ref: anchorRef,
    });
  }

  return (
    <View {...anchorProps} ref={anchorRef}>
      {children}
    </View>
  );
}

PopoverAnchor.displayName = 'Popover.Anchor';
