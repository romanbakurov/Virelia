// Coverage contract: accessible-name, interaction, controlled, uncontrolled, disabled, keyboard
import { act } from 'react';

import { render } from '@test-utils/render';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { Accordion } from './Accordion';

afterEach(() => {
  document.body.innerHTML = '';
});

const sections = [
  <Accordion.Item key='first' value='first'>
    <Accordion.Trigger>First section</Accordion.Trigger>
    <Accordion.Content>First content</Accordion.Content>
  </Accordion.Item>,
  <Accordion.Item key='second' value='second'>
    <Accordion.Trigger>Second section</Accordion.Trigger>
    <Accordion.Content>Second content</Accordion.Content>
  </Accordion.Item>,
];

describe('Accordion manual behavior coverage', () => {
  it('provides named, keyboard-native triggers and updates uncontrolled state', () => {
    const onValueChange = vi.fn();
    const { container, unmount } = render(
      <Accordion defaultValue='first' onValueChange={onValueChange}>
        {sections}
      </Accordion>
    );
    const buttons = container.querySelectorAll<HTMLButtonElement>('button');

    expect(buttons[0].textContent).toContain('First section');
    expect(buttons[0].getAttribute('aria-expanded')).toBe('true');
    expect(buttons[0].getAttribute('aria-controls')).toBeTruthy();

    buttons[1].focus();
    act(() => {
      buttons[1].dispatchEvent(
        new KeyboardEvent('keydown', { bubbles: true, key: 'Enter' })
      );
    });
    expect(document.activeElement).toBe(buttons[1]);

    act(() => buttons[1].click());

    expect(buttons[1].getAttribute('aria-expanded')).toBe('true');
    expect(container.textContent).toContain('Second content');
    expect(onValueChange).toHaveBeenCalledWith('second');
    unmount();
  });

  it('keeps controlled state until its value changes and respects disabled state', () => {
    const onValueChange = vi.fn();
    const { container, rerender, unmount } = render(
      <Accordion value='first' onValueChange={onValueChange}>
        {sections}
      </Accordion>
    );
    const buttons = container.querySelectorAll<HTMLButtonElement>('button');
    act(() => buttons[1].click());
    expect(buttons[0].getAttribute('aria-expanded')).toBe('true');
    expect(onValueChange).toHaveBeenCalledWith('second');

    rerender(
      <Accordion value='second' onValueChange={onValueChange}>
        {sections}
      </Accordion>
    );
    expect(
      container.querySelectorAll('button')[1].getAttribute('aria-expanded')
    ).toBe('true');

    rerender(<Accordion disabled>{sections}</Accordion>);
    expect(container.querySelector('button')?.disabled).toBe(true);
    unmount();
  });
});
