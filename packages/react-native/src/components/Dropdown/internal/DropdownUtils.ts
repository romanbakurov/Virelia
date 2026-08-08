import type { DropdownSelectEvent } from '../types';

import type { ParsedNativeDropdownChildren } from './types';

export function createDropdownSelectEvent(): DropdownSelectEvent {
  let defaultPrevented = false;

  return {
    preventDefault: () => {
      defaultPrevented = true;
    },
    get defaultPrevented() {
      return defaultPrevented;
    },
  };
}

export function filterDropdownEntries(
  parsed: ParsedNativeDropdownChildren,
  searchValue: string
) {
  const normalizedSearch = searchValue.trim().toLocaleLowerCase();

  const matchedItems = new Set(
    parsed.items
      .filter((item) =>
        item.label.toLocaleLowerCase().includes(normalizedSearch)
      )
      .map((item) => item.id)
  );

  return {
    ...parsed,
    items: parsed.items.filter((item) => matchedItems.has(item.id)),
    entries: parsed.entries.filter(
      (entry) => entry.type !== 'item' || matchedItems.has(entry.id)
    ),
  };
}
