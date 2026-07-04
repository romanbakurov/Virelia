import { useCallback, useEffect, useRef } from 'react';

import { useModalKeyboard } from '@hooks/useModalKeyboard';
import { cn } from '@utils/cn';
import { Portal } from '@utils/Portal';
import FocusTrap from 'focus-trap-react';

import { useModalContext } from './ModalContext';
import type { ModalOverlayProps } from './types';

import styles from './ModalOverlay.module.scss';

let openModalCount = 0;
let originalBodyOverflow = '';

export const ModalOverlay = ({
  children,
  onClose,
  isOpen,
  className,
  closeOnBackdrop,
  closeOnClick,
  closeOnEsc = true,
  zIndex = 1000,
  animated = true,
}: ModalOverlayProps) => {
  const shouldCloseOnBackdrop = closeOnBackdrop ?? closeOnClick ?? true;
  const modalRef = useRef<HTMLDivElement>(null);
  const { titleId, descriptionId } = useModalContext();

  const handleOverlayClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!shouldCloseOnBackdrop) return;

      if (e.target === e.currentTarget) {
        onClose?.();
      }
    },
    [shouldCloseOnBackdrop, onClose]
  );

  useModalKeyboard({ isOpen, onClose: closeOnEsc ? onClose : undefined });

  useEffect(() => {
    if (!isOpen) return;

    if (openModalCount === 0) {
      originalBodyOverflow = document.body.style.overflow;
    }
    openModalCount += 1;
    document.body.style.overflow = 'hidden';

    return () => {
      openModalCount = Math.max(0, openModalCount - 1);
      if (openModalCount === 0) {
        document.body.style.overflow = originalBodyOverflow;
      }
    };
  }, [isOpen]);

  if (!isOpen && !animated) return null;

  return (
    <Portal>
      <div
        className={cn(
          styles.overlay,
          isOpen && styles['overlay--open'],
          animated && styles['overlay--animated'],
          className
        )}
        onClick={handleOverlayClick}
        tabIndex={-1}
        role='presentation'
        aria-hidden={!isOpen}
        style={{ zIndex }}
      >
        <FocusTrap
          active={isOpen}
          focusTrapOptions={{
            fallbackFocus: () => modalRef.current!,
            returnFocusOnDeactivate: true,
            allowOutsideClick: true, // required for backdrop click support with focus-trap-react v12
          }}
        >
          <div
            ref={modalRef}
            tabIndex={-1}
            className={styles.modal}
            role='dialog'
            aria-modal='true'
            aria-labelledby={titleId}
            aria-describedby={descriptionId}
          >
            {children}
          </div>
        </FocusTrap>
      </div>
    </Portal>
  );
};

ModalOverlay.displayName = 'ModalOverlay';
