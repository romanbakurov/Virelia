export const generatedComponentPageComponents = [
  'Button',
  'Input',
  'Radio',
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
