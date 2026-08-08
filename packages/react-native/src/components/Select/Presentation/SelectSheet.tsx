import { Modal, Platform, View } from 'react-native';

import { useThemeStyles } from '../../../theme';

import { SelectBackdrop } from './SelectBackdrop';
import { SelectHandle } from './SelectHandle';
import { createPresentationStyles } from './SelectPresentation.styles';
import type { SelectPresentationProps } from './types';

export const SelectSheet = ({
  visible,
  onClose,
  dismissOnBackdropPress,
  zIndex,
  contentStyle,
  children,
}: SelectPresentationProps) => {
  const styles = useThemeStyles(createPresentationStyles);

  return (
    <Modal
      transparent
      visible={visible}
      animationType='slide'
      onRequestClose={onClose}
    >
      <View
        style={[
          styles.modalRoot,
          styles.sheetRoot,
          Platform.OS === 'web' && { zIndex },
        ]}
        testID='select-content-root'
      >
        <SelectBackdrop
          onClose={onClose}
          dismissOnBackdropPress={dismissOnBackdropPress}
        />
        <View
          style={[styles.content, styles.sheet, contentStyle]}
          testID='select-sheet'
        >
          <SelectHandle />
          {children}
        </View>
      </View>
    </Modal>
  );
};

SelectSheet.displayName = 'Select.Sheet';
