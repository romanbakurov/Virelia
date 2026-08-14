import { act } from 'react';

import { afterEach, describe, expect, it, vi } from 'vitest';

import { render } from '../../test-utils/render';

import { Tabs } from './Tabs';

function pressKey(target: EventTarget, key: string) {
  act(() => {
    target.dispatchEvent(
      new KeyboardEvent('keydown', {
        key,
        bubbles: true,
      })
    );
  });
}

function TabsExample({
  onValueChange,
}: {
  onValueChange?: (value: string) => void;
}) {
  return (
    <Tabs defaultValue='overview' onValueChange={onValueChange}>
      <Tabs.List aria-label='Documentation sections'>
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
}

function VerticalTabsExample() {
  return (
    <Tabs defaultValue='overview' orientation='vertical'>
      <Tabs.List aria-label='Vertical documentation sections'>
        <Tabs.Trigger value='overview'>Overview</Tabs.Trigger>

        <Tabs.Trigger value='usage'>Usage</Tabs.Trigger>
      </Tabs.List>

      <Tabs.Content value='overview'>Overview panel</Tabs.Content>

      <Tabs.Content value='usage'>Usage panel</Tabs.Content>
    </Tabs>
  );
}

afterEach(() => {
  vi.restoreAllMocks();
  document.body.innerHTML = '';
});

describe('Tabs keyboard', () => {
  it('moves with horizontal keyboard controls and skips disabled tabs', () => {
    const onValueChange = vi.fn();

    const { container, unmount } = render(
      <TabsExample onValueChange={onValueChange} />
    );

    const tabs = container.querySelectorAll<HTMLButtonElement>('[role="tab"]');

    pressKey(tabs[0], 'ArrowRight');

    expect(onValueChange).toHaveBeenCalledWith('usage');
    expect(tabs[2].getAttribute('aria-selected')).toBe('true');
    expect(document.activeElement).toBe(tabs[2]);

    expect(container.querySelector('[role="tabpanel"]')?.textContent).toContain(
      'Usage panel'
    );

    pressKey(tabs[2], 'ArrowLeft');

    expect(onValueChange).toHaveBeenCalledWith('overview');
    expect(tabs[0].getAttribute('aria-selected')).toBe('true');

    pressKey(tabs[0], 'End');

    expect(tabs[2].getAttribute('aria-selected')).toBe('true');

    pressKey(tabs[2], 'Home');

    expect(tabs[0].getAttribute('aria-selected')).toBe('true');

    unmount();
  });

  it('does not treat PageUp and PageDown as Tabs navigation shortcuts', () => {
    const { container, unmount } = render(<TabsExample />);
    const tabs = container.querySelectorAll<HTMLButtonElement>('[role="tab"]');

    pressKey(tabs[0], 'PageDown');

    expect(tabs[0].getAttribute('aria-selected')).toBe('true');

    pressKey(tabs[0], 'PageUp');

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
    expect(container.querySelector('[role="tabpanel"]')?.textContent).toContain(
      'Usage panel'
    );

    pressKey(tabs[1], 'ArrowUp');

    expect(tabs[0].getAttribute('aria-selected')).toBe('true');
    expect(container.querySelector('[role="tabpanel"]')?.textContent).toContain(
      'Overview panel'
    );

    unmount();
  });

  it('moves focus without selection in manual activation mode', () => {
    const onValueChange = vi.fn();
    const { container, unmount } = render(
      <Tabs
        defaultValue='overview'
        activationMode='manual'
        onValueChange={onValueChange}
      >
        <Tabs.List aria-label='Manual tabs'>
          <Tabs.Trigger value='overview'>Overview</Tabs.Trigger>
          <Tabs.Trigger value='usage'>Usage</Tabs.Trigger>
        </Tabs.List>

        <Tabs.Content value='overview'>Overview panel</Tabs.Content>
        <Tabs.Content value='usage'>Usage panel</Tabs.Content>
      </Tabs>
    );
    const tabs = container.querySelectorAll<HTMLButtonElement>('[role="tab"]');

    pressKey(tabs[0], 'ArrowRight');

    expect(document.activeElement).toBe(tabs[1]);
    expect(tabs[0].getAttribute('aria-selected')).toBe('true');
    expect(tabs[1].tabIndex).toBe(0);
    expect(onValueChange).not.toHaveBeenCalled();

    pressKey(tabs[1], 'Enter');

    expect(onValueChange).toHaveBeenCalledWith('usage');
    expect(tabs[1].getAttribute('aria-selected')).toBe('true');

    unmount();
  });

  it('reverses horizontal arrow keys in rtl', () => {
    const { container, unmount } = render(
      <Tabs defaultValue='overview' dir='rtl'>
        <Tabs.List aria-label='RTL tabs'>
          <Tabs.Trigger value='overview'>Overview</Tabs.Trigger>
          <Tabs.Trigger value='usage'>Usage</Tabs.Trigger>
        </Tabs.List>

        <Tabs.Content value='overview'>Overview panel</Tabs.Content>
        <Tabs.Content value='usage'>Usage panel</Tabs.Content>
      </Tabs>
    );
    const tabs = container.querySelectorAll<HTMLButtonElement>('[role="tab"]');

    pressKey(tabs[0], 'ArrowLeft');

    expect(tabs[1].getAttribute('aria-selected')).toBe('true');

    unmount();
  });

  it('moves focus between navigation triggers with arrow keys', () => {
    const onValueChange = vi.fn();

    const { container, unmount } = render(
      <Tabs
        mode='navigation'
        defaultValue='components'
        onValueChange={onValueChange}
      >
        <Tabs.List aria-label='Primary navigation'>
          <Tabs.Trigger value='components' asChild>
            <a href='#components'>Components</a>
          </Tabs.Trigger>

          <Tabs.Trigger value='themes' asChild>
            <a href='#themes'>Themes</a>
          </Tabs.Trigger>

          <Tabs.Trigger value='roadmap' asChild>
            <a href='#roadmap'>Roadmap</a>
          </Tabs.Trigger>
        </Tabs.List>
      </Tabs>
    );

    const links = container.querySelectorAll<HTMLAnchorElement>('a');

    links[0].focus();

    pressKey(links[0], 'ArrowRight');

    expect(document.activeElement).toBe(links[1]);
    expect(onValueChange).toHaveBeenCalledWith('themes');
    expect(links[1].getAttribute('aria-current')).toBe('page');

    pressKey(links[1], 'End');

    expect(document.activeElement).toBe(links[2]);
    expect(links[2].getAttribute('aria-current')).toBe('page');

    pressKey(links[2], 'Home');

    expect(document.activeElement).toBe(links[0]);
    expect(links[0].getAttribute('aria-current')).toBe('page');

    unmount();
  });
});
