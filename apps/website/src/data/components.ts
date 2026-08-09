export type WebsiteComponentCategory =
  'forms' | 'overlays' | 'navigation' | 'primitives';

export type WebsiteComponentEntry = {
  slug: string;
  name: string;
  description: string;
  category: WebsiteComponentCategory;
  docsUrl: string;
  status: 'stable' | 'beta';
};

export const webComponents = [
  {
    slug: 'button',
    name: 'Button',
    description:
      'Accessible actions with multiple appearances, colors, sizes, and composition support.',
    category: 'primitives',
    docsUrl: 'https://docs.vellira.dev/components/web/button',
    status: 'stable',
  },
  {
    slug: 'input',
    name: 'Input',
    description:
      'Flexible text input with adornments, validation states, and form integration.',
    category: 'forms',
    docsUrl: 'https://docs.vellira.dev/components/web/input',
    status: 'stable',
  },
  {
    slug: 'checkbox',
    name: 'Checkbox',
    description: 'Accessible binary and indeterminate selection control.',
    category: 'forms',
    docsUrl: 'https://docs.vellira.dev/components/web/checkbox',
    status: 'stable',
  },
  {
    slug: 'radio-group',
    name: 'Radio Group',
    description:
      'Single-choice selection with keyboard navigation and shared group state.',
    category: 'forms',
    docsUrl: 'https://docs.vellira.dev/components/web/radio',
    status: 'stable',
  },
  {
    slug: 'select',
    name: 'Select',
    description:
      'Composable single and multiple selection with search, groups, and virtualization.',
    category: 'forms',
    docsUrl: 'https://docs.vellira.dev/components/web/select',
    status: 'stable',
  },
  {
    slug: 'dropdown',
    name: 'Dropdown',
    description:
      'Composable action menus with nested content, selection states, and rich items.',
    category: 'overlays',
    docsUrl: 'https://docs.vellira.dev/components/web/dropdown',
    status: 'stable',
  },
  {
    slug: 'modal',
    name: 'Modal',
    description:
      'Accessible modal dialogs with focus management, dismissal, and compound structure.',
    category: 'overlays',
    docsUrl: 'https://docs.vellira.dev/components/web/modal',
    status: 'stable',
  },
  {
    slug: 'popover',
    name: 'Popover',
    description:
      'Floating contextual content with collision handling and flexible positioning.',
    category: 'overlays',
    docsUrl: 'https://docs.vellira.dev/components/web/popover',
    status: 'stable',
  },
  {
    slug: 'tooltip',
    name: 'Tooltip',
    description:
      'Contextual labels with managed delay, positioning, and accessibility.',
    category: 'overlays',
    docsUrl: 'https://docs.vellira.dev/components/web/tooltip',
    status: 'stable',
  },
  {
    slug: 'tabs',
    name: 'Tabs',
    description:
      'Keyboard-accessible tab navigation with controlled activation and indicators.',
    category: 'navigation',
    docsUrl: 'https://docs.vellira.dev/components/web/tabs',
    status: 'stable',
  },
  {
    slug: 'form-field',
    name: 'Form Field',
    description:
      'Composable labels, descriptions, controls, and validation messages for forms.',
    category: 'forms',
    docsUrl: 'https://docs.vellira.dev/components/web/form-field',
    status: 'stable',
  },
] as const satisfies readonly WebsiteComponentEntry[];
