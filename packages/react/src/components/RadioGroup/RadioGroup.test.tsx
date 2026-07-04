import { act } from 'react';

import { afterEach, describe, expect, it, vi } from 'vitest';

import { expectNoA11yViolations } from '../../test-utils/a11y';
import { render } from '../../test-utils/render';

import { RadioGroup } from './RadioGroup';

const options = [
  { label: 'Starter', value: 'starter' },
  { label: 'Pro', value: 'pro' },
];

afterEach(() => {
  document.body.innerHTML = '';
});

describe('RadioGroup', () => {
  it('updates uncontrolled value and calls onChange', () => {
    const onChange = vi.fn();
    const { container, unmount } = render(
      <RadioGroup
        label='Plan'
        name='plan'
        options={options}
        defaultValue='starter'
        onChange={onChange}
      />
    );

    const radios = container.querySelectorAll<HTMLInputElement>(
      'input[type="radio"]'
    );

    expect(radios[0].checked).toBe(true);
    act(() => radios[1].click());
    expect(radios[1].checked).toBe(true);
    expect(onChange).toHaveBeenCalledWith('pro');

    unmount();
  });

  it('does not select disabled options', () => {
    const onChange = vi.fn();
    const { container, unmount } = render(
      <RadioGroup
        name='plan'
        options={[options[0], { ...options[1], disabled: true }]}
        defaultValue='starter'
        onChange={onChange}
      />
    );

    const disabledRadio = container.querySelectorAll<HTMLInputElement>(
      'input[type="radio"]'
    )[1];

    act(() => disabledRadio.click());
    expect(disabledRadio.checked).toBe(false);
    expect(onChange).not.toHaveBeenCalled();

    unmount();
  });

  it('connects description and error text through aria-describedby', async () => {
    const { container, unmount } = render(
      <RadioGroup
        label='Plan'
        name='plan'
        description='Choose your plan'
        error='Plan is required'
        options={options}
        defaultValue='starter'
      />
    );

    await expectNoA11yViolations(container);

    const group = container.querySelector<HTMLElement>('[role="radiogroup"]');
    const describedBy = group?.getAttribute('aria-describedby');

    expect(describedBy).toBeTruthy();

    const ids = describedBy?.split(' ') ?? [];

    expect(ids).toHaveLength(2);

    for (const id of ids) {
      expect(document.getElementById(id)).not.toBeNull();
    }

    expect(document.getElementById(ids[0])?.textContent).toBe(
      'Choose your plan'
    );
    expect(document.getElementById(ids[1])?.textContent).toBe(
      'Plan is required'
    );

    unmount();
  });
});
