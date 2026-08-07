import type { shadows } from '../tokens/shadows.js';

type NativeShadowToken = (typeof shadows)[keyof typeof shadows];

type PopoverTokensConfig = {
  contentBg: string;
  contentFg: string;
  contentBorder: string;
  contentWebShadow: string;
  contentNativeShadow: NativeShadowToken;
  titleFg: string;
  descriptionFg: string;
  radiusLg: number;
  spacing3: number;
  spacing4: number;
};

export const createPopoverTokens = (config: PopoverTokensConfig) =>
  ({
    content: {
      bg: config.contentBg,
      fg: config.contentFg,
      border: config.contentBorder,

      shadow: {
        web: config.contentWebShadow,
        native: config.contentNativeShadow,
      },

      borderWidth: 1,
      radius: config.radiusLg,
      padding: config.spacing4,
      gap: config.spacing3,
      minWidth: 220,
      maxWidth: 320,
    },

    title: {
      fg: config.titleFg,
    },

    description: {
      fg: config.descriptionFg,
    },

    arrow: {
      size: 10,
      bg: config.contentBg,
      border: config.contentBorder,
    },
  }) as const;
