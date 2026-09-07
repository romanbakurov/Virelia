import { describe, expect, it } from 'vitest';

import { resolveComponentTokenPlatformOutputs } from './componentTokenOutput';
import { nativeThemes } from './themes';

describe('React Native component token platform output', () => {
  it('derives Web and native shadow output from canonical component intent', () => {
    const theme = nativeThemes.light;

    const popover = resolveComponentTokenPlatformOutputs(
      theme,
      theme.components.popover.content
    );
    expect(popover.web.shadow).toBe(theme.semantic.shadow.lg);
    expect(popover.reactNative.shadow).toEqual(theme.tokens.shadows.lg);

    const modal = resolveComponentTokenPlatformOutputs(
      theme,
      theme.components.modal.content
    );
    expect(modal.web.shadow).toBe(theme.semantic.shadow.xl);
    expect(modal.reactNative.shadow).toEqual(theme.tokens.shadows.lg);
  });

  it('keeps viewport and non-elevation intent renderer-specific only at output', () => {
    const theme = nativeThemes.dark;
    const probe = {
      viewport: { kind: 'viewport-height', ratio: 0.9 },
      focus: { kind: 'shadow', role: 'focus-ring' },
      none: { kind: 'shadow', role: 'none' },
    } as const;

    const output = resolveComponentTokenPlatformOutputs(theme, probe);

    expect(output.web).toEqual({
      viewport: '90vh',
      focus: theme.semantic.focus.ring.shadow,
      none: 'none',
    });
    expect(output.reactNative).toEqual({
      viewport: '90%',
      focus: null,
      none: null,
    });
  });
});
