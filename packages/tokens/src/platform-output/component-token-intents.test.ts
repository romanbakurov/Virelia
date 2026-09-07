import { describe, expect, it } from 'vitest';

import {
  adaptComponentTokensForReactNative,
  adaptComponentTokensForWeb,
  type ComponentPlatformOutputSources,
  createComponentFocusRingShadowIntent,
  createComponentNoShadowIntent,
  createComponentShadowIntent,
  createComponentViewportHeightIntent,
  isComponentPlatformIntent,
} from './component-token-intents.js';

const sources: ComponentPlatformOutputSources = {
  web: {
    shadow: {
      sm: 'web-sm',
      md: 'web-md',
      lg: 'web-lg',
      xl: 'web-xl',
    },
    focusRingShadow: 'web-focus-ring',
  },
  reactNative: {
    shadow: {
      sm: { x: 0, y: 1, blur: 2, color: '#000', opacity: 0.04, elevation: 1 },
      md: { x: 0, y: 4, blur: 12, color: '#000', opacity: 0.08, elevation: 4 },
      lg: { x: 0, y: 12, blur: 32, color: '#000', opacity: 0.1, elevation: 8 },
      xl: { x: 0, y: 12, blur: 32, color: '#000', opacity: 0.1, elevation: 8 },
    },
  },
};

describe('component platform-output intents', () => {
  it('keeps elevation intent renderer-neutral until Web output', () => {
    const components = {
      tooltip: { content: { shadow: createComponentShadowIntent('md') } },
    };

    expect(adaptComponentTokensForWeb(components, sources)).toEqual({
      tooltip: { content: { shadow: 'web-md' } },
    });
  });

  it('resolves elevation intent to React Native structured output', () => {
    const components = {
      popover: { content: { shadow: createComponentShadowIntent('lg') } },
    };

    expect(adaptComponentTokensForReactNative(components, sources)).toEqual({
      popover: { content: { shadow: sources.reactNative.shadow.lg } },
    });
  });

  it('keeps focus glow and no-shadow as intents until platform output', () => {
    const components = {
      focus: { shadow: createComponentFocusRingShadowIntent() },
      selected: { shadow: createComponentNoShadowIntent() },
    };

    expect(adaptComponentTokensForWeb(components, sources)).toEqual({
      focus: { shadow: 'web-focus-ring' },
      selected: { shadow: 'none' },
    });
    expect(adaptComponentTokensForReactNative(components, sources)).toEqual({
      focus: { shadow: null },
      selected: { shadow: null },
    });
  });

  it('adapts one viewport-height intent to platform-native units', () => {
    const components = {
      modal: {
        content: { maxHeight: createComponentViewportHeightIntent(0.9) },
      },
    };

    expect(adaptComponentTokensForWeb(components, sources)).toEqual({
      modal: { content: { maxHeight: '90vh' } },
    });
    expect(adaptComponentTokensForReactNative(components, sources)).toEqual({
      modal: { content: { maxHeight: '90%' } },
    });
  });

  it('rejects invalid viewport ratios before renderer adaptation', () => {
    expect(() => createComponentViewportHeightIntent(0)).toThrow(
      /viewport-height ratio/
    );
    expect(() => createComponentViewportHeightIntent(1.1)).toThrow(
      /viewport-height ratio/
    );
  });

  it('rejects intent-shaped objects with extra renderer keys', () => {
    expect(
      isComponentPlatformIntent({
        kind: 'shadow',
        role: 'elevation',
        level: 'lg',
        web: '0 0 8px black',
      })
    ).toBe(false);
    expect(
      isComponentPlatformIntent({
        kind: 'shadow',
        role: 'focus-ring',
        native: { elevation: 4 },
      })
    ).toBe(false);
    expect(
      isComponentPlatformIntent({
        kind: 'viewport-height',
        ratio: 0.9,
        nativeMaxHeight: '90%',
      })
    ).toBe(false);
  });
});
