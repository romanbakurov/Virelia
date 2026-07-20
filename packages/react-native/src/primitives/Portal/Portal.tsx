import { createContext, useContext } from 'react';

import type React from 'react';

import type { PortalProps, PortalProviderProps } from './types';

const PortalContext = createContext<unknown>(null);

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

export const Portal: PortalComponent = ({ children }) => {
  useContext(PortalContext);

  return <>{children}</>;
};

Portal.__velliraPortal = true;
Portal.displayName = 'Portal';
PortalProvider.displayName = 'PortalProvider';
