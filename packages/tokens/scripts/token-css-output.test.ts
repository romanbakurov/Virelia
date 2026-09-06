import { describe, expect, it } from 'vitest';

import { serializeCssTokenValue } from './token-css-output.js';

describe('token CSS value-kind serialization', () => {
  it('serializes lengths with px', () => {
    expect(
      serializeCssTokenValue('components.probe.geometry.trackWidth', 44)
    ).toBe('44px');
  });

  it('serializes scales without a unit', () => {
    expect(
      serializeCssTokenValue('components.probe.motion.pressScale', 0.98)
    ).toBe('0.98');
  });

  it('serializes opacity without a unit', () => {
    expect(
      serializeCssTokenValue('components.probe.motion.pressedOpacity', 0.8)
    ).toBe('0.8');
  });

  it('serializes z-index/order without a unit', () => {
    expect(
      serializeCssTokenValue('components.probe.content.zIndexOffset', 1)
    ).toBe('1');
  });

  it('serializes numeric duration as milliseconds', () => {
    expect(
      serializeCssTokenValue('components.probe.motion.animationDuration', 150)
    ).toBe('150ms');
  });

  it('preserves valid duration and easing strings', () => {
    expect(
      serializeCssTokenValue(
        'components.probe.motion.animationDuration',
        '150ms'
      )
    ).toBe('150ms');
    expect(
      serializeCssTokenValue(
        'components.probe.motion.easing',
        'cubic-bezier(0.16, 1, 0.3, 1)'
      )
    ).toBe('cubic-bezier(0.16, 1, 0.3, 1)');
  });

  it('rejects stringified numeric unitless tokens', () => {
    expect(() =>
      serializeCssTokenValue('components.probe.content.zIndexOffset', '1')
    ).toThrow(/stored as a string/);
  });

  it('rejects unknown numeric token roles instead of defaulting to px', () => {
    expect(() =>
      serializeCssTokenValue('components.probe.motion.springResponse', 0.7)
    ).toThrow(/Unknown numeric token value kind/);
  });

  it('validates opacity, scale, z-index, and duration values', () => {
    expect(() =>
      serializeCssTokenValue('components.probe.motion.opacity', 1.1)
    ).toThrow(/between 0 and 1/);
    expect(() =>
      serializeCssTokenValue('components.probe.motion.scale', -0.1)
    ).toThrow(/zero or greater/);
    expect(() =>
      serializeCssTokenValue('components.probe.content.zIndex', 1.5)
    ).toThrow(/must be an integer/);
    expect(() =>
      serializeCssTokenValue('components.probe.motion.duration', -1)
    ).toThrow(/zero or greater/);
  });
});
