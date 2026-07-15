import { act } from 'react';

import { afterEach, describe, expect, it, vi } from 'vitest';

import { Radio } from '../../primitives/Radio';
import { expectNoA11yViolations } from '../../test-utils/a11y';
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

describe('RadioGroup', () => {
  it('updates uncontrolled value and calls onValueChange', () => {
    const onValueChange = vi.fn();
    const { container, unmount } = render(
      <RadioGroup
        id='plan'
        label='Plan'
        name='plan'
        defaultValue='starter'
        onValueChange={onValueChange}
      >
        <PlanRadios />
      </RadioGroup>
    );

    const radios = container.querySelectorAll<HTMLInputElement>(
      'input[type="radio"]'
    );

    expect(radios[0].checked).toBe(true);
    expect(radios[0].name).toBe('plan');
    expect(radios[1].name).toBe('plan');

    act(() => radios[1].click());

    expect(radios[0].checked).toBe(false);
    expect(radios[1].checked).toBe(true);
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

    const radios = container.querySelectorAll<HTMLInputElement>(
      'input[type="radio"]'
    );

    act(() => radios[1].click());

    expect(onValueChange).toHaveBeenCalledWith('pro');
    expect(radios[0].checked).toBe(true);
    expect(radios[1].checked).toBe(false);

    rerender(
      <RadioGroup value='pro' onValueChange={onValueChange}>
        <PlanRadios />
      </RadioGroup>
    );

    const updatedRadios = container.querySelectorAll<HTMLInputElement>(
      'input[type="radio"]'
    );

    expect(updatedRadios[0].checked).toBe(false);
    expect(updatedRadios[1].checked).toBe(true);

    unmount();
  });

  it('propagates disabled, required, invalid, size and described-by state', async () => {
    const { container, unmount } = render(
      <RadioGroup
        id='plan'
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

    await expectNoA11yViolations(container);

    const group = container.querySelector<HTMLElement>('[role="radiogroup"]');
    const radios = container.querySelectorAll<HTMLInputElement>(
      'input[type="radio"]'
    );

    expect(group?.getAttribute('aria-labelledby')).toBe('plan-label');
    expect(group?.getAttribute('aria-describedby')).toBe(
      'plan-description plan-error'
    );
    expect(group?.getAttribute('aria-disabled')).toBe('true');
    expect(group?.getAttribute('aria-required')).toBe('true');
    expect(group?.getAttribute('aria-invalid')).toBe('true');
    expect(radios[0].disabled).toBe(true);
    expect(radios[0].required).toBe(true);
    expect(radios[0].getAttribute('aria-invalid')).toBe('true');
    expect(radios[0].getAttribute('aria-describedby')).toBe(
      'plan-description plan-error'
    );
    expect(radios[0].parentElement?.parentElement?.className).toContain('lg');

    unmount();
  });

  it('does not select disabled radios inside the group', () => {
    const onValueChange = vi.fn();
    const { container, unmount } = render(
      <RadioGroup defaultValue='starter' onValueChange={onValueChange}>
        <PlanRadios disablePro />
      </RadioGroup>
    );

    const radios = container.querySelectorAll<HTMLInputElement>(
      'input[type="radio"]'
    );

    act(() => radios[1].click());

    expect(radios[1].disabled).toBe(true);
    expect(radios[1].checked).toBe(false);
    expect(onValueChange).not.toHaveBeenCalled();

    unmount();
  });

  it('forwards root props and className', () => {
    const { container, unmount } = render(
      <RadioGroup
        id='plan'
        label='Plan'
        className='group-class'
        data-testid='group'
        orientation='horizontal'
      >
        <PlanRadios />
      </RadioGroup>
    );

    const group = container.querySelector('[data-testid="group"]');

    expect(group?.className).toContain('group-class');
    expect(group?.querySelector('[class*="horizontal"]')).not.toBeNull();

    unmount();
  });
});
