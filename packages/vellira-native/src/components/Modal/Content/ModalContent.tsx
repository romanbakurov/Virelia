import { forwardRef } from 'react';

import { View } from 'react-native';

import { useThemeStyles } from '../../../theme';

import { createStyles } from './ModalContent.styles';
import type { ModalContentProps } from './types';

export const ModalContent = forwardRef<View, ModalContentProps>(
  ({ children, style, contentStyle, testID }, ref) => {
    const styles = useThemeStyles(createStyles);

    return (
      <View
        ref={ref}
        testID={testID}
        style={[styles.content, style, contentStyle]}
      >
        {children}
      </View>
    );
  }
);

ModalContent.displayName = 'ModalContent';
