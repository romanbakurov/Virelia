// Coverage contract: accessible-name, interaction, controlled, uncontrolled, disabled, keyboard, instance-isolation
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
  it('updates uncontrolled state from keyboard activation', async () => {
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

  it('isolates relationship IDs across Accordion instances', () => {
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
    const triggers = container.querySelectorAll<HTMLButtonElement>('button');
    const firstId = triggers[0].getAttribute('aria-controls');
    const secondId = triggers[1].getAttribute('aria-controls');

    expect(firstId).toBeTruthy();
    expect(secondId).toBeTruthy();
    expect(firstId).not.toBe(secondId);
    expect(document.getElementById(firstId ?? '')?.textContent).toContain(
      'First billing details'
    );
    expect(document.getElementById(secondId ?? '')?.textContent).toContain(
      'Second billing details'
    );

    rerender(renderAccordions());

    const rerendered = container.querySelectorAll<HTMLButtonElement>('button');
    expect(rerendered[0].getAttribute('aria-controls')).toBe(firstId);
    expect(rerendered[1].getAttribute('aria-controls')).toBe(secondId);
    unmount();
  });
});
