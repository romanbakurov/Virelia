import { Children, isValidElement, useRef } from 'react';

import { cn } from '@utils/cn';
import { ChevronDown, Close } from '@vellira-ui/icons';
import type { SelectColor } from '@vellira-ui/types';
import type { ReactElement, ReactNode } from 'react';

import { SelectDropdown } from './SelectDropdown/SelectDropdown';
import { SelectTrigger as SelectTriggerPrimitive } from './SelectTrigger/SelectTrigger';
import { useSelectContext } from './SelectContext';
import type { SelectOption } from './types';

import dropdownStyles from './SelectDropdown/SelectDropdown.module.scss';
import triggerStyles from './SelectTrigger/SelectTrigger.module.scss';

type SelectCompoundPart =
  | 'content'
  | 'empty'
  | 'group'
  | 'icon'
  | 'item'
  | 'itemDescription'
  | 'itemIcon'
  | 'label'
  | 'loading'
  | 'search'
  | 'separator'
  | 'trigger'
  | 'value';

type SelectCompoundComponent<P> = ((props: P) => ReactElement | null) & {
  __velliraSelectPart?: SelectCompoundPart;
  displayName?: string;
};

export interface SelectCompoundTriggerProps {
  children?: ReactNode;
  className?: string;
}

export interface SelectCompoundContentProps {
  children?: ReactNode;
  className?: string;
}

export interface SelectCompoundValueProps {
  children?: ReactNode;
  className?: string;
}

export interface SelectCompoundIconProps {
  children?: ReactNode;
  className?: string;
}

export interface SelectCompoundSearchProps {
  placeholder?: string;
  className?: string;
}

export interface SelectCompoundGroupProps {
  children?: ReactNode;
  label: ReactNode;
}

export interface SelectCompoundLabelProps {
  children?: ReactNode;
}

export interface SelectCompoundItemProps {
  value: string;
  children?: ReactNode;
  label?: string;
  disabled?: boolean;
  description?: ReactNode;
  icon?: ReactNode;
  badge?: string;
  shortcut?: string;
  color?: SelectColor;
}

export interface SelectCompoundItemIconProps {
  children?: ReactNode;
}

export interface SelectCompoundItemDescriptionProps {
  children?: ReactNode;
}

export interface SelectCompoundSeparatorProps {
  children?: never;
}

export interface SelectCompoundEmptyProps {
  children?: ReactNode;
}

export interface SelectCompoundLoadingProps {
  children?: ReactNode;
}

export type SelectRenderEntry =
  | {
      type: 'group';
      id: string;
      label: ReactNode;
    }
  | {
      type: 'option';
      option: SelectOption;
      optionIndex: number;
    }
  | {
      type: 'separator';
      id: string;
    };

export const SelectCompoundTrigger = ({
  children,
  className,
}: SelectCompoundTriggerProps) => {
  const { triggerProps } = useSelectContext();

  return (
    <SelectTriggerPrimitive
      {...triggerProps}
      className={[triggerProps.className, className].filter(Boolean).join(' ')}
    >
      {children}
    </SelectTriggerPrimitive>
  );
};

SelectCompoundTrigger.__velliraSelectPart = 'trigger';
SelectCompoundTrigger.displayName = 'Select.Trigger';

export const SelectCompoundContent = ({
  children,
  className,
}: SelectCompoundContentProps) => {
  const { dropdownProps } = useSelectContext();
  const slots = collectSelectContentSlots(children);

  return (
    <SelectDropdown
      {...dropdownProps}
      {...slots}
      className={[dropdownProps.className, className].filter(Boolean).join(' ')}
    />
  );
};

SelectCompoundContent.__velliraSelectPart = 'content';
SelectCompoundContent.displayName = 'Select.Content';

export const SelectCompoundValue: SelectCompoundComponent<
  SelectCompoundValueProps
> = ({ children, className }) => {
  const { triggerProps } = useSelectContext();

  return (
    <span className={cn(triggerStyles.valueWrap, className)}>
      <span
        className={cn(triggerStyles.value, {
          [triggerStyles.placeholder]: triggerProps.isPlaceholder,
        })}
      >
        {children ?? triggerProps.displayText}
      </span>
    </span>
  );
};

SelectCompoundValue.__velliraSelectPart = 'value';
SelectCompoundValue.displayName = 'Select.Value';

export const SelectCompoundIcon: SelectCompoundComponent<
  SelectCompoundIconProps
> = ({ children, className }) => {
  const { triggerProps } = useSelectContext();

  return (
    <span
      className={cn(
        triggerStyles.arrow,
        {
          [triggerStyles.open]: triggerProps.isOpen,
        },
        className
      )}
      aria-hidden='true'
    >
      {triggerProps.loading ? (
        <span className={triggerStyles.spinner} />
      ) : (
        (children ?? triggerProps.endIcon ?? <ChevronDown />)
      )}
    </span>
  );
};

SelectCompoundIcon.__velliraSelectPart = 'icon';
SelectCompoundIcon.displayName = 'Select.Icon';

export const SelectCompoundSearch: SelectCompoundComponent<
  SelectCompoundSearchProps
> = ({ placeholder, className }) => {
  const { dropdownProps } = useSelectContext();
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchValue = dropdownProps.searchValue ?? '';

  return (
    <div className={dropdownStyles.searchWrap}>
      <input
        ref={searchInputRef}
        className={cn(dropdownStyles.search, className)}
        value={searchValue}
        placeholder={
          placeholder ??
          (dropdownProps.command ? 'Type a command...' : 'Search...')
        }
        aria-label='Search options'
        onInput={(event) =>
          dropdownProps.onSearchChange?.(event.currentTarget.value)
        }
        onChange={(event) => dropdownProps.onSearchChange?.(event.target.value)}
      />
      {searchValue && (
        <button
          type='button'
          className={dropdownStyles.searchClear}
          aria-label='Clear search'
          onClick={() => {
            dropdownProps.onSearchChange?.('');
            searchInputRef.current?.focus();
          }}
        >
          <Close />
        </button>
      )}
    </div>
  );
};

SelectCompoundSearch.__velliraSelectPart = 'search';
SelectCompoundSearch.displayName = 'Select.Search';

export const SelectCompoundGroup: SelectCompoundComponent<
  SelectCompoundGroupProps
> = () => null;

SelectCompoundGroup.__velliraSelectPart = 'group';
SelectCompoundGroup.displayName = 'Select.Group';

export const SelectCompoundLabel: SelectCompoundComponent<
  SelectCompoundLabelProps
> = ({ children }) => (
  <div role='presentation' className={dropdownStyles.groupLabel}>
    {children}
  </div>
);

SelectCompoundLabel.__velliraSelectPart = 'label';
SelectCompoundLabel.displayName = 'Select.Label';

export const SelectCompoundItem: SelectCompoundComponent<
  SelectCompoundItemProps
> = () => null;

SelectCompoundItem.__velliraSelectPart = 'item';
SelectCompoundItem.displayName = 'Select.Item';

export const SelectCompoundItemIcon: SelectCompoundComponent<
  SelectCompoundItemIconProps
> = () => null;

SelectCompoundItemIcon.__velliraSelectPart = 'itemIcon';
SelectCompoundItemIcon.displayName = 'Select.ItemIcon';

export const SelectCompoundItemDescription: SelectCompoundComponent<
  SelectCompoundItemDescriptionProps
> = () => null;

SelectCompoundItemDescription.__velliraSelectPart = 'itemDescription';
SelectCompoundItemDescription.displayName = 'Select.ItemDescription';

export const SelectCompoundSeparator: SelectCompoundComponent<
  SelectCompoundSeparatorProps
> = () => null;

SelectCompoundSeparator.__velliraSelectPart = 'separator';
SelectCompoundSeparator.displayName = 'Select.Separator';

export const SelectCompoundEmpty: SelectCompoundComponent<
  SelectCompoundEmptyProps
> = ({ children }) => <>{children}</>;

SelectCompoundEmpty.__velliraSelectPart = 'empty';
SelectCompoundEmpty.displayName = 'Select.Empty';

export const SelectCompoundLoading: SelectCompoundComponent<
  SelectCompoundLoadingProps
> = ({ children }) => <>{children}</>;

SelectCompoundLoading.__velliraSelectPart = 'loading';
SelectCompoundLoading.displayName = 'Select.Loading';

export function collectSelectOptions(children: ReactNode) {
  return collectSelectStructure(children).options;
}

export function collectSelectStructure(children: ReactNode): {
  entries: SelectRenderEntry[];
  options: SelectOption[];
} {
  const entries: SelectRenderEntry[] = [];
  const options: SelectOption[] = [];
  let generatedEntryId = 0;

  function visit(node: ReactNode) {
    Children.forEach(node, (child) => {
      if (!isValidElement(child)) return;

      const type = child.type as SelectCompoundComponent<unknown>;

      if (type.__velliraSelectPart === 'group') {
        const props = child.props as SelectCompoundGroupProps;

        entries.push({
          type: 'group',
          id: `group-${generatedEntryId++}`,
          label: props.label,
        });
        visit(props.children);
        return;
      }

      if (type.__velliraSelectPart === 'item') {
        const props = child.props as SelectCompoundItemProps;
        const itemChildren = getItemChildren(props.children, props.value);
        const label = props.label ?? itemChildren.label;
        const optionIndex = options.length;
        const option = {
          label,
          value: props.value,
          disabled: props.disabled,
          description: props.description ?? itemChildren.description,
          icon: props.icon ?? itemChildren.icon,
          badge: props.badge,
          shortcut: props.shortcut,
          color: props.color,
        };

        options.push(option);
        entries.push({ type: 'option', option, optionIndex });
        return;
      }

      if (type.__velliraSelectPart === 'separator') {
        entries.push({
          type: 'separator',
          id: `separator-${generatedEntryId++}`,
        });
        return;
      }

      if (
        type.__velliraSelectPart === 'empty' ||
        type.__velliraSelectPart === 'icon' ||
        type.__velliraSelectPart === 'itemDescription' ||
        type.__velliraSelectPart === 'itemIcon' ||
        type.__velliraSelectPart === 'label' ||
        type.__velliraSelectPart === 'loading' ||
        type.__velliraSelectPart === 'search' ||
        type.__velliraSelectPart === 'value'
      ) {
        return;
      }

      visit((child.props as { children?: ReactNode }).children);
    });
  }

  visit(children);

  return { entries, options };
}

export function hasSelectLayoutChildren(children: ReactNode) {
  let hasLayout = false;

  function visit(node: ReactNode) {
    Children.forEach(node, (child) => {
      if (!isValidElement(child) || hasLayout) return;

      const type = child.type as SelectCompoundComponent<unknown>;

      if (
        type.__velliraSelectPart === 'trigger' ||
        type.__velliraSelectPart === 'content'
      ) {
        hasLayout = true;
        return;
      }

      visit((child.props as { children?: ReactNode }).children);
    });
  }

  visit(children);

  return hasLayout;
}

function collectSelectContentSlots(children: ReactNode) {
  let headerSlot: ReactNode;
  let searchSlot: ReactNode;
  let emptySlot: ReactNode;
  let loadingSlot: ReactNode;

  Children.forEach(children, (child) => {
    if (!isValidElement(child)) return;

    const type = child.type as SelectCompoundComponent<unknown>;

    if (type.__velliraSelectPart === 'label') {
      headerSlot = child;
    }

    if (type.__velliraSelectPart === 'search') {
      searchSlot = child;
    }

    if (type.__velliraSelectPart === 'empty') {
      emptySlot = child;
    }

    if (type.__velliraSelectPart === 'loading') {
      loadingSlot = child;
    }
  });

  return { emptySlot, headerSlot, loadingSlot, searchSlot };
}

function getItemChildren(children: ReactNode, fallback: string) {
  let icon: ReactNode;
  let description: ReactNode;
  const labelParts: string[] = [];

  function visit(node: ReactNode) {
    Children.forEach(node, (child) => {
      if (typeof child === 'string' || typeof child === 'number') {
        labelParts.push(String(child));
        return;
      }

      if (!isValidElement(child)) return;

      const type = child.type as SelectCompoundComponent<unknown>;

      if (type.__velliraSelectPart === 'itemIcon') {
        icon = (child.props as SelectCompoundItemIconProps).children;
        return;
      }

      if (type.__velliraSelectPart === 'itemDescription') {
        description = (child.props as SelectCompoundItemDescriptionProps)
          .children;
        return;
      }

      visit((child.props as { children?: ReactNode }).children);
    });
  }

  visit(children);

  const label = labelParts.join('').trim();

  return {
    description,
    icon,
    label: label || fallback,
  };
}
