import type { AccordionItemProps } from './types';

import styles from '../Accordion.module.scss';

type InternalAccordionItemProps = AccordionItemProps & { className?: string };

export function AccordionItem({
  children,
  className,
}: InternalAccordionItemProps) {
  return <div className={className ?? styles.item}>{children}</div>;
}
