import {
  cloneElement,
  type CSSProperties,
  isValidElement,
  type ReactElement,
  type Ref,
  useCallback,
  useState,
} from 'react';

import { Portal } from '@primitives/Portal';
import { cn } from '@utils/cn';

import type { OverlayDismissReason } from '@/hooks';
import {
  useAriaIsolation,
  useFocusScope,
  useOverlayDismiss,
  useOverlayStack,
  useScrollLock,
} from '@/hooks';

import { usePopoverContext } from '../Context';

import type { PopoverContentProps } from './types';

import styles from './PopoverContent.module.scss';

type ContentChildProps = {
  className?: string;
  style?: CSSProperties;
  ref?: Ref<HTMLElement>;
};

export function PopoverContent({
  children,
  asChild = false,
  className,
  style,
  initialFocus,
  returnFocus = true,
  closeOnEscape = true,
  closeOnOutsidePress = true,
  onEscapeKeyDown,
  onPointerDownOutside,
  onInteractOutside,
  onOpenAutoFocus,
  onCloseAutoFocus,
  ...contentProps
}: PopoverContentProps) {
  const {
    open,
    modal,
    portal,
    triggerRef,
    contentRef,
    contentId,
    titleId,
    descriptionId,
    placement,
    floatingStyles,
    setOpen,
    setContentRef: setContextContentRef,
  } = usePopoverContext('Popover.Content');

  const [contentElement, setContentElement] = useState<HTMLElement | null>(
    null
  );

  const { isTopOverlay } = useOverlayStack({
    active: open,
    id: contentId,
  });

  const requestClose = useCallback(
    (reason: OverlayDismissReason, event: KeyboardEvent | PointerEvent) => {
      setOpen(false, {
        reason,
        event,
      });
    },
    [setOpen]
  );

  useOverlayDismiss({
    active: open,
    id: contentId,
    contentRef: contentRef,
    ignoreRefs: [triggerRef],
    closeOnEscape,
    closeOnOutsidePress,
    isTopOverlay,
    onEscapeKeyDown,
    onPointerDownOutside,
    onInteractOutside,
    requestClose,
  });

  const handleOpenAutoFocus = useCallback(
    (
      event: Parameters<NonNullable<PopoverContentProps['onOpenAutoFocus']>>[0]
    ) => {
      onOpenAutoFocus?.(event);

      if (!event.defaultPrevented && !modal && !initialFocus) {
        event.preventDefault();
      }
    },
    [modal, initialFocus, onOpenAutoFocus]
  );

  useFocusScope({
    active: open,
    contentRef: contentRef,
    enabled: modal,
    initialFocus,
    finalFocus: triggerRef,
    restoreFocus: returnFocus,
    onOpenAutoFocus: handleOpenAutoFocus,
    onCloseAutoFocus,
  });

  useScrollLock({
    active: open,
    enabled: modal,
  });

  useAriaIsolation({
    active: open,
    enabled: modal,
    content: contentElement,
  });

  const setContentRef = useCallback(
    (node: HTMLElement | null) => {
      setContentElement(node);
      setContextContentRef(node);
    },
    [setContextContentRef]
  );

  if (!open) {
    return null;
  }

  const resolvedSide = placement.split('-')[0];

  const sharedProps = {
    ...contentProps,
    id: contentId,
    role: contentProps.role ?? 'dialog',
    tabIndex: contentProps.tabIndex ?? -1,
    'aria-labelledby': titleId,
    'aria-describedby': descriptionId,
    'data-state': 'open',
    'data-side': resolvedSide,
    className: cn(styles.content, className),
    style: {
      ...floatingStyles,
      ...style,
    },
  };

  const child =
    asChild && isValidElement<ContentChildProps>(children)
      ? (children as ReactElement<ContentChildProps>)
      : undefined;

  const content = child ? (
    cloneElement(child, {
      ...sharedProps,
      ref: setContentRef,
      className: cn(child.props.className, styles.content, className),
      style: {
        ...floatingStyles,
        ...child.props.style,
        ...style,
      },
    })
  ) : (
    <div ref={setContentRef} {...sharedProps}>
      {children}
    </div>
  );

  return portal ? <Portal>{content}</Portal> : content;
}

PopoverContent.displayName = 'Popover.Content';
