import { Modal, Platform, View } from 'react-native';

import { useThemeStyles } from '../../../theme';

import { SelectBackdrop } from './SelectBackdrop';
import { createPresentationStyles } from './SelectPresentation.styles';
import type { SelectPopoverProps } from './types';

export const SelectPopover = ({
  visible,
  onClose,
  outsidePressProps,
  zIndex,
  position,
  onFloatingLayout,
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
        style={[styles.modalRoot, Platform.OS === 'web' && { zIndex }]}
        testID='select-content-root'
      >
        <SelectBackdrop outsidePressProps={outsidePressProps} />

        <View
          onLayout={onFloatingLayout}
          style={[
            styles.surface,
            styles.popoverSurface,
            {
              position: 'absolute',
              top: position.top,
              left: position.left,
            },
            matchTriggerWidth && triggerWidth
              ? {
                  width: triggerWidth,
                  maxWidth: triggerWidth,
                }
              : {
                  width: '100%',
                  maxWidth: 420,
                },
          ]}
          testID='select-popover-surface'
        >
          <View
            style={[styles.content, styles.popover, contentStyle]}
            testID='select-popover'
          >
            {children}
          </View>
        </View>
      </View>
    </Modal>
  );
};

SelectPopover.displayName = 'Select.Popover';
