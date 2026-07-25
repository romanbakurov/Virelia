import { act } from 'react';

import { afterEach, describe, expect, it, vi } from 'vitest';

import { render } from '../../test-utils/render';

import { Tabs } from '.';

afterEach(() => {
  document.body.innerHTML = '';
});

describe('Native Tabs', () => {
  it('switches active panel when tab is pressed', () => {
    const { container, unmount } = render(
      <Tabs>
        <Tabs.List>
          <Tabs.Trigger value='overview'>Overview</Tabs.Trigger>
          <Tabs.Trigger value='usage'>Usage</Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value='overview'>Overview panel</Tabs.Content>
        <Tabs.Content value='usage'>Usage panel</Tabs.Content>
      </Tabs>
    );

    expect(container.textContent).toContain('Overview panel');

    const tabs = container.querySelectorAll<HTMLButtonElement>('[role="tab"]');
    act(() => tabs[1].click());

    expect(container.textContent).toContain('Usage panel');
    expect(container.textContent).not.toContain('Overview panel');

    unmount();
  });

  it('exposes tablist, tab names, selected state, and disabled state', () => {
    const { container, unmount } = render(
      <Tabs>
        <Tabs.List>
          <Tabs.Trigger value='overview'>Overview</Tabs.Trigger>
          <Tabs.Trigger value='disabled' disabled>
            Disabled
          </Tabs.Trigger>
          <Tabs.Trigger value='usage'>Usage</Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value='overview'>Overview panel</Tabs.Content>
        <Tabs.Content value='disabled'>Disabled panel</Tabs.Content>
        <Tabs.Content value='usage'>Usage panel</Tabs.Content>
      </Tabs>
    );

    const tablist = container.querySelector('[role="tablist"]');
    const tabs = container.querySelectorAll<HTMLButtonElement>('[role="tab"]');

    expect(tablist).not.toBeNull();
    expect(tabs).toHaveLength(3);
    expect(tabs[0].textContent).toBe('Overview');
    expect(tabs[0].getAttribute('aria-selected')).toBe('true');
    expect(tabs[0].getAttribute('aria-disabled')).toBeNull();
    expect(tabs[1].textContent).toBe('Disabled');
    expect(tabs[1].disabled).toBe(true);
    expect(tabs[1].getAttribute('aria-selected')).toBe('false');
    expect(tabs[1].getAttribute('aria-disabled')).toBe('true');
    expect(tabs[2].textContent).toBe('Usage');
    expect(tabs[2].getAttribute('aria-selected')).toBe('false');

    act(() => tabs[2].click());

    expect(tabs[0].getAttribute('aria-selected')).toBe('false');
    expect(tabs[2].getAttribute('aria-selected')).toBe('true');
    expect(container.textContent).toContain('Usage panel');
    expect(container.textContent).not.toContain('Overview panel');

    unmount();
  });

  it('exposes tablist and tab selected states', () => {
    const { container, unmount } = render(
      <Tabs defaultValue='usage'>
        <Tabs.List>
          <Tabs.Trigger value='overview'>Overview</Tabs.Trigger>
          <Tabs.Trigger value='usage'>Usage</Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value='overview'>Overview panel</Tabs.Content>
        <Tabs.Content value='usage'>Usage panel</Tabs.Content>
      </Tabs>
    );

    expect(container.querySelector('[role="tablist"]')).not.toBeNull();

    const tabs = container.querySelectorAll<HTMLButtonElement>('[role="tab"]');
    expect(tabs[0].getAttribute('aria-selected')).toBe('false');
    expect(tabs[1].getAttribute('aria-selected')).toBe('true');
    expect(container.textContent).toContain('Usage panel');

    unmount();
  });

  it('keeps controlled active tab until value changes', () => {
    const onValueChange = vi.fn();
    const { container, rerender, unmount } = render(
      <Tabs value='overview' onValueChange={onValueChange}>
        <Tabs.List>
          <Tabs.Trigger value='overview'>Overview</Tabs.Trigger>
          <Tabs.Trigger value='usage'>Usage</Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value='overview'>Overview panel</Tabs.Content>
        <Tabs.Content value='usage'>Usage panel</Tabs.Content>
      </Tabs>
    );

    const tabs = container.querySelectorAll<HTMLButtonElement>('[role="tab"]');
    act(() => tabs[1].click());

    expect(onValueChange).toHaveBeenCalledWith('usage');
    expect(tabs[0].getAttribute('aria-selected')).toBe('true');
    expect(container.textContent).toContain('Overview panel');

    rerender(
      <Tabs value='usage' onValueChange={onValueChange}>
        <Tabs.List>
          <Tabs.Trigger value='overview'>Overview</Tabs.Trigger>
          <Tabs.Trigger value='usage'>Usage</Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value='overview'>Overview panel</Tabs.Content>
        <Tabs.Content value='usage'>Usage panel</Tabs.Content>
      </Tabs>
    );

    const updatedTabs =
      container.querySelectorAll<HTMLButtonElement>('[role="tab"]');
    expect(updatedTabs[1].getAttribute('aria-selected')).toBe('true');
    expect(container.textContent).toContain('Usage panel');

    unmount();
  });

  it('marks disabled tabs and does not activate them', () => {
    const onValueChange = vi.fn();
    const { container, unmount } = render(
      <Tabs defaultValue='overview' onValueChange={onValueChange}>
        <Tabs.List>
          <Tabs.Trigger value='overview'>Overview</Tabs.Trigger>
          <Tabs.Trigger value='usage' disabled>
            Usage
          </Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value='overview'>Overview panel</Tabs.Content>
        <Tabs.Content value='usage'>Usage panel</Tabs.Content>
      </Tabs>
    );

    const tabs = container.querySelectorAll<HTMLButtonElement>('[role="tab"]');
    expect(tabs[1].getAttribute('aria-disabled')).toBe('true');

    act(() => tabs[1].click());

    expect(onValueChange).not.toHaveBeenCalled();
    expect(tabs[0].getAttribute('aria-selected')).toBe('true');
    expect(container.textContent).toContain('Overview panel');

    unmount();
  });
});
