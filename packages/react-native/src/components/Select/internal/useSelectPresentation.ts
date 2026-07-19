import { useWindowDimensions } from 'react-native';

import type { SelectPresentation } from '../types';

export const useSelectPresentation = (
  presentation: SelectPresentation = 'auto'
) => {
  const { width } = useWindowDimensions();

  if (presentation === 'auto') {
    return width >= 768 ? 'popover' : 'sheet';
  }

  return presentation;
};
