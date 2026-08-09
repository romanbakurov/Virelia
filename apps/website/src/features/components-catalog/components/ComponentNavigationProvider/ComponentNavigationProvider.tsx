'use client';

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

type ComponentNavigationContextValue = {
  open: boolean;
  openNavigation: () => void;
  closeNavigation: () => void;
  toggleNavigation: () => void;
};

const ComponentNavigationContext =
  createContext<ComponentNavigationContextValue | null>(null);

type ComponentNavigationProviderProps = {
  children: ReactNode;
};

export function ComponentNavigationProvider({
  children,
}: ComponentNavigationProviderProps) {
  const [open, setOpen] = useState(false);

  const openNavigation = useCallback(() => {
    setOpen(true);
  }, []);

  const closeNavigation = useCallback(() => {
    setOpen(false);
  }, []);

  const toggleNavigation = useCallback(() => {
    setOpen((current) => !current);
  }, []);

  const value = useMemo(
    () => ({
      open,
      openNavigation,
      closeNavigation,
      toggleNavigation,
    }),
    [closeNavigation, open, openNavigation, toggleNavigation]
  );

  return (
    <ComponentNavigationContext.Provider value={value}>
      {children}
    </ComponentNavigationContext.Provider>
  );
}

export function useComponentNavigation() {
  const context = useContext(ComponentNavigationContext);

  if (!context) {
    throw new Error(
      'useComponentNavigation must be used within ComponentNavigationProvider'
    );
  }

  return context;
}
