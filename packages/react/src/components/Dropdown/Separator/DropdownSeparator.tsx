import styles from './DropdownSeparator.module.scss';

export const DropdownSeparator = () => {
  return (
    <li role='separator' className={styles.separator} aria-hidden='true' />
  );
};
