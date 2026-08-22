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
  padding: var(--space-0-5);
  border: 2px solid var(--checkbox-default-border);
  border-radius: var(--radius-full);
  background: var(--checkbox-default-bg);
  cursor: pointer;
  transition:
    background-color 0.2s ease,
    border-color 0.2s ease;
}

.root[data-state='checked'] {
  background: var(--checkbox-primary-default-bg);
  border-color: var(--checkbox-primary-default-border);
}

.root:hover:not(:disabled) {
  border-color: var(--checkbox-primary-hover-border);
}

.root[data-state='checked']:hover:not(:disabled) {
  background: var(--checkbox-primary-hover-bg);
  border-color: var(--checkbox-primary-hover-border);
}

.root:active:not(:disabled) {
  transform: scale(0.98);
}

.root[data-state='checked']:active:not(:disabled) {
  background: var(--checkbox-primary-pressed-bg);
  border-color: var(--checkbox-primary-pressed-border);
}

.root:focus-visible {
  outline: 2px solid var(--checkbox-primary-ring);
  outline-offset: 2px;
}

.root[aria-invalid='true'] {
  border-color: var(--checkbox-error-border);
}

.root[aria-invalid='true']:focus-visible {
  outline-color: var(--checkbox-error-ring);
}

.root:disabled {
  background: var(--checkbox-disabled-bg);
  border-color: var(--checkbox-disabled-border);
  cursor: not-allowed;
}

.thumb {
  display: block;
  width: 18px;
  height: 18px;
  border-radius: var(--radius-full);
  background: var(--checkbox-default-fg);
  transform: translateX(0);
  transition:
    background-color 0.2s ease,
    transform 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}

.root[data-state='checked'] .thumb {
  background: var(--checkbox-primary-default-fg);
  transform: translateX(20px);
}

.root[data-state='checked']:hover:not(:disabled) .thumb {
  background: var(--checkbox-primary-hover-fg);
}

.root[data-state='checked']:active:not(:disabled) .thumb {
  background: var(--checkbox-primary-pressed-fg);
}

.root:disabled .thumb {
  background: var(--checkbox-disabled-fg);
}

@media (prefers-reduced-motion: reduce) {
  .root,
  .thumb {
    transition: none;
  }
}
`;
  }

  const className = `${componentName[0].toLowerCase()}${componentName.slice(1)}`;

  return `.${className} {
  display: inline-flex;
}
`;
}
