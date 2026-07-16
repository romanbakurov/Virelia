export type RadioState = {
  bg: string;
  fg: string;
  border: string;
  labelFg: string;
};

export type RadioPaletteConfig = {
  ring: string;
  default: RadioState;
  hover: RadioState;
  pressed: RadioState;
};

export const createRadioPalette = ({
  ring,
  default: defaultState,
  hover,
  pressed,
}: RadioPaletteConfig) =>
  ({
    ring,
    default: defaultState,
    hover,
    pressed,
  }) as const;
