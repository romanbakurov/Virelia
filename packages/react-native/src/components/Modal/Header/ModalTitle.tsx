import { Text } from 'react-native';

import { useThemeStyles } from '../../../theme';

import { createStyles } from './ModalHeader.styles';
import type { ModalTitleProps } from './types';

export const ModalTitle = ({ children, style }: ModalTitleProps) => {
  const styles = useThemeStyles(createStyles);

  return (
    <Text accessibilityRole='header' style={[styles.title, style]}>
      {children}
    </Text>
  );
};

ModalTitle.displayName = 'Modal.Title';
