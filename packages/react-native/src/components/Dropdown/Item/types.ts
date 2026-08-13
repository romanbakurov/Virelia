import type { DropdownItemColor, TextWrap } from '@vellira-ui/types';
import type { ReactNode } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';

export interface DropdownItemProps {
  /** Value associated with this item for selection and filtering. */
  value: string;
  /** Composes item behavior onto a single child element. */
  asChild?: boolean;
  /** Custom item content. */
  children?: ReactNode;
  /** Semantic color palette for the item. */
  color?: DropdownItemColor;
  /** Disables item interaction. */
  disabled?: boolean;
  /** Item label. */
  label: ReactNode;
  /** Icon rendered before the item label. */
  icon?: ReactNode;
  /** Controls wrapping behavior for item text. */
  textWrap?: TextWrap;
  /** Called when this item is selected. */
  onSelect: (value: string) => void;
  /** Style applied to the item row. */
  style?: StyleProp<ViewStyle>;
}
