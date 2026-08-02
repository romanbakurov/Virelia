import { act } from 'react';
import { createRoot } from 'react-dom/client';

import type { ReactNode } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { FormField } from '../../patterns/FormField';
import { expectNoA11yViolations } from '../../test-utils/a11y';

import { Select } from './Select';

const options = [
  { label: 'France', value: 'fr', disabled: true },
  { label: 'Germany', value: 'de' },
  { label: 'Spain', value: 'es' },
];

type TestSelectOption = {
  label: string;
  value: string;
  disabled?: boolean;
  description?: string;
  icon?: ReactNode;
  badge?: string;
  shortcut?: string;
  color?: 'primary' | 'neutral' | 'success' | 'warning' | 'danger';
};

function renderSelectItems(items: TestSelectOption[] = options) {
  return (
    <>
      {items.map((option) => (
        <Select.Item
          key={option.value}
          value={option.value}
          disabled={option.disabled}
          label={option.label}
          description={option.description}
          icon={option.icon}
          badge={option.badge}
          shortcut={option.shortcut}
          color={option.color}
        >
          {option.label}
        </Select.Item>
      ))}
    </>
  );
}

function pressKey(target: EventTarget, key: string) {
  act(() => {
    target.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true }));
  });
}

afterEach(() => {
  document.body.innerHTML = '';
  document.body.style.overflow = '';
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
        >
          <Select.Item value='fr'>France</Select.Item>
        </Select>
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
    const onValueChange = vi.fn();
    const form = document.createElement('form');
    document.body.append(form);

    const root = createRoot(form);

    act(() => {
      root.render(
        <Select
          id='country'
          name='country'
          label='Country'
          onValueChange={onValueChange}
        >
          {renderSelectItems()}
        </Select>
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
      document.getElementById('country-listbox-option-1')?.className
    ).toMatch(/active/);
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

    expect(onValueChange).toHaveBeenCalledWith('es');
    expect(new FormData(form).get('country')).toBe('es');
    expect(trigger?.getAttribute('aria-expanded')).toBe('false');
    expect(document.querySelector('[role="listbox"]')).toBeNull();

    act(() => {
      root.unmount();
    });
  });

  it('opens by pointer without applying the visual active state to selected option', () => {
    const form = document.createElement('form');
    document.body.append(form);

    const root = createRoot(form);

    act(() => {
      root.render(
        <Select id='country' name='country' label='Country' defaultValue='de'>
          {renderSelectItems()}
        </Select>
      );
    });

    const trigger = form.querySelector<HTMLButtonElement>('[role="combobox"]');

    act(() => {
      trigger?.click();
    });

    const selectedOption = document.getElementById('country-listbox-option-1');

    expect(trigger?.getAttribute('aria-activedescendant')).toBe(
      'country-listbox-option-1'
    );
    expect(selectedOption?.className).toMatch(/selected/);
    expect(selectedOption?.className).not.toMatch(/active/);

    act(() => {
      root.unmount();
    });
  });

  it('supports explicit compound Trigger, Content, and Item children', () => {
    const onValueChange = vi.fn();
    const form = document.createElement('form');
    document.body.append(form);

    const root = createRoot(form);

    act(() => {
      root.render(
        <Select
          id='country'
          label='Country'
          onValueChange={onValueChange}
          placeholder='Choose country'
        >
          <Select.Trigger className='compound-trigger' />
          <Select.Content className='compound-content'>
            <Select.Item value='fr'>France</Select.Item>
            <Select.Item value='de' description='Berlin'>
              Germany
            </Select.Item>
          </Select.Content>
        </Select>
      );
    });

    const trigger = form.querySelector<HTMLButtonElement>('[role="combobox"]');

    expect(trigger?.className).toContain('compound-trigger');

    act(() => {
      trigger?.click();
    });

    expect(
      document.querySelector('[role="listbox"]')?.parentElement?.className
    ).toContain('compound-content');

    act(() => {
      document.getElementById('country-listbox-option-1')?.click();
    });

    expect(onValueChange).toHaveBeenCalledWith('de');
    expect(trigger?.textContent).toContain('Germany');

    act(() => {
      root.unmount();
    });
  });

  it('supports public compound slots for trigger, content, and option metadata', () => {
    const form = document.createElement('form');
    document.body.append(form);

    const root = createRoot(form);

    act(() => {
      root.render(
        <Select id='country' label='Country' defaultOpen searchable>
          <Select.Trigger>
            <Select.Value />
            <Select.Icon />
          </Select.Trigger>
          <Select.Content>
            <Select.Search placeholder='Find country' />
            <Select.Label>Europe</Select.Label>
            <Select.Item value='fr'>
              <Select.ItemIcon>FR</Select.ItemIcon>
              France
              <Select.ItemDescription>Paris</Select.ItemDescription>
            </Select.Item>
          </Select.Content>
        </Select>
      );
    });

    expect(
      document.querySelector<HTMLInputElement>(
        'input[aria-label="Search options"]'
      )?.placeholder
    ).toBe('Find country');
    expect(document.body.textContent).toContain('Europe');
    expect(
      document.getElementById('country-listbox-option-0')?.textContent
    ).toContain('FR');
    expect(
      document.getElementById('country-listbox-option-0')?.textContent
    ).toContain('Paris');

    act(() => {
      root.unmount();
    });
  });

  it('keeps collection-only compound slots out of the DOM when rendered standalone', () => {
    const host = document.createElement('div');
    document.body.append(host);

    const root = createRoot(host);

    act(() => {
      root.render(
        <>
          <Select.Group label='Europe'>
            <Select.Item value='fr'>France</Select.Item>
          </Select.Group>
          <Select.Separator />
          <Select.ItemBadge>New</Select.ItemBadge>
          <Select.ItemIcon>FR</Select.ItemIcon>
          <Select.ItemDescription>Paris</Select.ItemDescription>
        </>
      );
    });

    expect(host).toBeEmptyDOMElement();

    act(() => {
      root.unmount();
    });
  });

  it('supports compound empty and loading content slots', () => {
    const form = document.createElement('form');
    document.body.append(form);

    const root = createRoot(form);

    act(() => {
      root.render(
        <Select id='country' label='Country' defaultOpen>
          <Select.Content>
            <Select.Empty>No countries</Select.Empty>
          </Select.Content>
        </Select>
      );
    });

    expect(document.querySelector('[role="option"]')?.textContent).toBe(
      'No countries'
    );

    act(() => {
      root.render(
        <Select id='country' label='Country' defaultOpen loading>
          <Select.Content>
            <Select.Loading>Loading countries</Select.Loading>
          </Select.Content>
        </Select>
      );
    });

    expect(document.querySelector('[role="option"]')?.textContent).toBe(
      'Loading countries'
    );

    act(() => {
      root.unmount();
    });
  });

  it('renders grouped options and separators without affecting option indexes', () => {
    const onValueChange = vi.fn();
    const form = document.createElement('form');
    document.body.append(form);

    const root = createRoot(form);

    act(() => {
      root.render(
        <Select
          id='country'
          label='Country'
          defaultOpen
          onValueChange={onValueChange}
        >
          <Select.Group label='Europe'>
            <Select.Item value='fr'>France</Select.Item>
            <Select.Item value='de'>Germany</Select.Item>
          </Select.Group>
          <Select.Separator />
          <Select.Group label='Americas'>
            <Select.Item value='us'>United States</Select.Item>
          </Select.Group>
        </Select>
      );
    });

    const listbox = document.querySelector('[role="listbox"]');

    expect(listbox?.textContent).toContain('Europe');
    expect(listbox?.textContent).toContain('Americas');
    expect(document.querySelector('[role="separator"]')).toBeNull();
    expect(
      document.querySelector('[data-vellira-select-separator="true"]')
    ).not.toBeNull();
    expect(
      document.getElementById('country-listbox-option-2')?.textContent
    ).toContain('United States');

    act(() => {
      document.getElementById('country-listbox-option-2')?.click();
    });

    expect(onValueChange).toHaveBeenCalledWith('us');

    act(() => {
      root.unmount();
    });
  });

  it('toggles all enabled options in a selectable group for multiple select', () => {
    const onValueChange = vi.fn();
    const form = document.createElement('form');
    document.body.append(form);

    const root = createRoot(form);

    act(() => {
      root.render(
        <Select
          id='team'
          name='team'
          label='Team'
          multiple
          defaultOpen
          defaultValue={['platform']}
          closeOnSelect={false}
          onValueChange={onValueChange}
        >
          <Select.Group label='Core' selectable selectLabel='All core'>
            <Select.Item value='design'>Design</Select.Item>
            <Select.Item value='platform'>Platform</Select.Item>
            <Select.Item value='disabled' disabled>
              Disabled
            </Select.Item>
          </Select.Group>
          <Select.Group label='Operations' selectable>
            <Select.Item value='qa'>QA</Select.Item>
          </Select.Group>
        </Select>
      );
    });

    const groupAction = document.querySelector<HTMLButtonElement>(
      'button[aria-label="All core"]'
    );

    expect(groupAction?.textContent).toContain('1/2');
    expect(groupAction?.getAttribute('aria-pressed')).toBe('mixed');

    act(() => {
      groupAction?.click();
    });

    expect(onValueChange).toHaveBeenLastCalledWith(['platform', 'design']);
    expect(groupAction?.textContent).toContain('2/2');
    expect(groupAction?.getAttribute('aria-pressed')).toBe('true');

    act(() => {
      groupAction?.click();
    });

    expect(onValueChange).toHaveBeenLastCalledWith([]);
    expect(groupAction?.textContent).toContain('0/2');
    expect(groupAction?.getAttribute('aria-pressed')).toBe('false');

    act(() => {
      root.unmount();
    });
  });

  it('respects maxSelected when selecting a group', () => {
    const onValueChange = vi.fn();
    const form = document.createElement('form');
    document.body.append(form);

    const root = createRoot(form);

    act(() => {
      root.render(
        <Select
          id='team'
          name='team'
          label='Team'
          multiple
          defaultOpen
          defaultValue={['platform']}
          maxSelected={3}
          closeOnSelect={false}
          onValueChange={onValueChange}
        >
          <Select.Group label='Core' selectable selectLabel='All core'>
            <Select.Item value='design'>Design</Select.Item>
            <Select.Item value='platform'>Platform</Select.Item>
            <Select.Item value='docs'>Docs</Select.Item>
            <Select.Item value='accessibility'>Accessibility</Select.Item>
          </Select.Group>
        </Select>
      );
    });

    const groupAction = document.querySelector<HTMLButtonElement>(
      'button[aria-label="All core"]'
    );

    expect(groupAction?.textContent).toContain('1/4');
    expect(groupAction?.getAttribute('aria-pressed')).toBe('mixed');

    act(() => {
      groupAction?.click();
    });

    expect(onValueChange).toHaveBeenLastCalledWith([
      'platform',
      'design',
      'docs',
    ]);
    expect(new FormData(form).getAll('team')).toEqual([
      'platform',
      'design',
      'docs',
    ]);
    expect(groupAction?.textContent).toContain('3/4');
    expect(groupAction?.getAttribute('aria-pressed')).toBe('mixed');

    act(() => {
      root.unmount();
    });
  });

  it('closes with Escape without selecting a new value', () => {
    const onValueChange = vi.fn();
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
          onValueChange={onValueChange}
        >
          {renderSelectItems()}
        </Select>
      );
    });

    const trigger = form.querySelector<HTMLButtonElement>('[role="combobox"]');

    pressKey(trigger!, 'Enter');
    expect(trigger?.getAttribute('aria-expanded')).toBe('true');

    pressKey(trigger!, 'Escape');

    expect(trigger?.getAttribute('aria-expanded')).toBe('false');
    expect(document.querySelector('[role="listbox"]')).toBeNull();
    expect(new FormData(form).get('country')).toBe('de');
    expect(onValueChange).not.toHaveBeenCalled();

    act(() => {
      root.unmount();
    });
  });

  it('closes with Tab while preserving normal tab navigation', () => {
    const onValueChange = vi.fn();
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
          onValueChange={onValueChange}
        >
          {renderSelectItems()}
        </Select>
      );
    });

    const trigger = form.querySelector<HTMLButtonElement>('[role="combobox"]');

    pressKey(trigger!, 'Enter');
    expect(trigger?.getAttribute('aria-expanded')).toBe('true');

    pressKey(trigger!, 'Tab');

    expect(trigger?.getAttribute('aria-expanded')).toBe('false');
    expect(document.querySelector('[role="listbox"]')).toBeNull();
    expect(onValueChange).not.toHaveBeenCalled();

    act(() => {
      root.unmount();
    });
  });

  it('closes on outside pointerdown without changing the selected value', () => {
    const onValueChange = vi.fn();
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
          onValueChange={onValueChange}
        >
          {renderSelectItems()}
        </Select>
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
    expect(onValueChange).not.toHaveBeenCalled();

    act(() => {
      root.unmount();
    });
  });

  it('ignores disabled option click and selects enabled option click', () => {
    const onValueChange = vi.fn();
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
          onValueChange={onValueChange}
        >
          {renderSelectItems()}
        </Select>
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

    expect(onValueChange).not.toHaveBeenCalled();
    expect(trigger?.getAttribute('aria-expanded')).toBe('true');
    expect(trigger?.getAttribute('aria-activedescendant')).toBe(
      'country-listbox-option-1'
    );

    act(() => {
      germany?.click();
    });

    expect(onValueChange).toHaveBeenCalledWith('de');
    expect(trigger?.getAttribute('aria-expanded')).toBe('false');

    act(() => {
      root.unmount();
    });
  });

  it('moves the active option to the selected option after single selection', () => {
    const form = document.createElement('form');
    document.body.append(form);

    const root = createRoot(form);

    act(() => {
      root.render(
        <Select id='country' label='Country'>
          <Select.Item value='fr'>France</Select.Item>
          <Select.Item value='de'>Germany</Select.Item>
        </Select>
      );
    });

    const trigger = form.querySelector<HTMLButtonElement>('[role="combobox"]');

    act(() => {
      trigger?.click();
    });

    act(() => {
      document.getElementById('country-listbox-option-1')?.click();
    });

    act(() => {
      trigger?.click();
    });

    expect(document.getElementById('country-listbox-option-1')).toHaveAttribute(
      'aria-selected',
      'true'
    );
    expect(trigger?.getAttribute('aria-activedescendant')).toBe(
      'country-listbox-option-1'
    );

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
        <Select id='country' name='country' label='Country' disabled>
          {renderSelectItems()}
        </Select>
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
          open
          onOpenChange={onOpenChange}
          placement='top'
          matchTriggerWidth={false}
          size='lg'
          triggerClassName='custom-trigger'
          dropdownClassName='custom-dropdown'
        >
          {renderSelectItems()}
        </Select>
      );
    });

    const trigger = form.querySelector<HTMLButtonElement>('[role="combobox"]');
    const listbox = document.querySelector('[role="listbox"]');
    const dropdown = listbox?.parentElement;

    expect(trigger?.getAttribute('aria-expanded')).toBe('true');
    expect(trigger?.className).toContain('custom-trigger');
    expect(trigger?.className).toContain('lg');
    expect(dropdown?.className).toContain('custom-dropdown');
    expect(listbox?.className).not.toContain('custom-dropdown');

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
        <Select id='country' name='country' label='Country' value='de'>
          {renderSelectItems()}
        </Select>
      );
    });

    const trigger = form.querySelector<HTMLButtonElement>('[role="combobox"]');

    expect(trigger?.textContent).toContain('Germany');
    expect(new FormData(form).get('country')).toBe('de');

    act(() => {
      root.render(
        <Select id='country' name='country' label='Country' value='es'>
          {renderSelectItems()}
        </Select>
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
          defaultOpen
          error={<span data-testid='custom-error'>Country required</span>}
        >
          {renderSelectItems()}
        </Select>
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
          onFocus={onFocus}
          onBlur={onBlur}
        >
          {renderSelectItems()}
        </Select>
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
      root.render(
        <Select id='country' defaultValue='es'>
          {renderSelectItems()}
        </Select>
      );
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
        <Select id='country' label='Country' required>
          {renderSelectItems()}
        </Select>
      );
    });

    const trigger = form.querySelector<HTMLButtonElement>('[role="combobox"]');

    expect(trigger?.getAttribute('aria-required')).toBe('true');

    act(() => {
      root.unmount();
    });
  });

  it('opens an empty state when no options are available', () => {
    const onValueChange = vi.fn();
    const form = document.createElement('form');
    document.body.append(form);

    const root = createRoot(form);

    act(() => {
      root.render(
        <Select
          id='country'
          empty='No countries found'
          label='Country'
          name='country'
          onValueChange={onValueChange}
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

    expect(onValueChange).not.toHaveBeenCalled();
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
        <Select id='country' label='Country' defaultValue='long' defaultOpen>
          <Select.Item value='long'>{longLabel}</Select.Item>
        </Select>
      );
    });

    const triggerValue = form.querySelector<HTMLSpanElement>(
      '[role="combobox"] span'
    );
    const optionLabel = document.querySelector<HTMLSpanElement>(
      '[role="option"] span[class*="label"]'
    );

    expect(triggerValue?.className).toContain('value');
    expect(optionLabel?.className).toContain('label');
    expect(triggerValue?.textContent).toBe(longLabel);
    expect(optionLabel?.textContent).toBe(longLabel);

    act(() => {
      root.unmount();
    });
  });

  it('inherits FormField context when composed externally', () => {
    const form = document.createElement('form');
    document.body.append(form);

    const root = createRoot(form);

    act(() => {
      root.render(
        <FormField
          id='country'
          label='Country'
          description='Shipping destination'
          error='Required'
          required
          disabled
          size='lg'
        >
          <Select name='country'>{renderSelectItems()}</Select>
        </FormField>
      );
    });

    const trigger = form.querySelector<HTMLButtonElement>('[role="combobox"]');

    expect(trigger?.id).toBe('country');
    expect(trigger?.disabled).toBe(true);
    expect(trigger?.getAttribute('aria-required')).toBe('true');
    expect(trigger?.getAttribute('aria-invalid')).toBe('true');
    expect(trigger?.getAttribute('aria-describedby')).toBe(
      'country-description country-error'
    );
    expect(trigger?.className).toContain('lg');

    act(() => {
      root.unmount();
    });
  });

  it('wraps label, description, and error shorthand with FormField', () => {
    const form = document.createElement('form');
    document.body.append(form);

    const root = createRoot(form);

    act(() => {
      root.render(
        <Select
          id='country'
          label='Country'
          description='Choose one'
          error='Required'
        />
      );
    });

    const label = form.querySelector('label');
    const trigger = form.querySelector<HTMLButtonElement>('[role="combobox"]');

    expect(label?.getAttribute('for')).toBe('country');
    expect(label?.textContent).toBe('Country');
    expect(document.getElementById('country-description')?.textContent).toBe(
      'Choose one'
    );
    expect(document.getElementById('country-error')?.textContent).toBe(
      'Required'
    );
    expect(trigger?.id).toBe('country');
    expect(trigger?.getAttribute('aria-invalid')).toBe('true');
    expect(trigger?.getAttribute('aria-describedby')).toBe(
      'country-description country-error'
    );

    act(() => {
      root.unmount();
    });
  });

  it('supports clearable, searchable, loading, and rich option content', async () => {
    const onValueChange = vi.fn();
    const onSearch = vi.fn();
    const onClear = vi.fn();
    const form = document.createElement('form');
    document.body.append(form);

    const root = createRoot(form);

    act(() => {
      root.render(
        <Select
          id='country'
          label='Country'
          defaultValue='de'
          clearable
          searchable
          color='success'
          variant='soft'
          onValueChange={onValueChange}
          onSearch={onSearch}
          onClear={onClear}
        >
          {renderSelectItems([
            {
              label: 'France',
              value: 'fr',
              description: 'Paris',
              icon: 'FR',
              badge: 'EU',
              shortcut: '⌘1',
              color: 'success',
            },
            { label: 'Germany', value: 'de', description: 'Berlin' },
          ])}
        </Select>
      );
    });

    const trigger = form.querySelector<HTMLButtonElement>('[role="combobox"]');

    expect(trigger?.className).toContain('success');
    expect(trigger?.className).toContain('soft');
    expect(trigger?.textContent).toContain('Germany');

    act(() => {
      trigger?.click();
    });

    const search = document.querySelector<HTMLInputElement>(
      '[aria-label="Search options"]'
    );

    await act(async () => {
      await new Promise((resolve) => window.setTimeout(resolve, 0));
    });

    expect(document.activeElement).toBe(search);

    act(() => {
      search!.value = 'fra';
      search?.dispatchEvent(new Event('input', { bubbles: true }));
    });

    expect(onSearch).toHaveBeenCalledWith('fra');
    expect(trigger?.textContent).toContain('Germany');
    expect(trigger?.getAttribute('aria-activedescendant')).toBe(
      'country-listbox-option-0'
    );
    expect(document.querySelector('[role="listbox"]')?.textContent).toContain(
      'France'
    );
    expect(document.querySelector('[role="listbox"]')?.textContent).toContain(
      'Paris'
    );
    expect(document.querySelector('[role="listbox"]')?.textContent).toContain(
      'EU'
    );

    const clearSearch = document.querySelector('[aria-label="Clear search"]');

    act(() => {
      clearSearch?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    });

    expect(onSearch).toHaveBeenCalledWith('');
    expect(search?.value).toBe('');

    const clear = form.querySelector('[aria-label="Clear selection"]');

    act(() => {
      clear?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    });

    expect(onValueChange).toHaveBeenCalledWith('');
    expect(onClear).toHaveBeenCalledTimes(1);

    act(() => {
      root.render(
        <Select id='country' label='Country' loading>
          {renderSelectItems()}
        </Select>
      );
    });

    act(() => {
      form.querySelector<HTMLButtonElement>('[role="combobox"]')?.click();
    });

    expect(document.querySelector('[role="listbox"]')?.textContent).toContain(
      'Loading...'
    );

    act(() => {
      root.unmount();
    });
  });

  it('supports multiple values, maxSelected, and closeOnSelect', () => {
    const onValueChange = vi.fn();
    const form = document.createElement('form');
    document.body.append(form);

    const root = createRoot(form);

    act(() => {
      root.render(
        <Select
          id='countries'
          name='countries'
          label='Countries'
          multiple
          defaultValue={['de']}
          maxSelected={2}
          closeOnSelect={false}
          onValueChange={onValueChange}
        >
          {renderSelectItems([
            { label: 'Germany', value: 'de' },
            { label: 'Spain', value: 'es' },
            { label: 'Portugal', value: 'pt' },
          ])}
        </Select>
      );
    });

    const trigger = form.querySelector<HTMLButtonElement>('[role="combobox"]');

    act(() => {
      trigger?.click();
    });

    const listbox = document.querySelector('[role="listbox"]');
    const germany = document.getElementById('countries-listbox-option-0');
    const spain = document.getElementById('countries-listbox-option-1');
    const portugal = document.getElementById('countries-listbox-option-2');

    expect(listbox?.getAttribute('aria-multiselectable')).toBe('true');
    expect(germany?.getAttribute('aria-selected')).toBe('true');

    act(() => {
      spain?.click();
    });

    expect(onValueChange).toHaveBeenLastCalledWith(['de', 'es']);
    expect(trigger?.getAttribute('aria-expanded')).toBe('true');
    expect(new FormData(form).getAll('countries')).toEqual(['de', 'es']);

    act(() => {
      portugal?.click();
    });

    expect(onValueChange).toHaveBeenCalledTimes(1);

    act(() => {
      root.unmount();
    });
  });

  it('virtualizes long option lists', () => {
    const longItems = Array.from({ length: 100 }, (_, index) => ({
      label: `Country ${index + 1}`,
      value: `country-${index + 1}`,
    }));
    const form = document.createElement('form');
    document.body.append(form);

    const root = createRoot(form);

    act(() => {
      root.render(
        <Select id='country' label='Country' defaultOpen virtual>
          {renderSelectItems(longItems)}
        </Select>
      );
    });

    const listbox = document.querySelector('[role="listbox"]');
    const dropdown = listbox?.parentElement;

    expect(dropdown?.getAttribute('tabindex')).toBe('0');
    expect(document.querySelectorAll('[role="option"]').length).toBeLessThan(
      longItems.length
    );
    expect(document.getElementById('country-listbox-option-50')).toBeNull();

    act(() => {
      Object.defineProperty(dropdown!, 'scrollTop', {
        configurable: true,
        value: 2000,
      });
      dropdown?.dispatchEvent(new Event('scroll', { bubbles: true }));
    });

    expect(document.getElementById('country-listbox-option-50')).not.toBeNull();

    act(() => {
      root.unmount();
    });
  });

  it('scrolls the selected option into view when reopening a long list', () => {
    const longItems = Array.from({ length: 100 }, (_, index) => ({
      label: `Country ${index + 1}`,
      value: `country-${index + 1}`,
    }));
    const scrollIntoView = vi.fn();
    const originalScrollIntoView = HTMLElement.prototype.scrollIntoView;
    HTMLElement.prototype.scrollIntoView = scrollIntoView;
    const form = document.createElement('form');
    document.body.append(form);

    const root = createRoot(form);

    act(() => {
      root.render(
        <Select id='country' label='Country' defaultValue='country-51'>
          {renderSelectItems(longItems)}
        </Select>
      );
    });

    const trigger = form.querySelector<HTMLButtonElement>('[role="combobox"]');

    act(() => {
      trigger?.click();
    });

    expect(trigger?.getAttribute('aria-activedescendant')).toBe(
      'country-listbox-option-50'
    );
    expect(scrollIntoView).toHaveBeenCalledWith({ block: 'nearest' });
    expect(
      document.getElementById('country-listbox-option-50')
    ).toHaveAttribute('aria-selected', 'true');

    act(() => {
      trigger?.click();
    });

    act(() => {
      trigger?.click();
    });

    expect(trigger?.getAttribute('aria-activedescendant')).toBe(
      'country-listbox-option-50'
    );
    expect(scrollIntoView).toHaveBeenCalledTimes(2);

    act(() => {
      root.unmount();
    });

    HTMLElement.prototype.scrollIntoView = originalScrollIntoView;
  });

  it('opens a virtualized list around the selected option', () => {
    const longItems = Array.from({ length: 100 }, (_, index) => ({
      label: `Country ${index + 1}`,
      value: `country-${index + 1}`,
    }));
    const form = document.createElement('form');
    document.body.append(form);

    const root = createRoot(form);

    act(() => {
      root.render(
        <Select id='country' label='Country' defaultValue='country-51' virtual>
          {renderSelectItems(longItems)}
        </Select>
      );
    });

    const trigger = form.querySelector<HTMLButtonElement>('[role="combobox"]');

    act(() => {
      trigger?.click();
    });

    expect(document.getElementById('country-listbox-option-50')).not.toBeNull();
    expect(
      document.getElementById('country-listbox-option-50')
    ).toHaveAttribute('aria-selected', 'true');
    expect(document.getElementById('country-listbox-option-0')).toBeNull();

    act(() => {
      root.unmount();
    });
  });

  it('does not pin virtualized scrolling to the selected option after opening', () => {
    const longItems = Array.from({ length: 100 }, (_, index) => ({
      label: `Country ${index + 1}`,
      value: `country-${index + 1}`,
    }));
    const form = document.createElement('form');
    document.body.append(form);

    const root = createRoot(form);

    act(() => {
      root.render(
        <Select id='country' label='Country' defaultValue='country-51' virtual>
          {renderSelectItems(longItems)}
        </Select>
      );
    });

    const trigger = form.querySelector<HTMLButtonElement>('[role="combobox"]');

    act(() => {
      trigger?.click();
    });

    const listbox = document.querySelector('[role="listbox"]');
    const dropdown = listbox?.parentElement;

    expect(document.getElementById('country-listbox-option-50')).not.toBeNull();

    act(() => {
      Object.defineProperty(dropdown!, 'scrollTop', {
        configurable: true,
        writable: true,
        value: 0,
      });
      dropdown?.dispatchEvent(new Event('scroll', { bubbles: true }));
    });

    expect(document.getElementById('country-listbox-option-0')).not.toBeNull();

    act(() => {
      document
        .getElementById('country-listbox-option-0')
        ?.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
    });

    expect(dropdown?.scrollTop).toBe(0);
    expect(document.getElementById('country-listbox-option-0')).not.toBeNull();

    act(() => {
      root.unmount();
    });
  });

  it('locks body scroll when modal dropdown is open', () => {
    const form = document.createElement('form');
    document.body.append(form);
    document.body.style.overflow = 'auto';

    const root = createRoot(form);

    act(() => {
      root.render(
        <Select id='country' label='Country' modal>
          {renderSelectItems()}
        </Select>
      );
    });

    act(() => {
      form.querySelector<HTMLButtonElement>('[role="combobox"]')?.click();
    });

    expect(document.body.style.overflow).toBe('hidden');

    pressKey(
      form.querySelector<HTMLButtonElement>('[role="combobox"]')!,
      'Escape'
    );

    expect(document.body.style.overflow).toBe('auto');

    act(() => {
      root.unmount();
    });
  });

  it('enables command search without searchable', () => {
    const form = document.createElement('form');
    document.body.append(form);

    const root = createRoot(form);

    act(() => {
      root.render(
        <Select id='command' label='Command' command>
          {renderSelectItems()}
        </Select>
      );
    });

    act(() => {
      form.querySelector<HTMLButtonElement>('[role="combobox"]')?.click();
    });

    expect(
      document.querySelector<HTMLInputElement>('[aria-label="Search options"]')
        ?.placeholder
    ).toBe('Type a command...');

    act(() => {
      root.unmount();
    });
  });

  it('lets searchable input handle text keys without trigger typeahead', async () => {
    const form = document.createElement('form');
    document.body.append(form);

    const root = createRoot(form);

    act(() => {
      root.render(
        <Select id='country' label='Country' searchable>
          {renderSelectItems()}
        </Select>
      );
    });

    const trigger = form.querySelector<HTMLButtonElement>('[role="combobox"]');

    act(() => {
      trigger?.click();
    });

    const search = document.querySelector<HTMLInputElement>(
      '[aria-label="Search options"]'
    );

    await act(async () => {
      await new Promise((resolve) => window.setTimeout(resolve, 0));
    });

    act(() => {
      search?.focus();
      search!.value = 's';
      search?.dispatchEvent(
        new KeyboardEvent('keydown', { key: 's', bubbles: true })
      );
      search?.dispatchEvent(new Event('input', { bubbles: true }));
    });

    expect(search?.value).toBe('s');
    expect(trigger?.getAttribute('aria-activedescendant')).toBe(
      'country-listbox-option-0'
    );
    expect(
      document.getElementById('country-listbox-option-0')?.textContent
    ).toContain('Spain');

    act(() => {
      root.unmount();
    });
  });
});
