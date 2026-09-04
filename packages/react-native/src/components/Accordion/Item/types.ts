import type { ReactNode } from 'react';

export type AccordionItemProps = {
  children?: ReactNode;
  value: string;
  disabled?: boolean;
};
