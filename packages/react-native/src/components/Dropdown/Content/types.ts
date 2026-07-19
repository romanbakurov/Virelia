import type { ReactNode } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';

import type { DropdownPresentation } from '../types';

export interface DropdownContentProps {
  isOpen: boolean;
  children: ReactNode;
  onClose: () => void;
  contentStyle?: StyleProp<ViewStyle>;
  accessibilityLabel?: string;
  presentation: Exclude<DropdownPresentation, 'auto'>;
}
