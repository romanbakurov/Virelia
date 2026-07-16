import { act } from 'react';

import { afterEach, describe, expect, it, vi } from 'vitest';

import { render } from '../../test-utils/render';

import { Radio } from './Radio';

afterEach(() => {
  document.body.innerHTML = '';
});

describe('Native Radio', () => {
  it('renders standalone accessibility state, label, description and error', () => {
    const { container, unmount } = render(
      <Radio
        value='email'
        label='Email'
        description='Receive email updates.'
        error='Choose a contact method.'
        required
      />
    );

    const radio = container.querySelector<HTMLButtonElement>('[role="radio"]');
    const error = container.querySelector('[aria-live="polite"]');

    expect(radio?.getAttribute('aria-label')).toBe('Email');
    expect(radio?.getAttribute('aria-checked')).toBe('false');
    expect(radio?.getAttribute('aria-disabled')).toBe('false');
    expect(radio?.textContent).toContain('Email');
    expect(radio?.textContent).toContain('Receive email updates.');
    expect(radio?.getAttribute('aria-description')).toBe(
      'Receive email updates. Required. Choose a contact method.'
    );
    expect(error?.textContent).toBe('Choose a contact method.');

    unmount();
  });

  it('supports uncontrolled and controlled standalone checked state', () => {
    const onCheckedChange = vi.fn();
    const { container, rerender, unmount } = render(
      <Radio value='email' label='Email' onCheckedChange={onCheckedChange} />
    );

    const radio = container.querySelector<HTMLButtonElement>('[role="radio"]');

    expect(radio?.getAttribute('aria-checked')).toBe('false');

    act(() => radio?.click());

    expect(radio?.getAttribute('aria-checked')).toBe('true');
    expect(onCheckedChange).toHaveBeenCalledWith(true);

    rerender(<Radio value='email' label='Email' checked={false} />);

    const controlledRadio =
      container.querySelector<HTMLButtonElement>('[role="radio"]');

    expect(controlledRadio?.getAttribute('aria-checked')).toBe('false');

    unmount();
  });

  it('does not change or fire callbacks when disabled', () => {
    const onCheckedChange = vi.fn();
    const { container, unmount } = render(
      <Radio
        value='email'
        label='Email'
        disabled
        onCheckedChange={onCheckedChange}
      />
    );

    const radio = container.querySelector<HTMLButtonElement>('[role="radio"]');

    act(() => radio?.click());

    expect(radio?.getAttribute('aria-disabled')).toBe('true');
    expect(radio?.getAttribute('aria-checked')).toBe('false');
    expect(onCheckedChange).not.toHaveBeenCalled();

    unmount();
  });

  it('uses accessibilityLabel for custom labels and applies style props', () => {
    const { container, unmount } = render(
      <Radio
        value='custom'
        label={<span data-testid='custom-label'>Custom visual label</span>}
        description={
          <span data-testid='custom-description'>Custom visual hint</span>
        }
        accessibilityLabel='Custom'
        accessibilityHint='Custom hint'
        containerStyle={{ maxWidth: 320 }}
        style={{ marginTop: 4 }}
        error='Custom error.'
        errorStyle={{ textDecorationLine: 'underline' }}
      />
    );

    const root = container.firstElementChild as HTMLElement | null;
    const radio = container.querySelector<HTMLButtonElement>('[role="radio"]');
    const error = container.querySelector<HTMLElement>('[aria-live="polite"]');

    expect(root?.style.maxWidth).toBe('320px');
    expect(radio?.getAttribute('aria-label')).toBe('Custom');
    expect(radio?.getAttribute('aria-description')).toBe('Custom hint');
    expect(radio?.style.marginTop).toBe('4px');
    expect(
      container.querySelector('[data-testid="custom-label"]')
    ).not.toBeNull();
    expect(
      container.querySelector('[data-testid="custom-description"]')
    ).not.toBeNull();
    expect(error?.style.textDecorationLine).toBe('underline');

    unmount();
  });

  it('renders a custom selected indicator and accepts color', () => {
    const { container, unmount } = render(
      <Radio
        value='security'
        label='Security alerts'
        color='success'
        checked
        icon={<span data-testid='native-custom-radio-indicator'>selected</span>}
      />
    );

    expect(
      container.querySelector('[data-testid="native-custom-radio-indicator"]')
    ).not.toBeNull();

    unmount();
  });
});
