import { describe, expect, it } from 'vitest';

import {
  renderFormControlComponentTemplate,
  renderFormControlTypesTemplate,
} from './component-form-control';

describe('form-control component templates', () => {
  it('preserves the V1 value-control contract', () => {
    const result = renderFormControlTypesTemplate({
      componentName: 'FieldControl',
      control: 'value',
    });

    expect(result).toContain('value?: string');
    expect(result).toContain('defaultValue?: string');
    expect(result).toContain('disabled?: boolean');
    expect(result).toContain('required?: boolean');
    expect(result).toContain('invalid?: boolean');
    expect(result).toContain('onValueChange?: (value: string) => void');
  });

  it('renders a web value-control scaffold', () => {
    const result = renderFormControlComponentTemplate({
      componentName: 'FieldControl',
      isNative: false,
      control: 'value',
    });

    expect(result).toContain('<button');
    expect(result).toContain('aria-required');
    expect(result).toContain('aria-invalid');
  });

  it('renders a native value-control scaffold', () => {
    const result = renderFormControlComponentTemplate({
      componentName: 'FieldControl',
      isNative: true,
      control: 'value',
    });

    expect(result).toContain('<Pressable');
    expect(result).toContain("accessibilityRole='button'");
    expect(result).toContain('accessibilityState');
  });

  it('renders boolean types for Switch-like controls', () => {
    const result = renderFormControlTypesTemplate({
      componentName: 'Switch',
      control: 'boolean',
    });

    expect(result).toContain('checked?: boolean');
    expect(result).toContain('defaultChecked?: boolean');
    expect(result).toContain('onCheckedChange?: (checked: boolean) => void');
    expect(result).not.toContain('value?: string');
  });

  it('renders platform-aware Switch-like semantics', () => {
    const web = renderFormControlComponentTemplate({
      componentName: 'Switch',
      isNative: false,
      control: 'boolean',
    });
    const native = renderFormControlComponentTemplate({
      componentName: 'Switch',
      isNative: true,
      control: 'boolean',
    });

    expect(web).toContain("role='switch'");
    expect(web).toContain('aria-checked={resolvedChecked}');
    expect(native).toContain("accessibilityRole='switch'");
    expect(native).toContain('checked: resolvedChecked');
    expect(native).not.toContain('aria-checked');
  });

  it('renders platform-aware multiline text controls', () => {
    const web = renderFormControlComponentTemplate({
      componentName: 'Textarea',
      isNative: false,
      control: 'text',
    });
    const native = renderFormControlComponentTemplate({
      componentName: 'Textarea',
      isNative: true,
      control: 'text',
    });

    expect(web).toContain('<textarea');
    expect(web).toContain('ChangeEvent<HTMLTextAreaElement>');
    expect(native).toContain('<TextInput');
    expect(native).toContain('multiline');
    expect(native).not.toContain('<textarea');
  });
});
