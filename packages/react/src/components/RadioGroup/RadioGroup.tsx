import { RadioGroupItem } from './Item';
import { RadioGroupRoot } from './Root';

export const RadioGroup = Object.assign(RadioGroupRoot, {
  Item: RadioGroupItem,
});

RadioGroup.displayName = 'RadioGroup';
