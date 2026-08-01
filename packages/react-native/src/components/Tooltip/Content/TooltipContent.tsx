import { Children } from 'react';

import { Modal, Platform, Pressable, Text, View } from 'react-native';

import { useThemeStyles } from '../../../theme';
import { useTheme } from '../../../theme/useTheme';
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
      {withArrow && <InternalArrow />}
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

function InternalArrow() {
  const { theme } = useTheme();
  const tooltip = useTooltipContext();
  const size = theme.components.tooltip.arrow.size;
  const side = tooltip.placement.split('-')[0] as
    'top' | 'right' | 'bottom' | 'left';
  const staticSide = {
    top: 'bottom',
    right: 'left',
    bottom: 'top',
    left: 'right',
  }[side];
  const crossAxisStyle =
    side === 'left' || side === 'right'
      ? {
          top: '50%' as const,
          marginTop: -size / 2,
        }
      : {
          left: '50%' as const,
          marginLeft: -size / 2,
        };

  return (
    <View
      {...nativePointerEventsNone}
      style={[
        {
          position: 'absolute',
          width: size,
          height: size,
          backgroundColor: theme.components.tooltip.arrow.bg,
          transform: [{ rotate: '45deg' }],
          [staticSide]: -size / 2,
          ...crossAxisStyle,
        },
        webPointerEventsNone,
      ]}
    />
  );
}
