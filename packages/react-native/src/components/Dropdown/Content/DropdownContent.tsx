import { Modal, Pressable, View } from 'react-native';

import { useThemeStyles } from '../../../theme';

import { createStyles } from './DropdownContent.styles';
import type { DropdownContentProps } from './types';

export function DropdownContent({
  isOpen,
  children,
  onClose,
}: DropdownContentProps) {
  const styles = useThemeStyles(createStyles);

  return (
    <Modal
      transparent
      visible={isOpen}
      animationType='slide'
      onRequestClose={onClose}
    >
      <View style={styles.modalRoot}>
        <Pressable
          accessibilityRole='button'
          accessibilityLabel='Close menu'
          style={styles.backdrop}
          onPress={onClose}
        />

        <View accessibilityRole='menu' style={styles.menu}>
          {children}
        </View>
      </View>
    </Modal>
  );
}

DropdownContent.displayName = 'DropdownContent';
