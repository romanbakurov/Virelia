import { createContext, useContext, useMemo, useRef } from 'react';

import {
  createNativeOverlayManager,
  nativeOverlayManager,
} from './NativeOverlayManager';
import type {
  NativeOverlayManager,
  NativeOverlayManagerProviderProps,
} from './types';

const NativeOverlayManagerContext = createContext<NativeOverlayManager | null>(
  null
);

export const NativeOverlayManagerProvider = ({
  children,
  manager,
}: NativeOverlayManagerProviderProps) => {
  const ownedManagerRef = useRef<NativeOverlayManager | null>(null);

  if (!ownedManagerRef.current) {
    ownedManagerRef.current = createNativeOverlayManager();
  }

  const value = useMemo(
    () => manager ?? ownedManagerRef.current ?? nativeOverlayManager,
    [manager]
  );

  return (
    <NativeOverlayManagerContext.Provider value={value}>
      {children}
    </NativeOverlayManagerContext.Provider>
  );
};

export const useNativeOverlayManager = () =>
  useContext(NativeOverlayManagerContext) ?? nativeOverlayManager;
