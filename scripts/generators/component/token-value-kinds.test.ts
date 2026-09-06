import { describe, expect, it } from 'vitest';

import { renderComponentTokenFactoryTemplate } from './templates/component-tokens';
import { requireGeneratedComponentNumericValueKind } from './token-value-kinds';

describe('generator token value-kind contract', () => {
  it('classifies generated boolean-control geometry by canonical roles', () => {
    expect(
      requireGeneratedComponentNumericValueKind({
        componentName: 'SwitchProbe',
        section: 'geometry',
        role: 'trackWidth',
        value: 44,
      })
    ).toBe('length');
    expect(
      requireGeneratedComponentNumericValueKind({
        componentName: 'SwitchProbe',
        section: 'geometry',
        role: 'pressScale',
        value: 0.98,
      })
    ).toBe('scale');
  });

  it('rejects unknown numeric roles before a token factory is emitted', () => {
    expect(() =>
      requireGeneratedComponentNumericValueKind({
        componentName: 'SwitchProbe',
        section: 'geometry',
        role: 'springResponse',
        value: 0.7,
      })
    ).toThrow(/Unknown numeric token value kind/);
  });

  it('keeps boolean-control token templates compatible with the shared authority', () => {
    const source = renderComponentTokenFactoryTemplate({
      componentName: 'SwitchProbe',
      profile: 'form-control',
      control: 'boolean',
    });

    expect(source).toContain('trackWidth: number;');
    expect(source).toContain('pressScale: number;');
    expect(source).toContain('trackWidth: 44,');
    expect(source).toContain('pressScale: 0.98,');
  });
});
