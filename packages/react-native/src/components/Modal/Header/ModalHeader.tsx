import { Text, View } from 'react-native';

import { useThemeStyles } from '../../../theme';
import { ModalClose } from '../Close';

import { createStyles } from './ModalHeader.styles';
import type { ModalHeaderProps } from './types';

export const ModalHeader = ({
  children,
  style,
  textStyle,
}: ModalHeaderProps) => {
  const styles = useThemeStyles(createStyles);

  return (
    <View style={[styles.header, style]}>
      <Text style={[styles.title, textStyle]}>{children}</Text>

      <ModalClose />
    </View>
  );
};

ModalHeader.displayName = 'ModalHeader';
