import { cloneElement, isValidElement } from 'react';

import { cn } from '@utils/cn';
import { ChevronDown } from '@vellira-ui/icons';
import type {
  HTMLAttributes,
  KeyboardEventHandler,
  MouseEventHandler,
  ReactElement,
  Ref,
} from 'react';

import {
  composeEventHandlers,
  composeRefs,
} from '../internal/composeEventHandlers';
import {
  useDropdownContext,
  useDropdownTriggerContext,
} from '../internal/DropdownContext';
import type { DropdownSlotComponent } from '../internal/types';
import type { DropdownTriggerProps } from '../types';

import styles from './DropdownTrigger.module.scss';

type TriggerChildProps = HTMLAttributes<HTMLElement> & {
  disabled?: boolean;
  ref?: Ref<HTMLElement>;
};

export const DropdownTrigger: DropdownSlotComponent<DropdownTriggerProps> = (
  props
) => <DropdownTriggerSurface {...props} />;

DropdownTrigger.__velliraDropdownPart = 'trigger';
DropdownTrigger.displayName = 'Dropdown.Trigger';

export const DropdownTriggerSurface = ({
  children,
  asChild = false,
  disabled,
  className,
}: DropdownTriggerProps) => {
  const root = useDropdownContext();
  const trigger = useDropdownTriggerContext();
  const child =
    asChild && isValidElement<TriggerChildProps>(children)
      ? (children as ReactElement<TriggerChildProps>)
      : undefined;
  const isDisabled = root.disabled || disabled;
  const triggerProps = {
    id: trigger.triggerId,
    ref: child
      ? composeRefs(child.props.ref, trigger.setTriggerRef)
      : trigger.setTriggerRef,
    'aria-controls': trigger.isOpen ? trigger.contentId : undefined,
    'aria-disabled': isDisabled || undefined,
    'aria-expanded': trigger.isOpen,
    'aria-haspopup': 'menu' as const,
    className: cn(
      !child && styles.button,
      !child && styles[root.size],
      !child && styles[root.color],
      trigger.triggerClassName,
      className
    ),
    'data-state': trigger.isOpen ? 'open' : 'closed',
    disabled: isDisabled || undefined,
    onClick: composeEventHandlers(
      child?.props.onClick as MouseEventHandler<HTMLElement> | undefined,
      trigger.onClick
    ),
    onKeyDown: composeEventHandlers(
      child?.props.onKeyDown as KeyboardEventHandler<HTMLElement> | undefined,
      trigger.onKeyDown
    ),
  };

  if (child) {
    return cloneElement(child, {
      ...triggerProps,
      className: cn(child.props.className, className),
    });
  }

  return (
    <button type='button' {...triggerProps}>
      <span className={styles.label}>{children}</span>
      <span
        className={cn(styles.arrow, {
          [styles.open]: trigger.isOpen,
        })}
        aria-hidden='true'
      >
        <ChevronDown />
      </span>
    </button>
  );
};

DropdownTriggerSurface.displayName = 'DropdownTriggerSurface';
