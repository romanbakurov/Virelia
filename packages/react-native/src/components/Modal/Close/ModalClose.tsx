import { cloneElement, isValidElement } from 'react';

import { Close } from '@vellira-ui/icons';
import { Pressable } from 'react-native';

import { useTheme, useThemeStyles } from '../../../theme';
import { createStyles } from '../Header/ModalHeader.styles';
import { useModalContext } from '../internal/ModalContext';

import type { ModalCloseProps } from './types';

export const ModalClose = ({
  asChild = false,
  children,
  accessibilityLabel,
  style,
}: ModalCloseProps) => {
  const { theme } = useTheme();
  const styles = useThemeStyles(createStyles);
  const { onClose } = useModalContext();
  const shouldRenderChild = asChild || children !== undefined;

  if (shouldRenderChild && isValidElement(children)) {
    return cloneElement(children, {
      accessibilityLabel:
        children.props.accessibilityLabel ?? accessibilityLabel,
      onPress: (event) => {
        children.props.onPress?.(event);
        onClose?.();
      },
    });
  }

  return (
    <Pressable
      accessibilityRole='button'
      accessibilityLabel={accessibilityLabel ?? 'Close modal'}
      onPress={onClose}
      style={[styles.closeButton, style]}
    >
      {({ pressed }) => {
        const closeIconColor = pressed
          ? theme.components.modal.closeButton.hover.fg
          : theme.components.modal.closeButton.default.fg;
        return (
          <Close
            size={theme.components.modal.closeButton.iconSize}
            color={closeIconColor}
          />
        );
      }}
    </Pressable>
  );
};

ModalClose.displayName = 'Modal.Close';
