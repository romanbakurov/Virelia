import { useMemo } from 'react';

import type { ReactNode } from 'react';

import { collectSelectStructure } from './SelectCollection';

export function useSelectCollection(children: ReactNode) {
  return useMemo(() => collectSelectStructure(children), [children]);
}
