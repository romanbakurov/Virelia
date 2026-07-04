import { forwardRef } from 'react';

import { Close } from '@romanbakurov/vellira-icons';
import { Pressable, Text, View } from 'react-native';

import { useTheme, useThemeStyles } from '../../../theme';
import { useModalContext } from '../ModalContext';

import { createStyles } from './ModalHeader.styles';
import type { ModalHeaderProps } from './types';

export const ModalHeader = forwardRef<View, ModalHeaderProps>(
  ({ children, style, textStyle, testID }, ref) => {
    const { theme } = useTheme();
    const styles = useThemeStyles(createStyles);
    const { onClose } = useModalContext();

    return (
      <View ref={ref} testID={testID} style={[styles.header, style]}>
        <Text style={[styles.title, textStyle]}>{children}</Text>

        {onClose && (
          <Pressable
            accessibilityRole='button'
            accessibilityLabel='Close modal'
            onPress={onClose}
            style={styles.closeButton}
          >
            <Close
              size={16}
              color={theme.components.modal.closeButton.default.fg}
            />
          </Pressable>
        )}
      </View>
    );
  }
);

ModalHeader.displayName = 'ModalHeader';
