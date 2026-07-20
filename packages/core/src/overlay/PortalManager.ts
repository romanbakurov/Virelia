export const defaultPortalTarget = () => {
  if (typeof document === 'undefined') return null;

  return document.body;
};
