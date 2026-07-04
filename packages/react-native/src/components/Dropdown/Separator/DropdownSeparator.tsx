import { View } from 'react-native';

import { useThemeStyles } from '../../../theme';

import { createStyles } from './DropdownSeparator.styles';

export function DropdownSeparator() {
  const styles = useThemeStyles(createStyles);

  return <View style={styles.separator} />;
}

DropdownSeparator.displayName = 'DropdownSeparator';
