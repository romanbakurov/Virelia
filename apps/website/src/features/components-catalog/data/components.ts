import type { ComponentCatalogEntry } from '../types';

export const webComponents = [
  {
    slug: 'button',
    name: 'Button',
    description:
      'Accessible actions with multiple appearances, colors, sizes, and composition support.',
    category: 'general',
    docsUrl: 'https://docs.vellira.dev/components/web/button',
    status: 'stable',
    order: 10,
  },

  {
    slug: 'input',
    name: 'Input',
    description:
      'Flexible text input with adornments, validation states, and form integration.',
    category: 'forms',
    docsUrl: 'https://docs.vellira.dev/components/web/input',
    status: 'stable',
    order: 10,
  },
  {
    slug: 'checkbox',
    name: 'Checkbox',
    description: 'Accessible binary and indeterminate selection control.',
    category: 'forms',
    docsUrl: 'https://docs.vellira.dev/components/web/checkbox',
    status: 'stable',
    order: 20,
  },
  {
    slug: 'radio-group',
    name: 'Radio Group',
    description:
      'Single-choice selection with keyboard navigation and shared group state.',
    category: 'forms',
    docsUrl: 'https://docs.vellira.dev/components/web/radio',
    status: 'stable',
    order: 30,
  },
  {
    slug: 'select',
    name: 'Select',
    description:
      'Composable single and multiple selection with search, groups, and virtualization.',
    category: 'forms',
    docsUrl: 'https://docs.vellira.dev/components/web/select',
    status: 'stable',
    order: 40,
  },
  {
    slug: 'form-field',
    name: 'Form Field',
    description:
      'Composable labels, descriptions, controls, and validation messages for forms.',
    category: 'forms',
    docsUrl: 'https://docs.vellira.dev/components/web/form-field',
    status: 'stable',
    order: 50,
  },

  {
    slug: 'tabs',
    name: 'Tabs',
    description:
      'Keyboard-accessible tab navigation with controlled activation and indicators.',
    category: 'navigation',
    docsUrl: 'https://docs.vellira.dev/components/web/tabs',
    status: 'stable',
    order: 10,
  },

  {
    slug: 'dropdown',
    name: 'Dropdown',
    description:
      'Composable action menus with nested content, selection states, and rich items.',
    category: 'overlays',
    docsUrl: 'https://docs.vellira.dev/components/web/dropdown',
    status: 'stable',
    order: 10,
  },
  {
    slug: 'modal',
    name: 'Modal',
    description:
      'Accessible modal dialogs with focus management, dismissal, and compound structure.',
    category: 'overlays',
    docsUrl: 'https://docs.vellira.dev/components/web/modal',
    status: 'stable',
    order: 20,
  },
  {
    slug: 'popover',
    name: 'Popover',
    description:
      'Floating contextual content with collision handling and flexible positioning.',
    category: 'overlays',
    docsUrl: 'https://docs.vellira.dev/components/web/popover',
    status: 'stable',
    order: 30,
  },
  {
    slug: 'tooltip',
    name: 'Tooltip',
    description:
      'Contextual labels with managed delay, positioning, and accessibility.',
    category: 'overlays',
    docsUrl: 'https://docs.vellira.dev/components/web/tooltip',
    status: 'stable',
    order: 40,
  },
] as const satisfies readonly ComponentCatalogEntry[];
