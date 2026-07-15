import { cn } from '@utils/cn';
import { Check } from '@vellira-ui/icons';

import type { SelectOptionProps } from './types';

import styles from './SelectOption.module.scss';

export const SelectOption = ({
  option,
  isSelected,
  isActive,
  optionId,
  onSelect,
  onMouseEnter,
}: SelectOptionProps) => {
  const isDisabled = !!option.disabled;

  return (
    <li
      id={optionId}
      role='option'
      aria-selected={isSelected}
      aria-disabled={isDisabled || undefined}
      className={cn(styles.option, {
        [styles.selected]: isSelected,
        [styles.active]: isActive,
        [styles.disabled]: isDisabled,
      })}
      onClick={() => {
        if (isDisabled) return;

        onSelect(option.value);
      }}
      onMouseEnter={() => {
        if (isDisabled) return;

        onMouseEnter();
      }}
    >
      <span className={styles.label}>{option.label}</span>

      <span className={styles.check} aria-hidden='true'>
        {isSelected && <Check />}
      </span>
    </li>
  );
};

SelectOption.displayName = 'SelectOption';
