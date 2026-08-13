export const generatedComponentPageComponents = [
  'Button',
  'Input',
  'FormField',
  'Radio',
  'RadioGroup',
  'Checkbox',
  'Select',
  'Dropdown',
  'Tabs',
  'Modal',
  'Tooltip',
  'Popover',
] as const;

export type GeneratedComponentPageComponent =
  (typeof generatedComponentPageComponents)[number];
