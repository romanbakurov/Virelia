import { View } from 'react-native';

import { useTheme } from '../../../theme';
import { createStyles } from '../Accordion.styles';

import type { AccordionItemProps } from './types';

export function AccordionItem({ children }: AccordionItemProps) {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  return <View style={styles.item}>{children}</View>;
}
