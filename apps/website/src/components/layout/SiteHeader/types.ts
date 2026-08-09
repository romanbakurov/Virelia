import type { ReactNode } from 'react';

export type SiteHeaderVariant = 'marketing' | 'portal';

export interface SiteHeaderProps {
  variant?: SiteHeaderVariant;
  mobileAction?: ReactNode;
}
