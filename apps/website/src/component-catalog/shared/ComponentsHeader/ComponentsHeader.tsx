'use client';

import { SiteHeader } from '@/components/layout/SiteHeader';

import { ComponentNavigationTrigger } from '../ComponentNavigationTrigger';
import { useComponentNavigation } from '../ComponentNavigationProvider';

export function ComponentsHeader() {
  const { mainOpen, setMainNavigationOpen } = useComponentNavigation();

  return (
    <SiteHeader
      variant='portal'
      mobileAction={<ComponentNavigationTrigger />}
      mobileMenuOpen={mainOpen}
      onMobileMenuOpenChange={setMainNavigationOpen}
    />
  );
}
