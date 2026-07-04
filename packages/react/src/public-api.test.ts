import { describe, expect, it } from 'vitest';

import * as api from './index';

describe('public API', () => {
  it('exports only documented runtime entries', () => {
    expect(Object.keys(api).sort()).toEqual([
      'Button',
      'Checkbox',
      'Dropdown',
      'FormField',
      'Input',
      'Modal',
      'RadioGroup',
      'Select',
      'Tabs',
      'ThemeProvider',
      'Tooltip',
      'useTheme',
    ]);
  });

  it('exports runtime components and hooks', () => {
    expect(api.ThemeProvider).toBeDefined();
    expect(api.useTheme).toBeDefined();

    expect(typeof api.useTheme).toBe('function');
    expect(typeof api.ThemeProvider).toBe('function');
  });
});
