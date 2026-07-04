import type { DropdownGroupProps } from './types';

import styles from './DropdownGroup.module.scss';

export const DropdownGroup = ({ label }: DropdownGroupProps) => {
  return (
    <li role='presentation' className={styles.group}>
      {label}
    </li>
  );
};
