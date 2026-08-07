import { useNativeOverlayRegistration } from '../../../managers';

export type OverlayStackOptions = {
  active: boolean;
  id: string;
};

export const useOverlayStack = ({ active, id }: OverlayStackOptions) =>
  useNativeOverlayRegistration({ id, visible: active });
