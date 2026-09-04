// Coverage contract: accessible-name, interaction, instance-isolation, controlled, uncontrolled, disabled, keyboard
import { act } from 'react';

import { render } from '@test-utils/render';
import userEvent from '@testing-library/user-event';
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
  it('provides named, keyboard-native triggers and updates uncontrolled state from keyboard activation', async () => {
    const user = userEvent.setup();
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
    await user.keyboard('{Enter}');

    expect(document.activeElement).toBe(buttons[1]);
    expect(buttons[1].getAttribute('aria-expanded')).toBe('true');
    expect(container.textContent).toContain('Second content');
    expect(onValueChange).toHaveBeenLastCalledWith('second');

    buttons[0].focus();
    await user.keyboard(' ');

    expect(buttons[0].getAttribute('aria-expanded')).toBe('true');
    expect(onValueChange).toHaveBeenLastCalledWith('first');
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

  it('keeps trigger/content relationships unique across Accordion instances and stable across rerenders', () => {
    const renderAccordions = () => (
      <>
        <Accordion defaultValue='billing'>
          <Accordion.Item value='billing'>
            <Accordion.Trigger>First billing</Accordion.Trigger>
            <Accordion.Content>First billing details</Accordion.Content>
          </Accordion.Item>
        </Accordion>
        <Accordion defaultValue='billing'>
          <Accordion.Item value='billing'>
            <Accordion.Trigger>Second billing</Accordion.Trigger>
            <Accordion.Content>Second billing details</Accordion.Content>
          </Accordion.Item>
        </Accordion>
      </>
    );

    const { container, rerender, unmount } = render(renderAccordions());
    const initialTriggers = container.querySelectorAll<HTMLButtonElement>('button');
    const initialControlIds = Array.from(initialTriggers, (trigger) =>
      trigger.getAttribute('aria-controls')
    );

    expect(initialControlIds[0]).toBeTruthy();
    expect(initialControlIds[1]).toBeTruthy();
    expect(initialControlIds[0]).not.toBe(initialControlIds[1]);
    expect(new Set(initialControlIds).size).toBe(2);

    const firstPanel = container.querySelector<HTMLElement>(
      `[id="${initialControlIds[0]}"]`
    );
    const secondPanel = container.querySelector<HTMLElement>(
      `[id="${initialControlIds[1]}"]`
    );

    expect(firstPanel?.textContent).toContain('First billing details');
    expect(secondPanel?.textContent).toContain('Second billing details');

    rerender(renderAccordions());

    const rerenderedControlIds = Array.from(
      container.querySelectorAll<HTMLButtonElement>('button'),
      (trigger) => trigger.getAttribute('aria-controls')
    );

    expect(rerenderedControlIds).toEqual(initialControlIds);
    unmount();
  });
});
