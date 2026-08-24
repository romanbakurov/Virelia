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
  width: var(--switch-geometry-track-width);
  height: var(--switch-geometry-track-height);
  flex-shrink: 0;
  align-items: center;
  padding: var(--switch-geometry-padding);
  border: var(--switch-geometry-border-width) solid var(--switch-off-track-border);
  border-radius: var(--radius-full);
  background: var(--switch-off-track-bg);
  cursor: pointer;
  transition:
    background-color 0.2s ease,
    border-color 0.2s ease,
    transform 0.18s ease;
}

.root[data-state='checked'] {
  background: var(--switch-on-default-track-bg);
  border-color: var(--switch-on-default-track-border);
}

.root[data-state='checked']:hover:not(:disabled) {
  background: var(--switch-on-hover-track-bg);
  border-color: var(--switch-on-hover-track-border);
}

.root:active:not(:disabled) {
  transform: scale(var(--switch-geometry-press-scale));
}

.root[data-state='checked']:active:not(:disabled) {
  background: var(--switch-on-pressed-track-bg);
  border-color: var(--switch-on-pressed-track-border);
}

.root:focus-visible {
  outline: var(--switch-geometry-focus-ring-width) solid var(--switch-focus-ring);
  outline-offset: var(--switch-geometry-focus-ring-offset);
}

.root[aria-invalid='true'] {
  border-color: var(--switch-error-border);
}

.root[aria-invalid='true']:focus-visible {
  outline-color: var(--switch-error-ring);
}

.root:disabled {
  background: var(--switch-disabled-track-bg);
  border-color: var(--switch-disabled-track-border);
  cursor: not-allowed;
}

.thumb {
  display: block;
  width: var(--switch-geometry-thumb-size);
  height: var(--switch-geometry-thumb-size);
  border-radius: var(--radius-full);
  background: var(--switch-off-thumb-bg);
  transform: translateX(0);
  transition:
    background-color 0.2s ease,
    transform 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}

.root[data-state='checked'] .thumb {
  background: var(--switch-on-default-thumb-bg);
  transform: translateX(var(--switch-geometry-thumb-travel));
}

.root[data-state='checked']:hover:not(:disabled) .thumb {
  background: var(--switch-on-hover-thumb-bg);
}

.root[data-state='checked']:active:not(:disabled) .thumb {
  background: var(--switch-on-pressed-thumb-bg);
}

.root:disabled .thumb {
  background: var(--switch-disabled-thumb-bg);
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
