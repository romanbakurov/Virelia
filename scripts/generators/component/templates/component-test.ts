import type { ComponentCapability } from '@vellira-ui/metadata';
import type { ComponentProfileArg, FormControlKindArg } from '../cli';
import { createBaselineTestContract } from '../test-contract';
import type { ComponentTemplateParams } from './component-types';

export type TestTemplateParams = ComponentTemplateParams & {
  isNative: boolean;
  profile?: ComponentProfileArg;
  control?: FormControlKindArg;
  capabilities?: readonly ComponentCapability[];
};

function renderFormControlStateTests(params: {
  componentName: string;
  requirements: readonly string[];
}) {
  const { componentName, requirements } = params;
  const tests: string[] = [];

  if (requirements.includes('disabled')) {
    tests.push(`  it('renders the disabled baseline state', () => {
    const { container, unmount } = render(<${componentName} disabled />);

    expect(container.firstChild).not.toBeNull();
    unmount();
  });`);
  }

  if (requirements.includes('invalid')) {
    tests.push(`  it('renders the invalid baseline state', () => {
    const { container, unmount } = render(<${componentName} invalid />);

    expect(container.firstChild).not.toBeNull();
    unmount();
  });`);
  }

  if (requirements.includes('required')) {
    tests.push(`  it('renders the required baseline state', () => {
    const { container, unmount } = render(<${componentName} required />);

    expect(container.firstChild).not.toBeNull();
    unmount();
  });`);
  }

  return tests.length > 0 ? `\n\n${tests.join('\n\n')}` : '';
}

function renderFormControlContractTests(params: {
  componentName: string;
  control: FormControlKindArg;
  requirements: readonly string[];
}) {
  const { componentName, control, requirements } = params;
  const tests: string[] = [];
  const isBoolean = control === 'boolean';

  if (requirements.includes('controlled')) {
    tests.push(`  it('renders the controlled baseline contract', () => {
    const { container, unmount } = render(
      <${componentName} ${isBoolean ? 'checked' : "value='Controlled value'"} />
    );

    expect(container.firstChild).not.toBeNull();
    unmount();
  });`);
  }

  if (requirements.includes('uncontrolled')) {
    tests.push(`  it('renders the uncontrolled baseline contract', () => {
    const { container, unmount } = render(
      <${componentName} ${isBoolean ? 'defaultChecked' : "defaultValue='Default value'"} />
    );

    expect(container.firstChild).not.toBeNull();
    unmount();
  });`);
  }

  return tests.length > 0 ? `\n\n${tests.join('\n\n')}` : '';
}

export function renderTestTemplate({
  componentName,
  isNative,
  profile = 'base',
  control = 'value',
  capabilities = [],
}: TestTemplateParams) {
  const describeName = isNative ? `Native ${componentName}` : componentName;
  const contract = createBaselineTestContract({
    profile,
    control,
    capabilities,
    isNative,
  });
  const contractComment = `// Baseline contract: ${contract.requirements.join(', ')}`;

  if (profile === 'form-control' && control === 'boolean') {
    const contractTests = renderFormControlContractTests({
      componentName,
      control,
      requirements: contract.requirements,
    });
    const stateTests = renderFormControlStateTests({
      componentName,
      requirements: contract.requirements,
    });

    return `${contractComment}
import { afterEach, describe, expect, it, vi } from 'vitest';

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
  });${contractTests}${stateTests}
});
`;
  }

  if (profile === 'form-control') {
    const contractTests = renderFormControlContractTests({
      componentName,
      control,
      requirements: contract.requirements,
    });
    const stateTests = renderFormControlStateTests({
      componentName,
      requirements: contract.requirements,
    });

    return `${contractComment}
import { afterEach, describe, expect, it, vi } from 'vitest';

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
  });${contractTests}${stateTests}
});
`;
  }

  return `${contractComment}
import { afterEach, describe, expect, it } from 'vitest';

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
