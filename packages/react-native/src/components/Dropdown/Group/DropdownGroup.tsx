import { Text } from 'react-native';

import { useThemeStyles } from '../../../theme';

import { createStyles } from './DropdownGroup.styles';
import type { DropdownGroupProps } from './types';

export function DropdownGroup({ label }: DropdownGroupProps) {
  const styles = useThemeStyles(createStyles);

  return <Text style={styles.groupLabel}>{label}</Text>;
}

DropdownGroup.displayName = 'DropdownGroup';
