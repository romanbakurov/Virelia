import type { ComponentCatalogEntry } from '../types';

export const webComponents = [
  {
    slug: 'button',
    name: 'Button',
    description:
      'Accessible actions with multiple appearances, colors, sizes, and composition support.',
    category: 'general',
    status: 'stable',
    order: 10,
    platforms: ['react', 'react-native'],
    docs: {
      react: 'https://docs.vellira.dev/react/button',
      'react-native': 'https://docs.vellira.dev/react-native/button',
    },
  },

  {
    slug: 'input',
    name: 'Input',
    description:
      'Flexible text input with adornments, validation states, and form integration.',
    category: 'forms',
    status: 'stable',
    order: 10,
    platforms: ['react', 'react-native'],
    docs: {
      react: 'https://docs.vellira.dev/react/input',
      'react-native': 'https://docs.vellira.dev/react-native/input',
    },
  },
  {
    slug: 'checkbox',
    name: 'Checkbox',
    description: 'Accessible binary and indeterminate selection control.',
    category: 'forms',
    status: 'stable',
    order: 20,
    platforms: ['react', 'react-native'],
    docs: {
      react: 'https://docs.vellira.dev/react/checkbox',
      'react-native': 'https://docs.vellira.dev/react-native/checkbox',
    },
  },
  {
    slug: 'radio',
    name: 'Radio',
    description:
      'Accessible single-choice selection control with labels, descriptions, and validation states.',
    category: 'forms',
    status: 'stable',
    order: 30,
    platforms: ['react', 'react-native'],
    docs: {
      react: 'https://docs.vellira.dev/react/radio',
      'react-native': 'https://docs.vellira.dev/react-native/radio',
    },
  },
  {
    slug: 'radio-group',
    name: 'Radio Group',
    description:
      'Single-choice selection with keyboard navigation and shared group state.',
    category: 'forms',
    status: 'stable',
    order: 40,
    platforms: ['react', 'react-native'],
    docs: {
      react: 'https://docs.vellira.dev/react/radio',
      'react-native': 'https://docs.vellira.dev/react-native/radio',
    },
  },
  {
    slug: 'select',
    name: 'Select',
    description:
      'Composable single and multiple selection with search, groups, and virtualization.',
    category: 'forms',
    status: 'stable',
    order: 50,
    platforms: ['react', 'react-native'],
    docs: {
      react: 'https://docs.vellira.dev/react/select',
      'react-native': 'https://docs.vellira.dev/react-native/select',
    },
  },
  {
    slug: 'form-field',
    name: 'Form Field',
    description:
      'Composable labels, descriptions, controls, and validation messages for forms.',
    category: 'forms',
    status: 'stable',
    order: 60,
    platforms: ['react', 'react-native'],
    docs: {
      react: 'https://docs.vellira.dev/react/form-field',
      'react-native': 'https://docs.vellira.dev/react-native/form-field',
    },
  },

  {
    slug: 'tabs',
    name: 'Tabs',
    description:
      'Keyboard-accessible tab navigation with controlled activation and indicators.',
    category: 'navigation',
    status: 'stable',
    order: 10,
    platforms: ['react', 'react-native'],
    docs: {
      react: 'https://docs.vellira.dev/react/tabs',
      'react-native': 'https://docs.vellira.dev/react-native/tabs',
    },
  },

  {
    slug: 'dropdown',
    name: 'Dropdown',
    description:
      'Composable action menus with nested content, selection states, and rich items.',
    category: 'overlays',
    status: 'stable',
    order: 10,
    platforms: ['react', 'react-native'],
    docs: {
      react: 'https://docs.vellira.dev/react/dropdown',
      'react-native': 'https://docs.vellira.dev/react-native/dropdown',
    },
  },
  {
    slug: 'modal',
    name: 'Modal',
    description:
      'Accessible modal dialogs with focus management, dismissal, and compound structure.',
    category: 'overlays',
    status: 'stable',
    order: 20,
    platforms: ['react', 'react-native'],
    docs: {
      react: 'https://docs.vellira.dev/react/modal',
      'react-native': 'https://docs.vellira.dev/react-native/modal',
    },
  },
  {
    slug: 'popover',
    name: 'Popover',
    description:
      'Floating contextual content with collision handling and flexible positioning.',
    category: 'overlays',
    status: 'stable',
    order: 30,
    platforms: ['react', 'react-native'],
    docs: {
      react: 'https://docs.vellira.dev/react/popover',
      'react-native': 'https://docs.vellira.dev/react-native/popover',
    },
  },
  {
    slug: 'tooltip',
    name: 'Tooltip',
    description:
      'Contextual labels with managed delay, positioning, and accessibility.',
    category: 'overlays',
    status: 'stable',
    order: 40,
    platforms: ['react', 'react-native'],
    docs: {
      react: 'https://docs.vellira.dev/react/tooltip',
      'react-native': 'https://docs.vellira.dev/react-native/tooltip',
    },
  },
] as const satisfies readonly ComponentCatalogEntry[];
