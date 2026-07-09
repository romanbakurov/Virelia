import { act, createRef, useState } from 'react';

import type { ChangeEvent } from 'react';
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
        description='Use your work email.'
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
    expect(input?.getAttribute('aria-describedby')).toBe(
      'email-description email-error'
    );
    expect(document.getElementById('email-description')?.textContent).toBe(
      'Use your work email.'
    );
    expect(document.getElementById('email-error')?.textContent).toBe(
      'Email is required'
    );

    unmount();
  });

  it('handles changes, disabled state, and object refs', () => {
    const enabledValues: string[] = [];
    const enabledChange = vi.fn((event: ChangeEvent<HTMLInputElement>) => {
      enabledValues.push(event.target.value);
    });
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

    expect(enabledChange).toHaveBeenCalledTimes(1);
    expect(enabledValues).toEqual(['Roman']);

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

  it('passes standard input props and DOM event handlers through', () => {
    const focus = vi.fn();
    const blur = vi.fn();
    const keyDown = vi.fn();
    const mouseEnter = vi.fn();
    const mouseLeave = vi.fn();

    const { container, unmount } = render(
      <Input
        id='amount'
        label='Amount'
        value='10'
        aria-label='Transfer amount'
        aria-describedby='amount-hint'
        data-testid='amount-input'
        inputMode='decimal'
        pattern='[0-9]*'
        min={1}
        max={100}
        step={0.5}
        onFocus={focus}
        onBlur={blur}
        onKeyDown={keyDown}
        onMouseEnter={mouseEnter}
        onMouseLeave={mouseLeave}
      />
    );

    const input = container.querySelector<HTMLInputElement>('input');

    expect(input?.getAttribute('aria-label')).toBe('Transfer amount');
    expect(input?.getAttribute('aria-describedby')).toBe('amount-hint');
    expect(input?.getAttribute('data-testid')).toBe('amount-input');
    expect(input?.getAttribute('inputmode')).toBe('decimal');
    expect(input?.getAttribute('pattern')).toBe('[0-9]*');
    expect(input?.getAttribute('min')).toBe('1');
    expect(input?.getAttribute('max')).toBe('100');
    expect(input?.getAttribute('step')).toBe('0.5');

    act(() => {
      input?.focus();
      input?.dispatchEvent(
        new KeyboardEvent('keydown', { bubbles: true, key: 'Enter' })
      );
      input?.dispatchEvent(new MouseEvent('mouseover', { bubbles: true }));
      input?.dispatchEvent(new MouseEvent('mouseout', { bubbles: true }));
      input?.blur();
    });

    expect(focus).toHaveBeenCalledTimes(1);
    expect(keyDown).toHaveBeenCalledTimes(1);
    expect(mouseEnter).toHaveBeenCalledTimes(1);
    expect(mouseLeave).toHaveBeenCalledTimes(1);
    expect(blur).toHaveBeenCalledTimes(1);

    unmount();
  });

  it('connects generated description text without an error', () => {
    const { container, unmount } = render(
      <Input id='email' label='Email' value='' description='Optional hint.' />
    );

    const input = container.querySelector<HTMLInputElement>('input');

    expect(input?.getAttribute('aria-describedby')).toBe('email-description');
    expect(document.getElementById('email-description')?.textContent).toBe(
      'Optional hint.'
    );

    unmount();
  });

  it('merges external aria-describedby with generated description and error text', () => {
    const { container, unmount } = render(
      <Input
        id='email'
        label='Email'
        value=''
        description='Use your work email.'
        aria-describedby='email-hint'
        error='Email is required'
      />
    );

    const input = container.querySelector<HTMLInputElement>('input');

    expect(input?.getAttribute('aria-describedby')).toBe(
      'email-hint email-description email-error'
    );

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
    const changedValues: string[] = [];
    const change = vi.fn((event: ChangeEvent<HTMLInputElement>) => {
      changedValues.push(event.target.value);
    });
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

    expect(change).toHaveBeenCalledTimes(1);
    expect(changedValues).toEqual(['tokens']);
    expect(input?.value).toBe('tokens');

    unmount();
  });

  it('clears uncontrolled values and restores focus without emitting change', () => {
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

    expect(change).not.toHaveBeenCalled();
    expect(clear).toHaveBeenCalledTimes(1);
    expect(inputRef.current?.value).toBe('');
    expect(document.activeElement).toBe(inputRef.current);

    unmount();
  });

  it('lets controlled values clear through onClear', () => {
    const clear = vi.fn();

    const ControlledInput = () => {
      const [value, setValue] = useState('Clear me');

      return (
        <Input
          id='controlled-clearable'
          label='Controlled clearable'
          value={value}
          onChange={vi.fn()}
          onClear={() => {
            clear();
            setValue('');
          }}
          clearable
        />
      );
    };

    const { container, unmount } = render(<ControlledInput />);
    const input = container.querySelector<HTMLInputElement>('input');
    const clearButton = container.querySelector<HTMLButtonElement>(
      'button[aria-label="Clear input"]'
    );

    expect(input?.value).toBe('Clear me');
    expect(clearButton).not.toBeNull();

    act(() => {
      clearButton?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    });

    expect(clear).toHaveBeenCalledTimes(1);
    expect(input?.value).toBe('');
    expect(
      container.querySelector('button[aria-label="Clear input"]')
    ).toBeNull();

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
