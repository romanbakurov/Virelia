import { describe, expect, it } from 'vitest';

import { darkTheme } from './dark/theme.js';
import { highContrastTheme } from './highContrast/theme.js';
import { lightTheme } from './light/theme.js';
import { controlSizes } from './tokens/controlSizes.js';
import {
  requireTokenValueKind,
  resolveTokenValueKind,
} from './token-architecture.js';

type TokenObject = Record<string, unknown>;

type NumericLeaf = {
  path: string;
  value: number;
};

function isPlainObject(value: unknown): value is TokenObject {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function collectNumericLeaves(
  value: unknown,
  prefix: string,
  result: NumericLeaf[]
): void {
  if (typeof value === 'number') {
    result.push({ path: prefix, value });
    return;
  }

  if (Array.isArray(value)) {
    value.forEach((entry, index) => {
      collectNumericLeaves(entry, `${prefix}.${index}`, result);
    });
    return;
  }

  if (!isPlainObject(value)) return;

  for (const [key, child] of Object.entries(value)) {
    collectNumericLeaves(child, prefix ? `${prefix}.${key}` : key, result);
  }
}

const themes = [
  ['light', lightTheme],
  ['dark', darkTheme],
  ['high-contrast', highContrastTheme],
] as const;

describe('canonical token value-kind authority', () => {
  it.each(themes)('classifies every numeric leaf in %s', (_name, theme) => {
    const leaves: NumericLeaf[] = [];

    collectNumericLeaves(theme.colors, 'colors', leaves);
    collectNumericLeaves(theme.semantic, 'semantic', leaves);
    collectNumericLeaves(theme.components, 'components', leaves);
    collectNumericLeaves(theme.tokens, 'tokens', leaves);

    const unknown = leaves.filter(
      ({ path, value }) => resolveTokenValueKind(path, value) === null
    );

    expect(unknown).toEqual([]);
  });

  it('classifies shared control-size numeric leaves', () => {
    const leaves: NumericLeaf[] = [];

    collectNumericLeaves(controlSizes, 'tokens.controlSizes', leaves);

    const unknown = leaves.filter(
      ({ path, value }) => resolveTokenValueKind(path, value) === null
    );

    expect(unknown).toEqual([]);
  });

  it('assigns the expected kinds to representative component roles', () => {
    expect(
      requireTokenValueKind('components.radio.motion.activeScale', 0.92)
    ).toBe('scale');
    expect(
      requireTokenValueKind('components.radio.motion.pressedOpacity', 0.8)
    ).toBe('opacity');
    expect(
      requireTokenValueKind('components.tooltip.content.scale', 0.98)
    ).toBe('scale');
    expect(
      requireTokenValueKind('components.switch.geometry.pressScale', 0.98)
    ).toBe('scale');
    expect(
      requireTokenValueKind('components.modal.content.zIndexOffset', 1)
    ).toBe('z-index');
    expect(requireTokenValueKind('components.popover.shadow.native.x', 0)).toBe(
      'length'
    );
    expect(
      requireTokenValueKind('components.popover.shadow.native.opacity', 0.1)
    ).toBe('opacity');
    expect(
      requireTokenValueKind('components.popover.shadow.native.elevation', 8)
    ).toBe('unitless-number');
  });

  it('rejects unknown numeric roles', () => {
    expect(() =>
      requireTokenValueKind('components.probe.motion.springResponse', 0.7)
    ).toThrow(/Unknown numeric token value kind/);
  });
});
