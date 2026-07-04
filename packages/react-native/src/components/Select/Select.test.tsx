import { act } from 'react';

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
});
