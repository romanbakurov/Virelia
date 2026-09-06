import type { BaseAccordionProps } from '@vellira-ui/types';
import type { ReactNode } from 'react';

export type AccordionProps = BaseAccordionProps & {
  children?: ReactNode;
};

export type { AccordionContentProps } from './Content';
export type { AccordionItemProps } from './Item';
export type { AccordionTriggerProps } from './Trigger';
