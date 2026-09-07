import { createContextMenuTokensFromSemantics } from '../../factories/createContextMenuTokens.js';
import { focus } from '../semantic/focus.js';
import { menu } from '../semantic/menu.js';
import { text } from '../semantic/text.js';

export const contextMenu = createContextMenuTokensFromSemantics({
  focus,
  menu,
  text,
});
