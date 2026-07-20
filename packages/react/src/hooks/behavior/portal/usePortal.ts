import { useEffect, useState } from 'react';

export const defaultPortalTarget = () => {
  if (typeof document === 'undefined') return null;

  return document.body;
};

export type PortalOptions = {
  container?: Element | DocumentFragment | null;
};

export const usePortal = ({ container }: PortalOptions = {}) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    container ??
    document.getElementById('overlay-root') ??
    defaultPortalTarget()
  );
};
