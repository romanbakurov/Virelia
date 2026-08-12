import type { ComponentApiProp } from '../components/ComponentApi';

const sharedSelectApi: readonly ComponentApiProp[] = [
  {
    name: 'multiple',
    type: 'boolean | undefined',
    description: 'Prop for Select.',
  },
  {
    name: 'value',
    type: 'string | SelectMultipleValue | undefined',
    description: 'Prop for Select.',
  },
  {
    name: 'defaultValue',
    type: 'string | SelectMultipleValue | undefined',
    description: 'Prop for Select.',
  },
  {
    name: 'onValueChange',
    type: '((value: SelectValue) => void) | ((value: SelectMultipleValue) => void) | undefined',
    description:
      'Called when the selected value changes.\nCalled when the selected values change.',
  },
  {
    name: 'options',
    type: 'BaseSelectOption[]',
    description: 'Prop for Select.',
    required: true,
  },
  {
    name: 'placeholder',
    type: 'string | undefined',
    description: 'Prop for Select.',
  },
  {
    name: 'size',
    type: "'sm' | 'md' | 'lg'",
    description: 'Prop for Select.',
  },
  {
    name: 'color',
    type: "'primary' | 'neutral' | 'success' | 'warning' | 'danger'",
    description: 'Prop for Select.',
  },
  {
    name: 'variant',
    type: "'outline' | 'filled' | 'soft'",
    description: 'Prop for Select.',
  },
  {
    name: 'invalid',
    type: 'boolean | undefined',
    description: 'Prop for Select.',
  },
  {
    name: 'loading',
    type: 'boolean | undefined',
    description: 'Prop for Select.',
  },
  {
    name: 'clearable',
    type: 'boolean | undefined',
    description: 'Prop for Select.',
  },
  {
    name: 'searchable',
    type: 'boolean | undefined',
    description: 'Prop for Select.',
  },
  {
    name: 'maxSelected',
    type: 'number | undefined',
    description: 'Prop for Select.',
  },
  {
    name: 'closeOnSelect',
    type: 'boolean | undefined',
    description: 'Prop for Select.',
  },
  {
    name: 'virtual',
    type: 'boolean | SelectVirtualConfig | undefined',
    description: 'Prop for Select.',
  },
  {
    name: 'avoidCollisions',
    type: 'boolean | undefined',
    description: 'Prop for Select.',
  },
  {
    name: 'modal',
    type: 'boolean | undefined',
    description: 'Prop for Select.',
  },
  {
    name: 'command',
    type: 'boolean | undefined',
    description: 'Prop for Select.',
  },
  {
    name: 'label',
    type: 'string | undefined',
    description: 'Visible field label.',
  },
  {
    name: 'description',
    type: 'string | undefined',
    description: 'Supporting text linked to the control.',
  },
  {
    name: 'error',
    type: 'string | undefined',
    description:
      'Error message linked to the control. Also implies invalid state.',
  },
  {
    name: 'required',
    type: 'boolean | undefined',
    description: 'Marks the field and compatible child controls as required.',
  },
  {
    name: 'disabled',
    type: 'boolean | undefined',
    description: 'Disables the field and compatible child controls.',
  },
];

const reactSelectApi: readonly ComponentApiProp[] = [...sharedSelectApi];

const nativeSelectApi: readonly ComponentApiProp[] = [...sharedSelectApi];

export const selectApi = {
  react: reactSelectApi,
  'react-native': nativeSelectApi,
} as const;
