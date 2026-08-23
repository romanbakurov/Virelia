export type SwitchVisualState = {
  trackBg: string;
  trackBorder: string;
  thumbBg: string;
};

export type SwitchGeometry = {
  trackWidth: number;
  trackHeight: number;
  borderWidth: number;
  padding: number;
  thumbSize: number;
  thumbTravel: number;
  focusRingWidth: number;
  focusRingOffset: number;
  pressScale: number;
};

export type SwitchTokensConfig = {
  geometry: SwitchGeometry;
  off: SwitchVisualState;
  on: {
    default: SwitchVisualState;
    hover: SwitchVisualState;
    pressed: SwitchVisualState;
  };
  focusRing: string;
  errorBorder: string;
  errorRing: string;
  disabled: SwitchVisualState;
};

export const createSwitchTokens = (config: SwitchTokensConfig) => config;
