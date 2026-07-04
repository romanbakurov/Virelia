import type { ComponentPropsWithoutRef, ElementType } from 'react';

export type WebComponentProps<
  TagName extends ElementType,
  OmittedProps extends PropertyKey = never,
> = Omit<
  ComponentPropsWithoutRef<TagName>,
  Extract<OmittedProps, keyof ComponentPropsWithoutRef<TagName>>
>;
