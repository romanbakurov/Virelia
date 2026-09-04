import { View } from 'react-native';

import { useTheme } from '../../../theme';
import { createStyles } from '../Accordion.styles';

import type { AccordionContentProps } from './types';

type InternalAccordionContentProps = AccordionContentProps & {
  hidden?: boolean;
};

export function AccordionContent({
  children,
  forceMount = false,
  hidden = false,
}: InternalAccordionContentProps) {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  if (hidden && !forceMount) return null;
  return (
    <View style={[styles.content, hidden && styles.contentHidden]}>
      {children}
    </View>
  );
}
