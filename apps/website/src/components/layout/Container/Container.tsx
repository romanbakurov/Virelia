import type { ComponentPropsWithoutRef, ElementType, ReactNode } from 'react';

import styles from './Container.module.css';

type ContainerSize = 'narrow' | 'content' | 'wide' | 'full';

interface ContainerOwnProps<TElement extends ElementType = 'div'> {
  as?: TElement;
  children: ReactNode;
  size?: ContainerSize;
  className?: string;
}

export type ContainerProps<TElement extends ElementType = 'div'> =
  ContainerOwnProps<TElement> &
    Omit<ComponentPropsWithoutRef<TElement>, keyof ContainerOwnProps<TElement>>;

export function Container<TElement extends ElementType = 'div'>({
  as,
  children,
  size = 'wide',
  className,
  ...props
}: ContainerProps<TElement>) {
  const Component = as ?? 'div';

  return (
    <Component
      className={[styles.container, styles[size], className]
        .filter(Boolean)
        .join(' ')}
      {...props}
    >
      {children}
    </Component>
  );
}
