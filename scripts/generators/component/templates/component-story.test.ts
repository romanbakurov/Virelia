import { describe, expect, it } from 'vitest';

import { renderStoryTemplate } from './component-story';

describe('component story templates', () => {
  it('derives compound representative stories from capabilities and parts', () => {
    const result = renderStoryTemplate({
      componentName: 'Disclosure',
      layer: 'components',
      isNative: false,
      profile: 'compound',
      control: 'value',
      capabilities: ['controlled', 'uncontrolled', 'disabled'],
      parts: ['Item', 'Trigger', 'Content'],
    });

    expect(result).toContain('export const Controlled');
    expect(result).toContain("value: 'item-1'");
    expect(result).toContain('onValueChange: () => undefined');
    expect(result).toContain('export const Uncontrolled');
    expect(result).toContain("defaultValue: 'item-1'");
    expect(result).toContain('export const Disabled');
    expect(result).toContain('disabled: true');
    expect(result).toContain('<Disclosure.Item');
    expect(result).toContain('<Disclosure.Trigger>');
    expect(result).toContain('<Disclosure.Content>');
  });

  it('keeps base component stories minimal', () => {
    const result = renderStoryTemplate({
      componentName: 'Avatar',
      layer: 'primitives',
      isNative: false,
      profile: 'base',
    });

    expect(result).toContain('export const Default');
    expect(result).not.toContain('export const Controlled');
    expect(result).not.toContain('export const Disabled');
  });
});
