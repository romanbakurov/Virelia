import { act } from 'react';

import { afterEach, describe, expect, it, vi } from 'vitest';

import { expectNoA11yViolations } from '../../test-utils/a11y';
import { render } from '../../test-utils/render';

import { Checkbox } from './Checkbox';

afterEach(() => {
  document.body.innerHTML = '';
  vi.restoreAllMocks();
});

describe('Checkbox', () => {
  it('toggles its uncontrolled value', async () => {
    const { container, unmount } = render(<Checkbox label='Accept' />);
    await expectNoA11yViolations(container);

    const checkbox = container.querySelector<HTMLInputElement>(
      'input[type="checkbox"]'
    );

    expect(checkbox?.checked).toBe(false);
    act(() => checkbox?.click());
    expect(checkbox?.checked).toBe(true);
    unmount();
  });

  it('keeps controlled value until checked changes', () => {
    const onCheckedChange = vi.fn();
    const { container, rerender, unmount } = render(
      <Checkbox
        label='Accept'
        checked={false}
        onCheckedChange={onCheckedChange}
      />
    );

    const checkbox = container.querySelector<HTMLInputElement>(
      'input[type="checkbox"]'
    );

    act(() => checkbox?.click());

    expect(onCheckedChange).toHaveBeenCalledWith(true);
    expect(checkbox?.checked).toBe(false);

    rerender(
      <Checkbox label='Accept' checked onCheckedChange={onCheckedChange} />
    );

    expect(checkbox?.checked).toBe(true);
    unmount();
  });

  it('marks disabled state and ignores changes', () => {
    const onCheckedChange = vi.fn();
    const { container, unmount } = render(
      <Checkbox
        label='Accept'
        disabled
        defaultChecked
        onCheckedChange={onCheckedChange}
      />
    );

    const checkbox = container.querySelector<HTMLInputElement>(
      'input[type="checkbox"]'
    );

    expect(checkbox?.disabled).toBe(true);
    expect(checkbox?.checked).toBe(true);

    act(() => checkbox?.click());

    expect(onCheckedChange).not.toHaveBeenCalled();
    expect(checkbox?.checked).toBe(true);
    unmount();
  });

  it('announces the indeterminate state as mixed', () => {
    const { container, unmount } = render(
      <Checkbox label='Accept' indeterminate />
    );

    const checkbox = container.querySelector<HTMLInputElement>(
      'input[type="checkbox"]'
    );

    expect(checkbox?.getAttribute('aria-checked')).toBe('mixed');
    expect(checkbox?.indeterminate).toBe(true);
    expect(
      container
        .querySelector('[aria-hidden="true"]')
        ?.className.includes('indeterminate')
    ).toBe(true);
    unmount();
  });

  it('connects description and error text through aria-describedby', () => {
    const { container, unmount } = render(
      <Checkbox
        id='terms'
        label='Terms'
        description='Required to continue.'
        error='Accept terms first.'
        aria-describedby='terms-hint'
      />
    );

    const checkbox = container.querySelector<HTMLInputElement>(
      'input[type="checkbox"]'
    );

    expect(checkbox?.getAttribute('aria-invalid')).toBe('true');
    expect(checkbox?.getAttribute('aria-describedby')).toBe(
      'terms-hint terms-description terms-error'
    );
    expect(document.getElementById('terms-description')?.textContent).toBe(
      'Required to continue.'
    );
    expect(document.getElementById('terms-description')?.className).toContain(
      'descriptionText'
    );
    expect(document.getElementById('terms-error')?.textContent).toBe(
      'Accept terms first.'
    );

    unmount();
  });

  it('marks required state visually and on the input', () => {
    const { container, unmount } = render(<Checkbox label='Accept' required />);

    const checkbox = container.querySelector<HTMLInputElement>(
      'input[type="checkbox"]'
    );

    expect(checkbox?.required).toBe(true);
    expect(container.textContent).toContain('*');
    unmount();
  });

  it('warns when no accessible label is provided', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    const { unmount } = render(<Checkbox />);

    expect(warn).toHaveBeenCalledWith(
      'Checkbox: an accessible label must be provided through label, aria-label, or aria-labelledby.'
    );
    unmount();
  });

  it('applies size classes used by the checkbox and error layout', () => {
    const { container, unmount } = render(
      <Checkbox id='terms' label='Terms' size='sm' error='Required.' />
    );

    const root = container.firstElementChild;
    const wrapper = container.querySelector('label');
    const error = document.getElementById('terms-error');

    expect(root?.className).toContain('containerSm');
    expect(wrapper?.className).toContain('wrapperSm');
    expect(error?.className).toContain('errorText');
    unmount();
  });

  it('applies root and wrapper class names without styling the hidden input', () => {
    const { container, unmount } = render(
      <Checkbox
        label='Accept'
        className='custom-root'
        wrapperClassName='custom-wrapper'
      />
    );

    const checkbox = container.querySelector<HTMLInputElement>(
      'input[type="checkbox"]'
    );
    const wrapper = container.querySelector('label');

    expect(container.firstElementChild?.classList.contains('custom-root')).toBe(
      true
    );
    expect(wrapper?.classList.contains('custom-wrapper')).toBe(true);
    expect(checkbox?.classList.contains('custom-root')).toBe(false);
    expect(checkbox?.classList.contains('custom-wrapper')).toBe(false);
    unmount();
  });

  it('applies color and label position classes', () => {
    const { container, unmount } = render(
      <Checkbox label='Accept' color='success' labelPosition='start' />
    );

    const root = container.firstElementChild;
    const wrapper = container.querySelector('label');

    expect(root?.className).toContain('containerLabelStart');
    expect(wrapper?.className).toContain('colorSuccess');
    expect(wrapper?.className).toContain('labelStart');
    unmount();
  });

  it('renders custom checked and indeterminate icons', () => {
    const { container, rerender, unmount } = render(
      <Checkbox
        label='Accept'
        checked
        icon={<span data-testid='custom-check'>ok</span>}
      />
    );

    expect(container.querySelector('[data-testid="custom-check"]')).not.toBe(
      null
    );

    rerender(
      <Checkbox
        label='Accept'
        indeterminate
        indeterminateIcon={<span data-testid='custom-mixed'>mixed</span>}
      />
    );

    expect(container.querySelector('[data-testid="custom-mixed"]')).not.toBe(
      null
    );
    unmount();
  });
});
