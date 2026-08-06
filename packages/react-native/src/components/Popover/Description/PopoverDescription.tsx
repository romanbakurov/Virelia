import { useMemo } from 'react';

import { Text } from 'react-native';

import { useTheme } from '../../../theme';

import { createPopoverDescriptionStyles } from './PopoverDescription.styles';
import type { PopoverDescriptionProps } from './types';

export const PopoverDescription = ({
  children,
  style,
  ...descriptionProps
}: PopoverDescriptionProps) => {
  const { theme } = useTheme();

  const styles = useMemo(() => createPopoverDescriptionStyles(theme), [theme]);

  return (
    <Text {...descriptionProps} style={[styles.description, style]}>
      {children}
    </Text>
  );
};

PopoverDescription.displayName = 'PopoverDescription';
