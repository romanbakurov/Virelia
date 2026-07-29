import { Children } from 'react';

import { Modal, Platform, Pressable, Text, View } from 'react-native';

import { useThemeStyles } from '../../../theme';
import { TooltipArrow } from '../Arrow';
import { useTooltipContext } from '../internal/TooltipContext';
import { createStyles } from '../Tooltip.styles';

import type { TooltipContentProps } from './types';

const nativePointerEventsNone =
  Platform.OS === 'web' ? undefined : ({ pointerEvents: 'none' } as const);
const webPointerEventsNone =
  Platform.OS === 'web' ? { pointerEvents: 'none' as const } : undefined;

export const TooltipContent = ({
  children,
  forceMount = false,
  withArrow = false,
  style,
  textStyle,
}: TooltipContentProps) => {
  const styles = useThemeStyles(createStyles);
  const tooltip = useTooltipContext();
  const visible = tooltip.open && !tooltip.disabled;

  if (!forceMount && !visible) {
    return null;
  }

  const bubble = (
    <View
      nativeID={tooltip.contentId}
      {...nativePointerEventsNone}
      style={[
        styles.bubble,
        webPointerEventsNone,
        {
          top: tooltip.position.top,
          left: tooltip.position.left,
        },
        !visible && { display: 'none' },
        style,
      ]}
      onLayout={tooltip.onFloatingLayout}
    >
      {Children.map(children, (child) =>
        typeof child === 'string' || typeof child === 'number' ? (
          <Text style={[styles.text, textStyle]}>{child}</Text>
        ) : (
          child
        )
      )}
      {withArrow && <TooltipArrow />}
    </View>
  );

  if (!visible) {
    return bubble;
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType='fade'
      onRequestClose={tooltip.requestClose}
    >
      <Pressable style={styles.overlay} onPress={tooltip.requestOutsideClose}>
        {bubble}
      </Pressable>
    </Modal>
  );
};

TooltipContent.displayName = 'Tooltip.Content';
