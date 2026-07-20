import { forwardRef } from 'react';

import type { View } from 'react-native';

import { Radio } from '../../../primitives/Radio';

import type { RadioGroupItemProps } from './types';

export const RadioGroupItem = forwardRef<View, RadioGroupItemProps>(
  (props, ref) => <Radio {...props} ref={ref} />
);

RadioGroupItem.displayName = 'RadioGroup.Item';
