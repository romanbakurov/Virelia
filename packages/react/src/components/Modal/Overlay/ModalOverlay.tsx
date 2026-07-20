import { cn } from '@utils/cn';

import { useModalContext } from '../internal/ModalContext';

import type { ModalOverlayProps } from './types';

import styles from './ModalOverlay.module.scss';

export const ModalOverlay = ({
  className,
  animated = true,
  forceMount = false,
}: ModalOverlayProps) => {
  const { open } = useModalContext();

  if (!open && !forceMount) return null;

  return (
    <div
      className={cn(
        styles.overlay,
        open && styles['overlay--open'],
        animated && styles['overlay--animated'],
        className
      )}
      data-state={open ? 'open' : 'closed'}
      aria-hidden='true'
    />
  );
};

ModalOverlay.displayName = 'ModalOverlay';
