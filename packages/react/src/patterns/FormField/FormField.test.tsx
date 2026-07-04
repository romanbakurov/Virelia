import { afterEach, describe, expect, it } from 'vitest';

import { render } from '../../test-utils/render';

import { FormField } from './FormField';

afterEach(() => {
  document.body.innerHTML = '';
});

describe('FormField', () => {
  it('renders label, required marker and alert error', () => {
    const { container, unmount } = render(
      <FormField id='name' label='Name' required error='Name is required'>
        <input id='name' />
      </FormField>
    );

    const label = container.querySelector('label');
    const alert = container.querySelector('[role="alert"]');

    expect(label?.getAttribute('for')).toBe('name');
    expect(label?.textContent).toContain('Name');
    expect(label?.textContent).toContain('*');
    expect(alert?.id).toBe('name-error');
    expect(alert?.textContent).toBe('Name is required');

    unmount();
  });
});
