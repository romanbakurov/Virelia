import { View } from 'react-native';

import { useThemeStyles } from '../../../theme';
import { createSelectSlot } from '../internal/SelectCollection';
import type { SelectSeparatorProps } from '../types';

import { createGroupStyles } from './SelectGroup.styles';

export const SelectSeparator = createSelectSlot<SelectSeparatorProps>(
  'separator',
  'Select.Separator'
);

export const SelectSeparatorRow = () => {
  const styles = useThemeStyles(createGroupStyles);

  return <View style={styles.separator} />;
};

SelectSeparatorRow.displayName = 'Select.SeparatorRow';
