import { ChevronDown } from '@vellira-ui/icons';

import { useSelectContext } from '../internal/SelectContext';
import { markSelectSlot, type SelectSlotComponent } from '../internal/types';

import type { SelectIconProps } from './types';

import styles from '../Trigger/SelectTrigger.module.scss';

import { cn } from '#utils/cn';

export const SelectIcon: SelectSlotComponent<SelectIconProps> = ({
  children,
  className,
}) => {
  const { triggerProps } = useSelectContext();

  return (
    <span
      className={cn(
        styles.arrow,
        {
          [styles.open]: triggerProps.isOpen,
        },
        className
      )}
      aria-hidden='true'
    >
      {triggerProps.loading ? (
        <span className={styles.spinner} />
      ) : (
        (children ?? triggerProps.endIcon ?? <ChevronDown />)
      )}
    </span>
  );
};

markSelectSlot(SelectIcon, 'icon');
SelectIcon.displayName = 'Select.Icon';
