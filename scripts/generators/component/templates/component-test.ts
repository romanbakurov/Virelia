import type { ComponentCapability } from '@vellira-ui/metadata';
import type { ComponentProfileArg, FormControlKindArg } from '../cli';
import { createBaselineTestContract } from '../test-contract';
import type { ComponentTemplateParams } from './component-types';

export type TestTemplateParams = ComponentTemplateParams & {
  isNative: boolean;
  profile?: ComponentProfileArg;
  control?: FormControlKindArg;
  capabilities?: readonly ComponentCapability[];
  parts?: readonly string[];
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

function renderFormControlAccessibilityTests(params: {
  componentName: string;
  control: FormControlKindArg;
  isNative: boolean;
}) {
  const { componentName, control, isNative } = params;

  if (control === 'boolean') {
    const selector = isNative ? '[aria-checked]' : '[role="switch"]';

    return `\n\n  it('exposes ${isNative ? 'native' : 'web'} switch semantics', () => {
    const { container, unmount } = render(<${componentName} />);
    const control = container.querySelector('${selector}');

    expect(control).not.toBeNull();
    unmount();
  });`;
  }

  if (control === 'text') {
    return `\n\n  it('renders a text-entry control', () => {
    const { container, unmount } = render(<${componentName} />);
    const control = container.querySelector('textarea, input');

    expect(control).not.toBeNull();
    unmount();
  });`;
  }

  return `\n\n  it('renders an interactive value control', () => {
    const { container, unmount } = render(<${componentName} />);
    const control = container.querySelector('${isNative ? '[role="button"]' : 'button'}');

    expect(control).not.toBeNull();
    unmount();
  });`;
}

function renderCompoundInteractionTests(params: {
  componentName: string;
  requirements: readonly string[];
  isNative: boolean;
  parts: readonly string[];
}) {
  const { componentName, requirements, isNative, parts } = params;

  if (!parts.includes('Trigger')) {
    return '';
  }

  const tests: string[] = [];
  const triggerSelector = isNative ? '[role="button"]' : 'button';

  if (requirements.includes('compound-api')) {
    tests.push(`  it('exposes the declared compound API', () => {
    expect(${componentName}.Trigger).toBeTypeOf('function');
  });`);
  }

  if (requirements.includes('accessible-name')) {
    tests.push(`  it('gives the trigger an accessible name', () => {
    const { container, unmount } = render(
      <${componentName}>
        <${componentName}.Trigger>Open section</${componentName}.Trigger>
      </${componentName}>
    );
    const trigger = container.querySelector('${triggerSelector}');

    expect(trigger?.textContent).toContain('Open section');
    unmount();
  });`);
  }

  if (requirements.includes('interaction')) {
    tests.push(`  it('forwards trigger activation', () => {
    const onActivate = vi.fn();
    const { container, unmount } = render(
      <${componentName}>
        <${componentName}.Trigger onActivate={onActivate}>
          Open section
        </${componentName}.Trigger>
      </${componentName}>
    );
    const trigger = container.querySelector('${triggerSelector}');

    expect(trigger).not.toBeNull();
    trigger?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(onActivate).toHaveBeenCalledTimes(1);
    unmount();
  });`);
  }

  if (requirements.includes('keyboard') && !isNative) {
    tests.push(`  it('keeps the trigger keyboard-focusable', () => {
    const { container, unmount } = render(
      <${componentName}>
        <${componentName}.Trigger>Open section</${componentName}.Trigger>
      </${componentName}>
    );
    const trigger = container.querySelector('button');

    expect(trigger).toBeInstanceOf(HTMLButtonElement);
    (trigger as HTMLButtonElement | null)?.focus();
    expect(document.activeElement).toBe(trigger);
    unmount();
  });`);
  }

  return tests.length > 0 ? `\n\n${tests.join('\n\n')}` : '';
}

function renderOverlayStateTests(params: {
  componentName: string;
  requirements: readonly string[];
}) {
  const { componentName, requirements } = params;
  const tests: string[] = [];

  if (requirements.includes('controlled')) {
    tests.push(`  it('supports the controlled open contract', () => {
    const { container, unmount } = render(
      <${componentName} open>Overlay content</${componentName}>
    );

    expect(container.textContent).toContain('Overlay content');
    unmount();
  });`);
  }

  if (requirements.includes('uncontrolled')) {
    tests.push(`  it('supports the uncontrolled defaultOpen contract', () => {
    const { container, unmount } = render(
      <${componentName} defaultOpen>Overlay content</${componentName}>
    );

    expect(container.textContent).toContain('Overlay content');
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
  parts = [],
}: TestTemplateParams) {
  const describeName = isNative ? `Native ${componentName}` : componentName;
  const contract = createBaselineTestContract({
    profile,
    control,
    capabilities,
    parts,
    isNative,
  });
  const contractComment = `// Baseline contract: ${contract.requirements.join(', ')}`;

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
    const accessibilityTests = renderFormControlAccessibilityTests({
      componentName,
      control,
      isNative,
    });
    const callbackName =
      control === 'boolean' ? 'onCheckedChange' : 'onValueChange';

    return `${contractComment}
import { afterEach, describe, expect, it, vi } from 'vitest';

import { render } from '../../test-utils/render';

import { ${componentName} } from './${componentName}';

afterEach(() => {
  document.body.innerHTML = '';
});

describe('${describeName}', () => {
  it('renders the declared ${control === 'boolean' ? 'boolean' : 'value'} state', () => {
    const { container, unmount } = render(
      <${componentName} ${control === 'boolean' ? 'defaultChecked' : "defaultValue='Example value'"} />
    );

    expect(container.firstChild).not.toBeNull();
    unmount();
  });

  it('exposes a state-change callback', () => {
    const ${callbackName} = vi.fn();
    const { container, unmount } = render(
      <${componentName} ${callbackName}={${callbackName}} />
    );

    expect(container.firstChild).not.toBeNull();
    unmount();
  });${contractTests}${stateTests}${accessibilityTests}
});
`;
  }

  if (profile === 'compound' || profile === 'overlay') {
    const interactionTests = renderCompoundInteractionTests({
      componentName,
      requirements: contract.requirements,
      isNative,
      parts,
    });
    const overlayStateTests =
      profile === 'overlay'
        ? renderOverlayStateTests({
            componentName,
            requirements: contract.requirements,
          })
        : '';

    return `${contractComment}
import { afterEach, describe, expect, it, vi } from 'vitest';

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
  });${interactionTests}${overlayStateTests}
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
