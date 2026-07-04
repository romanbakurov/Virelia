import { act } from 'react';
import { createRoot } from 'react-dom/client';

import { afterEach, describe, expect, it, vi } from 'vitest';

import { expectNoA11yViolations } from '../../test-utils/a11y';

import { Select } from './Select';

const options = [
  { label: 'France', value: 'fr', disabled: true },
  { label: 'Germany', value: 'de' },
  { label: 'Spain', value: 'es' },
];

function pressKey(target: EventTarget, key: string) {
  act(() => {
    target.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true }));
  });
}

afterEach(() => {
  document.body.innerHTML = '';
});

describe('Select', () => {
  it('submits its selected value and connects error text', () => {
    const form = document.createElement('form');
    document.body.append(form);

    const root = createRoot(form);

    act(() => {
      root.render(
        <Select
          id='country'
          name='country'
          label='Country'
          value='fr'
          error='Choose a valid country'
          options={[{ label: 'France', value: 'fr' }]}
        />
      );
    });

    const trigger = form.querySelector('[role="combobox"]');
    const errorId = trigger?.getAttribute('aria-describedby');

    expect(new FormData(form).get('country')).toBe('fr');
    expect(errorId).toBe('country-error');
    expect(document.getElementById(errorId ?? '')?.textContent).toBe(
      'Choose a valid country'
    );

    act(() => {
      root.unmount();
    });
  });

  it('opens from keyboard, exposes active option, and selects with Enter', async () => {
    const onChange = vi.fn();
    const form = document.createElement('form');
    document.body.append(form);

    const root = createRoot(form);

    act(() => {
      root.render(
        <Select
          id='country'
          name='country'
          label='Country'
          onChange={onChange}
          options={options}
        />
      );
    });

    const trigger = form.querySelector<HTMLButtonElement>('[role="combobox"]');

    expect(trigger?.getAttribute('aria-expanded')).toBe('false');

    pressKey(trigger!, 'ArrowDown');

    const listbox = document.querySelector('[role="listbox"]');

    await expectNoA11yViolations(document.body);

    expect(trigger?.getAttribute('aria-expanded')).toBe('true');
    expect(trigger?.getAttribute('aria-controls')).toBe('country-listbox');
    expect(listbox?.id).toBe('country-listbox');
    expect(listbox?.getAttribute('aria-labelledby')).toBe('country');
    expect(trigger?.getAttribute('aria-activedescendant')).toBe(
      'country-listbox-option-1'
    );
    expect(
      document
        .getElementById('country-listbox-option-0')
        ?.getAttribute('aria-disabled')
    ).toBe('true');

    pressKey(trigger!, 'ArrowDown');

    expect(trigger?.getAttribute('aria-activedescendant')).toBe(
      'country-listbox-option-2'
    );

    pressKey(trigger!, 'Enter');

    expect(onChange).toHaveBeenCalledWith('es');
    expect(new FormData(form).get('country')).toBe('es');
    expect(trigger?.getAttribute('aria-expanded')).toBe('false');
    expect(document.querySelector('[role="listbox"]')).toBeNull();

    act(() => {
      root.unmount();
    });
  });

  it('closes with Escape without selecting a new value', () => {
    const onChange = vi.fn();
    const form = document.createElement('form');
    document.body.append(form);

    const root = createRoot(form);

    act(() => {
      root.render(
        <Select
          id='country'
          name='country'
          label='Country'
          defaultValue='de'
          onChange={onChange}
          options={options}
        />
      );
    });

    const trigger = form.querySelector<HTMLButtonElement>('[role="combobox"]');

    pressKey(trigger!, 'Enter');
    expect(trigger?.getAttribute('aria-expanded')).toBe('true');

    pressKey(trigger!, 'Escape');

    expect(trigger?.getAttribute('aria-expanded')).toBe('false');
    expect(document.querySelector('[role="listbox"]')).toBeNull();
    expect(new FormData(form).get('country')).toBe('de');
    expect(onChange).not.toHaveBeenCalled();

    act(() => {
      root.unmount();
    });
  });

  it('ignores disabled option click and selects enabled option click', () => {
    const onChange = vi.fn();
    const form = document.createElement('form');
    document.body.append(form);

    const root = createRoot(form);

    act(() => {
      root.render(
        <Select
          id='country'
          name='country'
          label='Country'
          defaultValue='de'
          onChange={onChange}
          options={options}
        />
      );
    });

    const trigger = form.querySelector<HTMLButtonElement>('[role="combobox"]');

    act(() => {
      trigger?.click();
    });

    const france = document.getElementById('country-listbox-option-0');
    const germany = document.getElementById('country-listbox-option-1');

    expect(germany?.getAttribute('aria-selected')).toBe('true');

    act(() => {
      france?.click();
      france?.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
    });

    expect(onChange).not.toHaveBeenCalled();
    expect(trigger?.getAttribute('aria-expanded')).toBe('true');
    expect(trigger?.getAttribute('aria-activedescendant')).toBe(
      'country-listbox-option-1'
    );

    act(() => {
      germany?.click();
    });

    expect(onChange).toHaveBeenCalledWith('de');
    expect(trigger?.getAttribute('aria-expanded')).toBe('false');

    act(() => {
      root.unmount();
    });
  });

  it('does not open or submit a value when disabled', () => {
    const form = document.createElement('form');
    document.body.append(form);

    const root = createRoot(form);

    act(() => {
      root.render(
        <Select
          id='country'
          name='country'
          label='Country'
          disabled
          options={options}
        />
      );
    });

    const trigger = form.querySelector<HTMLButtonElement>('[role="combobox"]');

    act(() => {
      trigger?.click();
    });

    expect(trigger?.getAttribute('aria-expanded')).toBe('false');
    expect(document.querySelector('[role="listbox"]')).toBeNull();
    expect(new FormData(form).get('country')).toBeNull();

    act(() => {
      root.unmount();
    });
  });
});
