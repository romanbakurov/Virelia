import { act } from 'react';

import { afterEach, describe, expect, it, vi } from 'vitest';

import { render } from '../../test-utils/render';

import { Input } from './Input';

const TestIcon = ({
  color,
  size,
  testID,
}: {
  color?: string;
  size?: number;
  testID: string;
}) => (
  <span data-testid={testID} data-color={color} data-size={size}>
    icon
  </span>
);

afterEach(() => {
  document.body.innerHTML = '';
});

describe('Native Input', () => {
  it('renders input props and error text', () => {
    const { container, unmount } = render(
      <Input
        label='Email'
        value='hello@vellira.dev'
        placeholder='name@company.com'
        error='Email is required'
        type='email'
      />
    );

    const input = container.querySelector<HTMLInputElement>('input');

    expect(input?.value).toBe('hello@vellira.dev');
    expect(input?.placeholder).toBe('name@company.com');
    expect(container.textContent).toContain('Email is required');

    unmount();
  });

  it('maps password type to secure input', () => {
    const { container, unmount } = render(
      <Input label='Password' value='' type='password' />
    );

    expect(container.querySelector('input')?.type).toBe('password');

    unmount();
  });

  it('handles uncontrolled changes and native type mappings', () => {
    const change = vi.fn();
    const { container, unmount } = render(
      <Input
        label='Age'
        defaultValue='40'
        onChange={change}
        type='number'
        accessibilityHint='Numbers only'
      />
    );

    const input = container.querySelector<HTMLInputElement>('input');
    const valueSetter = Object.getOwnPropertyDescriptor(
      HTMLInputElement.prototype,
      'value'
    )?.set;

    expect(input?.inputMode).toBe('numeric');
    expect(input?.getAttribute('aria-label')).toBe('Age');

    act(() => {
      valueSetter?.call(input, '41');
      input?.dispatchEvent(new Event('input', { bubbles: true }));
    });

    expect(change).toHaveBeenCalledWith('41');
    expect(input?.value).toBe('41');

    unmount();
  });

  it('renders adornments with resolved icon color and size', () => {
    const { container, unmount } = render(
      <Input
        label='Search'
        value='Theme'
        leftAdornment={<TestIcon testID='left-icon' />}
        rightAdornment={<TestIcon testID='right-icon' />}
        leftAdornmentTone='primary'
        rightAdornmentTone='success'
        iconSize={24}
      />
    );

    const leftIcon = container.querySelector('[data-testid="left-icon"]');
    const rightIcon = container.querySelector('[data-testid="right-icon"]');

    expect(leftIcon?.getAttribute('data-color')).toBeTruthy();
    expect(rightIcon?.getAttribute('data-color')).toBeTruthy();
    expect(leftIcon?.getAttribute('data-size')).toBe('24');
    expect(rightIcon?.getAttribute('data-size')).toBe('24');

    unmount();
  });

  it('clears values and hides right adornment while clear action is shown', () => {
    const change = vi.fn();
    const clear = vi.fn();
    const { container, unmount } = render(
      <Input
        label='Clearable'
        defaultValue='Clear me'
        onChange={change}
        onClear={clear}
        clearable
        clearIcon={<TestIcon testID='clear-icon' />}
        rightAdornment={<TestIcon testID='right-icon' />}
      />
    );

    const clearButton = container.querySelector<HTMLButtonElement>(
      'button[aria-label="Clear input"]'
    );

    expect(clearButton).not.toBeNull();
    expect(
      container.querySelector('[data-testid="clear-icon"]')
    ).not.toBeNull();
    expect(container.querySelector('[data-testid="right-icon"]')).toBeNull();

    act(() => {
      clearButton?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    });

    expect(change).toHaveBeenCalledWith('');
    expect(clear).toHaveBeenCalledTimes(1);

    unmount();
  });

  it('updates focus state and calls focus handlers', () => {
    const focus = vi.fn();
    const blur = vi.fn();
    const { container, unmount } = render(
      <Input
        label='Focused'
        value='value'
        error='Invalid value'
        onFocus={focus}
        onBlur={blur}
      />
    );

    const input = container.querySelector<HTMLInputElement>('input');

    act(() => {
      input?.dispatchEvent(new FocusEvent('focusin', { bubbles: true }));
    });

    expect(focus).toHaveBeenCalledTimes(1);

    act(() => {
      input?.dispatchEvent(new FocusEvent('focusout', { bubbles: true }));
    });

    expect(blur).toHaveBeenCalledTimes(1);

    unmount();
  });

  it('keeps clear action hidden when disabled or read-only', () => {
    const { container, rerender, unmount } = render(
      <Input label='Disabled' value='value' disabled clearable />
    );

    expect(
      container.querySelector('button[aria-label="Clear input"]')
    ).toBeNull();

    rerender(<Input label='Read only' value='value' readOnly clearable />);

    expect(
      container.querySelector('button[aria-label="Clear input"]')
    ).toBeNull();

    unmount();
  });
});
