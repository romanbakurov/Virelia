import { defineComponentPageMetadata } from '../../metadata';

export default defineComponentPageMetadata({
  react: {
    children: `<Select.Item value='react'>React</Select.Item>
<Select.Item value='vue'>Vue</Select.Item>
<Select.Item value='svelte'>Svelte</Select.Item>`,
  },

  native: {
    responsivePresentation: true,
    children: `<Select.Item value='react' label='React' />
<Select.Item value='vue' label='Vue' />
<Select.Item value='svelte' label='Svelte' />`,
  },

  demo: {
    label: 'Favorite framework',
    description: 'Choose one option.',
    satisfiedRequiredProps: ['options'],
    excludeControls: [
      'multiple',
      'label',
      'description',
      'required',
      'maxSelected',
      'closeOnSelect',
      'avoidCollisions',
      'modal',
      'command',
    ],
    initialValues: {
      multiple: false,
      placeholder: 'Select an option',
      size: 'md',
      color: 'primary',
      variant: 'outline',
      invalid: false,
      loading: false,
      clearable: false,
      searchable: false,
      disabled: false,
      error: '',
    },
  },

  defaults: {
    shared: {
      multiple: false,
      placeholder: 'Select...',
      size: 'md',
      color: 'primary',
      variant: 'outline',
      invalid: false,
      loading: false,
      clearable: false,
      searchable: false,
      closeOnSelect: false,
      required: false,
      disabled: false,
    },

    react: {
      modal: false,
      command: false,
      matchTriggerWidth: true,
      avoidCollisions: true,
      portal: true,
      defaultOpen: false,
      placement: 'bottom',
    },

    native: {
      presentation: 'auto',
      placement: 'bottom-start',
      offset: 8,
      matchTriggerWidth: false,
      dismissOnBackdropPress: true,
      defaultOpen: false,
    },
  },

  examples: [
    {
      title: 'Basic',
      description: 'Basic component usage.',
      props: [],
    },
    {
      title: 'Searchable',
      description: 'Filter options by typing a search query.',
      props: ['searchable'],
    },
    {
      title: 'Multiple',
      description: 'Select more than one option.',
      props: ['multiple'],
    },
    {
      title: 'Error',
      description: 'Validation error state.',
      props: [`error='Please review this option.'`],
    },
    {
      title: 'Disabled',
      description: 'Disabled select state.',
      props: ['disabled'],
    },
    {
      title: 'Loading',
      description: 'Loading state while options are being resolved.',
      props: ['loading'],
    },
  ],

  api: {
    descriptions: {
      multiple: 'Enables multiple selection when true.',
      value: 'Controlled selected value or values.',
      defaultValue: 'Initial selected value or values for uncontrolled usage.',
      onValueChange: 'Called when the selected value or values change.',
    },

    sections: [
      { name: 'Select.Item', exportName: 'SelectItemProps' },
      { name: 'Select.Trigger', exportName: 'SelectTriggerSlotProps' },
      {
        name: 'Select.Value',
        exportName: {
          react: 'SelectValueProps',
          'react-native': 'SelectValueSlotProps',
        },
      },
      {
        name: 'Select.Content',
        exportName: {
          react: 'SelectContentSlotProps',
          'react-native': 'SelectContentProps',
        },
      },
      { name: 'Select.Search', exportName: 'SelectSearchProps' },
      { name: 'Select.Group', exportName: 'SelectGroupProps' },
      { name: 'Select.Label', exportName: 'SelectLabelProps' },
      { name: 'Select.Separator', exportName: 'SelectSeparatorProps' },
      { name: 'Select.Empty', exportName: 'SelectEmptyProps' },
      { name: 'Select.Loading', exportName: 'SelectLoadingProps' },
    ],
  },

  accessibility: {
    react: [
      {
        title: 'Accessible naming',
        description:
          'Provide a visible label or another accessible name for the select trigger.',
        props: ['label', 'description'],
      },
      {
        title: 'Keyboard interaction',
        description:
          'Preserve expected keyboard navigation, focus management, and option selection behavior.',
        props: ['open', 'defaultOpen', 'searchable'],
      },
      {
        title: 'Selection state',
        description:
          'Keep selected values and expanded state synchronized with the visual interface.',
        props: ['value', 'defaultValue', 'multiple'],
      },
      {
        title: 'Validation feedback',
        description:
          'Associate validation feedback with the control and expose invalid and required state.',
        props: ['error', 'invalid', 'required', 'disabled'],
      },
    ],

    native: [
      {
        title: 'Accessible naming',
        description:
          'Provide a visible label or accessibilityLabel so screen readers can identify the control.',
        props: ['label', 'accessibilityLabel', 'accessibilityHint'],
      },
      {
        title: 'Screen reader interaction',
        description:
          'Expose expanded, selected, disabled, and busy state through React Native accessibility semantics.',
        props: ['value', 'multiple', 'disabled', 'loading'],
      },
      {
        title: 'Search and selection',
        description:
          'Keep search, active option, and selected values understandable when using assistive technologies.',
        props: ['searchable', 'searchPlaceholder', 'multiple'],
      },
      {
        title: 'Validation feedback',
        description:
          'Expose validation errors and required state without relying only on visual styling.',
        props: ['error', 'invalid', 'required'],
      },
    ],
  },

  related: ['input', 'dropdown', 'radio-group'],
});
