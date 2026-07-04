import type { BaseModalFooterProps } from '@romanbakurov/vellira-types';
import type { ReactNode } from 'react';

import type { NativeComponentProps } from '../../../types';

export interface ModalFooterProps
  extends BaseModalFooterProps, NativeComponentProps {
  children: ReactNode;
}
