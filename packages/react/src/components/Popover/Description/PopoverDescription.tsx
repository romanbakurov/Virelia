import {
  cloneElement,
  type HTMLAttributes,
  isValidElement,
  type ReactElement,
} from 'react';

import { cn } from '@utils/cn';

import { usePopoverContext } from '../Context';

import type { PopoverDescriptionProps } from './types';

import styles from './PopoverDescription.module.scss';

type DescriptionChildProps = HTMLAttributes<HTMLElement>;

export function PopoverDescription({
  children,
  asChild = false,
  className,
  ...descriptionProps
}: PopoverDescriptionProps) {
  const { descriptionId } = usePopoverContext('Popover.Description');

  const child =
    asChild && isValidElement<DescriptionChildProps>(children)
      ? (children as ReactElement<DescriptionChildProps>)
      : undefined;

  if (child) {
    return cloneElement(child, {
      ...descriptionProps,
      id: descriptionId,
      className: cn(child.props.className, styles.description, className),
    });
  }

  return (
    <p
      {...descriptionProps}
      id={descriptionId}
      className={cn(styles.description, className)}
    >
      {children}
    </p>
  );
}

PopoverDescription.displayName = 'Popover.Description';
