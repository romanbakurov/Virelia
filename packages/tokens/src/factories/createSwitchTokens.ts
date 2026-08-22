export type SwitchVisualState = {
  trackBg: string;
  trackBorder: string;
  thumbBg: string;
};

export type SwitchTokensConfig = {
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
