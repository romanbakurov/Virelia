import { forwardRef, useEffect, useRef, useState } from 'react';

import { Modal, Pressable, Text, View } from 'react-native';

import { useNativeFloatingPosition } from '../../hooks/useNativeFloatingPosition';
import { useThemeStyles } from '../../theme';

import { createStyles } from './Tooltip.styles';
import type { TooltipProps } from './types';

export const Tooltip = forwardRef<View, TooltipProps>(
  (
    {
      children,
      content,
      placement = 'top',
      disabled = false,
      maxWidth = 240,
      delay,
      onOpenChange,
      style,
      testID,
      contentStyle,
      textStyle,
    },
    ref
  ) => {
    const styles = useThemeStyles(createStyles);
    const [visible, setVisible] = useState(false);

    const triggerRef = useRef<View | null>(null);
    const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const { position, updatePosition, onFloatingLayout } =
      useNativeFloatingPosition(placement, 8);

    const hideDelay = delay?.close ?? 2500;

    const setTooltipVisible = (nextVisible: boolean) => {
      setVisible((currentVisible) => {
        if (currentVisible !== nextVisible) {
          onOpenChange?.(nextVisible);
        }

        return nextVisible;
      });
    };

    const clearCloseTimer = () => {
      if (closeTimerRef.current) {
        clearTimeout(closeTimerRef.current);
        closeTimerRef.current = null;
      }
    };

    const showTooltip = () => {
      if (disabled) return;

      clearCloseTimer();
      updatePosition(triggerRef);
      setTooltipVisible(true);

      closeTimerRef.current = setTimeout(() => {
        setTooltipVisible(false);
        closeTimerRef.current = null;
      }, hideDelay);
    };

    useEffect(() => {
      return clearCloseTimer;
    }, []);

    return (
      <View ref={ref} testID={testID} style={[styles.root, style]}>
        <Pressable ref={triggerRef} onLongPress={showTooltip}>
          {children}
        </Pressable>

        <Modal visible={visible && !disabled} transparent animationType='fade'>
          <Pressable
            style={styles.overlay}
            onPress={() => {
              clearCloseTimer();
              setTooltipVisible(false);
            }}
          >
            <View
              pointerEvents='none'
              style={[
                styles.bubble,
                {
                  maxWidth,
                  top: position.top,
                  left: position.left,
                },
                contentStyle,
              ]}
              onLayout={onFloatingLayout}
            >
              {typeof content === 'string' ? (
                <Text style={[styles.text, textStyle]}>{content}</Text>
              ) : (
                content
              )}
            </View>
          </Pressable>
        </Modal>
      </View>
    );
  }
);

Tooltip.displayName = 'Tooltip';
