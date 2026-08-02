import { act } from 'react';

import { afterEach, describe, expect, it, vi } from 'vitest';

import { expectNoA11yViolations } from '../../test-utils/a11y';
import { render } from '../../test-utils/render';

import { Radio } from './Radio';

afterEach(() => {
  document.body.innerHTML = '';
});

describe('Radio', () => {
  it('renders standalone label, description, error and native input props', async () => {
    const { container, unmount } = render(
      <Radio
        id='email'
        name='contact'
        value='email'
        label='Email'
        description='Receive email updates.'
        error='Choose a contact method.'
        required
      />
    );

    await expectNoA11yViolations(container);

    const input = container.querySelector<HTMLInputElement>(
      'input[type="radio"]'
    );
    const label = container.querySelector('label');

    expect(input?.id).toBe('email');
    expect(input?.name).toBe('contact');
    expect(input?.value).toBe('email');
    expect(input?.required).toBe(true);
    expect(input?.getAttribute('aria-invalid')).toBe('true');
    expect(input?.getAttribute('aria-describedby')).toBe(
      'email-description email-error'
    );
    expect(label?.getAttribute('for')).toBe('email');
    expect(document.getElementById('email-description')?.textContent).toBe(
      'Receive email updates.'
    );
    expect(document.getElementById('email-error')?.textContent).toBe(
      'Choose a contact method.'
    );

    unmount();
  });

  it('supports uncontrolled and controlled standalone checked state', () => {
    const onCheckedChange = vi.fn();
    const { container, rerender, unmount } = render(
      <Radio value='email' label='Email' onCheckedChange={onCheckedChange} />
    );

    const input = container.querySelector<HTMLInputElement>(
      'input[type="radio"]'
    );

    expect(input?.checked).toBe(false);

    act(() => input?.click());

    expect(input?.checked).toBe(true);
    expect(onCheckedChange).toHaveBeenCalledWith(true);

    rerender(<Radio value='email' label='Email' checked={false} />);

    const controlledInput = container.querySelector<HTMLInputElement>(
      'input[type="radio"]'
    );

    expect(controlledInput?.checked).toBe(false);

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

    const input = container.querySelector<HTMLInputElement>(
      'input[type="radio"]'
    );

    act(() => input?.click());

    expect(input?.checked).toBe(false);
    expect(onCheckedChange).not.toHaveBeenCalled();

    unmount();
  });

  it('supports accessibility labels without a visible label', () => {
    const { container, unmount } = render(
      <Radio
        id='silent'
        value='silent'
        aria-label='Silent option'
        aria-describedby='external-hint'
      />
    );

    const input = container.querySelector<HTMLInputElement>(
      'input[type="radio"]'
    );

    expect(input?.getAttribute('aria-label')).toBe('Silent option');
    expect(input?.getAttribute('aria-describedby')).toBe('external-hint');
    expect(container.querySelector('label')?.textContent).toBe('');

    unmount();
  });

  it('renders custom label and description nodes and applies class props', () => {
    const { container, unmount } = render(
      <Radio
        id='custom'
        value='custom'
        label={<span data-testid='label'>Custom</span>}
        description={<span data-testid='description'>Custom hint</span>}
        className='root-class'
        wrapperClassName='wrapper-class'
        aria-describedby='external-hint'
      />
    );

    const root = container.firstElementChild;
    const wrapper = container.querySelector('label');
    const input = container.querySelector<HTMLInputElement>(
      'input[type="radio"]'
    );

    expect(root?.className).toContain('root-class');
    expect(wrapper?.className).toContain('wrapper-class');
    expect(container.querySelector('[data-testid="label"]')?.textContent).toBe(
      'Custom'
    );
    expect(
      container.querySelector('[data-testid="description"]')?.parentElement?.id
    ).toBe('custom-description');
    expect(input?.getAttribute('aria-describedby')).toBe(
      'custom-description external-hint'
    );

    unmount();
  });

  it('applies color and renders a custom selected indicator', () => {
    const { container, unmount } = render(
      <Radio
        value='security'
        label='Security alerts'
        color='success'
        checked
        icon={<span data-testid='custom-radio-indicator'>selected</span>}
      />
    );

    const root = container.firstElementChild;

    expect(root?.className).toContain('colorSuccess');
    expect(
      container.querySelector('[data-testid="custom-radio-indicator"]')
    ).not.toBeNull();

    unmount();
  });

  it('applies token-backed size and color classes', () => {
    const { container, unmount } = render(
      <Radio value='warning' label='Warning option' size='lg' color='warning' />
    );

    const root = container.firstElementChild;

    expect(root?.className).toContain('lg');
    expect(root?.className).toContain('colorWarning');

    unmount();
  });
});
