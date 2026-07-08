import { act, createRef } from 'react';

import { afterEach, describe, expect, it, vi } from 'vitest';

import { expectNoA11yViolations } from '../../test-utils/a11y';
import { render } from '../../test-utils/render';

import { Input } from './Input';

afterEach(() => {
  document.body.innerHTML = '';
  vi.unstubAllGlobals();
});

describe('Input', () => {
  it('renders input props and connects error text', async () => {
    const { container, unmount } = render(
      <Input
        id='email'
        label='Email'
        value='hello@vellira.dev'
        placeholder='name@company.com'
        error='Email is required'
        type='email'
      />
    );

    await expectNoA11yViolations(container);

    const input = container.querySelector<HTMLInputElement>('input');

    expect(input?.value).toBe('hello@vellira.dev');
    expect(input?.type).toBe('email');
    expect(input?.placeholder).toBe('name@company.com');
    expect(input?.getAttribute('aria-invalid')).toBe('true');
    expect(input?.getAttribute('aria-describedby')).toBe('email-error');
    expect(document.getElementById('email-error')?.textContent).toBe(
      'Email is required'
    );

    unmount();
  });

  it('handles changes, disabled state, and object refs', () => {
    const enabledChange = vi.fn();
    const { container: enabledContainer, unmount: unmountEnabled } = render(
      <Input id='nickname' label='Nickname' value='' onChange={enabledChange} />
    );
    const enabledInput =
      enabledContainer.querySelector<HTMLInputElement>('input');
    const valueSetter = Object.getOwnPropertyDescriptor(
      HTMLInputElement.prototype,
      'value'
    )?.set;

    act(() => {
      valueSetter?.call(enabledInput, 'Roman');
      enabledInput?.dispatchEvent(new InputEvent('input', { bubbles: true }));
      enabledInput?.dispatchEvent(new Event('change', { bubbles: true }));
    });

    expect(enabledChange).toHaveBeenCalledWith('Roman');

    unmountEnabled();

    const disabledChange = vi.fn();
    const inputRef = { current: null as HTMLInputElement | null };
    const { container, unmount } = render(
      <Input
        ref={inputRef}
        id='name'
        label='Name'
        value=''
        onChange={disabledChange}
        required
        disabled
        autoComplete='name'
      />
    );

    const input = container.querySelector<HTMLInputElement>('input');

    expect(inputRef.current).toBe(input);
    expect(input?.required).toBe(true);
    expect(input?.disabled).toBe(true);
    expect(input?.getAttribute('autocomplete')).toBe('name');

    act(() => {
      input?.dispatchEvent(
        new Event('change', {
          bubbles: true,
        })
      );
    });

    expect(disabledChange).not.toHaveBeenCalled();

    unmount();
  });

  it('shows overflow tooltip only while overflowing valued input is hovered', () => {
    vi.stubGlobal('ResizeObserver', undefined);

    const { container, unmount } = render(
      <Input
        id='token'
        label='Token'
        value='very-long-token-value'
        showOverflowTooltip
      />
    );

    const input = container.querySelector<HTMLInputElement>('input');

    Object.defineProperty(input, 'scrollWidth', {
      configurable: true,
      value: 240,
    });
    Object.defineProperty(input, 'clientWidth', {
      configurable: true,
      value: 80,
    });

    act(() => {
      window.dispatchEvent(new Event('resize'));
    });
    act(() => {
      input?.dispatchEvent(new MouseEvent('mouseover', { bubbles: true }));
    });

    expect(container.querySelector('[role="tooltip"]')?.textContent).toBe(
      'very-long-token-value'
    );

    act(() => {
      input?.dispatchEvent(new MouseEvent('mouseout', { bubbles: true }));
    });

    expect(container.querySelector('[role="tooltip"]')).toBeNull();

    unmount();
  });

  it('keeps overflow tooltip hidden for empty or fitting values', () => {
    const { container, unmount, rerender } = render(
      <Input id='code' label='Code' value='' showOverflowTooltip />
    );

    const input = container.querySelector<HTMLInputElement>('input');

    Object.defineProperty(input, 'scrollWidth', {
      configurable: true,
      value: 80,
    });
    Object.defineProperty(input, 'clientWidth', {
      configurable: true,
      value: 160,
    });

    act(() => {
      window.dispatchEvent(new Event('resize'));
    });
    act(() => {
      input?.dispatchEvent(new MouseEvent('mouseover', { bubbles: true }));
    });

    expect(container.querySelector('[role="tooltip"]')).toBeNull();

    rerender(
      <Input id='code' label='Code' value='short' showOverflowTooltip />
    );

    act(() => {
      input?.dispatchEvent(new MouseEvent('mouseover', { bubbles: true }));
    });

    expect(container.querySelector('[role="tooltip"]')).toBeNull();

    unmount();
  });

  it('supports uncontrolled changes, function refs, and adornments', () => {
    const change = vi.fn();
    const ref = vi.fn();
    const { container, unmount } = render(
      <Input
        ref={ref}
        id='search'
        label='Search'
        defaultValue='theme'
        onChange={change}
        leftAdornment={<span data-testid='left-icon'>L</span>}
        rightAdornment={<span data-testid='right-icon'>R</span>}
        leftAdornmentTone='primary'
        rightAdornmentTone='success'
      />
    );

    const input = container.querySelector<HTMLInputElement>('input');
    const valueSetter = Object.getOwnPropertyDescriptor(
      HTMLInputElement.prototype,
      'value'
    )?.set;

    expect(ref).toHaveBeenCalledWith(input);
    expect(input?.value).toBe('theme');
    expect(container.querySelector('[data-testid="left-icon"]')).not.toBeNull();
    expect(
      container.querySelector('[data-testid="right-icon"]')
    ).not.toBeNull();

    act(() => {
      valueSetter?.call(input, 'tokens');
      input?.dispatchEvent(new InputEvent('input', { bubbles: true }));
      input?.dispatchEvent(new Event('change', { bubbles: true }));
    });

    expect(change).toHaveBeenCalledWith('tokens');
    expect(input?.value).toBe('tokens');

    unmount();
  });

  it('clears uncontrolled values and restores focus', () => {
    const change = vi.fn();
    const clear = vi.fn();
    const inputRef = createRef<HTMLInputElement>();
    const { container, unmount } = render(
      <Input
        ref={inputRef}
        id='clearable'
        label='Clearable'
        defaultValue='Clear me'
        onChange={change}
        onClear={clear}
        clearable
        clearIcon={<span data-testid='clear-icon'>clear</span>}
      />
    );

    const clearButton = container.querySelector<HTMLButtonElement>(
      'button[aria-label="Clear input"]'
    );

    expect(clearButton).not.toBeNull();
    expect(
      container.querySelector('[data-testid="clear-icon"]')
    ).not.toBeNull();

    act(() => {
      clearButton?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    });

    expect(change).toHaveBeenCalledWith('');
    expect(clear).toHaveBeenCalledTimes(1);
    expect(inputRef.current?.value).toBe('');
    expect(document.activeElement).toBe(inputRef.current);

    unmount();
  });

  it('hides the clear action for controlled empty, disabled, and read-only inputs', () => {
    const { container, rerender, unmount } = render(
      <Input id='empty' label='Empty' value='' clearable />
    );

    expect(
      container.querySelector('button[aria-label="Clear input"]')
    ).toBeNull();

    rerender(
      <Input id='disabled' label='Disabled' value='value' disabled clearable />
    );

    expect(
      container.querySelector('button[aria-label="Clear input"]')
    ).toBeNull();

    rerender(
      <Input id='readonly' label='Read only' value='value' readOnly clearable />
    );

    expect(
      container.querySelector('button[aria-label="Clear input"]')
    ).toBeNull();

    unmount();
  });
});
