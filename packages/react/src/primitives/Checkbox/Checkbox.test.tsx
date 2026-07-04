import { act } from 'react';
import { createRoot } from 'react-dom/client';

import { afterEach, describe, expect, it } from 'vitest';

import { expectNoA11yViolations } from '../../test-utils/a11y';

import { Checkbox } from './Checkbox';

afterEach(() => {
  document.body.innerHTML = '';
});

describe('Checkbox', () => {
  it('toggles its uncontrolled value', async () => {
    const container = document.createElement('div');
    document.body.append(container);
    const root = createRoot(container);

    act(() => root.render(<Checkbox label='Accept' />));
    await expectNoA11yViolations(container);

    const checkbox = container.querySelector<HTMLInputElement>(
      'input[type="checkbox"]'
    );

    expect(checkbox?.checked).toBe(false);
    act(() => checkbox?.click());
    expect(checkbox?.checked).toBe(true);
    act(() => root.unmount());
  });
});
