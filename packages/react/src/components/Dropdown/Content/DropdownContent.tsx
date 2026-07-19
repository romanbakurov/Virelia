import { Fragment } from 'react';

import { cn } from '@utils/cn';
import { Portal } from '@utils/Portal';

import { DropdownEmptySurface } from '../Empty';
import { DropdownGroupSurface } from '../Group';
import { useDropdownContext } from '../internal/DropdownContext';
import type { DropdownSlotComponent } from '../internal/types';
import { DropdownItemRow } from '../Item';
import { DropdownLabelSurface } from '../Label';
import { DropdownLoadingSurface } from '../Loading';
import { DropdownSeparatorSurface } from '../Separator';
import type { DropdownContentProps } from '../types';

import styles from './DropdownContent.module.scss';

export const DropdownContent: DropdownSlotComponent<DropdownContentProps> = ({
  className,
}) => {
  const context = useDropdownContext();

  if (!context.isOpen) return null;

  const contentClassName = cn(
    styles.dropdown,
    styles[context.color],
    context.contentProps?.className,
    className
  );
  const content = (
    <ul
      ref={context.setContentRef}
      id={context.contentId}
      role='menu'
      tabIndex={-1}
      aria-labelledby={context.triggerId}
      aria-activedescendant={
        context.activeIndex >= 0
          ? context.getItemId(context.activeIndex)
          : undefined
      }
      onKeyDown={context.onKeyDown}
      style={{ ...context.surfaceStyle, ...context.contentProps?.style }}
      className={contentClassName}
      data-color={context.color}
    >
      {context.loading ? (
        <DropdownLoadingSurface>{context.loadingText}</DropdownLoadingSurface>
      ) : context.entries.length ? (
        context.entries.map((entry) => {
          if (entry.type === 'groupStart') {
            return <DropdownGroupSurface key={entry.id} />;
          }

          if (entry.type === 'groupEnd') {
            return null;
          }

          if (entry.type === 'label') {
            return <DropdownLabelSurface key={entry.id} {...entry.props} />;
          }

          if (entry.type === 'separator') {
            return <DropdownSeparatorSurface key={entry.id} {...entry.props} />;
          }

          if (entry.type === 'empty') {
            return (
              <DropdownEmptySurface key={entry.id}>
                {entry.props.children}
              </DropdownEmptySurface>
            );
          }

          if (entry.type === 'loading') {
            return (
              <DropdownLoadingSurface key={entry.id}>
                {entry.props.children}
              </DropdownLoadingSurface>
            );
          }

          return (
            <Fragment key={entry.item.id}>
              <DropdownItemRow item={entry.item} itemIndex={entry.itemIndex} />
            </Fragment>
          );
        })
      ) : (
        <DropdownEmptySurface />
      )}
    </ul>
  );

  return context.portal ? <Portal>{content}</Portal> : content;
};

DropdownContent.__velliraDropdownPart = 'content';
DropdownContent.displayName = 'Dropdown.Content';
