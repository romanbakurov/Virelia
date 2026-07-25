import { Children } from 'react';

import { Modal, Pressable, Text, View } from 'react-native';

import { useThemeStyles } from '../../../theme';
import { useTooltipContext } from '../internal/TooltipContext';
import { createStyles } from '../Tooltip.styles';

import type { TooltipContentProps } from './types';

export const TooltipContent = ({
  children,
  forceMount = false,
  style,
  textStyle,
}: TooltipContentProps) => {
  const styles = useThemeStyles(createStyles);
  const tooltip = useTooltipContext();
  const visible = tooltip.open && !tooltip.disabled;

  if (!forceMount && !visible) {
    return null;
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType='fade'
      onRequestClose={tooltip.requestClose}
    >
      <Pressable style={styles.overlay} onPress={tooltip.requestOutsideClose}>
        <View
          nativeID={tooltip.contentId}
          pointerEvents='none'
          style={[
            styles.bubble,
            {
              top: tooltip.position.top,
              left: tooltip.position.left,
            },
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
        </View>
      </Pressable>
    </Modal>
  );
};

TooltipContent.displayName = 'Tooltip.Content';
