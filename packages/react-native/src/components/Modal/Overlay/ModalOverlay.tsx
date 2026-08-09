import {
  Animated,
  Modal as RNModal,
  Platform,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';

import { useThemeStyles } from '../../../theme';
import { useModalContext } from '../internal/ModalContext';
import { createStyles } from '../Modal.styles';
import type { ModalOverlayProps } from '../types';

export const ModalOverlay = ({ children, overlayStyle }: ModalOverlayProps) => {
  const styles = useThemeStyles(createStyles);
  const {
    animation,
    animationProgress,
    zIndex,
    onClose,
    getOutsidePressProps,
    shouldRender,
  } = useModalContext();
  const backdropStyle =
    animation === 'none'
      ? undefined
      : {
          opacity: animationProgress,
        };

  return (
    <RNModal
      visible={shouldRender}
      transparent
      animationType='none'
      onRequestClose={onClose}
    >
      <View
        style={[
          styles.overlay,
          Platform.OS === 'web' && { zIndex },
          overlayStyle,
        ]}
      >
        <Animated.View style={[styles.backdrop, backdropStyle]}>
          <Pressable
            testID='modal-backdrop'
            {...getOutsidePressProps({ accessibilityLabel: 'Close modal' })}
            style={StyleSheet.absoluteFill}
          />
        </Animated.View>

        {children}
      </View>
    </RNModal>
  );
};
