import { act } from 'react';

import { afterEach, describe, expect, it, vi } from 'vitest';

import { render } from '../../test-utils/render';
import { nativeThemes } from '../../theme';

import { Input } from './Input';

const hexToRgb = (hex: string) => {
  const value = hex.replace('#', '');
  const red = Number.parseInt(value.slice(0, 2), 16);
  const green = Number.parseInt(value.slice(2, 4), 16);
  const blue = Number.parseInt(value.slice(4, 6), 16);

  return `rgb(${red}, ${green}, ${blue})`;
};

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
        description='Use your work email.'
        value='hello@vellira.dev'
        placeholder='name@company.com'
        error='Email is required'
        type='email'
      />
    );

    const input = container.querySelector<HTMLInputElement>('input');

    expect(input?.value).toBe('hello@vellira.dev');
    expect(input?.placeholder).toBe('name@company.com');
    expect(container.textContent).toContain('Use your work email.');
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

  it('maps semantic input types to native keyboard props', () => {
    const expectedKeyboardTypeByType = {
      text: 'default',
      email: 'email-address',
      password: 'default',
      number: 'numeric',
      tel: 'phone-pad',
      url: 'url',
      search: 'web-search',
    } as const;

    for (const [type, keyboardType] of Object.entries(
      expectedKeyboardTypeByType
    )) {
      const { container, unmount } = render(
        <Input
          label={type}
          type={type as keyof typeof expectedKeyboardTypeByType}
          value=''
        />
      );

      expect(container.querySelector('input')?.dataset.keyboardType).toBe(
        keyboardType
      );

      unmount();
    }
  });

  it('lets explicit keyboardType override semantic type mapping', () => {
    const { container, unmount } = render(
      <Input label='Email code' type='email' keyboardType='numeric' value='' />
    );

    const input = container.querySelector<HTMLInputElement>('input');

    expect(input?.dataset.keyboardType).toBe('numeric');
    expect(input?.inputMode).toBe('numeric');

    unmount();
  });

  it('renders adornments with resolved icon color and size', () => {
    const theme = nativeThemes.light;
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

    expect(leftIcon?.getAttribute('data-color')).toBe(
      theme.components.input.icon.primary
    );
    expect(rightIcon?.getAttribute('data-color')).toBe(
      theme.components.input.icon.success
    );
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
    expect(container.querySelector('input')?.value).toBe('');

    unmount();
  });

  it('keeps clear action hidden and input non-editable when disabled or read-only', () => {
    const { container, rerender, unmount } = render(
      <Input label='Disabled' value='value' disabled clearable />
    );

    expect(container.querySelector('input')?.disabled).toBe(true);
    expect(
      container.querySelector('input')?.getAttribute('aria-disabled')
    ).toBe('true');
    expect(
      container.querySelector('button[aria-label="Clear input"]')
    ).toBeNull();

    rerender(<Input label='Read only' value='value' readOnly clearable />);

    expect(container.querySelector('input')?.disabled).toBe(true);
    expect(
      container.querySelector('input')?.getAttribute('aria-disabled')
    ).toBe('false');
    expect(
      container.querySelector('button[aria-label="Clear input"]')
    ).toBeNull();

    unmount();
  });

  it('uses label as accessibilityLabel fallback and allows overrides', () => {
    const { container, rerender, unmount } = render(
      <Input label='Email' value='' />
    );

    expect(container.querySelector('input')?.getAttribute('aria-label')).toBe(
      'Email'
    );

    rerender(<Input label='Email' accessibilityLabel='Work email' value='' />);

    expect(container.querySelector('input')?.getAttribute('aria-label')).toBe(
      'Work email'
    );

    unmount();
  });

  it('updates focus state, error styles, and calls focus handlers', () => {
    const theme = nativeThemes.light;
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

    expect(input?.style.borderColor).toBe(
      hexToRgb(theme.components.input.error.border)
    );

    act(() => {
      input?.dispatchEvent(new FocusEvent('focusin', { bubbles: true }));
    });

    expect(focus).toHaveBeenCalledTimes(1);
    expect(input?.style.borderColor).toBe(
      hexToRgb(theme.components.input.error.border)
    );

    act(() => {
      input?.dispatchEvent(new FocusEvent('focusout', { bubbles: true }));
    });

    expect(blur).toHaveBeenCalledTimes(1);

    unmount();
  });

  it('applies focus, read-only, disabled, and custom styles', () => {
    const theme = nativeThemes.light;
    const { container, rerender, unmount } = render(
      <Input
        label='Styled'
        value='value'
        containerStyle={{ width: 320 }}
        inputStyle={{ minHeight: 64 }}
        testID='styled-input'
      />
    );

    const root = container.firstElementChild as HTMLElement | null;
    const input = container.querySelector<HTMLInputElement>(
      '[data-testid="styled-input"]'
    );

    expect(root?.style.width).toBe('320px');
    expect(input?.style.minHeight).toBe('64px');

    act(() => {
      input?.dispatchEvent(new FocusEvent('focusin', { bubbles: true }));
    });

    expect(input?.style.borderColor).toBe(
      hexToRgb(theme.components.input.focus.border)
    );

    rerender(<Input label='Read only' value='value' readOnly />);

    const readOnlyInput = container.querySelector<HTMLInputElement>('input');

    expect(readOnlyInput?.style.backgroundColor).toBe(
      hexToRgb(theme.components.input.readOnly.bg)
    );
    expect(readOnlyInput?.style.borderColor).toBe(
      hexToRgb(theme.components.input.readOnly.border)
    );

    rerender(<Input label='Disabled' value='value' disabled />);

    const disabledInput = container.querySelector<HTMLInputElement>('input');

    expect(disabledInput?.style.backgroundColor).toBe(
      hexToRgb(theme.components.input.disabled.bg)
    );
    expect(disabledInput?.style.borderColor).toBe(
      hexToRgb(theme.components.input.disabled.border)
    );

    unmount();
  });
});
