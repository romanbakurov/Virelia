type ModalFocusRing = {
  color: string;
  width: string;
  shadow: string;
  offset: string;
};

type ModalTokensConfig = {
  overlayBg: string;
  contentBg: string;
  contentFg: string;
  contentBorder: string;
  contentShadow: string;
  titleFg: string;
  descriptionFg: string;
  closeButtonDefaultFg: string;
  closeButtonHoverBg: string;
  closeButtonHoverFg: string;
  closeButtonPressedBg: string;
  closeButtonPressedFg: string;
  closeButtonDisabledFg: string;
  closeButtonFocusRing: ModalFocusRing;
  radiusLg: number;
  radiusFull: number;
  spacing1: number;
  spacing3: number;
  spacing4: number;
  spacing8: number;
  spacing10: number;
};

const modalLayout = {
  maxHeight: '90vh',
  nativeMaxHeight: '90%',
  zIndexOffset: '1',
} as const;

const modalMotion = {
  closeDuration: '150ms',
  easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
  openDuration: '180ms',
} as const;

export const createModalTokens = (config: ModalTokensConfig) =>
  ({
    overlay: {
      bg: config.overlayBg,
      blur: 4,
      animationDuration: modalMotion.openDuration,
    },

    content: {
      bg: config.contentBg,
      fg: config.contentFg,
      border: config.contentBorder,
      shadow: config.contentShadow,
      borderWidth: 1,
      radius: config.radiusLg,
      padding: config.spacing4,
      gap: config.spacing4,
      minWidth: 320,
      maxHeight: modalLayout.maxHeight,
      nativeMaxHeight: modalLayout.nativeMaxHeight,
      viewportMargin: config.spacing8,
      topOffset: config.spacing10,
      zIndexOffset: modalLayout.zIndexOffset,
      animationDuration: modalMotion.openDuration,

      size: {
        sm: 400,
        md: 560,
        lg: 720,
        xl: 960,
      },
    },

    title: {
      fg: config.titleFg,
    },

    description: {
      fg: config.descriptionFg,
    },

    header: {
      gap: config.spacing4,
      paddingBottom: config.spacing4,
      textGap: config.spacing1,
    },

    body: {
      paddingBottom: config.spacing4,
    },

    footer: {
      gap: config.spacing3,
      paddingTop: config.spacing4,
    },

    closeButton: {
      size: 32,
      iconSize: 16,
      radius: config.radiusFull,

      default: {
        bg: 'transparent',
        fg: config.closeButtonDefaultFg,
        border: 'transparent',
      },

      hover: {
        bg: config.closeButtonHoverBg,
        fg: config.closeButtonHoverFg,
        border: 'transparent',
      },

      pressed: {
        bg: config.closeButtonPressedBg,
        fg: config.closeButtonPressedFg,
        border: 'transparent',
      },

      focus: {
        ring: config.closeButtonFocusRing,
      },

      disabled: {
        bg: 'transparent',
        fg: config.closeButtonDisabledFg,
        border: 'transparent',
      },
    },

    motion: modalMotion,
  }) as const;
