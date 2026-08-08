import type { DropdownColor, DropdownSize } from '@vellira-ui/types';
import type { ReactNode } from 'react';
import type {
  LayoutChangeEvent,
  StyleProp,
  TextStyle,
  ViewStyle,
} from 'react-native';

import type {
  DropdownContentProps,
  DropdownEmptyProps,
  DropdownItemProps,
  DropdownLabelProps,
  DropdownLoadingProps,
  DropdownPresentation,
  DropdownSearchProps,
  DropdownSeparatorProps,
  DropdownTriggerProps,
} from '../types';

export interface DropdownContextValue {
  open: boolean;
  disabled: boolean;
  loading: boolean;

  color: DropdownColor;
  size: DropdownSize;

  presentation: Exclude<DropdownPresentation, 'auto'>;
  position: {
    top: number;
    left: number;
  };
  zIndex: number;

  searchable: boolean;
  searchValue: string;
  searchPlaceholder: string;
  searchAccessibilityLabel?: string;

  itemStyle?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;

  requestClose: () => void;
  requestOutsideClose: () => void;
  toggle: () => void;
  onSearchChange: (value: string) => void;
  onFloatingLayout: (event: LayoutChangeEvent) => void;
}

export type NativeDropdownEntry =
  | { type: 'label'; id: string; props: DropdownLabelProps }
  | { type: 'separator'; id: string; props: DropdownSeparatorProps }
  | { type: 'empty'; id: string; props: DropdownEmptyProps }
  | { type: 'loading'; id: string; props: DropdownLoadingProps }
  | {
      type: 'item';
      id: string;
      props: DropdownItemProps;
      label: string;
      disabled?: boolean;
    };

export type ParsedNativeDropdownChildren = {
  trigger?: ReactNode;
  triggerProps?: DropdownTriggerProps;
  contentProps?: DropdownContentProps;
  searchProps?: DropdownSearchProps;
  entries: NativeDropdownEntry[];
  items: Array<Extract<NativeDropdownEntry, { type: 'item' }>>;
};
