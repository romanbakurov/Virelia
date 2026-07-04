import { forwardRef } from 'react';

import { View } from 'react-native';

import { useThemeStyles } from '../../../theme';

import { createStyles } from './ModalFooter.styles';
import type { ModalFooterProps } from './types';

export const ModalFooter = forwardRef<View, ModalFooterProps>(
  ({ children, style, testID }, ref) => {
    const styles = useThemeStyles(createStyles);

    return (
      <View ref={ref} testID={testID} style={[styles.footer, style]}>
        {children}
      </View>
    );
  }
);

ModalFooter.displayName = 'ModalFooter';
