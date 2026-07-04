import { afterEach, describe, expect, it } from 'vitest';

import { render } from '../../test-utils/render';

import { FormField } from './FormField';

afterEach(() => {
  document.body.innerHTML = '';
});

describe('Native FormField', () => {
  it('renders label, required marker, children and error', () => {
    const { container, unmount } = render(
      <FormField label='Email' required error='Email is required'>
        <span>Control</span>
      </FormField>
    );

    expect(container.textContent).toContain('Email');
    expect(container.textContent).toContain('*');
    expect(container.textContent).toContain('Control');
    expect(container.textContent).toContain('Email is required');

    unmount();
  });
});
