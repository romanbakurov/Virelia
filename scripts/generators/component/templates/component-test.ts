import type { ComponentTemplateParams } from './component-types';

export type TestTemplateParams = ComponentTemplateParams & {
  isNative: boolean;
};

export function renderTestTemplate({
  componentName,
  isNative,
}: TestTemplateParams) {
  const describeName = isNative ? `Native ${componentName}` : componentName;

  return `import { afterEach, describe, expect, it } from 'vitest';

import { render } from '../../test-utils/render';

import { ${componentName} } from './${componentName}';

afterEach(() => {
  document.body.innerHTML = '';
});

describe('${describeName}', () => {
  it('renders component content', () => {
    const { container, unmount } = render(<${componentName} />);

    expect(container.textContent).toContain('${componentName}');

    unmount();
  });
});
`;
}
