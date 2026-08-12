import type { PlaygroundControl } from '../../components/PlaygroundControls';

import type {
  ButtonPlaygroundAppearance,
  ButtonPlaygroundColor,
  ButtonPlaygroundShape,
  ButtonPlaygroundSize,
  ButtonPlaygroundState,
  ButtonPlaygroundValue,
} from './ButtonPlayground';

const appearances: ButtonPlaygroundAppearance[] = [
  'solid',
  'outline',
  'soft',
  'ghost',
  'link',
];

const colors: ButtonPlaygroundColor[] = [
  'primary',
  'neutral',
  'success',
  'warning',
  'danger',
];

const sizes: ButtonPlaygroundSize[] = ['sm', 'md', 'lg'];

const shapes: ButtonPlaygroundShape[] = ['square', 'rounded', 'pill'];

const states: ButtonPlaygroundState[] = ['default', 'disabled', 'loading'];

export const buttonPlaygroundControls = [
  {
    type: 'select',
    key: 'appearance',
    label: 'Appearance',
    options: appearances,
  },
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
    key: 'shape',
    label: 'Shape',
    options: shapes,
  },
  {
    type: 'select',
    key: 'state',
    label: 'State',
    options: states,
  },
] as const satisfies readonly PlaygroundControl<ButtonPlaygroundValue>[];
