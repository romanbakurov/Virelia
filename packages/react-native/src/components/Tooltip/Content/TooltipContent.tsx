import { Children } from 'react';

import { Modal, Pressable, Text, View } from 'react-native';

import { useThemeStyles } from '../../../theme';
import { TooltipArrow } from '../Arrow';
import { useTooltipContext } from '../internal/TooltipContext';
import { createStyles } from '../Tooltip.styles';

import type { TooltipContentProps } from './types';

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
      pointerEvents='none'
      style={[
        styles.bubble,
        {
          top: tooltip.position.top,
          left: tooltip.position.left,
          zIndex: tooltip.zIndex,
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
      <Pressable
        {...tooltip.getOutsidePressProps({
          accessibilityLabel: 'Close tooltip',
        })}
        style={styles.overlay}
      >
        {bubble}
      </Pressable>
    </Modal>
  );
};

TooltipContent.displayName = 'Tooltip.Content';
