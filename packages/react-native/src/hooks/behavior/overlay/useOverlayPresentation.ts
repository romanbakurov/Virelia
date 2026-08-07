import { useWindowDimensions } from 'react-native';

export type OverlayPresentation = 'auto' | 'sheet' | 'modal' | 'popover';

export function useOverlayPresentation(
  presentation: OverlayPresentation = 'auto',
  breakpoint = 768
): Exclude<OverlayPresentation, 'auto'> {
  const { width } = useWindowDimensions();

  if (presentation === 'auto') {
    return width >= breakpoint ? 'popover' : 'sheet';
  }

  return presentation;
}
