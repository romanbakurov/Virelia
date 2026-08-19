import type { ComponentProfileArg, FormControlKindArg } from '../cli';
import type { ComponentTemplateParams } from './component-types';

export type TestTemplateParams = ComponentTemplateParams & {
  isNative: boolean;
  profile?: ComponentProfileArg;
  control?: FormControlKindArg;
};

export function renderTestTemplate({
  componentName,
  isNative,
  profile = 'base',
  control = 'value',
}: TestTemplateParams) {
  const describeName = isNative ? `Native ${componentName}` : componentName;

  if (profile === 'form-control' && control === 'boolean') {
    return `import { afterEach, describe, expect, it, vi } from 'vitest';

import { render } from '../../test-utils/render';

import { ${componentName} } from './${componentName}';

afterEach(() => {
  document.body.innerHTML = '';
});

describe('${describeName}', () => {
  it('renders the declared boolean state', () => {
    const { container, unmount } = render(
      <${componentName} defaultChecked />
    );

    expect(container.firstChild).not.toBeNull();
    unmount();
  });

  it('exposes a state-change callback', () => {
    const onCheckedChange = vi.fn();
    const { container, unmount } = render(
      <${componentName} onCheckedChange={onCheckedChange} />
    );

    expect(container.firstChild).not.toBeNull();
    unmount();
  });
});
`;
  }

  if (profile === 'form-control') {
    return `import { afterEach, describe, expect, it, vi } from 'vitest';

import { render } from '../../test-utils/render';

import { ${componentName} } from './${componentName}';

afterEach(() => {
  document.body.innerHTML = '';
});

describe('${describeName}', () => {
  it('renders the declared value state', () => {
    const { container, unmount } = render(
      <${componentName} defaultValue='Example value' />
    );

    expect(container.firstChild).not.toBeNull();
    unmount();
  });

  it('exposes a value-change callback', () => {
    const onValueChange = vi.fn();
    const { container, unmount } = render(
      <${componentName} onValueChange={onValueChange} />
    );

    expect(container.firstChild).not.toBeNull();
    unmount();
  });
});
`;
  }

  return `import { afterEach, describe, expect, it } from 'vitest';

import { render } from '../../test-utils/render';

import { ${componentName} } from './${componentName}';

afterEach(() => {
  document.body.innerHTML = '';
});

describe('${describeName}', () => {
  it('renders children', () => {
    const { container, unmount } = render(
      <${componentName}>Example content</${componentName}>
    );

    expect(container.textContent).toContain('Example content');

    unmount();
  });
});
`;
}
