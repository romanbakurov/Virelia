import {
  createContext,
  type ReactNode,
  useContext,
  useMemo,
  useRef,
} from 'react';

import type { OverlayManager } from './types';
import { createOverlayManager, overlayManager } from './WebOverlayManager';

const OverlayManagerContext = createContext<OverlayManager | null>(null);

export type OverlayManagerProviderProps = {
  children: ReactNode;
  manager?: OverlayManager;
};

export const OverlayManagerProvider = ({
  children,
  manager,
}: OverlayManagerProviderProps) => {
  const ownedManagerRef = useRef<OverlayManager | null>(null);

  if (!ownedManagerRef.current) {
    ownedManagerRef.current = createOverlayManager();
  }

  const value = useMemo(
    () => manager ?? ownedManagerRef.current ?? overlayManager,
    [manager]
  );

  return (
    <OverlayManagerContext.Provider value={value}>
      {children}
    </OverlayManagerContext.Provider>
  );
};

export const useOverlayManager = () =>
  useContext(OverlayManagerContext) ?? overlayManager;
