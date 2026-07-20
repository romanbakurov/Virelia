export const focusableSelector = [
  'a[href]',
  'button:not([disabled])',
  'textarea:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',');

export const getFocusableElements = (content: HTMLElement) =>
  Array.from(content.querySelectorAll<HTMLElement>(focusableSelector)).filter(
    (element) => !element.hasAttribute('disabled')
  );

export const focusFirstElement = (content: HTMLElement) => {
  const focusable = getFocusableElements(content);

  (focusable[0] ?? content).focus();
};
