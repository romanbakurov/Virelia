// Baseline contract: render, accessibility, compound-api
import { act } from 'react';

import { render } from '@test-utils/render';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { Accordion } from './Accordion';

const legacyDisclosureGlyph = String.fromCharCode(0x25be);

afterEach(() => {
  document.body.innerHTML = '';
});

describe('Accordion', () => {
  it('renders children', () => {
    const { container, unmount } = render(
      <Accordion>Rendered content</Accordion>
    );

    expect(container.textContent).toContain('Rendered content');
    unmount();
  });

  it('exposes the declared compound API', () => {
    expect(Accordion.Item).toBeTypeOf('function');
    expect(Accordion.Trigger).toBeTypeOf('function');
    expect(Accordion.Content).toBeTypeOf('function');
  });

  it('renders the disclosure indicator with a canonical icon instead of text glyphs', () => {
    const { container, unmount } = render(
      <Accordion>
        <Accordion.Item value='billing'>
          <Accordion.Trigger>Billing</Accordion.Trigger>
          <Accordion.Content>Billing details</Accordion.Content>
        </Accordion.Item>
      </Accordion>
    );

    expect(container.textContent).not.toContain(legacyDisclosureGlyph);
    expect(container.querySelector('svg')).not.toBeNull();
    unmount();
  });

  it('supports multiple open items', () => {
    const onValueChange = vi.fn();
    const { container, unmount } = render(
      <Accordion
        type='multiple'
        defaultValue={['billing']}
        onValueChange={onValueChange}
      >
        <Accordion.Item value='billing'>
          <Accordion.Trigger>Billing</Accordion.Trigger>
          <Accordion.Content>Billing details</Accordion.Content>
        </Accordion.Item>
        <Accordion.Item value='team'>
          <Accordion.Trigger>Team</Accordion.Trigger>
          <Accordion.Content>Team details</Accordion.Content>
        </Accordion.Item>
      </Accordion>
    );
    const buttons = container.querySelectorAll<HTMLButtonElement>('button');

    expect(buttons[0].getAttribute('aria-expanded')).toBe('true');

    act(() => buttons[1].click());

    expect(buttons[0].getAttribute('aria-expanded')).toBe('true');
    expect(buttons[1].getAttribute('aria-expanded')).toBe('true');
    expect(onValueChange).toHaveBeenCalledWith(['billing', 'team']);
    unmount();
  });

  it('allows single accordions to collapse when requested', () => {
    const onValueChange = vi.fn();
    const { container, unmount } = render(
      <Accordion
        defaultValue='billing'
        collapsible
        onValueChange={onValueChange}
      >
        <Accordion.Item value='billing'>
          <Accordion.Trigger>Billing</Accordion.Trigger>
          <Accordion.Content>Billing details</Accordion.Content>
        </Accordion.Item>
      </Accordion>
    );
    const trigger = container.querySelector<HTMLButtonElement>('button');

    act(() => trigger?.click());

    expect(trigger?.getAttribute('aria-expanded')).toBe('false');
    expect(onValueChange).toHaveBeenCalledWith('');
    unmount();
  });
});
