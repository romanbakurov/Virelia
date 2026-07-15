import { Close } from '@vellira-ui/icons';
import { Pressable, Text, View } from 'react-native';

import { useTheme, useThemeStyles } from '../../../theme';
import { useModalContext } from '../ModalContext';

import { createStyles } from './ModalHeader.styles';
import type { ModalHeaderProps } from './types';

export const ModalHeader = ({
  children,
  style,
  textStyle,
}: ModalHeaderProps) => {
  const { theme } = useTheme();
  const styles = useThemeStyles(createStyles);
  const { onClose } = useModalContext();

  return (
    <View style={[styles.header, style]}>
      <Text style={[styles.title, textStyle]}>{children}</Text>

      {onClose && (
        <Pressable
          accessibilityRole='button'
          accessibilityLabel='Close modal'
          onPress={onClose}
          style={styles.closeButton}
        >
          {({ pressed }) => {
            const closeIconColor = pressed
              ? theme.components.modal.closeButton.hover.fg
              : theme.components.modal.closeButton.default.fg;
            return <Close size={16} color={closeIconColor} />;
          }}
        </Pressable>
      )}
    </View>
  );
};

ModalHeader.displayName = 'ModalHeader';
