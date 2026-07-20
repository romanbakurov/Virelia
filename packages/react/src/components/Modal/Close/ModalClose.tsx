import { cloneElement, isValidElement } from 'react';

import { cn } from '@utils/cn';
import { Close } from '@vellira-ui/icons';
import type { MouseEventHandler, Ref } from 'react';

import { composeEventHandlers } from '../internal/composeEventHandlers';
import { MODAL_CLOSE_LABEL } from '../internal/constants';
import { useModalContext } from '../internal/ModalContext';

import type { ModalCloseProps } from './types';

import styles from '../Header/ModalHeader.module.scss';

type CloseChildProps = {
  className?: string;
  onClick?: MouseEventHandler<HTMLElement>;
  ref?: Ref<HTMLElement>;
  'aria-label'?: string;
};

export const ModalClose = ({
  asChild = false,
  children,
  className,
  'aria-label': ariaLabel,
}: ModalCloseProps) => {
  const root = useModalContext();
  const child =
    asChild && isValidElement<CloseChildProps>(children) ? children : undefined;
  const closeProps = {
    'aria-label': child ? ariaLabel : (ariaLabel ?? MODAL_CLOSE_LABEL),
    className: cn(!child && styles.modalHeaderCloseButton, className),
    onClick: composeEventHandlers(
      child?.props.onClick as MouseEventHandler<HTMLElement> | undefined,
      root.requestClose
    ),
  };

  if (child) {
    return cloneElement(child, {
      ...closeProps,
      className: cn(child.props.className, className),
      'aria-label': ariaLabel ?? child.props['aria-label'],
    });
  }

  return (
    <button type='button' {...closeProps}>
      <Close size={16} />
    </button>
  );
};

ModalClose.displayName = 'Modal.Close';
