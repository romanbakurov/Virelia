import { useMemo } from 'react';

import { Platform, View } from 'react-native';

import { useTheme } from '../../../theme';
import { usePopoverContext } from '../internal';

import { createPopoverArrowStyles } from './PopoverArrow.styles';
import type { PopoverArrowProps } from './types';

export function PopoverArrow({ style }: PopoverArrowProps) {
  const { theme } = useTheme();
  const { placement, arrowPosition } = usePopoverContext('Popover.Arrow');

  const side = placement.split('-')[0] as 'top' | 'right' | 'bottom' | 'left';

  const styles = useMemo(
    () =>
      createPopoverArrowStyles({
        theme,
        side,
        arrowPosition,
      }),
    [theme, side, arrowPosition]
  );

  return (
    <View
      accessible={false}
      pointerEvents={Platform.OS === 'web' ? undefined : 'none'}
      style={[styles.arrow, style]}
    />
  );
}

PopoverArrow.displayName = 'Popover.Arrow';
