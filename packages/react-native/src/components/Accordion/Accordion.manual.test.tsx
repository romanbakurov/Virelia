// Coverage contract: accessible-name, interaction, controlled, uncontrolled, disabled
import { act } from 'react';

import { render } from '@test-utils/render';
import { Text } from 'react-native';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { Accordion } from './Accordion';

afterEach(() => {
  document.body.innerHTML = '';
});

const sections = [
  <Accordion.Item key='first' value='first'>
    <Accordion.Trigger>First section</Accordion.Trigger>
    <Accordion.Content>
      <Text>First content</Text>
    </Accordion.Content>
  </Accordion.Item>,
  <Accordion.Item key='second' value='second'>
    <Accordion.Trigger>Second section</Accordion.Trigger>
    <Accordion.Content>
      <Text>Second content</Text>
    </Accordion.Content>
  </Accordion.Item>,
];

describe('Native Accordion manual behavior coverage', () => {
  it('exposes named button semantics and manages uncontrolled expansion', () => {
    const onValueChange = vi.fn();
    const { container, unmount } = render(
      <Accordion defaultValue='first' onValueChange={onValueChange}>
        {sections}
      </Accordion>
    );
    const buttons = container.querySelectorAll<HTMLElement>('[role="button"]');
    expect(buttons[0].getAttribute('aria-expanded')).toBe('true');
    expect(buttons[0].textContent).toContain('First section');
    act(() => buttons[1].click());
    expect(buttons[1].getAttribute('aria-expanded')).toBe('true');
    expect(onValueChange).toHaveBeenCalledWith('second');
    unmount();
  });

  it('honors controlled and disabled contracts', () => {
    const onValueChange = vi.fn();
    const { container, rerender, unmount } = render(
      <Accordion value='first' onValueChange={onValueChange}>
        {sections}
      </Accordion>
    );
    act(() =>
      container.querySelectorAll<HTMLElement>('[role="button"]')[1].click()
    );
    expect(onValueChange).toHaveBeenCalledWith('second');
    expect(
      container
        .querySelectorAll<HTMLElement>('[role="button"]')[0]
        .getAttribute('aria-expanded')
    ).toBe('true');
    rerender(<Accordion disabled>{sections}</Accordion>);
    expect(
      container.querySelector('[role="button"]')?.getAttribute('aria-disabled')
    ).toBe('true');
    unmount();
  });
});
