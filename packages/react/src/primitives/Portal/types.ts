import type { ReactNode } from 'react';

export type PortalProps = {
  /** Content rendered into the portal container. */
  children: ReactNode;
  /** DOM container that receives the portal content. */
  container?: Element | DocumentFragment | null;
};

export type PortalProviderProps = {
  /** Provider children that can consume the default portal container. */
  children: ReactNode;
  /** Default DOM container used by nested portals. */
  container?: Element | DocumentFragment | null;
};
