import type { BaseButtonProps } from '@romanbakurov/vellira-types';
import type { ReactNode } from 'react';

import type { WebComponentProps } from '../../types';

export type { ButtonColor, ButtonSize } from '@romanbakurov/vellira-types';

export interface ButtonProps
  extends
    BaseButtonProps,
    WebComponentProps<'button', 'children' | 'disabled' | 'onChange' | 'size'> {
  ariaLabel?: string | false;
  children?: ReactNode;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  fullWidth?: boolean;
}
