import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { cn } from '@utils/cn';
import { useModal } from '@vellira-ui/core';

import { ModalProvider } from '../internal/ModalContext';
import { modalStack } from '../internal/ModalStack';
import type { ModalProps } from '../types';

export const ModalRoot = ({
  children,
  open,
  defaultOpen = false,
  onOpenChange,
  modal = true,
  closeOnEscape = true,
  closeOnOutsidePress = true,
  preventScroll = true,
  restoreFocus = true,
  trapFocus = true,
  initialFocus,
  finalFocus,
  onOpenAutoFocus,
  onCloseAutoFocus,
  onEscapeKeyDown,
  onPointerDownOutside,
  onInteractOutside,
  role = 'dialog',
  className,
}: ModalProps) => {
  const contentRef = useRef<HTMLElement | null>(null);
  const modalState = useModal({
    open,
    defaultOpen,
    onOpenChange,
    closeOnEscape,
    closeOnOutsidePress,
  });
  const {
    contentId,
    descriptionId,
    open: isOpen,
    requestClose: requestModalClose,
    setOpen,
    titleId,
  } = modalState;
  const [titlePresent, setTitlePresent] = useState(false);
  const [descriptionPresent, setDescriptionPresent] = useState(false);
  const shouldRender = isOpen;

  const requestClose = useCallback(() => {
    requestModalClose();
  }, [requestModalClose]);

  const setContentRef = useCallback((node: HTMLElement | null) => {
    contentRef.current = node;
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    modalStack.add(contentId);

    return () => {
      modalStack.remove(contentId);
    };
  }, [contentId, isOpen]);

  useEffect(() => {
    if (!isOpen || !preventScroll) return;

    modalStack.lockScroll();

    return () => {
      modalStack.unlockScroll();
    };
  }, [isOpen, preventScroll]);

  useEffect(() => {
    if (
      process.env.NODE_ENV === 'production' ||
      !isOpen ||
      titlePresent ||
      contentRef.current?.hasAttribute('aria-label')
    ) {
      return;
    }

    console.warn('Modal.Content requires Modal.Title or ariaLabel.');
  }, [isOpen, titlePresent]);

  useEffect(() => {
    if (
      process.env.NODE_ENV === 'production' ||
      !isOpen ||
      role !== 'alertdialog' ||
      descriptionPresent
    ) {
      return;
    }

    console.warn('Modal with role="alertdialog" requires Modal.Description.');
  }, [descriptionPresent, isOpen, role]);

  const context = useMemo(
    () => ({
      closeOnEscape,
      closeOnOutsidePress,
      contentId,
      contentRef,
      descriptionId,
      finalFocus,
      initialFocus,
      isTopModal: () => modalStack.isTop(contentId),
      modal,
      onCloseAutoFocus,
      onEscapeKeyDown,
      onInteractOutside,
      onOpenAutoFocus,
      onPointerDownOutside,
      open: isOpen,
      preventScroll,
      requestClose,
      restoreFocus,
      role,
      setContentRef,
      setDescriptionPresent,
      setOpen,
      setTitlePresent,
      shouldRender,
      titleId,
      trapFocus,
    }),
    [
      closeOnEscape,
      closeOnOutsidePress,
      contentId,
      descriptionId,
      finalFocus,
      initialFocus,
      isOpen,
      modal,
      onCloseAutoFocus,
      onEscapeKeyDown,
      onInteractOutside,
      onOpenAutoFocus,
      onPointerDownOutside,
      preventScroll,
      requestClose,
      restoreFocus,
      role,
      setContentRef,
      setOpen,
      shouldRender,
      titleId,
      trapFocus,
    ]
  );

  return (
    <ModalProvider value={context}>
      <div className={cn(className)} data-state={isOpen ? 'open' : 'closed'}>
        {children}
      </div>
    </ModalProvider>
  );
};

ModalRoot.displayName = 'ModalRoot';
