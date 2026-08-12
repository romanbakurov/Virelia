import type { PlaygroundControl } from '../../components/PlaygroundControls';

import type { SelectPlaygroundValue } from './SelectPlayground';

export const selectPlaygroundControls = [
  {
    type: 'text',
    key: 'placeholder',
    label: 'Placeholder',
  },
  {
    type: 'select',
    key: 'size',
    label: 'Size',
    options: ['sm', 'md', 'lg'],
  },
  {
    type: 'select',
    key: 'color',
    label: 'Color',
    options: ['primary', 'neutral', 'success', 'warning', 'danger'],
  },
  {
    type: 'select',
    key: 'variant',
    label: 'Variant',
    options: ['outline', 'filled', 'soft'],
  },
  {
    type: 'toggle',
    key: 'invalid',
    label: 'Invalid',
    group: 'Options',
  },
  {
    type: 'toggle',
    key: 'loading',
    label: 'Loading',
    group: 'Options',
  },
  {
    type: 'toggle',
    key: 'clearable',
    label: 'Clearable',
    group: 'Options',
  },
  {
    type: 'toggle',
    key: 'searchable',
    label: 'Searchable',
    group: 'Options',
  },
  {
    type: 'text',
    key: 'error',
    label: 'Error',
  },
  {
    type: 'toggle',
    key: 'disabled',
    label: 'Disabled',
    group: 'Options',
  },
] as const satisfies readonly PlaygroundControl<SelectPlaygroundValue>[];
