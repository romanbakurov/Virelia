import { Modal, Pressable, View } from 'react-native';

import { useThemeStyles } from '../../../theme';

import { createStyles } from './DropdownContent.styles';
import type { DropdownContentProps } from './types';

export function DropdownContent({
  isOpen,
  children,
  onClose,
  contentStyle,
  accessibilityLabel,
  presentation,
}: DropdownContentProps) {
  const styles = useThemeStyles(createStyles);
  const isSheet = presentation === 'sheet';

  return (
    <Modal
      transparent
      visible={isOpen}
      animationType={isSheet ? 'slide' : 'fade'}
      onRequestClose={onClose}
    >
      <View style={[styles.modalRoot, styles[presentation]]}>
        <Pressable
          accessibilityRole='button'
          accessibilityLabel='Close menu'
          style={styles.backdrop}
          onPress={onClose}
        />

        <View
          accessibilityRole='menu'
          accessibilityLabel={accessibilityLabel}
          style={[styles.menu, styles[`${presentation}Menu`], contentStyle]}
        >
          {children}
        </View>
      </View>
    </Modal>
  );
}

DropdownContent.displayName = 'DropdownContent';
