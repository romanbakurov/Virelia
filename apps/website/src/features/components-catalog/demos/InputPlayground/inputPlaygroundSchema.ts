import type { PlaygroundControl } from '../../components/PlaygroundControls';

import type {
  InputPlaygroundColor,
  InputPlaygroundSize,
  InputPlaygroundState,
  InputPlaygroundType,
  InputPlaygroundValue,
  InputPlaygroundVariant,
} from './InputPlayground';

const types: InputPlaygroundType[] = [
  'text',
  'email',
  'password',
  'number',
  'tel',
  'url',
  'search',
];

const sizes: InputPlaygroundSize[] = ['sm', 'md', 'lg'];

const colors: InputPlaygroundColor[] = [
  'primary',
  'neutral',
  'success',
  'warning',
  'danger',
];

const variants: InputPlaygroundVariant[] = ['outline', 'filled', 'soft'];

const states: InputPlaygroundState[] = [
  'default',
  'disabled',
  'loading',
  'invalid',
  'readOnly',
];

export const inputPlaygroundControls = [
  {
    type: 'select',
    key: 'type',
    label: 'Type',
    options: types,
  },
  {
    type: 'select',
    key: 'color',
    label: 'Color',
    options: colors,
  },
  {
    type: 'select',
    key: 'variant',
    label: 'Variant',
    options: variants,
  },
  {
    type: 'select',
    key: 'size',
    label: 'Size',
    options: sizes,
  },
  {
    type: 'select',
    key: 'state',
    label: 'State',
    options: states,
  },
  {
    type: 'toggle',
    key: 'clearable',
    label: 'Clearable',
    group: 'Options',
  },
  {
    type: 'toggle',
    key: 'required',
    label: 'Required',
    group: 'Options',
  },
] as const satisfies readonly PlaygroundControl<InputPlaygroundValue>[];
