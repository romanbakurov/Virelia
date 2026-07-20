import type { ReactNode } from 'react';

export type ModalPortalProps = {
  children: ReactNode;
  container?: HTMLElement | null;
  forceMount?: boolean;
};
