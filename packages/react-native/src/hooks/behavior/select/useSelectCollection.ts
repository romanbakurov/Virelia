import { useMemo } from 'react';

import type { ReactNode } from 'react';

import { parseSelectChildren } from '../../../components/Select/internal/SelectCollection';
import type { SelectCollectionRow } from '../../../components/Select/internal/types';
import type { SelectOption } from '../../../components/Select/types';

export const useSelectCollection = (
  children: ReactNode,
  optionsProp: SelectOption[] | undefined
) => {
  const parsedChildren = useMemo(
    () => parseSelectChildren(children),
    [children]
  );
  const options = useMemo(
    () => [...(optionsProp ?? []), ...parsedChildren.options],
    [optionsProp, parsedChildren.options]
  );

  const rows = useMemo<SelectCollectionRow[]>(() => {
    if (parsedChildren.rows.length > 0) {
      return parsedChildren.rows;
    }

    return options.map((option) => ({
      type: 'item',
      key: `item-${option.value}`,
      option,
    }));
  }, [options, parsedChildren.rows]);

  return {
    options,
    rows,
    searchableFromChildren: parsedChildren.searchable,
    searchPlaceholderFromChildren: parsedChildren.searchPlaceholder,
    emptyFromChildren: parsedChildren.empty,
    loadingFromChildren: parsedChildren.loading,
  };
};
