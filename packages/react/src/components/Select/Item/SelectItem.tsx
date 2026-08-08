import { cn } from '@utils/cn';
import { Check } from '@vellira-ui/icons';

import { markSelectSlot, type SelectSlotComponent } from '../internal/types';

import type { SelectItemProps, SelectItemRowProps } from './types';

import styles from './SelectItem.module.scss';

export const SelectItem: SelectSlotComponent<SelectItemProps> = () => null;

markSelectSlot(SelectItem, 'item');
SelectItem.displayName = 'Select.Item';

export const SelectItemRow = ({
  option,
  isSelected,
  isActive,
  optionId,
  renderOption,
  onSelect,
  onMouseEnter,
}: SelectItemRowProps) => {
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
        [styles.success]: option.color === 'success',
        [styles.warning]: option.color === 'warning',
        [styles.danger]: option.color === 'danger',
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
      {renderOption ? (
        <span className={styles.custom}>{renderOption(option)}</span>
      ) : (
        <>
          {option.icon && <span className={styles.icon}>{option.icon}</span>}

          <span className={styles.content}>
            <span className={styles.label}>{option.label}</span>
            {option.description && (
              <span className={styles.description}>{option.description}</span>
            )}
          </span>

          {option.badge && <span className={styles.badge}>{option.badge}</span>}
          {option.shortcut && (
            <kbd className={styles.shortcut}>{option.shortcut}</kbd>
          )}
        </>
      )}

      <span className={styles.check} aria-hidden='true'>
        {isSelected && <Check />}
      </span>
    </li>
  );
};

SelectItemRow.displayName = 'SelectItemRow';
