import type { StyleProp, ViewStyle } from 'react-native';

import type { SelectCollectionOption } from '../internal/types';

export type SelectItemRowProps = {
  option: SelectCollectionOption;
  isSelected: boolean;
  isDisabled: boolean;
  itemIndex: number;
  selectedValues: string[];
  multiple: boolean;
  optionStyle: StyleProp<ViewStyle>;
  onSelect: (option: SelectCollectionOption) => void;
};
