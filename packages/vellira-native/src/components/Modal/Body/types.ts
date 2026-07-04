import type { BaseModalBodyProps } from '@romanbakurov/vellira-types';
import type { ReactNode } from 'react';

import type { NativeComponentProps } from '../../../types';

export interface ModalBodyProps
  extends BaseModalBodyProps, NativeComponentProps {
  children: ReactNode;
}
