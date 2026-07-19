import { Modal, View } from 'react-native';

import { useThemeStyles } from '../../../theme';

import { SelectBackdrop } from './SelectBackdrop';
import { createPresentationStyles } from './SelectPresentation.styles';
import type { SelectPopoverProps } from './types';

export const SelectPopover = ({
  visible,
  onClose,
  dismissOnBackdropPress,
  placement,
  matchTriggerWidth,
  triggerWidth,
  contentStyle,
  children,
}: SelectPopoverProps) => {
  const styles = useThemeStyles(createPresentationStyles);

  return (
    <Modal
      transparent
      visible={visible}
      animationType='fade'
      onRequestClose={onClose}
    >
      <View
        style={[
          styles.modalRoot,
          styles.popoverRoot,
          placement === 'top'
            ? styles.popoverRootTop
            : styles.popoverRootBottom,
        ]}
        testID='select-content-root'
      >
        <SelectBackdrop
          onClose={onClose}
          dismissOnBackdropPress={dismissOnBackdropPress}
        />
        <View
          style={[
            styles.content,
            styles.popover,
            placement === 'top' ? styles.popoverTop : styles.popoverBottom,
            matchTriggerWidth && triggerWidth ? { width: triggerWidth } : null,
            contentStyle,
          ]}
          testID='select-popover'
        >
          {children}
        </View>
      </View>
    </Modal>
  );
};

SelectPopover.displayName = 'Select.Popover';
