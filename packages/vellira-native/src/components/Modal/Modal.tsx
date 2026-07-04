import { forwardRef } from 'react';

import type { View } from 'react-native';

import { ModalContent } from './Content/ModalContent';
import ModalContext from './ModalContext';
import { ModalOverlay } from './ModalOverlay';
import type { ModalProps } from './types';

export const ModalRoot = forwardRef<View, ModalProps>(
  (
    {
      isOpen,
      onClose,
      closeOnBackdrop,
      closeOnEsc = true,
      children,
      overlayStyle,
      contentStyle,
      style,
      testID,
    },
    ref
  ) => {
    const shouldCloseOnBackdrop = closeOnBackdrop ?? true;

    return (
      <ModalContext.Provider value={{ onClose }}>
        <ModalOverlay
          isOpen={isOpen}
          onClose={onClose}
          closeOnBackdrop={shouldCloseOnBackdrop}
          closeOnEsc={closeOnEsc}
          overlayStyle={overlayStyle}
        >
          <ModalContent
            ref={ref}
            testID={testID}
            style={style}
            contentStyle={contentStyle}
          >
            {children}
          </ModalContent>
        </ModalOverlay>
      </ModalContext.Provider>
    );
  }
);

ModalRoot.displayName = 'Modal';
