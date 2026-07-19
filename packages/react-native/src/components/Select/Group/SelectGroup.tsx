import { Pressable, Text } from 'react-native';

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

type SelectGroupActionRowProps = {
  label: string;
  selectLabel?: string;
  selectedCount: number;
  itemCount: number;
  onPress: () => void;
};

export const SelectGroupActionRow = ({
  label,
  selectLabel,
  selectedCount,
  itemCount,
  onPress,
}: SelectGroupActionRowProps) => {
  const styles = useThemeStyles(createGroupStyles);
  const isSelected = itemCount > 0 && selectedCount === itemCount;
  const isMixed = selectedCount > 0 && selectedCount < itemCount;
  const resolvedLabel = selectLabel ?? label;

  return (
    <Pressable
      accessibilityRole='button'
      accessibilityLabel={resolvedLabel}
      accessibilityHint={`Selects all options in ${label}`}
      accessibilityState={{
        selected: isSelected,
        checked: isMixed ? 'mixed' : isSelected,
        disabled: itemCount === 0,
      }}
      disabled={itemCount === 0}
      onPress={onPress}
      style={styles.groupAction}
    >
      <Text style={styles.groupActionText}>{resolvedLabel}</Text>
      <Text style={styles.groupActionMeta}>
        {selectedCount}/{itemCount}
      </Text>
    </Pressable>
  );
};

SelectGroupLabelRow.displayName = 'Select.GroupLabelRow';
SelectGroupActionRow.displayName = 'Select.GroupActionRow';
