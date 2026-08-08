import type { SelectLabelProps } from '../Group/types';
import { markSelectSlot, type SelectSlotComponent } from '../internal/types';

import styles from '../Content/SelectContent.module.scss';

export const SelectLabel: SelectSlotComponent<SelectLabelProps> = ({
  children,
}) => (
  <div role='presentation' className={styles.groupLabel}>
    {children}
  </div>
);

markSelectSlot(SelectLabel, 'label');
SelectLabel.displayName = 'Select.Label';
