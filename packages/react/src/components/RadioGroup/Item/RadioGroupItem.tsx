import { forwardRef } from 'react';

import { Radio } from '../../../primitives/Radio';

import type { RadioGroupItemProps } from './types';

export const RadioGroupItem = forwardRef<HTMLInputElement, RadioGroupItemProps>(
  (props, ref) => <Radio {...props} ref={ref} />
);

RadioGroupItem.displayName = 'RadioGroup.Item';
