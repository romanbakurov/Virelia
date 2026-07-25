import { useNativeOverlayStack } from '../../../managers';

export type OverlayStackOptions = {
  active: boolean;
  id: string;
};

export const useOverlayStack = ({ active, id }: OverlayStackOptions) =>
  useNativeOverlayStack({ id, visible: active });
