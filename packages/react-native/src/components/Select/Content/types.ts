import type { ReactNode } from 'react';

export type SelectContentToolbarProps = {
  title: string;
  onClose: () => void;
};

export type SelectNodeContentProps = {
  children?: ReactNode;
};
