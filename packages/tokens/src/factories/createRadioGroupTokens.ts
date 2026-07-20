type RadioGroupTokensConfig = {
  spacing1: number;
  spacing2: number;
  spacing3: number;
  spacing4: number;
  spacing5: number;
};

export const createRadioGroupTokens = (config: RadioGroupTokensConfig) =>
  ({
    size: {
      sm: {
        itemGap: config.spacing1,
        horizontalGap: config.spacing3,
      },
      md: {
        itemGap: config.spacing2,
        horizontalGap: config.spacing4,
      },
      lg: {
        itemGap: config.spacing3,
        horizontalGap: config.spacing5,
      },
    },
  }) as const;
