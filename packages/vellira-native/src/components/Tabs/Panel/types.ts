import type { BaseTabsPanelProps } from '@romanbakurov/vellira-types';
import type { ReactNode } from 'react';

import type { NativeComponentProps } from '../../../types';

export interface TabsPanelProps
  extends BaseTabsPanelProps, NativeComponentProps {
  children?: ReactNode;
}
