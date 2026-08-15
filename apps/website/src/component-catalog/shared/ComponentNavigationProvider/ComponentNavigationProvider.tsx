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
  mainOpen: boolean;

  openNavigation: () => void;
  closeNavigation: () => void;
  toggleNavigation: () => void;

  openMainNavigation: () => void;
  closeMainNavigation: () => void;

  switchToMainNavigation: () => void;
  setMainNavigationOpen: (open: boolean) => void;
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
  const [mainOpen, setMainOpen] = useState(false);

  const setMainNavigationOpen = useCallback((nextOpen: boolean) => {
    setOpen(false);
    setMainOpen(nextOpen);
  }, []);

  const openNavigation = useCallback(() => {
    setMainOpen(false);
    setOpen(true);
  }, []);

  const closeNavigation = useCallback(() => {
    setOpen(false);
  }, []);

  const toggleNavigation = useCallback(() => {
    setMainOpen(false);
    setOpen((current) => !current);
  }, []);

  const openMainNavigation = useCallback(() => {
    setOpen(false);
    setMainOpen(true);
  }, []);

  const closeMainNavigation = useCallback(() => {
    setMainOpen(false);
  }, []);

  const switchToMainNavigation = useCallback(() => {
    setOpen(false);
    setMainOpen(true);
  }, []);

  const value = useMemo(
    () => ({
      open,
      mainOpen,

      openNavigation,
      closeNavigation,
      toggleNavigation,

      openMainNavigation,
      closeMainNavigation,

      switchToMainNavigation,
      setMainNavigationOpen,
    }),
    [
      closeMainNavigation,
      closeNavigation,
      mainOpen,
      open,
      openMainNavigation,
      openNavigation,
      switchToMainNavigation,
      setMainNavigationOpen,
      toggleNavigation,
    ]
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
