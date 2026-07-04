import { View } from 'react-native';

import { useThemeStyles } from '../../../theme';

import { createStyles } from './ModalFooter.styles';
import type { ModalFooterProps } from './types';

export const ModalFooter = ({ children, style }: ModalFooterProps) => {
  const styles = useThemeStyles(createStyles);

  return <View style={[styles.footer, style]}>{children}</View>;
};

ModalFooter.displayName = 'ModalFooter';
