import { Modal as RNModal, Pressable, View } from 'react-native';

import { useThemeStyles } from '../../../theme';
import { useModalContext } from '../internal/ModalContext';
import { createStyles } from '../Modal.styles';
import type { ModalOverlayProps } from '../types';

export const ModalOverlay = ({ children, overlayStyle }: ModalOverlayProps) => {
  const styles = useThemeStyles(createStyles);
  const { closeOnOutsidePress, open, setOpen } = useModalContext();

  return (
    <RNModal
      visible={open}
      transparent
      animationType='fade'
      onRequestClose={() => setOpen(false)}
    >
      <View style={[styles.overlay, overlayStyle]}>
        <Pressable
          testID='modal-backdrop'
          accessibilityRole={closeOnOutsidePress ? 'button' : undefined}
          accessibilityLabel={closeOnOutsidePress ? 'Close modal' : undefined}
          style={styles.backdrop}
          onPress={closeOnOutsidePress ? () => setOpen(false) : undefined}
        />

        {children}
      </View>
    </RNModal>
  );
};
