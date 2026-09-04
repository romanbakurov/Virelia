import { AccordionContent } from './Content';
import { AccordionItem } from './Item';
import { AccordionRoot } from './Root';
import { AccordionTrigger } from './Trigger';

export const Accordion = Object.assign(AccordionRoot, {
  displayName: 'Accordion',
  Item: AccordionItem,
  Trigger: AccordionTrigger,
  Content: AccordionContent,
});
