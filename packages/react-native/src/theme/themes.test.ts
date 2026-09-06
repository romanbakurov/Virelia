import { darkTheme, highContrastTheme, lightTheme } from '@vellira-ui/tokens';
import { describe, expect, it } from 'vitest';

import { nativeThemes } from './themes';

describe('native theme token output', () => {
  it('resolves each native theme directly from the canonical token theme', () => {
    expect(nativeThemes.light).toBe(lightTheme);
    expect(nativeThemes.dark).toBe(darkTheme);
    expect(nativeThemes.highContrast).toBe(highContrastTheme);
  });
});
