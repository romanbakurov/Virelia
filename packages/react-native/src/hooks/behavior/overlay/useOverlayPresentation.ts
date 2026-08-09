import { resolveOverlayPresentation } from '@vellira-ui/core';
import { useWindowDimensions } from 'react-native';

export type OverlayPresentation = 'auto' | 'sheet' | 'modal' | 'popover';

export function useOverlayPresentation(
  presentation: OverlayPresentation = 'auto',
  breakpoint = 768
): Exclude<OverlayPresentation, 'auto'> {
  const { width } = useWindowDimensions();

  return resolveOverlayPresentation({
    presentation,
    defaultPresentation: 'sheet',
    autoPresentation: width >= breakpoint ? 'popover' : 'sheet',
  });
}
