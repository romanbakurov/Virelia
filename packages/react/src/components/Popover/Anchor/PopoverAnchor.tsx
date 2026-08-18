import {
  cloneElement,
  type HTMLAttributes,
  isValidElement,
  type ReactElement,
  type Ref,
} from 'react';

import { usePopoverContext } from '../Context';

import type { PopoverAnchorProps } from './types';

import { cn } from '#utils/cn';

type AnchorChildProps = HTMLAttributes<HTMLElement> & {
  ref?: Ref<HTMLElement>;
};

function assignRef<T>(ref: Ref<T> | undefined, value: T | null) {
  if (typeof ref === 'function') {
    ref(value);
    return;
  }

  if (ref) {
    ref.current = value;
  }
}

export function PopoverAnchor({
  children,
  asChild = false,
  className,
  ...anchorProps
}: PopoverAnchorProps) {
  const { setAnchorRef } = usePopoverContext('Popover.Anchor');

  const child =
    asChild && isValidElement<AnchorChildProps>(children)
      ? (children as ReactElement<AnchorChildProps>)
      : undefined;

  if (child) {
    return cloneElement(child, {
      ...anchorProps,
      ref: (node: HTMLElement | null) => {
        assignRef(child.props.ref, node);
        setAnchorRef(node);
      },
      className: cn(child.props.className, className),
    });
  }

  return (
    <div {...anchorProps} ref={setAnchorRef} className={className}>
      {children}
    </div>
  );
}

PopoverAnchor.displayName = 'Popover.Anchor';
