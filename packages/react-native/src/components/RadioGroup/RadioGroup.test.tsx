import { act } from 'react';

import { afterEach, describe, expect, it, vi } from 'vitest';

import { Radio } from '../../primitives/Radio';
import { render } from '../../test-utils/render';

import { RadioGroup } from './RadioGroup';

afterEach(() => {
  document.body.innerHTML = '';
});

function PlanRadios({ disablePro = false }: { disablePro?: boolean }) {
  return (
    <>
      <Radio value='starter' label='Starter' />
      <Radio value='pro' label='Pro' disabled={disablePro} />
    </>
  );
}

describe('Native RadioGroup', () => {
  it('updates uncontrolled value and calls onValueChange', () => {
    const onValueChange = vi.fn();
    const { container, unmount } = render(
      <RadioGroup defaultValue='starter' onValueChange={onValueChange}>
        <PlanRadios />
      </RadioGroup>
    );

    const radios =
      container.querySelectorAll<HTMLButtonElement>('[role="radio"]');

    expect(radios[0].getAttribute('aria-checked')).toBe('true');

    act(() => radios[1].click());

    expect(radios[0].getAttribute('aria-checked')).toBe('false');
    expect(radios[1].getAttribute('aria-checked')).toBe('true');
    expect(onValueChange).toHaveBeenCalledWith('pro');

    unmount();
  });

  it('keeps controlled value until value changes', () => {
    const onValueChange = vi.fn();
    const { container, rerender, unmount } = render(
      <RadioGroup value='starter' onValueChange={onValueChange}>
        <PlanRadios />
      </RadioGroup>
    );

    const radios =
      container.querySelectorAll<HTMLButtonElement>('[role="radio"]');

    act(() => radios[1].click());

    expect(onValueChange).toHaveBeenCalledWith('pro');
    expect(radios[0].getAttribute('aria-checked')).toBe('true');
    expect(radios[1].getAttribute('aria-checked')).toBe('false');

    rerender(
      <RadioGroup value='pro' onValueChange={onValueChange}>
        <PlanRadios />
      </RadioGroup>
    );

    const updatedRadios =
      container.querySelectorAll<HTMLButtonElement>('[role="radio"]');

    expect(updatedRadios[0].getAttribute('aria-checked')).toBe('false');
    expect(updatedRadios[1].getAttribute('aria-checked')).toBe('true');

    unmount();
  });

  it('exposes group accessibility props and propagates state to radios', () => {
    const { container, unmount } = render(
      <RadioGroup
        label='Plan'
        description='Choose one plan.'
        error='Plan is required.'
        required
        disabled
        size='lg'
      >
        <PlanRadios />
      </RadioGroup>
    );

    const group = container.querySelector('[role="radiogroup"]');
    const radios =
      container.querySelectorAll<HTMLButtonElement>('[role="radio"]');

    expect(group?.getAttribute('aria-label')).toBe('Plan');
    expect(group?.getAttribute('aria-description')).toBe(
      'Choose one plan. Required. Plan is required.'
    );
    expect(group?.getAttribute('aria-disabled')).toBe('true');
    expect(radios[0].getAttribute('aria-disabled')).toBe('true');
    expect(radios[0].getAttribute('aria-description')).toBe('Required.');
    expect(radios[0].textContent).toContain('Starter');

    unmount();
  });

  it('does not select disabled radios inside the group', () => {
    const onValueChange = vi.fn();
    const { container, unmount } = render(
      <RadioGroup defaultValue='starter' onValueChange={onValueChange}>
        <PlanRadios disablePro />
      </RadioGroup>
    );

    const radios =
      container.querySelectorAll<HTMLButtonElement>('[role="radio"]');

    act(() => radios[1].click());

    expect(radios[1].getAttribute('aria-disabled')).toBe('true');
    expect(radios[1].getAttribute('aria-checked')).toBe('false');
    expect(onValueChange).not.toHaveBeenCalled();

    unmount();
  });

  it('applies style props to the field and items wrapper', () => {
    const { container, unmount } = render(
      <RadioGroup
        testID='items'
        label='Plan'
        style={{ maxWidth: 360 }}
        itemsStyle={{ marginTop: 4 }}
        labelStyle={{ fontWeight: '700' }}
        description='Choose one plan.'
        descriptionStyle={{ fontStyle: 'italic' }}
        error='Plan is required.'
        errorStyle={{ textDecorationLine: 'underline' }}
      >
        <PlanRadios />
      </RadioGroup>
    );

    const field = container.firstElementChild as HTMLElement | null;
    const items = container.querySelector<HTMLElement>('[data-testid="items"]');
    const label = Array.from(container.querySelectorAll('span')).find((node) =>
      node.textContent?.includes('Plan')
    );
    const description = Array.from(container.querySelectorAll('span')).find(
      (node) => node.textContent === 'Choose one plan.'
    );
    const error = container.querySelector<HTMLElement>('[aria-live="polite"]');

    expect(field?.style.maxWidth).toBe('360px');
    expect(items?.style.marginTop).toBe('4px');
    expect(label?.style.fontWeight).toBe('700');
    expect(description?.style.fontStyle).toBe('italic');
    expect(error?.style.textDecorationLine).toBe('underline');

    unmount();
  });

  it('accepts group color and item color overrides', () => {
    const { container, unmount } = render(
      <RadioGroup label='Status' color='danger' defaultValue='blocked'>
        <Radio value='blocked' label='Blocked' />
        <Radio value='active' label='Active' color='success' />
      </RadioGroup>
    );

    const radios =
      container.querySelectorAll<HTMLButtonElement>('[role="radio"]');

    expect(radios[0].getAttribute('aria-checked')).toBe('true');
    expect(radios[1].textContent).toContain('Active');

    unmount();
  });

  it('supports RadioGroup.Item as a compound alias for Radio', () => {
    const onValueChange = vi.fn();
    const { container, unmount } = render(
      <RadioGroup defaultValue='starter' onValueChange={onValueChange}>
        <RadioGroup.Item value='starter' label='Starter' />
        <RadioGroup.Item value='pro' label='Pro' />
      </RadioGroup>
    );

    const radios =
      container.querySelectorAll<HTMLButtonElement>('[role="radio"]');

    expect(radios[0].getAttribute('aria-checked')).toBe('true');

    act(() => radios[1].click());

    expect(radios[1].getAttribute('aria-checked')).toBe('true');
    expect(onValueChange).toHaveBeenCalledWith('pro');

    unmount();
  });
});
