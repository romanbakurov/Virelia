import type { AccordionContentProps } from './types';

import styles from '../Accordion.module.scss';

type InternalAccordionContentProps = AccordionContentProps & {
  contentId?: string;
  hidden?: boolean;
};

export function AccordionContent({
  children,
  forceMount = false,
  hidden = false,
  contentId,
}: InternalAccordionContentProps) {
  if (hidden && !forceMount) return null;

  return (
    <div id={contentId} className={styles.content} hidden={hidden}>
      <div className={styles.contentInner}>{children}</div>
    </div>
  );
}
