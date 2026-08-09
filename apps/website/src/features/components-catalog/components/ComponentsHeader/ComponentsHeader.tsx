'use client';

import { SiteHeader } from '@/components/layout/SiteHeader';

import { ComponentNavigationTrigger } from '../ComponentNavigationTrigger';

export function ComponentsHeader() {
  return (
    <SiteHeader
      variant='portal'
      mobileAction={<ComponentNavigationTrigger />}
    />
  );
}
