import { forwardRef } from 'react';

import type { RadioGroupItemProps } from './types';

import { Radio } from '#primitives/Radio';

export const RadioGroupItem = forwardRef<HTMLInputElement, RadioGroupItemProps>(
  (props, ref) => <Radio {...props} ref={ref} />
);

RadioGroupItem.displayName = 'RadioGroup.Item';
