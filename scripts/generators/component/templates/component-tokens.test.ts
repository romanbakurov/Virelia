import { describe, expect, it } from 'vitest';

import {
  renderComponentTokenBarrelExport,
  renderComponentTokenFactoryBarrelExport,
  renderComponentTokenFactoryTemplate,
  renderThemeComponentTokensTemplate,
} from './component-tokens';

describe('component token templates', () => {
  it('generates a dedicated boolean control token factory', () => {
    const result = renderComponentTokenFactoryTemplate({
      componentName: 'Switch',
      profile: 'form-control',
      control: 'boolean',
    });

    expect(result).toContain('export type SwitchVisualState');
    expect(result).toContain('trackBg: string');
    expect(result).toContain('thumbBg: string');
    expect(result).toContain('export type SwitchTokensConfig');
    expect(result).toContain('export const createSwitchTokens');
  });

  it('maps boolean component tokens through Vellira semantic control states', () => {
    const result = renderThemeComponentTokensTemplate({
      componentName: 'Switch',
      profile: 'form-control',
      control: 'boolean',
    });

    expect(result).toContain(
      "import { control } from '../semantic/control.js';"
    );
    expect(result).toContain('control.default.bg');
    expect(result).toContain('control.selected.default.bg');
    expect(result).toContain('control.selected.hover.bg');
    expect(result).toContain('control.selected.active.bg');
    expect(result).toContain('control.disabled.bg');
    expect(result).toContain('focus.ring.color');
    expect(result).toContain('status.error.border');
    expect(result).not.toMatch(/#[0-9a-f]{3,8}\b/i);
  });

  it('generates a safe generic component token scaffold for other profiles', () => {
    const factory = renderComponentTokenFactoryTemplate({
      componentName: 'Avatar',
      profile: 'base',
      control: 'value',
    });
    const theme = renderThemeComponentTokensTemplate({
      componentName: 'Avatar',
      profile: 'base',
      control: 'value',
    });

    expect(factory).toContain('export type AvatarVisualState');
    expect(factory).toContain('export const createAvatarTokens');
    expect(theme).toContain('default: control.default');
    expect(theme).toContain('hover: control.hover');
    expect(theme).toContain('pressed: control.active');
    expect(theme).toContain('disabled: control.disabled');
  });

  it('renders idempotent barrel export lines', () => {
    expect(renderComponentTokenFactoryBarrelExport('Switch')).toBe(
      "export * from './createSwitchTokens.js';"
    );
    expect(renderComponentTokenBarrelExport('Switch')).toBe(
      "export { switchTokens as switch } from './switch.js';"
    );
  });
});
