import type { BaseButtonProps } from '@vellira-ui/types';
import type {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  ReactNode,
} from 'react';

export interface ButtonProps
  extends
    BaseButtonProps,
    Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'color'>,
    Pick<
      AnchorHTMLAttributes<HTMLAnchorElement>,
      'href' | 'target' | 'rel' | 'download'
    > {
  children?: ReactNode;
  iconStart?: ReactNode;
  iconEnd?: ReactNode;
  spinner?: ReactNode;
  tooltip?: string;
  badge?: ReactNode;
  shortcut?: ReactNode;
  asChild?: boolean;
}
