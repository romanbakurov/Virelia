import { cn } from '@utils/cn';
import type { ReactNode } from 'react';

import { useSelectContext } from '../internal/SelectContext';
import type { SelectSlotComponent } from '../internal/types';

import styles from '../Trigger/SelectTrigger.module.scss';

export interface SelectValueProps {
  children?: ReactNode;
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

SelectValue.__velliraSelectPart = 'value';
SelectValue.displayName = 'Select.Value';
