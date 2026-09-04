import { Children, Fragment, isValidElement } from 'react';

import type { ReactElement, ReactNode } from 'react';

import type { AccordionRootProps } from './Root/types';
import { AccordionContent } from './Content';
import { AccordionItem } from './Item';
import { AccordionRoot } from './Root';
import { AccordionTrigger } from './Trigger';

function flattenItems(children: ReactNode): ReactNode[] {
  return Children.toArray(children).flatMap((child) => {
    if (isValidElement(child) && child.type === Fragment) {
      return flattenItems(
        (child as ReactElement<{ children?: ReactNode }>).props.children
      );
    }

    return child;
  });
}

function AccordionRootWithFlattenedItems({
  children,
  ...props
}: AccordionRootProps) {
  return <AccordionRoot {...props}>{flattenItems(children)}</AccordionRoot>;
}

export const Accordion = Object.assign(AccordionRootWithFlattenedItems, {
  displayName: 'Accordion',
  Item: AccordionItem,
  Trigger: AccordionTrigger,
  Content: AccordionContent,
});
