import {
  cloneElement,
  type HTMLAttributes,
  isValidElement,
  type ReactElement,
} from 'react';

import { usePopoverContext } from '../Context';

import type { PopoverTitleProps } from './types';

import styles from './PopoverTitle.module.scss';

import { cn } from '#utils/cn';

type TitleChildProps = HTMLAttributes<HTMLElement>;

export function PopoverTitle({
  children,
  asChild = false,
  className,
  ...titleProps
}: PopoverTitleProps) {
  const { titleId } = usePopoverContext('Popover.Title');

  const child =
    asChild && isValidElement<TitleChildProps>(children)
      ? (children as ReactElement<TitleChildProps>)
      : undefined;

  if (child) {
    return cloneElement(child, {
      ...titleProps,
      id: titleId,
      className: cn(child.props.className, styles.title, className),
    });
  }

  return (
    <h2 {...titleProps} id={titleId} className={cn(styles.title, className)}>
      {children}
    </h2>
  );
}

PopoverTitle.displayName = 'Popover.Title';
