import { act } from 'react';

import { describe, expect, it, vi } from 'vitest';

import { render } from '../../test-utils/render';

import { RadioGroup } from './RadioGroup';

import { Radio } from '#primitives/Radio';

describe('RadioGroup keyboard navigation', () => {
  it('moves through enabled radios with arrow keys', () => {
    const onValueChange = vi.fn();
    const { container, unmount } = render(
      <RadioGroup defaultValue='starter' onValueChange={onValueChange}>
        <Radio value='starter' label='Starter' />
        <Radio value='pro' label='Pro' />
        <Radio value='enterprise' label='Enterprise' />
      </RadioGroup>
    );

    const radios = container.querySelectorAll<HTMLInputElement>(
      'input[type="radio"]'
    );

    act(() => {
      radios[0].focus();
      radios[0].dispatchEvent(
        new KeyboardEvent('keydown', {
          key: 'ArrowDown',
          bubbles: true,
          cancelable: true,
        })
      );
    });

    expect(document.activeElement).toBe(radios[1]);
    expect(radios[1].checked).toBe(true);
    expect(onValueChange).toHaveBeenCalledWith('pro');

    unmount();
  });

  it('skips disabled radios and supports Home and End', () => {
    const { container, unmount } = render(
      <RadioGroup defaultValue='starter'>
        <Radio value='starter' label='Starter' />
        <Radio value='pro' label='Pro' disabled />
        <Radio value='enterprise' label='Enterprise' />
      </RadioGroup>
    );

    const radios = container.querySelectorAll<HTMLInputElement>(
      'input[type="radio"]'
    );

    act(() => {
      radios[0].focus();
      radios[0].dispatchEvent(
        new KeyboardEvent('keydown', {
          key: 'End',
          bubbles: true,
          cancelable: true,
        })
      );
    });

    expect(document.activeElement).toBe(radios[2]);
    expect(radios[2].checked).toBe(true);

    act(() => {
      radios[2].dispatchEvent(
        new KeyboardEvent('keydown', {
          key: 'Home',
          bubbles: true,
          cancelable: true,
        })
      );
    });

    expect(document.activeElement).toBe(radios[0]);
    expect(radios[0].checked).toBe(true);

    unmount();
  });
});
