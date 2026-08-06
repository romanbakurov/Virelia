import { useMemo } from 'react';

import { Text } from 'react-native';

import { useTheme } from '../../../theme';

import { createPopoverTitleStyles } from './PopoverTitle.styles';
import type { PopoverTitleProps } from './types';

export const PopoverTitle = ({
  children,
  style,
  ...titleProps
}: PopoverTitleProps) => {
  const { theme } = useTheme();

  const styles = useMemo(() => createPopoverTitleStyles(theme), [theme]);

  return (
    <Text {...titleProps} style={[styles.title, style]}>
      {children}
    </Text>
  );
};

PopoverTitle.displayName = 'PopoverTitle';
