import { useEffect, useRef, useState } from 'react';

import { Modal, Pressable, Text, View } from 'react-native';

import { useNativeFloatingPosition } from '../../hooks/useNativeFloatingPosition';
import { useThemeStyles } from '../../theme';

import { createStyles } from './Tooltip.styles';
import type { TooltipProps } from './types';

export function Tooltip({
  children,
  content,
  placement = 'top',
  disabled = false,
  maxWidth = 240,
  delay,
  style,
  contentStyle,
  textStyle,
}: TooltipProps) {
  const styles = useThemeStyles(createStyles);
  const [visible, setVisible] = useState(false);

  const triggerRef = useRef<View | null>(null);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { position, updatePosition, onFloatingLayout } =
    useNativeFloatingPosition(placement, 8);

  const hideDelay = delay?.close ?? 2500;

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
    setVisible(true);

    closeTimerRef.current = setTimeout(() => {
      setVisible(false);
      closeTimerRef.current = null;
    }, hideDelay);
  };

  useEffect(() => {
    return clearCloseTimer;
  }, []);

  return (
    <View style={[styles.root, style]}>
      <Pressable ref={triggerRef} onLongPress={showTooltip}>
        {children}
      </Pressable>

      <Modal visible={visible && !disabled} transparent animationType='fade'>
        <Pressable
          style={styles.overlay}
          onPress={() => {
            clearCloseTimer();
            setVisible(false);
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

Tooltip.displayName = 'Tooltip';
