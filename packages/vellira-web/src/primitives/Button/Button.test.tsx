import { act, createRef } from 'react';
import { createRoot } from 'react-dom/client';

import { afterEach, describe, expect, it, vi } from 'vitest';

import { expectNoA11yViolations } from '../../test-utils/a11y';

import { Button } from './Button';

afterEach(() => {
  document.body.innerHTML = '';
});

describe('Button', () => {
  it('passes through standard button props and forwards ref', () => {
    const ref = createRef<HTMLButtonElement>();
    const container = document.createElement('div');
    document.body.append(container);
    const root = createRoot(container);

    act(() =>
      root.render(
        <Button
          ref={ref}
          id='save'
          data-testid='save-button'
          aria-label='Save changes'
          style={{ marginTop: 4 }}
        >
          Save
        </Button>
      )
    );

    const button = container.querySelector<HTMLButtonElement>('#save');

    expect(ref.current).toBe(button);
    expect(button?.dataset.testid).toBe('save-button');
    expect(button?.getAttribute('aria-label')).toBe('Save changes');
    expect(button?.style.marginTop).toBe('4px');

    act(() => root.unmount());
  });

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

  it('warns for icon-only buttons without an accessible name', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    const container = document.createElement('div');
    document.body.append(container);
    const root = createRoot(container);

    act(() =>
      root.render(
        <Button leftIcon={<span data-testid='icon' />} type='submit' />
      )
    );

    const button = container.querySelector<HTMLButtonElement>('button');

    expect(warn).toHaveBeenCalledWith(
      'Button: icon-only buttons must provide ariaLabel.'
    );
    expect(button?.type).toBe('submit');
    expect(button?.querySelector('[data-testid="icon"]')).not.toBeNull();

    act(() => root.unmount());
    warn.mockRestore();
  });
});
