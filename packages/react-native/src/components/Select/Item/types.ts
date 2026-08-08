import type { StyleProp, ViewStyle } from 'react-native';

import type { SelectOption } from '../types';

export type SelectItemRowProps = {
  option: SelectOption;
  isSelected: boolean;
  isDisabled: boolean;
  itemIndex: number;
  selectedValues: string[];
  multiple: boolean;
  optionStyle: StyleProp<ViewStyle>;
  onSelect: (option: SelectOption) => void;
};
