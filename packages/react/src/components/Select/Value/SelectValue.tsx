import { useSelectContext } from '../internal/SelectContext';
import { markSelectSlot, type SelectSlotComponent } from '../internal/types';

import type { SelectValueProps } from './types';

import styles from '../Trigger/SelectTrigger.module.scss';

import { cn } from '#utils/cn';

export const SelectValue: SelectSlotComponent<SelectValueProps> = ({
  children,
  className,
}) => {
  const { triggerProps } = useSelectContext();

  return (
    <span className={cn(styles.valueWrap, className)}>
      <span
        className={cn(styles.value, {
          [styles.placeholder]: triggerProps.isPlaceholder,
        })}
      >
        {children ?? triggerProps.displayText}
      </span>
    </span>
  );
};

markSelectSlot(SelectValue, 'value');
SelectValue.displayName = 'Select.Value';
