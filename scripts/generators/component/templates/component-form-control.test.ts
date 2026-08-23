import { describe, expect, it } from 'vitest';

import {
  renderFormControlComponentTemplate,
  renderFormControlTypesTemplate,
  renderSharedFormControlTypesTemplate,
} from './component-form-control';

describe('form-control component templates', () => {
  it('generates a shared V1 value-control contract', () => {
    const result = renderSharedFormControlTypesTemplate({
      componentName: 'FieldControl',
      control: 'value',
    });

    expect(result).toContain('export interface BaseFieldControlProps');
    expect(result).toContain('value?: string');
    expect(result).toContain('defaultValue?: string');
    expect(result).toContain('disabled?: boolean');
    expect(result).toContain('required?: boolean');
    expect(result).toContain('invalid?: boolean');
    expect(result).toContain('onValueChange?: (value: string) => void');
  });

  it('makes platform types alias the generated shared contract', () => {
    const result = renderFormControlTypesTemplate({
      componentName: 'Switch',
      control: 'boolean',
    });

    expect(result).toContain(
      "import type { BaseSwitchProps } from '@vellira-ui/types';"
    );
    expect(result).toContain('export type SwitchProps = BaseSwitchProps;');
    expect(result).not.toContain('interface SwitchProps extends');
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

  it('renders shared boolean types for Switch-like controls', () => {
    const result = renderSharedFormControlTypesTemplate({
      componentName: 'Switch',
      control: 'boolean',
    });

    expect(result).toContain('export interface BaseSwitchProps');
    expect(result).toContain('checked?: boolean');
    expect(result).toContain('defaultChecked?: boolean');
    expect(result).toContain('onCheckedChange?: (checked: boolean) => void');
    expect(result).not.toContain('value?: string');
  });

  it('renders functional platform-aware Switch-like semantics', () => {
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
    expect(web).toContain('useState(defaultChecked)');
    expect(web).toContain('setUncontrolledChecked(nextChecked)');
    expect(web).toContain("import styles from './Switch.module.scss';");
    expect(web).toContain(
      "data-state={resolvedChecked ? 'checked' : 'unchecked'}"
    );
    expect(web).toContain(
      "<span className={styles.thumb} aria-hidden='true' />"
    );

    expect(native).toContain("accessibilityRole='switch'");
    expect(native).toContain('useState(defaultChecked)');
    expect(native).toContain('setUncontrolledChecked(nextChecked)');
    expect(native).toContain("import { useThemeStyles } from '../../theme';");
    expect(native).toContain("import { createStyles } from './Switch.styles';");
    expect(native).toContain('const styles = useThemeStyles(createStyles);');
    expect(native).toContain('checked: resolvedChecked');
    expect(native).toContain('styles.checkedPressed');
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
