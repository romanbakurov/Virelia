type ContextMenuState = {
  readonly bg: string;
  readonly fg: string;
};

type ContextMenuDangerStates = {
  readonly default: ContextMenuState;
  readonly hover: ContextMenuState;
  readonly active: ContextMenuState;
  readonly disabled: ContextMenuState;
};

type ContextMenuFocusRing = {
  readonly color: string;
  readonly width: string;
  readonly shadow: string;
  readonly offset: string;
};

type ContextMenuTokensConfig = {
  contentBg: string;
  contentBorder: string;
  contentShadow: string;
  itemDefault: ContextMenuState;
  itemHover: ContextMenuState;
  itemActive: ContextMenuState;
  itemPressed: ContextMenuState;
  itemFocusRing: ContextMenuFocusRing;
  itemDisabled: ContextMenuState;
  itemDanger: ContextMenuDangerStates;
  triggerDefaultFg: string;
  triggerHoverBg: string;
  triggerHoverFg: string;
  triggerFocusFg: string;
  triggerFocusRing: ContextMenuFocusRing;
  triggerDisabledFg: string;
  groupLabelFg: string;
};

export const createContextMenuTokens = (config: ContextMenuTokensConfig) =>
  ({
    content: {
      bg: config.contentBg,
      border: config.contentBorder,
      shadow: config.contentShadow,
    },

    item: {
      default: config.itemDefault,
      hover: config.itemHover,
      active: {
        ...config.itemActive,
        ring: 'transparent',
      },
      pressed: config.itemPressed,
      focus: {
        ring: config.itemFocusRing,
      },
      disabled: config.itemDisabled,
      danger: config.itemDanger,
    },

    trigger: {
      default: {
        bg: 'transparent',
        fg: config.triggerDefaultFg,
        border: 'transparent',
      },
      hover: {
        bg: config.triggerHoverBg,
        fg: config.triggerHoverFg,
        border: 'transparent',
        ring: 'transparent',
      },
      focus: {
        bg: 'transparent',
        fg: config.triggerFocusFg,
        border: 'transparent',
        ring: config.triggerFocusRing,
      },
      disabled: {
        bg: 'transparent',
        fg: config.triggerDisabledFg,
        border: 'transparent',
      },
    },

    groupLabel: {
      fg: config.groupLabelFg,
    },
  }) as const;
