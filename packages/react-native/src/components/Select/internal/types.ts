import type { ReactNode, RefObject } from 'react';
import type { LayoutChangeEvent, TextInput } from 'react-native';

import type { SelectOption, SelectPresentation, SelectProps } from '../types';

export type SelectSlot =
  | 'trigger'
  | 'value'
  | 'icon'
  | 'content'
  | 'search'
  | 'group'
  | 'label'
  | 'item'
  | 'itemIcon'
  | 'itemDescription'
  | 'itemBadge'
  | 'separator'
  | 'empty'
  | 'loading';

export type SelectSlotComponent = {
  [selectSlotName]?: SelectSlot;
};

export type SelectCollectionRow =
  | {
      type: 'group';
      key: string;
      label: string;
      selectable?: boolean;
      selectLabel?: string;
      itemValues: string[];
    }
  | { type: 'separator'; key: string }
  | { type: 'item'; key: string; option: SelectOption };

export type ParsedSelectChildren = {
  options: SelectOption[];
  rows: SelectCollectionRow[];
  searchable: boolean;
  searchPlaceholder?: string;
  empty?: ReactNode;
  loading?: ReactNode;
};

export const selectSlotName = Symbol('VelliraNativeSelectSlot');

export type SelectContextValue = {
  label?: string;
  description?: string;
  error?: ReactNode;
  placeholder: string;
  color: NonNullable<SelectProps['color']>;
  variant: NonNullable<SelectProps['variant']>;
  size: NonNullable<SelectProps['size']>;
  isOpen: boolean;
  hasValue: boolean;
  loading: boolean;
  clearable: boolean;
  searchable: boolean;
  multiple: boolean;
  maxSelected?: number;
  virtual: SelectProps['virtual'];
  resolvedLabel: string;
  resolvedHint?: string;
  resolvedPresentation: Exclude<SelectPresentation, 'auto'>;
  placement: NonNullable<SelectProps['placement']>;
  position: {
    top: number;
    left: number;
  };
  onFloatingLayout: (event: LayoutChangeEvent) => void;
  dismissOnBackdropPress: boolean;
  matchTriggerWidth: boolean;
  triggerWidth?: number;
  selectedValues: string[];
  selectedOptions: SelectOption[];
  optionsByValue: Map<string, SelectOption>;
  rows: SelectCollectionRow[];
  filteredRows: SelectCollectionRow[];
  selectedRowIndex: number;
  itemHeight: number;
  query: string;
  searchPlaceholder: string;
  searchInputRef: RefObject<TextInput | null>;
  empty: ReactNode;
  loadingContent: ReactNode;
  closeContent: () => void;
  openContent: () => void;
  clearValue: () => void;
  selectOption: (option: SelectOption) => void;
  selectGroup: (values: string[]) => void;
  setQuery: (query: string) => void;
  renderValue: NonNullable<SelectProps['renderValue']> | undefined;
  renderOption: NonNullable<SelectProps['renderOption']> | undefined;
  startIcon: SelectProps['startIcon'];
  endIcon: SelectProps['endIcon'];
  prefix: SelectProps['prefix'];
  suffix: SelectProps['suffix'];
  triggerStyle: SelectProps['triggerStyle'];
  textStyle: SelectProps['textStyle'];
  contentStyle: SelectProps['contentStyle'];
  optionStyle: SelectProps['optionStyle'];
  searchStyle: SelectProps['searchStyle'];
  fieldControlId?: string;
  fieldLabelId?: string;
  fieldDescribedBy?: string;
};
