import type { ReactNode } from 'react';
import type { LayoutChangeEvent, StyleProp, ViewStyle } from 'react-native';

import type { DropdownColor, DropdownPresentation } from '../types';

export interface DropdownContentProps {
  isOpen: boolean;
  children: ReactNode;
  onClose: () => void;
  color?: DropdownColor;
  contentStyle?: StyleProp<ViewStyle>;
  accessibilityLabel?: string;
  presentation: Exclude<DropdownPresentation, 'auto'>;
  position: {
    top: number;
    left: number;
  };
  onFloatingLayout: (event: LayoutChangeEvent) => void;
  searchable?: boolean;
  searchValue?: string;
  searchPlaceholder?: string;
  searchAccessibilityLabel?: string;
  onSearchChange?: (value: string) => void;
  layer: number;
}
