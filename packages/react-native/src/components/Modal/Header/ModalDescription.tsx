import { Text } from 'react-native';

import { useThemeStyles } from '../../../theme';

import { createStyles } from './ModalHeader.styles';
import type { ModalDescriptionProps } from './types';

export const ModalDescription = ({
  children,
  style,
}: ModalDescriptionProps) => {
  const styles = useThemeStyles(createStyles);

  return <Text style={[styles.description, style]}>{children}</Text>;
};

ModalDescription.displayName = 'Modal.Description';
