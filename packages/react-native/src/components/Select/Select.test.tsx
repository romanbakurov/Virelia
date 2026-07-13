import { act } from 'react';

import { Text } from 'react-native';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { render } from '../../test-utils/render';

import { Select } from './Select';

const options = [
  { label: 'France', value: 'fr' },
  { label: 'Germany', value: 'de', disabled: true },
  { label: 'Spain', value: 'es' },
];

const getButtonByText = (text: string) =>
  Array.from(document.body.querySelectorAll<HTMLButtonElement>('button')).find(
    (button) => button.textContent === text
  );

const getPickerBackdrop = () =>
  document.body.querySelector<HTMLButtonElement>(
    '[data-testid="native-modal"] button'
  );

afterEach(() => {
  document.body.innerHTML = '';
});

describe('Native Select', () => {
  it('opens options and selects a value after confirmation', () => {
    const onChange = vi.fn();

    const { container, unmount } = render(
      <Select label='Country' options={options} onChange={onChange} />
    );

    const trigger =
      container.querySelector<HTMLButtonElement>('[role="button"]');

    act(() => {
      trigger?.click();
    });

    expect(trigger?.getAttribute('aria-expanded')).toBe('true');

    const option = getButtonByText('France');

    expect(option).toBeTruthy();

    act(() => {
      option?.click();
    });

    expect(onChange).not.toHaveBeenCalled();

    const doneButton = getButtonByText('Done');

    expect(doneButton).toBeTruthy();

    act(() => {
      doneButton?.click();
    });

    expect(onChange).toHaveBeenCalledWith('fr');
    expect(container.textContent).toContain('France');
    expect(trigger?.getAttribute('aria-expanded')).toBe('false');

    unmount();
  });

  it('ignores disabled options and closes without change on cancel', () => {
    const onChange = vi.fn();

    const { container, unmount } = render(
      <Select
        label='Country'
        options={options}
        defaultValue='es'
        onChange={onChange}
      />
    );

    const trigger =
      container.querySelector<HTMLButtonElement>('[role="button"]');

    act(() => {
      trigger?.click();
    });

    const disabledOption = getButtonByText('Germany - unavailable');
    const cancelButton = getButtonByText('Cancel');

    expect(disabledOption?.disabled).toBe(true);

    act(() => {
      disabledOption?.click();
      cancelButton?.click();
    });

    expect(onChange).not.toHaveBeenCalled();
    expect(container.textContent).toContain('Spain');
    expect(trigger?.getAttribute('aria-expanded')).toBe('false');

    unmount();
  });

  it('closes from the backdrop without committing a draft value', () => {
    const onChange = vi.fn();

    const { container, unmount } = render(
      <Select
        label='Country'
        options={options}
        defaultValue='es'
        onChange={onChange}
      />
    );

    const trigger =
      container.querySelector<HTMLButtonElement>('[role="button"]');

    act(() => {
      trigger?.click();
    });

    act(() => {
      getButtonByText('France')?.click();
    });

    expect(onChange).not.toHaveBeenCalled();

    act(() => {
      getPickerBackdrop()?.click();
    });

    expect(onChange).not.toHaveBeenCalled();
    expect(container.textContent).toContain('Spain');
    expect(trigger?.getAttribute('aria-expanded')).toBe('false');
    expect(document.body.textContent).not.toContain('Done');

    unmount();
  });

  it('resets the picker draft to the latest controlled value when reopened', () => {
    const onChange = vi.fn();

    const { container, rerender, unmount } = render(
      <Select
        label='Country'
        options={options}
        value='fr'
        onChange={onChange}
      />
    );

    expect(container.textContent).toContain('France');

    const trigger =
      container.querySelector<HTMLButtonElement>('[role="button"]');

    act(() => {
      trigger?.click();
    });

    rerender(
      <Select
        label='Country'
        options={options}
        value='es'
        onChange={onChange}
      />
    );

    expect(container.textContent).toContain('Spain');

    act(() => {
      getButtonByText('Cancel')?.click();
    });

    expect(onChange).not.toHaveBeenCalled();
    expect(trigger?.getAttribute('aria-expanded')).toBe('false');

    act(() => {
      trigger?.click();
    });

    act(() => {
      getButtonByText('Done')?.click();
    });

    expect(onChange).toHaveBeenCalledWith('es');
    expect(trigger?.getAttribute('aria-expanded')).toBe('false');

    unmount();
  });

  it('does not open when disabled', () => {
    const { container, unmount } = render(
      <Select label='Country' options={options} disabled error='Required' />
    );

    const trigger =
      container.querySelector<HTMLButtonElement>('[role="button"]');

    act(() => {
      trigger?.click();
    });

    expect(trigger?.getAttribute('aria-expanded')).toBe('false');
    expect(document.body.textContent).not.toContain('Cancel');
    expect(container.textContent).toContain('Required');

    unmount();
  });

  it('supports accessibility label and required/error hints', () => {
    const { container, rerender, unmount } = render(
      <Select
        label='Country'
        accessibilityLabel='Billing country'
        options={options}
        required
      />
    );

    const trigger =
      container.querySelector<HTMLButtonElement>('[role="button"]');

    expect(trigger?.getAttribute('aria-label')).toBe('Billing country');
    expect(trigger?.getAttribute('aria-description')).toBe(
      'Required. Opens a picker'
    );

    rerender(
      <Select
        label='Country'
        accessibilityLabel='Billing country'
        accessibilityHint='Choose the country used for billing'
        options={options}
        error='Country is required'
      />
    );

    expect(trigger?.getAttribute('aria-description')).toBe(
      'Choose the country used for billing'
    );

    unmount();
  });

  it('supports error content and style props', () => {
    const { container, unmount } = render(
      <Select
        label='Country'
        options={options}
        error={<Text testID='custom-error'>Required</Text>}
        size='lg'
        style={{ maxWidth: 360 }}
        triggerStyle={{ maxWidth: 300 }}
        textStyle={{ fontWeight: '700' }}
        pickerStyle={{ minHeight: 160 }}
      />
    );

    const field = container.firstElementChild as HTMLElement | null;
    const trigger =
      container.querySelector<HTMLButtonElement>('[role="button"]');
    const triggerText = trigger?.querySelector('span');

    expect(field?.style.maxWidth).toBe('360px');
    expect(trigger?.style.minHeight).toBe('52px');
    expect(trigger?.style.maxWidth).toBe('300px');
    expect(triggerText?.style.fontSize).toBe('20px');
    expect(triggerText?.style.lineHeight).toBe('28');
    expect(triggerText?.style.fontWeight).toBe('700');
    expect(container.textContent).toContain('Required');
    expect(
      container.querySelector('[data-testid="custom-error"]')
    ).toBeTruthy();

    act(() => {
      trigger?.click();
    });

    const picker = document.body.querySelector<HTMLElement>(
      '[data-testid="native-picker"]'
    );

    expect(picker?.style.minHeight).toBe('160px');

    unmount();
  });
});
