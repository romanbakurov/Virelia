import { createContext, useContext } from 'react';
import { createPortal } from 'react-dom';

import { usePortal } from '@vellira-ui/core';
import type React from 'react';

import type { PortalProps, PortalProviderProps } from './types';

const PortalContext = createContext<Element | DocumentFragment | null>(null);

type PortalComponent = ((props: PortalProps) => React.ReactElement | null) & {
  __velliraPortal?: true;
  displayName?: string;
};

export const PortalProvider = ({
  children,
  container = null,
}: PortalProviderProps) => (
  <PortalContext.Provider value={container}>{children}</PortalContext.Provider>
);

export const Portal: PortalComponent = ({ children, container }) => {
  const providerContainer = useContext(PortalContext);
  const root = usePortal({ container: container ?? providerContainer });

  if (!root) return null;

  return createPortal(children, root);
};

Portal.__velliraPortal = true;
Portal.displayName = 'Portal';
PortalProvider.displayName = 'PortalProvider';
