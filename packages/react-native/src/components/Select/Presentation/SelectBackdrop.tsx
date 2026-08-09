import { Pressable } from 'react-native';

import { useThemeStyles } from '../../../theme';

import { createPresentationStyles } from './SelectPresentation.styles';
import type { SelectBackdropProps } from './types';

export const SelectBackdrop = ({ outsidePressProps }: SelectBackdropProps) => {
  const styles = useThemeStyles(createPresentationStyles);

  return <Pressable {...outsidePressProps} style={styles.backdrop} />;
};

SelectBackdrop.displayName = 'Select.Backdrop';
