import type { ComponentApiProp } from '../components/ComponentApi';

const sharedRadioApi: readonly ComponentApiProp[] = [
  {
    name: 'value',
    type: 'string',
    description: 'Value represented by the radio control.',
    required: true,
  },
  {
    name: 'checked',
    type: 'boolean',
    description: 'Controlled checked state for standalone usage.',
  },
  {
    name: 'defaultChecked',
    type: 'boolean',
    description: 'Initial checked state for uncontrolled standalone usage.',
  },
  {
    name: 'disabled',
    type: 'boolean',
    description: 'Disables interaction.',
  },
  {
    name: 'required',
    type: 'boolean',
    description: 'Marks the radio as required.',
  },
  {
    name: 'error',
    type: 'string',
    description: 'Validation error rendered for invalid state.',
  },
  {
    name: 'size',
    type: "'sm' | 'md' | 'lg'",
    description: 'Radio control size.',
  },
  {
    name: 'color',
    type: "'primary' | 'neutral' | 'success' | 'warning' | 'danger'",
    description: 'Selected radio color.',
  },
  {
    name: 'onCheckedChange',
    type: '(checked: boolean) => void',
    description: 'Called when the standalone checked state changes.',
  },
];

const reactRadioApi: readonly ComponentApiProp[] = [...sharedRadioApi];

const nativeRadioApi: readonly ComponentApiProp[] = [...sharedRadioApi];

export const radioApi = {
  react: reactRadioApi,
  'react-native': nativeRadioApi,
} as const;
