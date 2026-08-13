import type { ReactNode } from 'react';

export interface SelectGroupProps {
  /** Option items rendered inside the group. */
  children?: ReactNode;
  /** Visible group label. */
  label: ReactNode;
  /** Allows selecting all options in the group from the group header. */
  selectable?: boolean;
  /** Accessible label for the group-level select action. */
  selectLabel?: ReactNode;
}

export interface SelectLabelProps {
  /** Label content for a select group. */
  children?: ReactNode;
}

export interface SelectSeparatorProps {
  /** Select separators do not render children. */
  children?: never;
}
