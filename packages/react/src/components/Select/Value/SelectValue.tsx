import { cn } from '@utils/cn';
import type { ReactNode } from 'react';

import { useSelectContext } from '../internal/SelectContext';
import { markSelectSlot, type SelectSlotComponent } from '../internal/types';

import styles from '../Trigger/SelectTrigger.module.scss';

export interface SelectValueProps {
  /** Custom value content; defaults to the current selected value text. */
  children?: ReactNode;
  /** Class name applied to the value wrapper. */
  className?: string;
}

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
