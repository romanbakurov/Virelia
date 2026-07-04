import React, { createContext, useContext } from 'react';

export interface OverlayProviderProps {
  children: React.ReactNode;
}

const OverlayContext = createContext(null);

export const OverlayProvider = ({ children }: OverlayProviderProps) => {
  return (
    <OverlayContext.Provider value={null}>{children}</OverlayContext.Provider>
  );
};

export const useOverlay = () => useContext(OverlayContext);
