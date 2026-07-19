import type { SelectSlotComponent } from '../internal/types';

import type { SelectLabelProps } from './types';

import styles from '../Content/SelectContent.module.scss';

export const SelectLabel: SelectSlotComponent<SelectLabelProps> = ({
  children,
}) => (
  <div role='presentation' className={styles.groupLabel}>
    {children}
  </div>
);

SelectLabel.__velliraSelectPart = 'label';
SelectLabel.displayName = 'Select.Label';
