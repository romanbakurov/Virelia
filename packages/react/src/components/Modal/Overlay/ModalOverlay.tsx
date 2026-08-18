import { useModalContext } from '../internal/ModalContext';

import type { ModalOverlayProps } from './types';

import styles from './ModalOverlay.module.scss';

import { cn } from '#utils/cn';

export const ModalOverlay = ({
  className,
  animated = true,
  forceMount = false,
}: ModalOverlayProps) => {
  const { animation, animationStyle, open, shouldRender } = useModalContext();

  if (!shouldRender && !forceMount) return null;

  return (
    <div
      className={cn(
        styles.overlay,
        open && styles['overlay--open'],
        animated && styles['overlay--animated'],
        className
      )}
      style={animationStyle}
      data-state={open ? 'open' : 'closed'}
      data-animation={animation}
      aria-hidden='true'
    />
  );
};

ModalOverlay.displayName = 'ModalOverlay';
