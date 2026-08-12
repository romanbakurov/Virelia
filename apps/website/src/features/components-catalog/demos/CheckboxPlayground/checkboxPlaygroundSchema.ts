import type { PlaygroundControl } from '../../components/PlaygroundControls';

import type {
  CheckboxPlaygroundColor,
  CheckboxPlaygroundLabelPosition,
  CheckboxPlaygroundSize,
  CheckboxPlaygroundState,
  CheckboxPlaygroundValue,
} from './CheckboxPlayground';

const sizes: CheckboxPlaygroundSize[] = ['sm', 'md', 'lg'];

const colors: CheckboxPlaygroundColor[] = [
  'primary',
  'neutral',
  'success',
  'warning',
  'danger',
];

const labelPositions: CheckboxPlaygroundLabelPosition[] = ['start', 'end'];

const states: CheckboxPlaygroundState[] = [
  'default',
  'disabled',
  'indeterminate',
  'error',
];

export const checkboxPlaygroundControls = [
  {
    type: 'select',
    key: 'color',
    label: 'Color',
    options: colors,
  },
  {
    type: 'select',
    key: 'size',
    label: 'Size',
    options: sizes,
  },
  {
    type: 'select',
    key: 'labelPosition',
    label: 'Label position',
    options: labelPositions,
  },
  {
    type: 'select',
    key: 'state',
    label: 'State',
    options: states,
  },
  {
    type: 'toggle',
    key: 'required',
    label: 'Required',
    group: 'Options',
  },
] as const satisfies readonly PlaygroundControl<CheckboxPlaygroundValue>[];
