import { ChevronDown } from '@vellira-ui/icons';

import type { AccordionTriggerProps } from './types';

import styles from '../Accordion.module.scss';

type InternalAccordionTriggerProps = AccordionTriggerProps & {
  contentId?: string;
  expanded?: boolean;
  onActivate?: () => void;
};

export function AccordionTrigger({
  children,
  disabled = false,
  contentId,
  expanded = false,
  onActivate,
}: InternalAccordionTriggerProps) {
  return (
    <button
      type='button'
      className={styles.trigger}
      disabled={disabled}
      aria-expanded={expanded}
      aria-controls={contentId}
      onClick={onActivate}
    >
      <span>{children}</span>
      <span className={styles.indicator} aria-hidden='true'>
        <ChevronDown size={16} />
      </span>
    </button>
  );
}
