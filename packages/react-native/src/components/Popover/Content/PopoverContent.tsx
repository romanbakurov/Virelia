import { useEffect, useMemo, useRef } from 'react';

import type { View as NativeView } from 'react-native';
import { Pressable, View } from 'react-native';

import { Portal } from '../../../primitives/Portal';
import { useTheme } from '../../../theme';
import { usePopoverContext } from '../internal';

import { createPopoverContentStyles, styles } from './PopoverContent.styles';
import type { PopoverContentProps } from './types';

export function PopoverContent({
  children,
  style,
  ...contentProps
}: PopoverContentProps) {
  const { theme } = useTheme();
  const layerRef = useRef<NativeView | null>(null);

  const themedStyles = useMemo(
    () => createPopoverContentStyles(theme),
    [theme]
  );

  const {
    open,
    position,
    onFloatingLayout,
    updatePosition,
    setOpen,
    closeOnOutsidePress,
  } = usePopoverContext('Popover.Content');

  useEffect(() => {
    if (!open) {
      return;
    }

    requestAnimationFrame(() => {
      updatePosition(layerRef);
    });
  }, [open, updatePosition]);

  return (
    <Portal
      visible={open}
      onRequestClose={() => {
        setOpen(false, {
          reason: 'escape-key',
        });
      }}
    >
      <View ref={layerRef} pointerEvents='box-none' style={styles.layer}>
        <Pressable
          testID='popover-backdrop'
          accessibilityLabel={closeOnOutsidePress ? 'Close popover' : undefined}
          accessibilityRole={closeOnOutsidePress ? 'button' : undefined}
          onPress={
            closeOnOutsidePress
              ? () => {
                  setOpen(false, {
                    reason: 'outside-press',
                  });
                }
              : undefined
          }
          style={styles.backdrop}
        />

        <View
          {...contentProps}
          onLayout={onFloatingLayout}
          style={[styles.content, themedStyles.content, position, style]}
        >
          {children}
        </View>
      </View>
    </Portal>
  );
}
