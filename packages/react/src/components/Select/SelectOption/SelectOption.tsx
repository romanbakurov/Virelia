import { cn } from '@utils/cn';

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
      {option.label}
    </li>
  );
};

SelectOption.displayName = 'SelectOption';
