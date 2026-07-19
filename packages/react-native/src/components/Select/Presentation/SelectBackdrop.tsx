import { Pressable } from 'react-native';

import { useThemeStyles } from '../../../theme';

import { createPresentationStyles } from './SelectPresentation.styles';
import type { SelectBackdropProps } from './types';

export const SelectBackdrop = ({
  onClose,
  dismissOnBackdropPress,
}: SelectBackdropProps) => {
  const styles = useThemeStyles(createPresentationStyles);

  return (
    <Pressable
      style={styles.backdrop}
      onPress={dismissOnBackdropPress ? onClose : undefined}
      accessibilityRole='button'
      accessibilityLabel='Dismiss select'
    />
  );
};

SelectBackdrop.displayName = 'Select.Backdrop';
