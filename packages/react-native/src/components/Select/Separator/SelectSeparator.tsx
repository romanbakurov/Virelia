import { View } from 'react-native';

import { useThemeStyles } from '../../../theme';
import { createGroupStyles } from '../Group/SelectGroup.styles';
import { createSelectSlot } from '../internal/SelectCollection';
import type { SelectSeparatorProps } from '../types';

export const SelectSeparator = createSelectSlot<SelectSeparatorProps>(
  'separator',
  'Select.Separator'
);

export const SelectSeparatorRow = () => {
  const styles = useThemeStyles(createGroupStyles);

  return <View style={styles.separator} />;
};

SelectSeparatorRow.displayName = 'Select.SeparatorRow';
