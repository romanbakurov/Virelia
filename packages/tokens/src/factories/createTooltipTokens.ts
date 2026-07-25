type TooltipContentTokens = {
  bg: string;
  fg: string;
  border: string;
  shadow: string;
  borderWidth: number;
  radius: number;
  paddingX: number;
  paddingY: number;
  maxWidth: number;
  compactMaxWidth: number;
  compactPaddingX: number;
  compactPaddingY: number;
  fontSize: number;
  lineHeight: number;
  compactFontSize: number;
  compactLineHeight: number;
  animationDuration: string;
  translateY: number;
  scale: number;
};

type TooltipArrowTokens = {
  bg: string;
  size: number;
  compactSize: number;
};

type TooltipTokensConfig = {
  contentBg: string;
  contentFg: string;
  contentBorder: string;
  contentShadow: string;
  contentBorderWidth?: number;
  contentRadius: number;
  contentPaddingX: number;
  contentPaddingY: number;
  contentMaxWidth?: number;
  contentCompactMaxWidth?: number;
  contentCompactPaddingX: number;
  contentCompactPaddingY: number;
  contentFontSize: number;
  contentLineHeight: number;
  contentCompactFontSize: number;
  contentCompactLineHeight: number;
  contentAnimationDuration?: string;
  contentTranslateY?: number;
  contentScale?: number;
  arrowBg?: string;
  arrowSize?: number;
  arrowCompactSize?: number;
};

export type TooltipTokens = {
  content: TooltipContentTokens;
  arrow: TooltipArrowTokens;
};

export const createTooltipTokens = ({
  contentBg,
  contentFg,
  contentBorder,
  contentShadow,
  contentBorderWidth = 1,
  contentRadius,
  contentPaddingX,
  contentPaddingY,
  contentMaxWidth = 240,
  contentCompactMaxWidth = 200,
  contentCompactPaddingX,
  contentCompactPaddingY,
  contentFontSize,
  contentLineHeight,
  contentCompactFontSize,
  contentCompactLineHeight,
  contentAnimationDuration = '150ms',
  contentTranslateY = 2,
  contentScale = 0.98,
  arrowBg = contentBg,
  arrowSize = 10,
  arrowCompactSize = 6,
}: TooltipTokensConfig): TooltipTokens =>
  ({
    content: {
      bg: contentBg,
      fg: contentFg,
      border: contentBorder,
      shadow: contentShadow,
      borderWidth: contentBorderWidth,
      radius: contentRadius,
      paddingX: contentPaddingX,
      paddingY: contentPaddingY,
      maxWidth: contentMaxWidth,
      compactMaxWidth: contentCompactMaxWidth,
      compactPaddingX: contentCompactPaddingX,
      compactPaddingY: contentCompactPaddingY,
      fontSize: contentFontSize,
      lineHeight: contentLineHeight,
      compactFontSize: contentCompactFontSize,
      compactLineHeight: contentCompactLineHeight,
      animationDuration: contentAnimationDuration,
      translateY: contentTranslateY,
      scale: contentScale,
    },

    arrow: {
      bg: arrowBg,
      size: arrowSize,
      compactSize: arrowCompactSize,
    },
  }) as const;
