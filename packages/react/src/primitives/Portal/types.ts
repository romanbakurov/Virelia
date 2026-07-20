import type { ReactNode } from 'react';

export type PortalProps = {
  children: ReactNode;
  container?: Element | DocumentFragment | null;
};

export type PortalProviderProps = {
  children: ReactNode;
  container?: Element | DocumentFragment | null;
};
