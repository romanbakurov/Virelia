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
  const isPlainTitle =
    typeof children === 'string' || typeof children === 'number';

  return (
    <View style={[styles.header, style]}>
      {isPlainTitle ? (
        <Text style={[styles.title, styles.plainTitle, textStyle]}>
          {children}
        </Text>
      ) : (
        <View style={styles.headerContent}>{children}</View>
      )}

      <ModalClose />
    </View>
  );
};

ModalHeader.displayName = 'ModalHeader';
