import { cn } from '@utils/cn';

import type { DropdownItemProps } from './types';

import styles from './DropdownItem.module.scss';

export const DropdownItem = ({
  id,
  children,
  label,
  icon,
  danger,
  disabled,
  active,
  onClick,
  onMouseEnter,
  shortcut,
  textWrap = 'truncate',
  className,
}: DropdownItemProps) => {
  const contentText = children || label;

  return (
    <li
      id={id}
      role='menuitem'
      tabIndex={-1}
      aria-disabled={disabled || undefined}
      data-active={active || undefined}
      data-danger={danger || undefined}
      onClick={disabled ? undefined : onClick}
      onMouseEnter={disabled ? undefined : onMouseEnter}
      className={cn(
        styles.item,
        {
          [styles.active]: active,
          [styles.disabled]: disabled,
          [styles.danger]: danger,
        },
        className
      )}
    >
      {icon && (
        <span aria-hidden='true' className={styles.itemIcon}>
          {icon}
        </span>
      )}
      {contentText && (
        <span className={cn(styles.itemText, styles[`itemText--${textWrap}`])}>
          {contentText}
        </span>
      )}
      {shortcut && <span className={styles.itemShortcut}>{shortcut}</span>}
    </li>
  );
};
