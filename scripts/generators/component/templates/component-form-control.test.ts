import { describe, expect, it } from 'vitest';

import {
  renderFormControlComponentTemplate,
  renderFormControlTypesTemplate,
} from './component-form-control';

describe('form-control component templates', () => {
  it('renders shared form-control types', () => {
    const result = renderFormControlTypesTemplate({
      componentName: 'FieldControl',
    });

    expect(result).toContain('value?: string');
    expect(result).toContain('defaultValue?: string');
    expect(result).toContain('disabled?: boolean');
    expect(result).toContain('required?: boolean');
    expect(result).toContain('invalid?: boolean');
    expect(result).toContain('onValueChange?: (value: string) => void');
  });

  it('renders a web form-control scaffold', () => {
    const result = renderFormControlComponentTemplate({
      componentName: 'FieldControl',
      isNative: false,
    });

    expect(result).toContain('<button');
    expect(result).toContain('aria-required');
    expect(result).toContain('aria-invalid');
  });

  it('renders a native form-control scaffold', () => {
    const result = renderFormControlComponentTemplate({
      componentName: 'FieldControl',
      isNative: true,
    });

    expect(result).toContain('<Pressable');
    expect(result).toContain("accessibilityRole='button'");
    expect(result).toContain('accessibilityState');
  });
});
