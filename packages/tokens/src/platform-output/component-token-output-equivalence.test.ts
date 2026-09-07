import { describe, expect, it } from 'vitest';

import { darkTheme } from '../dark/theme.js';
import { highContrastTheme } from '../highContrast/theme.js';
import { lightTheme } from '../light/theme.js';

import {
  adaptComponentTokensForReactNative,
  adaptComponentTokensForWeb,
  createComponentPlatformOutputSources,
} from './component-token-intents.js';

const themes = [
  ['light', lightTheme],
  ['dark', darkTheme],
  ['high-contrast', highContrastTheme],
] as const;

describe('component token platform-output equivalence', () => {
  for (const [themeName, theme] of themes) {
    it(`preserves Web output for ${themeName}`, () => {
      const web = adaptComponentTokensForWeb(
        theme.components,
        createComponentPlatformOutputSources(theme)
      );

      expect(web.contextMenu.content.shadow).toBe(theme.semantic.shadow.lg);
      expect(web.contextMenu.item.focus.ring.shadow).toBe(
        theme.semantic.focus.ring.shadow
      );
      expect(web.contextMenu.trigger.focus.ring.shadow).toBe(
        theme.semantic.focus.ring.shadow
      );
      expect(web.dropdown.content.shadow).toBe(theme.semantic.shadow.lg);
      expect(web.dropdown.item.focus.ring.shadow).toBe(
        theme.semantic.focus.ring.shadow
      );
      expect(web.dropdown.trigger.focus.ring.shadow).toBe(
        theme.semantic.focus.ring.shadow
      );
      expect(web.modal.closeButton.focus.ring.shadow).toBe(
        theme.semantic.focus.ring.shadow
      );
      expect(web.modal.content.maxHeight).toBe('90vh');
      expect(web.modal.content.shadow).toBe(theme.semantic.shadow.xl);
      expect(web.popover.content.shadow).toBe(theme.semantic.shadow.lg);
      expect(web.select.dropdown.shadow).toBe(theme.semantic.shadow.lg);
      expect(web.select.option.selected.shadow).toBe('none');
      expect(web.tooltip.content.shadow).toBe(theme.semantic.shadow.md);
    });

    it(`preserves React Native output for ${themeName}`, () => {
      const native = adaptComponentTokensForReactNative(
        theme.components,
        createComponentPlatformOutputSources(theme)
      );

      expect(native.contextMenu.content.shadow).toEqual(
        theme.tokens.shadows.lg
      );
      expect(native.dropdown.content.shadow).toEqual(theme.tokens.shadows.lg);
      expect(native.modal.content.maxHeight).toBe('90%');
      // Existing native Modal used lg directly even though Web used xl.
      expect(native.modal.content.shadow).toEqual(theme.tokens.shadows.lg);
      expect(native.popover.content.shadow).toEqual(theme.tokens.shadows.lg);
      expect(native.select.dropdown.shadow).toEqual(theme.tokens.shadows.lg);
      expect(native.tooltip.content.shadow).toEqual(theme.tokens.shadows.md);

      expect(native.contextMenu.item.focus.ring.shadow).toBeNull();
      expect(native.contextMenu.trigger.focus.ring.shadow).toBeNull();
      expect(native.dropdown.item.focus.ring.shadow).toBeNull();
      expect(native.dropdown.trigger.focus.ring.shadow).toBeNull();
      expect(native.modal.closeButton.focus.ring.shadow).toBeNull();
      expect(native.select.option.selected.shadow).toBeNull();
    });
  }
});
