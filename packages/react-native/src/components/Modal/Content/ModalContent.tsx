import { View } from 'react-native';

import { useThemeStyles } from '../../../theme';

import { createStyles } from './ModalContent.styles';
import type { ModalContentProps } from './types';

export const ModalContent = ({ children, style }: ModalContentProps) => {
  const styles = useThemeStyles(createStyles);

  return <View style={[styles.content, style]}>{children}</View>;
};

ModalContent.displayName = 'ModalContent';
