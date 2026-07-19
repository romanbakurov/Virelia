import { Text } from 'react-native';

import { useThemeStyles } from '../../../theme';
import { createSelectSlot } from '../internal/SelectCollection';
import type { SelectGroupProps } from '../types';

import { createGroupStyles } from './SelectGroup.styles';

export const SelectGroup = createSelectSlot<SelectGroupProps>(
  'group',
  'Select.Group'
);

export const SelectGroupLabelRow = ({ label }: { label: string }) => {
  const styles = useThemeStyles(createGroupStyles);

  return <Text style={styles.groupLabel}>{label}</Text>;
};

SelectGroupLabelRow.displayName = 'Select.GroupLabelRow';
