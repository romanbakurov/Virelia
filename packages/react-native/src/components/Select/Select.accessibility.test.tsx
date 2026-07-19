import { act } from 'react';

import { AccessibilityInfo } from 'react-native';
import { describe, expect, it, vi } from 'vitest';

import { FormField } from '../../patterns/FormField';
import { render } from '../../test-utils/render';

import { Select } from './Select';

const openSelect = (container: HTMLElement) => {
  const trigger = container.querySelector<HTMLButtonElement>('[role="button"]');

  act(() => {
    trigger?.click();
  });

  return trigger;
};

describe('Native Select accessibility', () => {
  it('exposes native button state on the trigger', () => {
    const { container, unmount } = render(
      <Select
        label='Country'
        description='Shipping destination'
        defaultValue='fr'
      >
        <Select.Item value='fr' label='France' />
        <Select.Item value='de' label='Germany' />
      </Select>
    );

    const trigger = openSelect(container);

    expect(trigger?.getAttribute('aria-label')).toBe('Country');
    expect(trigger?.getAttribute('aria-description')).toBe(
      'Shipping destination'
    );
    expect(trigger?.getAttribute('aria-selected')).toBe('true');
    expect(trigger?.getAttribute('aria-expanded')).toBe('true');

    unmount();
  });

  it('inherits FormField accessibility metadata', () => {
    const { container, unmount } = render(
      <FormField
        label='Country'
        description='Shipping destination'
        error='Country is required'
        required
      >
        <Select placeholder='Choose country'>
          <Select.Item value='fr' label='France' />
        </Select>
      </FormField>
    );

    const trigger =
      container.querySelector<HTMLButtonElement>('[role="button"]');

    expect(trigger?.id).toBeTruthy();
    expect(trigger?.getAttribute('aria-labelledby')).toBeTruthy();
    expect(trigger?.getAttribute('aria-describedby')).toBeTruthy();
    expect(trigger?.getAttribute('aria-label')).toBe('Choose country');
    expect(trigger?.getAttribute('aria-description')).toBe(
      'Country is required'
    );

    unmount();
  });

  it('exposes selected and disabled item states', () => {
    const { container, unmount } = render(
      <Select label='Country' defaultValue='fr'>
        <Select.Item value='fr' label='France' />
        <Select.Item value='de' label='Germany' disabled />
      </Select>
    );

    openSelect(container);

    const france = document.body.querySelector<HTMLButtonElement>(
      'button[aria-label="France"]'
    );
    const germany = document.body.querySelector<HTMLButtonElement>(
      'button[aria-label="Germany"]'
    );

    expect(france?.getAttribute('aria-selected')).toBe('true');
    expect(germany?.getAttribute('aria-disabled')).toBe('true');

    unmount();
  });

  it('announces selection changes', () => {
    const announce = vi.spyOn(AccessibilityInfo, 'announceForAccessibility');

    const { container, unmount } = render(
      <Select label='Country'>
        <Select.Item value='fr' label='France' />
      </Select>
    );

    openSelect(container);

    act(() => {
      document.body
        .querySelector<HTMLButtonElement>('button[aria-label="France"]')
        ?.click();
    });

    expect(announce).toHaveBeenCalledWith('France selected');

    announce.mockRestore();
    unmount();
  });
});
