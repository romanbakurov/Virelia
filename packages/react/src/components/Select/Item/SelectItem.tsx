import {
  cloneElement,
  isValidElement,
  type MouseEventHandler,
  type ReactElement,
  type ReactNode,
} from 'react';

import { cn } from '@utils/cn';
import { devWarning } from '@utils/devWarning';
import { Check } from '@vellira-ui/icons';

import { markSelectSlot, type SelectSlotComponent } from '../internal/types';

import type { SelectItemProps, SelectItemRowProps } from './types';

import styles from './SelectItem.module.scss';

type SelectItemChildProps = {
  'aria-disabled'?: boolean;
  'aria-selected'?: boolean;
  children?: ReactNode;
  className?: string;
  id?: string;
  onClick?: MouseEventHandler<HTMLElement>;
  onMouseEnter?: MouseEventHandler<HTMLElement>;
  role?: string;
  tabIndex?: number;
};

export const SelectItem: SelectSlotComponent<SelectItemProps> = () => null;

markSelectSlot(SelectItem, 'item');
SelectItem.displayName = 'Select.Item';

export const SelectItemRow = ({
  option,
  isSelected,
  isActive,
  optionId,
  optionIndex,
  selectedValues,
  multiple,
  renderOption,
  onSelect,
  onMouseEnter,
}: SelectItemRowProps) => {
  const isDisabled = !!option.disabled;
  const child =
    option.asChild && isValidElement<SelectItemChildProps>(option.children)
      ? (option.children as ReactElement<SelectItemChildProps>)
      : undefined;
  const optionClassName = cn(styles.option, {
    [styles.selected]: isSelected,
    [styles.active]: isActive,
    [styles.disabled]: isDisabled,
    [styles.success]: option.color === 'success',
    [styles.warning]: option.color === 'warning',
    [styles.danger]: option.color === 'danger',
  });

  devWarning(
    !option.asChild || Boolean(child),
    'Select.Item: asChild requires a single valid React element child.'
  );

  const handleClick: MouseEventHandler<HTMLElement> = (event) => {
    if (isDisabled) {
      event.preventDefault();
      return;
    }

    onSelect(option.value);
  };

  const handleMouseEnter: MouseEventHandler<HTMLElement> = () => {
    if (isDisabled) return;

    onMouseEnter();
  };

  if (child) {
    return cloneElement(child, {
      id: optionId,
      role: 'option',
      'aria-selected': isSelected,
      'aria-disabled': isDisabled || undefined,
      className: cn(child.props.className, optionClassName),
      onClick: (event) => {
        child.props.onClick?.(event);

        if (!event.defaultPrevented) {
          handleClick(event);
        }
      },
      onMouseEnter: (event) => {
        child.props.onMouseEnter?.(event);

        if (!event.defaultPrevented) {
          handleMouseEnter(event);
        }
      },
      tabIndex: isDisabled ? -1 : child.props.tabIndex,
    });
  }

  return (
    <li
      id={optionId}
      role='option'
      aria-selected={isSelected}
      aria-disabled={isDisabled || undefined}
      className={optionClassName}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
    >
      {renderOption ? (
        <span className={styles.custom}>
          {renderOption({
            option,
            selected: isSelected,
            disabled: isDisabled,
            active: isActive,
            index: optionIndex,
            values: selectedValues,
            multiple,
            pressed: false,
          })}
        </span>
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
