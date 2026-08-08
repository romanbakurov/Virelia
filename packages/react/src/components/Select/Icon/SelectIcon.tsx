import { cn } from '@utils/cn';
import { ChevronDown } from '@vellira-ui/icons';
import type { ReactNode } from 'react';

import { useSelectContext } from '../internal/SelectContext';
import type { SelectSlotComponent } from '../internal/types';

import styles from '../Trigger/SelectTrigger.module.scss';

export interface SelectIconProps {
  children?: ReactNode;
  className?: string;
}

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

SelectIcon.__velliraSelectPart = 'icon';
SelectIcon.displayName = 'Select.Icon';
