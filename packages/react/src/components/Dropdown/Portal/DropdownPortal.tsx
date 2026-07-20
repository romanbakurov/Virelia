import { Portal } from '@utils/Portal';

import { useDropdownContext } from '../internal/DropdownContext';
import type { DropdownSlotComponent } from '../internal/types';
import type { DropdownPortalProps } from '../types';

export const DropdownPortal: DropdownSlotComponent<DropdownPortalProps> = ({
  children,
  container,
  forceMount = false,
}: DropdownPortalProps) => {
  const context = useDropdownContext();

  if (!context.isOpen && !forceMount) return null;

  return <Portal container={container}>{children}</Portal>;
};

DropdownPortal.__velliraDropdownPart = 'portal';
DropdownPortal.displayName = 'Dropdown.Portal';
