'use client';

import { createContext, useContext, useState, type ReactNode } from 'react';

type ComponentDemoStateContextValue = {
  state: unknown;
  setState: (state: unknown) => void;
};

const ComponentDemoStateContext =
  createContext<ComponentDemoStateContextValue | null>(null);

type ComponentDemoStateProviderProps = {
  children: ReactNode;
};

export function ComponentDemoStateProvider({
  children,
}: ComponentDemoStateProviderProps) {
  const [state, setState] = useState<unknown>(undefined);

  return (
    <ComponentDemoStateContext.Provider value={{ state, setState }}>
      {children}
    </ComponentDemoStateContext.Provider>
  );
}

export function useComponentDemoState<T>(initialState: T) {
  const context = useContext(ComponentDemoStateContext);

  if (!context) {
    throw new Error(
      'useComponentDemoState must be used within ComponentDemoStateProvider'
    );
  }

  const state =
    context.state === undefined ? initialState : (context.state as T);

  const setState = (nextState: T) => {
    context.setState(nextState);
  };

  return [state, setState] as const;
}
