import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { cn } from '@utils/cn';
import { lightTheme } from '@vellira-ui/tokens';
import type { CSSProperties } from 'react';

import { useModal, useOverlayRegistration, useScrollLock } from '@/hooks';

import { ModalProvider } from '../internal/ModalContext';
import type { ModalProps } from '../types';

const easingMap = {
  standard: lightTheme.components.modal.motion.easing,
  linear: 'linear',
  ease: 'ease',
  'ease-in': 'ease-in',
  'ease-out': 'ease-out',
  'ease-in-out': 'ease-in-out',
} as const;

const parseDuration = (duration: string) => Number.parseFloat(duration);

const resolveDuration = (duration: ModalProps['duration']) => {
  if (typeof duration === 'number') {
    return {
      close: duration,
      open: duration,
    };
  }

  return {
    close:
      duration?.close ??
      parseDuration(lightTheme.components.modal.motion.closeDuration),
    open:
      duration?.open ??
      parseDuration(lightTheme.components.modal.motion.openDuration),
  };
};

export const ModalRoot = ({
  children,
  open,
  defaultOpen = false,
  onOpenChange,
  animation = 'scale',
  duration,
  easing = 'standard',
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
  const animationDuration = resolveDuration(duration);
  const shouldAnimate = animation !== 'none';
  const closeDuration = shouldAnimate ? animationDuration.close : 0;
  const [shouldRender, setShouldRender] = useState(isOpen);

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      return;
    }

    if (closeDuration === 0) {
      setShouldRender(false);
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setShouldRender(false);
    }, closeDuration);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [closeDuration, isOpen]);

  const requestClose = useCallback(() => {
    requestModalClose();
  }, [requestModalClose]);

  const setContentRef = useCallback((node: HTMLElement | null) => {
    contentRef.current = node;
  }, []);

  useScrollLock({
    active: isOpen,
    enabled: preventScroll,
  });

  const overlayRegistration = useOverlayRegistration({
    active: shouldRender,
    id: contentId,
    layer: 'modal',
  });

  const animationStyle = useMemo(
    () =>
      ({
        '--modal-animation-close-duration': `${animationDuration.close}ms`,
        '--modal-animation-easing': easingMap[easing],
        '--modal-animation-open-duration': `${animationDuration.open}ms`,
        '--z-index-modal':
          overlayRegistration.zIndex !== undefined
            ? `${overlayRegistration.zIndex}`
            : undefined,
      }) as CSSProperties,
    [
      animationDuration.close,
      animationDuration.open,
      easing,
      overlayRegistration.zIndex,
    ]
  );

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
      animation,
      animationStyle,
      closeOnEscape,
      closeOnOutsidePress,
      contentId,
      contentRef,
      descriptionId,
      finalFocus,
      initialFocus,
      zIndex: overlayRegistration.zIndex,
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
      animation,
      animationStyle,
      closeOnEscape,
      closeOnOutsidePress,
      contentId,
      descriptionId,
      finalFocus,
      initialFocus,
      overlayRegistration.zIndex,
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
