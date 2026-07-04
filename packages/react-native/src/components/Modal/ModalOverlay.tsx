import { Modal as RNModal, Pressable, View } from 'react-native';

import { useThemeStyles } from '../../theme';

import { createStyles } from './Modal.styles';
import type { ModalOverlayProps } from './types';

export const ModalOverlay = ({
  isOpen,
  onClose,
  closeOnBackdrop = true,
  children,
  overlayStyle,
}: ModalOverlayProps) => {
  const styles = useThemeStyles(createStyles);

  return (
    <RNModal
      visible={isOpen}
      transparent
      animationType='fade'
      onRequestClose={onClose}
    >
      <View style={[styles.overlay, overlayStyle]}>
        <Pressable
          testID='modal-backdrop'
          accessibilityRole={closeOnBackdrop ? 'button' : undefined}
          accessibilityLabel={closeOnBackdrop ? 'Close modal' : undefined}
          style={styles.backdrop}
          onPress={closeOnBackdrop ? onClose : undefined}
        />

        {children}
      </View>
    </RNModal>
  );
};
