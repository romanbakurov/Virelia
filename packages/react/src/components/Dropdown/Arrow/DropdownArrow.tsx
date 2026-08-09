import { cn } from '@utils/cn';
import { markCompoundSlot } from '@vellira-ui/core';

import type { DropdownSlotComponent } from '../internal/types';
import type { DropdownArrowProps } from '../types';

import styles from './DropdownArrow.module.scss';

export const DropdownArrow: DropdownSlotComponent<DropdownArrowProps> = ({
  className,
}) => <span aria-hidden='true' className={cn(styles.arrow, className)} />;

markCompoundSlot(DropdownArrow, 'arrow');
DropdownArrow.displayName = 'Dropdown.Arrow';
