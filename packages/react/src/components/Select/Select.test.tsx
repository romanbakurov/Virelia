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

    pressKey(trigger!, 'Home');

    expect(trigger?.getAttribute('aria-activedescendant')).toBe(
      'country-listbox-option-1'
    );

    pressKey(trigger!, 'End');

    expect(trigger?.getAttribute('aria-activedescendant')).toBe(
      'country-listbox-option-2'
    );

    pressKey(trigger!, 'g');

    expect(trigger?.getAttribute('aria-activedescendant')).toBe(
      'country-listbox-option-1'
    );

    pressKey(trigger!, 'End');

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

  it('closes on outside pointerdown without changing the selected value', () => {
    const onChange = vi.fn();
    const form = document.createElement('form');
    document.body.append(form);

    const outsideButton = document.createElement('button');
    outsideButton.type = 'button';
    outsideButton.textContent = 'Outside';
    document.body.append(outsideButton);

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

    expect(trigger?.getAttribute('aria-expanded')).toBe('true');

    act(() => {
      outsideButton.dispatchEvent(
        new PointerEvent('pointerdown', { bubbles: true })
      );
    });

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

  it('supports controlled open state and class props', () => {
    const onOpenChange = vi.fn();
    const form = document.createElement('form');
    document.body.append(form);

    const root = createRoot(form);

    act(() => {
      root.render(
        <Select
          id='country'
          label='Country'
          options={options}
          open
          onOpenChange={onOpenChange}
          placement='top-end'
          matchTriggerWidth={false}
          size='lg'
          triggerClassName='custom-trigger'
          dropdownClassName='custom-dropdown'
        />
      );
    });

    const trigger = form.querySelector<HTMLButtonElement>('[role="combobox"]');
    const listbox = document.querySelector('[role="listbox"]');

    expect(trigger?.getAttribute('aria-expanded')).toBe('true');
    expect(trigger?.className).toContain('custom-trigger');
    expect(trigger?.className).toContain('lg');
    expect(listbox?.className).toContain('custom-dropdown');

    act(() => {
      trigger?.click();
    });

    expect(onOpenChange).toHaveBeenCalledWith(false);
    expect(trigger?.getAttribute('aria-expanded')).toBe('true');

    act(() => {
      root.unmount();
    });
  });

  it('reflects controlled value rerenders', () => {
    const form = document.createElement('form');
    document.body.append(form);

    const root = createRoot(form);

    act(() => {
      root.render(
        <Select
          id='country'
          name='country'
          label='Country'
          value='de'
          options={options}
        />
      );
    });

    const trigger = form.querySelector<HTMLButtonElement>('[role="combobox"]');

    expect(trigger?.textContent).toContain('Germany');
    expect(new FormData(form).get('country')).toBe('de');

    act(() => {
      root.render(
        <Select
          id='country'
          name='country'
          label='Country'
          value='es'
          options={options}
        />
      );
    });

    expect(trigger?.textContent).toContain('Spain');
    expect(new FormData(form).get('country')).toBe('es');

    act(() => {
      root.unmount();
    });
  });

  it('supports defaultOpen and custom error content', () => {
    const form = document.createElement('form');
    document.body.append(form);

    const root = createRoot(form);

    act(() => {
      root.render(
        <Select
          id='country'
          label='Country'
          options={options}
          defaultOpen
          error={<span data-testid='custom-error'>Country required</span>}
        />
      );
    });

    const trigger = form.querySelector<HTMLButtonElement>('[role="combobox"]');

    expect(trigger?.getAttribute('aria-expanded')).toBe('true');
    expect(trigger?.getAttribute('aria-describedby')).toBe('country-error');
    expect(trigger?.getAttribute('aria-invalid')).toBe('true');
    expect(
      document.querySelector('[data-testid="custom-error"]')?.textContent
    ).toBe('Country required');
    expect(trigger?.className).toContain('error');

    act(() => {
      root.unmount();
    });
  });

  it('supports explicit accessibility label and focus handlers', () => {
    const onFocus = vi.fn();
    const onBlur = vi.fn();
    const form = document.createElement('form');
    document.body.append(form);

    const root = createRoot(form);

    act(() => {
      root.render(
        <Select
          id='country'
          aria-label='Billing country'
          options={options}
          onFocus={onFocus}
          onBlur={onBlur}
        />
      );
    });

    const trigger = form.querySelector<HTMLButtonElement>('[role="combobox"]');

    expect(trigger?.getAttribute('aria-label')).toBe('Billing country');

    act(() => {
      trigger?.focus();
    });

    expect(onFocus).toHaveBeenCalledTimes(1);

    act(() => {
      trigger?.blur();
    });

    expect(onBlur).toHaveBeenCalledTimes(1);

    act(() => {
      root.unmount();
    });
  });

  it('uses selected text as accessible name without a visible label', () => {
    const form = document.createElement('form');
    document.body.append(form);

    const root = createRoot(form);

    act(() => {
      root.render(<Select id='country' defaultValue='es' options={options} />);
    });

    const trigger = form.querySelector<HTMLButtonElement>('[role="combobox"]');

    expect(trigger?.getAttribute('aria-label')).toBe('Spain');

    act(() => {
      root.unmount();
    });
  });

  it('marks required state for assistive tech', () => {
    const form = document.createElement('form');
    document.body.append(form);

    const root = createRoot(form);

    act(() => {
      root.render(
        <Select id='country' label='Country' required options={options} />
      );
    });

    const trigger = form.querySelector<HTMLButtonElement>('[role="combobox"]');

    expect(trigger?.getAttribute('aria-required')).toBe('true');

    act(() => {
      root.unmount();
    });
  });

  it('opens an empty state when no options are available', () => {
    const onChange = vi.fn();
    const form = document.createElement('form');
    document.body.append(form);

    const root = createRoot(form);

    act(() => {
      root.render(
        <Select
          id='country'
          label='Country'
          name='country'
          options={[]}
          noOptionsText='No countries found'
          onChange={onChange}
        />
      );
    });

    const trigger = form.querySelector<HTMLButtonElement>('[role="combobox"]');

    pressKey(trigger!, 'ArrowDown');

    expect(trigger?.getAttribute('aria-expanded')).toBe('true');
    expect(trigger?.hasAttribute('aria-activedescendant')).toBe(false);
    expect(document.querySelector('[role="listbox"]')?.textContent).toContain(
      'No countries found'
    );

    pressKey(trigger!, 'Enter');

    expect(onChange).not.toHaveBeenCalled();
    expect(new FormData(form).get('country')).toBe('');

    act(() => {
      root.unmount();
    });
  });

  it('applies truncation classes for long trigger and option labels', () => {
    const longLabel =
      'Very very very very very very long country label for truncation';
    const form = document.createElement('form');
    document.body.append(form);

    const root = createRoot(form);

    act(() => {
      root.render(
        <Select
          id='country'
          label='Country'
          defaultValue='long'
          defaultOpen
          options={[{ label: longLabel, value: 'long' }]}
        />
      );
    });

    const triggerValue = form.querySelector<HTMLSpanElement>(
      '[role="combobox"] span'
    );
    const optionLabel = document.querySelector<HTMLSpanElement>(
      '[role="option"] span'
    );

    expect(triggerValue?.className).toContain('value');
    expect(optionLabel?.className).toContain('label');
    expect(triggerValue?.textContent).toBe(longLabel);
    expect(optionLabel?.textContent).toBe(longLabel);

    act(() => {
      root.unmount();
    });
  });
});
