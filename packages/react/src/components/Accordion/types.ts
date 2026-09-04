import type { ReactNode } from 'react';

export type AccordionProps =
  | {
      children?: ReactNode;
      type?: 'single';
      value?: string;
      defaultValue?: string;
      onValueChange?: (value: string) => void;
      collapsible?: boolean;
      disabled?: boolean;
    }
  | {
      children?: ReactNode;
      type: 'multiple';
      value?: string[];
      defaultValue?: string[];
      onValueChange?: (value: string[]) => void;
      collapsible?: never;
      disabled?: boolean;
    };
