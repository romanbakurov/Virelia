'use client';

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

type ComponentDemoStateContextValue = {
  state: unknown;
  setState: (state: unknown) => void;
};

const ComponentDemoStateContext =
  createContext<ComponentDemoStateContextValue | null>(null);

type ComponentDemoStateProviderProps = {
  children: ReactNode;
  resetKey?: string;
  transientStateKeys?: readonly string[];
};

export function ComponentDemoStateProvider({
  children,
  resetKey,
  transientStateKeys = [],
}: ComponentDemoStateProviderProps) {
  const [state, setState] = useState<unknown>(undefined);
  const [activeResetKey, setActiveResetKey] = useState(resetKey);

  const effectiveState = useMemo(
    () =>
      resetKey !== activeResetKey
        ? resetComponentDemoTransientState(state, transientStateKeys)
        : state,
    [activeResetKey, resetKey, state, transientStateKeys]
  );

  useEffect(() => {
    if (resetKey === activeResetKey) {
      return;
    }

    setState(resetComponentDemoTransientState(state, transientStateKeys));
    setActiveResetKey(resetKey);
  }, [activeResetKey, resetKey, state, transientStateKeys]);

  return (
    <ComponentDemoStateContext.Provider
      value={{ state: effectiveState, setState }}
    >
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

  const state = resolveComponentDemoState(context.state, initialState);

  const setState = (nextState: T) => {
    context.setState(nextState);
  };

  return [state, setState] as const;
}

export function resolveComponentDemoState<T>(
  state: unknown,
  initialState: T
): T {
  if (state === undefined) {
    return initialState;
  }

  if (isPlainRecord(initialState) && isPlainRecord(state)) {
    return {
      ...initialState,
      ...state,
    } as T;
  }

  return state as T;
}

export function resetComponentDemoTransientState(
  state: unknown,
  transientStateKeys: readonly string[]
) {
  if (!isPlainRecord(state) || transientStateKeys.length === 0) {
    return state;
  }

  const nextState: Record<string, unknown> = { ...state };

  for (const key of transientStateKeys) {
    delete nextState[key];
  }

  return nextState;
}

function isPlainRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}
