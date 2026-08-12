import type { CSSProperties, ReactNode } from 'react';

export type ModalContentSize = 'sm' | 'md' | 'lg' | 'xl' | 'full';
export type ModalContentPlacement = 'center' | 'top';
export type ModalScrollBehavior = 'inside' | 'outside';

export interface ModalContentProps {
  /** Modal panel content. */
  children: ReactNode;
  /** Preset modal panel width. */
  size?: ModalContentSize;
  /** Vertical placement for the modal panel. */
  placement?: ModalContentPlacement;
  /** Controls whether scrolling happens inside the panel or outside it. */
  scrollBehavior?: ModalScrollBehavior;
  /** Enables enter and exit animation for the panel. */
  animated?: boolean;
  /** Keeps content mounted even when the modal is closed. */
  forceMount?: boolean;
  /** Accessible label applied directly to the modal panel. */
  ariaLabel?: string;
  /** Id of the element that labels the modal panel. */
  ariaLabelledBy?: string;
  /** Id of the element that describes the modal panel. */
  ariaDescribedBy?: string;
  /** Class name applied to the modal panel. */
  className?: string;
  /** Inline style applied to the modal panel. */
  style?: CSSProperties;
}
