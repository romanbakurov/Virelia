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
          <Tabs.Tab index={0}>Overview</Tabs.Tab>
          <Tabs.Tab index={1}>Usage</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel index={0}>Overview panel</Tabs.Panel>
        <Tabs.Panel index={1}>Usage panel</Tabs.Panel>
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
          <Tabs.Tab index={0}>Overview</Tabs.Tab>
          <Tabs.Tab index={1} disabled>
            Disabled
          </Tabs.Tab>
          <Tabs.Tab index={2}>Usage</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel index={0}>Overview panel</Tabs.Panel>
        <Tabs.Panel index={1}>Disabled panel</Tabs.Panel>
        <Tabs.Panel index={2}>Usage panel</Tabs.Panel>
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
      <Tabs defaultActiveIndex={1}>
        <Tabs.List>
          <Tabs.Tab index={0}>Overview</Tabs.Tab>
          <Tabs.Tab index={1}>Usage</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel index={0}>Overview panel</Tabs.Panel>
        <Tabs.Panel index={1}>Usage panel</Tabs.Panel>
      </Tabs>
    );

    expect(container.querySelector('[role="tablist"]')).not.toBeNull();

    const tabs = container.querySelectorAll<HTMLButtonElement>('[role="tab"]');
    expect(tabs[0].getAttribute('aria-selected')).toBe('false');
    expect(tabs[1].getAttribute('aria-selected')).toBe('true');
    expect(container.textContent).toContain('Usage panel');

    unmount();
  });

  it('keeps controlled active tab until activeIndex changes', () => {
    const onChange = vi.fn();
    const { container, rerender, unmount } = render(
      <Tabs activeIndex={0} onChange={onChange}>
        <Tabs.List>
          <Tabs.Tab index={0}>Overview</Tabs.Tab>
          <Tabs.Tab index={1}>Usage</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel index={0}>Overview panel</Tabs.Panel>
        <Tabs.Panel index={1}>Usage panel</Tabs.Panel>
      </Tabs>
    );

    const tabs = container.querySelectorAll<HTMLButtonElement>('[role="tab"]');
    act(() => tabs[1].click());

    expect(onChange).toHaveBeenCalledWith(1);
    expect(tabs[0].getAttribute('aria-selected')).toBe('true');
    expect(container.textContent).toContain('Overview panel');

    rerender(
      <Tabs activeIndex={1} onChange={onChange}>
        <Tabs.List>
          <Tabs.Tab index={0}>Overview</Tabs.Tab>
          <Tabs.Tab index={1}>Usage</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel index={0}>Overview panel</Tabs.Panel>
        <Tabs.Panel index={1}>Usage panel</Tabs.Panel>
      </Tabs>
    );

    const updatedTabs =
      container.querySelectorAll<HTMLButtonElement>('[role="tab"]');
    expect(updatedTabs[1].getAttribute('aria-selected')).toBe('true');
    expect(container.textContent).toContain('Usage panel');

    unmount();
  });

  it('marks disabled tabs and does not activate them', () => {
    const onChange = vi.fn();
    const { container, unmount } = render(
      <Tabs onChange={onChange}>
        <Tabs.List>
          <Tabs.Tab index={0}>Overview</Tabs.Tab>
          <Tabs.Tab index={1} disabled>
            Usage
          </Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel index={0}>Overview panel</Tabs.Panel>
        <Tabs.Panel index={1}>Usage panel</Tabs.Panel>
      </Tabs>
    );

    const tabs = container.querySelectorAll<HTMLButtonElement>('[role="tab"]');
    expect(tabs[1].getAttribute('aria-disabled')).toBe('true');

    act(() => tabs[1].click());

    expect(onChange).not.toHaveBeenCalled();
    expect(tabs[0].getAttribute('aria-selected')).toBe('true');
    expect(container.textContent).toContain('Overview panel');

    unmount();
  });
});
