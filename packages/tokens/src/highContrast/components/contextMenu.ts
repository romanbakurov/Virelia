import { createContextMenuTokens } from '../../factories/createContextMenuTokens.js';
import { focus } from '../semantic/focus.js';
import { menu as semanticMenu } from '../semantic/menu.js';
import { shadow } from '../semantic/shadow.js';
import { text } from '../semantic/text.js';

export const contextMenu = createContextMenuTokens({
  contentBg: semanticMenu.background,
  contentBorder: semanticMenu.border,
  contentShadow: shadow.lg,
  itemDefault: semanticMenu.item.default,
  itemHover: semanticMenu.item.hover,
  itemActive: semanticMenu.item.active,
  itemPressed: semanticMenu.item.pressed,
  itemFocusRing: focus.ring,
  itemDisabled: semanticMenu.item.disabled,
  itemDanger: semanticMenu.item.danger,
  triggerDefaultFg: text.interactive,
  triggerHoverBg: semanticMenu.item.hover.bg,
  triggerHoverFg: text.interactiveHover,
  triggerFocusFg: text.interactive,
  triggerFocusRing: focus.ring,
  triggerDisabledFg: text.disabled,
  groupLabelFg: text.secondary,
});
