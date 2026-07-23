import { act } from 'react';

import { afterEach, describe, expect, it, vi } from 'vitest';

import { expectNoA11yViolations } from '../../test-utils/a11y';
import { render } from '../../test-utils/render';

import { Tabs } from './Tabs';

function pressKey(target: EventTarget, key: string) {
  act(() => {
    target.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true }));
  });
}

function TabsExample({ onChange }: { onChange?: (index: number) => void }) {
  return (
    <Tabs onChange={onChange}>
      <Tabs.List aria-label='Documentation sections'>
        <Tabs.Trigger index={0}>Overview</Tabs.Trigger>

        <Tabs.Trigger index={1} disabled>
          Disabled
        </Tabs.Trigger>

        <Tabs.Trigger index={2}>Usage</Tabs.Trigger>
      </Tabs.List>

      <Tabs.Content index={0}>Overview panel</Tabs.Content>
      <Tabs.Content index={1}>Disabled panel</Tabs.Content>
      <Tabs.Content index={2}>Usage panel</Tabs.Content>
    </Tabs>
  );
}

function VerticalTabsExample() {
  return (
    <Tabs orientation='vertical'>
      <Tabs.List aria-label='Vertical documentation sections'>
        <Tabs.Trigger index={0}>Overview</Tabs.Trigger>
        <Tabs.Trigger index={1}>Usage</Tabs.Trigger>
      </Tabs.List>

      <Tabs.Content index={0}>Overview panel</Tabs.Content>
      <Tabs.Content index={1}>Usage panel</Tabs.Content>
    </Tabs>
  );
}

afterEach(() => {
  document.body.innerHTML = '';
});

describe('Tabs', () => {
  it('switches active panel when a tab is clicked', () => {
    const { container, unmount } = render(<TabsExample />);
    const tabs = container.querySelectorAll<HTMLButtonElement>('[role="tab"]');

    expect(tabs[0].getAttribute('aria-selected')).toBe('true');
    expect(container.textContent).toContain('Overview panel');

    act(() => tabs[2].click());

    const panels = container.querySelectorAll<HTMLElement>('[role="tabpanel"]');

    expect(tabs[2].getAttribute('aria-selected')).toBe('true');
    expect(panels[0].hidden).toBe(true);
    expect(panels[2].hidden).toBe(false);
    expect(panels[2].textContent).toContain('Usage panel');

    unmount();
  });

  it('connects tabs and panels with accessible ids', async () => {
    const { container, unmount } = render(<TabsExample />);
    const tab = container.querySelector<HTMLButtonElement>('#tab-0');
    const panel = container.querySelector<HTMLElement>('#tab-panel-0');

    await expectNoA11yViolations(container);

    expect(
      container
        .querySelector('[role="tablist"]')
        ?.getAttribute('aria-orientation')
    ).toBe('horizontal');
    expect(tab?.getAttribute('aria-controls')).toBe('tab-panel-0');
    expect(panel?.getAttribute('aria-labelledby')).toBe('tab-0');
    expect(tab?.tabIndex).toBe(0);

    unmount();
  });

  it('exposes strict screen-reader names, states, and roving tab stops', () => {
    const { container, unmount } = render(<TabsExample />);
    const tablist = container.querySelector<HTMLElement>('[role="tablist"]');
    const tabs = container.querySelectorAll<HTMLButtonElement>('[role="tab"]');
    const panels = container.querySelectorAll<HTMLElement>('[role="tabpanel"]');

    expect(tablist?.getAttribute('aria-label')).toBe('Documentation sections');
    expect(tabs).toHaveLength(3);
    expect(tabs[0].textContent).toBe('Overview');
    expect(tabs[0].getAttribute('aria-selected')).toBe('true');
    expect(tabs[0].tabIndex).toBe(0);
    expect(tabs[1].textContent).toBe('Disabled');
    expect(tabs[1].disabled).toBe(true);
    expect(tabs[1].getAttribute('aria-selected')).toBe('false');
    expect(tabs[1].tabIndex).toBe(-1);
    expect(tabs[2].textContent).toBe('Usage');
    expect(tabs[2].getAttribute('aria-selected')).toBe('false');
    expect(tabs[2].tabIndex).toBe(-1);

    expect(panels[0].getAttribute('aria-labelledby')).toBe(tabs[0].id);
    expect(panels[0].tabIndex).toBe(0);
    expect(panels[0].hidden).toBe(false);
    expect(panels[1].hidden).toBe(true);
    expect(panels[2].hidden).toBe(true);

    act(() => tabs[2].click());

    expect(tabs[0].getAttribute('aria-selected')).toBe('false');
    expect(tabs[0].tabIndex).toBe(-1);
    expect(tabs[2].getAttribute('aria-selected')).toBe('true');
    expect(tabs[2].tabIndex).toBe(0);
    expect(panels[0].hidden).toBe(true);
    expect(panels[2].hidden).toBe(false);

    unmount();
  });

  it('moves with horizontal keyboard controls and skips disabled tabs', () => {
    const onChange = vi.fn();
    const { container, unmount } = render(<TabsExample onChange={onChange} />);
    const tabs = container.querySelectorAll<HTMLButtonElement>('[role="tab"]');

    pressKey(tabs[0], 'ArrowRight');

    expect(onChange).toHaveBeenCalledWith(2);
    expect(tabs[2].getAttribute('aria-selected')).toBe('true');
    expect(document.activeElement).toBe(tabs[2]);
    expect(container.textContent).toContain('Usage panel');

    pressKey(tabs[2], 'ArrowLeft');

    expect(onChange).toHaveBeenCalledWith(0);
    expect(tabs[0].getAttribute('aria-selected')).toBe('true');

    pressKey(tabs[0], 'End');

    expect(tabs[2].getAttribute('aria-selected')).toBe('true');

    pressKey(tabs[2], 'Home');

    expect(tabs[0].getAttribute('aria-selected')).toBe('true');

    unmount();
  });

  it('uses vertical arrow keys when orientation is vertical', () => {
    const { container, unmount } = render(<VerticalTabsExample />);
    const tabs = container.querySelectorAll<HTMLButtonElement>('[role="tab"]');

    expect(
      container
        .querySelector('[role="tablist"]')
        ?.getAttribute('aria-orientation')
    ).toBe('vertical');

    pressKey(tabs[0], 'ArrowDown');

    expect(tabs[1].getAttribute('aria-selected')).toBe('true');
    expect(container.textContent).toContain('Usage panel');

    pressKey(tabs[1], 'ArrowUp');

    expect(tabs[0].getAttribute('aria-selected')).toBe('true');
    expect(container.textContent).toContain('Overview panel');

    unmount();
  });
});
