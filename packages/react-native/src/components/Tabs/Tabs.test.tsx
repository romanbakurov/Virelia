import { act } from 'react';

import { afterEach, describe, expect, it, vi } from 'vitest';

import { render } from '../../test-utils/render';

import { Tabs } from '.';

afterEach(() => {
  document.body.innerHTML = '';
});

describe('Native Tabs', () => {
  it('exposes indicator and trigger slots through the compound export', () => {
    expect(Tabs.Indicator).toBeDefined();
    expect(Tabs.Icon).toBeDefined();
    expect(Tabs.Badge).toBeDefined();
  });

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

  it('does not render trigger borders for the line variant', () => {
    const { container, unmount } = render(
      <Tabs defaultValue='overview' variant='line'>
        <Tabs.List>
          <Tabs.Trigger value='overview'>Overview</Tabs.Trigger>
          <Tabs.Trigger value='usage'>Usage</Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value='overview'>Overview panel</Tabs.Content>
        <Tabs.Content value='usage'>Usage panel</Tabs.Content>
      </Tabs>
    );

    const tabs = container.querySelectorAll<HTMLButtonElement>('[role="tab"]');

    expect(tabs[0].style.borderColor).toBe('transparent');
    expect(tabs[1].style.borderColor).toBe('transparent');

    unmount();
  });

  it('keeps icon-only pill triggers square', () => {
    const { container, unmount } = render(
      <Tabs defaultValue='home' variant='pills'>
        <Tabs.List>
          <Tabs.Trigger value='home' icon={<span data-testid='home-icon' />} />
          <Tabs.Trigger
            value='settings'
            icon={<span data-testid='settings-icon' />}
          />
          <Tabs.Indicator />
        </Tabs.List>
        <Tabs.Content value='home'>Home panel</Tabs.Content>
        <Tabs.Content value='settings'>Settings panel</Tabs.Content>
      </Tabs>
    );

    const tabs = container.querySelectorAll<HTMLButtonElement>('[role="tab"]');

    expect(tabs[0].style.width).toBe('36px');
    expect(tabs[0].style.minWidth).toBe('36px');
    expect(tabs[1].style.width).toBe('36px');
    expect(tabs[1].style.minWidth).toBe('36px');

    unmount();
  });

  it('stretches segmented triggers evenly across the list', () => {
    const { container, unmount } = render(
      <Tabs defaultValue='overview' variant='segmented'>
        <Tabs.List>
          <Tabs.Trigger value='overview'>Overview</Tabs.Trigger>
          <Tabs.Trigger value='access'>Access</Tabs.Trigger>
          <Tabs.Indicator />
        </Tabs.List>
        <Tabs.Content value='overview'>Overview panel</Tabs.Content>
        <Tabs.Content value='access'>Access panel</Tabs.Content>
      </Tabs>
    );

    const tabs = container.querySelectorAll<HTMLButtonElement>('[role="tab"]');

    expect(tabs[0].style.flex).toBe('1 1 0%');
    expect(tabs[0].style.minWidth).toBe('0px');
    expect(tabs[1].style.flex).toBe('1 1 0%');
    expect(tabs[1].style.minWidth).toBe('0px');

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

  it('renders icon and badge props on a trigger', () => {
    const { container, unmount } = render(
      <Tabs defaultValue='settings' variant='segmented'>
        <Tabs.List>
          <Tabs.Trigger
            value='settings'
            icon={<span data-testid='settings-icon'>icon</span>}
            badge='New'
          >
            Settings
          </Tabs.Trigger>

          <Tabs.Indicator />
        </Tabs.List>

        <Tabs.Content value='settings'>Settings content</Tabs.Content>
      </Tabs>
    );

    const trigger = container.querySelector<HTMLButtonElement>('[role="tab"]');

    expect(
      container.querySelector('[data-testid="settings-icon"]')
    ).not.toBeNull();

    expect(trigger?.textContent).toContain('Settings');
    expect(trigger?.textContent).toContain('New');

    unmount();
  });

  it('renders Tabs.Icon inside the Tabs context', () => {
    const { container, unmount } = render(
      <Tabs defaultValue='overview'>
        <Tabs.List>
          <Tabs.Trigger value='overview'>Overview</Tabs.Trigger>
        </Tabs.List>

        <Tabs.Content value='overview'>
          <Tabs.Icon>
            <span data-testid='tabs-icon'>Icon</span>
          </Tabs.Icon>
        </Tabs.Content>
      </Tabs>
    );

    expect(container.querySelector('[data-testid="tabs-icon"]')).not.toBeNull();

    unmount();
  });

  it('renders Tabs.Badge inside the Tabs context', () => {
    const { container, unmount } = render(
      <Tabs defaultValue='overview'>
        <Tabs.List>
          <Tabs.Trigger value='overview'>Overview</Tabs.Trigger>
        </Tabs.List>

        <Tabs.Content value='overview'>
          <Tabs.Badge>New</Tabs.Badge>
        </Tabs.Content>
      </Tabs>
    );

    expect(container.textContent).toContain('New');

    unmount();
  });

  it('renders compound icon and badge slots together', () => {
    const { container, unmount } = render(
      <Tabs defaultValue='overview' size='lg' color='success'>
        <Tabs.List>
          <Tabs.Trigger value='overview'>Overview</Tabs.Trigger>
        </Tabs.List>

        <Tabs.Content value='overview'>
          <Tabs.Icon>
            <span data-testid='compound-icon'>Icon</span>
          </Tabs.Icon>

          <Tabs.Badge>12</Tabs.Badge>
        </Tabs.Content>
      </Tabs>
    );

    expect(
      container.querySelector('[data-testid="compound-icon"]')
    ).not.toBeNull();
    expect(container.textContent).toContain('12');

    unmount();
  });

  it('throws when a compound slot is rendered outside Tabs', () => {
    expect(() => {
      render(<Tabs.Badge>New</Tabs.Badge>);
    }).toThrow('Tabs components must be used inside <Tabs>.');
  });
});
