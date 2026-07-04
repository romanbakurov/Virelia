import { act } from 'react';

import { afterEach, describe, expect, it, vi } from 'vitest';

import { render } from '../../test-utils/render';

import { RadioGroup } from './RadioGroup';

const options = [
  { label: 'Starter', value: 'starter' },
  { label: 'Pro', value: 'pro' },
];

afterEach(() => {
  document.body.innerHTML = '';
});

describe('Native RadioGroup', () => {
  it('selects an option and calls onChange', () => {
    const onChange = vi.fn();
    const { container, unmount } = render(
      <RadioGroup
        options={options}
        defaultValue='starter'
        onChange={onChange}
      />
    );

    const radios =
      container.querySelectorAll<HTMLButtonElement>('[role="radio"]');

    expect(radios[0].getAttribute('aria-checked')).toBe('true');
    act(() => radios[1].click());
    expect(radios[1].getAttribute('aria-checked')).toBe('true');
    expect(onChange).toHaveBeenCalledWith('pro');

    unmount();
  });

  it('exposes radiogroup and radio accessibility states', () => {
    const { container, unmount } = render(
      <RadioGroup label='Plan' options={options} defaultValue='starter' />
    );

    const group = container.querySelector('[role="radiogroup"]');
    const radios =
      container.querySelectorAll<HTMLButtonElement>('[role="radio"]');

    expect(group).not.toBeNull();
    expect(radios[0].getAttribute('aria-label')).toBe('Starter');
    expect(radios[0].getAttribute('aria-checked')).toBe('true');
    expect(radios[1].getAttribute('aria-label')).toBe('Pro');
    expect(radios[1].getAttribute('aria-checked')).toBe('false');

    unmount();
  });

  it('keeps controlled value until value changes', () => {
    const onChange = vi.fn();
    const { container, rerender, unmount } = render(
      <RadioGroup options={options} value='starter' onChange={onChange} />
    );

    const radios =
      container.querySelectorAll<HTMLButtonElement>('[role="radio"]');

    act(() => radios[1].click());

    expect(onChange).toHaveBeenCalledWith('pro');
    expect(radios[0].getAttribute('aria-checked')).toBe('true');
    expect(radios[1].getAttribute('aria-checked')).toBe('false');

    rerender(<RadioGroup options={options} value='pro' onChange={onChange} />);

    const updatedRadios =
      container.querySelectorAll<HTMLButtonElement>('[role="radio"]');
    expect(updatedRadios[0].getAttribute('aria-checked')).toBe('false');
    expect(updatedRadios[1].getAttribute('aria-checked')).toBe('true');

    unmount();
  });

  it('marks disabled group and option states and ignores disabled options', () => {
    const onChange = vi.fn();
    const { container, unmount } = render(
      <RadioGroup
        options={[
          ...options,
          { label: 'Enterprise', value: 'enterprise', disabled: true },
        ]}
        defaultValue='starter'
        onChange={onChange}
      />
    );

    const radios =
      container.querySelectorAll<HTMLButtonElement>('[role="radio"]');

    expect(radios[2].getAttribute('aria-disabled')).toBe('true');

    act(() => radios[2].click());

    expect(onChange).not.toHaveBeenCalled();
    expect(radios[0].getAttribute('aria-checked')).toBe('true');

    unmount();
  });

  it('disables every option when the group is disabled', () => {
    const onChange = vi.fn();
    const { container, unmount } = render(
      <RadioGroup
        options={options}
        disabled
        defaultValue='starter'
        onChange={onChange}
      />
    );

    const group = container.querySelector('[role="radiogroup"]');
    const radios =
      container.querySelectorAll<HTMLButtonElement>('[role="radio"]');

    expect(group?.getAttribute('aria-disabled')).toBe('true');
    expect(radios[0].getAttribute('aria-disabled')).toBe('true');
    expect(radios[1].getAttribute('aria-disabled')).toBe('true');

    act(() => radios[1].click());

    expect(onChange).not.toHaveBeenCalled();
    expect(radios[0].getAttribute('aria-checked')).toBe('true');

    unmount();
  });
});
