import { act } from 'react';
import { createRoot } from 'react-dom/client';

import { afterEach, describe, expect, it, vi } from 'vitest';

import { expectNoA11yViolations } from '../../test-utils/a11y';

import { Button } from './Button';

afterEach(() => {
  document.body.innerHTML = '';
});

describe('Button', () => {
  it('calls onClick when enabled', async () => {
    const onClick = vi.fn();
    const container = document.createElement('div');
    document.body.append(container);
    const root = createRoot(container);

    act(() => root.render(<Button onClick={onClick}>Save</Button>));
    await expectNoA11yViolations(container);

    act(() => container.querySelector('button')?.click());

    expect(onClick).toHaveBeenCalledOnce();
    act(() => root.unmount());
  });
});
