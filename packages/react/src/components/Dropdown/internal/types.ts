import type { PortalProps } from '@primitives/Portal';
import type { ReactElement, ReactNode } from 'react';

import type {
  DropdownArrowProps,
  DropdownCheckboxItemProps,
  DropdownContentProps,
  DropdownEmptyProps,
  DropdownGroupProps,
  DropdownItemProps,
  DropdownLabelProps,
  DropdownLoadingProps,
  DropdownRadioGroupProps,
  DropdownRadioItemProps,
  DropdownSearchProps,
  DropdownSeparatorProps,
  DropdownSubTriggerProps,
  DropdownTriggerProps,
} from '../types';

export type DropdownSlot =
  | 'arrow'
  | 'checkboxItem'
  | 'content'
  | 'empty'
  | 'group'
  | 'item'
  | 'itemBadge'
  | 'itemDescription'
  | 'itemIcon'
  | 'itemShortcut'
  | 'label'
  | 'loading'
  | 'radioGroup'
  | 'radioItem'
  | 'search'
  | 'separator'
  | 'sub'
  | 'subContent'
  | 'subTrigger'
  | 'trigger';

export type DropdownSlotComponent<P> = ((props: P) => ReactElement | null) & {
  __velliraDropdownPart?: DropdownSlot;
  displayName?: string;
};

export type DropdownCollectionItem =
  | {
      type: 'item';
      id: string;
      props: DropdownItemProps;
      label: string;
      disabled?: boolean;
    }
  | {
      type: 'checkbox';
      id: string;
      props: DropdownCheckboxItemProps;
      label: string;
      disabled?: boolean;
    }
  | {
      type: 'radio';
      id: string;
      props: DropdownRadioItemProps;
      groupId: string;
      groupProps?: DropdownRadioGroupProps;
      label: string;
      disabled?: boolean;
    }
  | {
      type: 'subTrigger';
      id: string;
      props: DropdownSubTriggerProps;
      label: string;
      disabled?: boolean;
      content: ReactNode;
      subEntries: DropdownRenderEntry[];
      subItems: DropdownCollectionItem[];
    };

export type DropdownRenderEntry =
  | {
      type: 'groupStart';
      id: string;
      props: DropdownGroupProps;
    }
  | {
      type: 'groupEnd';
      id: string;
    }
  | {
      type: 'label';
      id: string;
      props: DropdownLabelProps;
    }
  | {
      type: 'separator';
      id: string;
      props: DropdownSeparatorProps;
    }
  | {
      type: 'empty';
      id: string;
      props: DropdownEmptyProps;
    }
  | {
      type: 'loading';
      id: string;
      props: DropdownLoadingProps;
    }
  | {
      type: 'arrow';
      id: string;
      props: DropdownArrowProps;
    }
  | {
      type: 'item';
      item: DropdownCollectionItem;
      itemIndex: number;
    };

export type ParsedDropdownChildren = {
  trigger?: ReactElement<DropdownTriggerProps>;
  content?: ReactElement<DropdownContentProps>;
  portal?: ReactElement<PortalProps>;
  search?: ReactElement<DropdownSearchProps>;
  entries: DropdownRenderEntry[];
  items: DropdownCollectionItem[];
};

export type DropdownParseContext = {
  radioGroupId?: string;
  radioGroupProps?: DropdownRadioGroupProps;
};
