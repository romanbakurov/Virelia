import type { ComponentProfileArg, FormControlKindArg } from '../cli';
import type { ComponentTemplateParams } from './component-types';

export type StylesTemplateParams = ComponentTemplateParams & {
  profile?: ComponentProfileArg;
  control?: FormControlKindArg;
};

export function renderStylesTemplate({
  componentName,
  profile = 'base',
  control = 'value',
}: StylesTemplateParams) {
  if (profile === 'form-control' && control === 'boolean') {
    return `.root {
  position: relative;
  display: inline-flex;
  width: 44px;
  height: 24px;
  flex-shrink: 0;
  align-items: center;
  padding: 2px;
  border: 0;
  border-radius: 999px;
  background: var(--vellira-color-background-neutral-strong, #6b7280);
  cursor: pointer;
  transition: background-color 160ms ease;
}

.root[data-state='checked'] {
  background: var(--vellira-color-background-primary-strong, #2563eb);
}

.root:focus-visible {
  outline: 2px solid var(--vellira-color-border-focus, #2563eb);
  outline-offset: 2px;
}

.root[aria-invalid='true'] {
  outline: 2px solid var(--vellira-color-border-danger, #dc2626);
  outline-offset: 2px;
}

.root:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.thumb {
  display: block;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: var(--vellira-color-background-surface, #fff);
  box-shadow: 0 1px 2px rgb(0 0 0 / 20%);
  transform: translateX(0);
  transition: transform 160ms ease;
}

.root[data-state='checked'] .thumb {
  transform: translateX(20px);
}
`;
  }

  const className = `${componentName[0].toLowerCase()}${componentName.slice(1)}`;

  return `.${className} {
  display: inline-flex;
}
`;
}
