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

  it('wraps generator-owned native compound text with NativeText', () => {
    const params = {
      componentName: 'Disclosure',
      layer: 'components',
      isNative: true,
      profile: 'compound' as const,
      capabilities: ['controlled', 'uncontrolled', 'disabled'] as const,
      parts: ['Item', 'Trigger', 'Content'],
    };

    const result = renderStoryTemplate(params);

    expect(result).toContain(
      "import { Text as NativeText } from 'react-native';"
    );
    expect(result.match(/Text as NativeText/g)).toHaveLength(1);
    expect(result).toContain(
      '<Disclosure.Trigger><NativeText>Example section</NativeText></Disclosure.Trigger>'
    );
    expect(result).toContain(
      '<Disclosure.Content><NativeText>Example content</NativeText></Disclosure.Content>'
    );
    expect(result).not.toContain(
      '<Disclosure.Content>Example content</Disclosure.Content>'
    );
    expect(renderStoryTemplate(params)).toBe(result);
  });

  it('wraps generator-owned native base story text with NativeText', () => {
    const result = renderStoryTemplate({
      componentName: 'Avatar',
      layer: 'primitives',
      isNative: true,
      profile: 'base',
    });

    expect(result).toContain(
      "import { Text as NativeText } from 'react-native';"
    );
    expect(result).toContain(
      'children: (\n      <NativeText>Example content</NativeText>\n    )'
    );
  });
});
