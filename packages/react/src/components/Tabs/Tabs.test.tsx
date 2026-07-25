import { act } from 'react';

import { afterEach, describe, expect, it, vi } from 'vitest';

import { expectNoA11yViolations } from '../../test-utils/a11y';
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
  document.body.innerHTML = '';
});

describe('Tabs', () => {
  it('selects the first enabled trigger by default in uncontrolled mode', () => {
    const { container, unmount } = render(
      <Tabs>
        <Tabs.List aria-label='Settings sections'>
          <Tabs.Trigger value='disabled' disabled>
            Disabled
          </Tabs.Trigger>

          <Tabs.Trigger value='general'>General</Tabs.Trigger>
        </Tabs.List>

        <Tabs.Content value='disabled'>Disabled panel</Tabs.Content>
        <Tabs.Content value='general'>General panel</Tabs.Content>
      </Tabs>
    );

    const tabs = container.querySelectorAll<HTMLButtonElement>('[role="tab"]');

    expect(tabs[0].getAttribute('aria-selected')).toBe('false');
    expect(tabs[1].getAttribute('aria-selected')).toBe('true');
    expect(container.querySelector('[role="tabpanel"]')?.textContent).toContain(
      'General panel'
    );

    unmount();
  });

  it('switches active content when a trigger is clicked', () => {
    const { container, unmount } = render(<TabsExample />);
    const tabs = container.querySelectorAll<HTMLButtonElement>('[role="tab"]');

    expect(tabs[0].getAttribute('aria-selected')).toBe('true');
    expect(container.querySelector('[role="tabpanel"]')?.textContent).toContain(
      'Overview panel'
    );

    act(() => {
      tabs[2].click();
    });

    expect(tabs[0].getAttribute('aria-selected')).toBe('false');
    expect(tabs[2].getAttribute('aria-selected')).toBe('true');

    expect(container.querySelectorAll('[role="tabpanel"]')).toHaveLength(1);

    expect(container.querySelector('[role="tabpanel"]')?.textContent).toContain(
      'Usage panel'
    );

    unmount();
  });

  it('connects triggers and content with accessible ids', async () => {
    const { container, unmount } = render(<TabsExample />);
    const tab = container.querySelector<HTMLButtonElement>('[role="tab"]');
    const panel = container.querySelector<HTMLElement>('[role="tabpanel"]');

    await expectNoA11yViolations(container);

    expect(
      container
        .querySelector('[role="tablist"]')
        ?.getAttribute('aria-orientation')
    ).toBe('horizontal');

    expect(tab?.getAttribute('aria-controls')).toBe(panel?.id);
    expect(panel?.getAttribute('aria-labelledby')).toBe(tab?.id);
    expect(tab?.tabIndex).toBe(0);

    unmount();
  });

  it('exposes accessible names, states, and roving tab stops', () => {
    const { container, unmount } = render(<TabsExample />);
    const tablist = container.querySelector<HTMLElement>('[role="tablist"]');
    const tabs = container.querySelectorAll<HTMLButtonElement>('[role="tab"]');

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

    const initialPanel =
      container.querySelector<HTMLElement>('[role="tabpanel"]');

    expect(initialPanel?.getAttribute('aria-labelledby')).toBe(tabs[0].id);
    expect(initialPanel?.tabIndex).toBe(0);
    expect(initialPanel?.textContent).toContain('Overview panel');

    act(() => {
      tabs[2].click();
    });

    expect(tabs[0].getAttribute('aria-selected')).toBe('false');
    expect(tabs[0].tabIndex).toBe(-1);
    expect(tabs[2].getAttribute('aria-selected')).toBe('true');
    expect(tabs[2].tabIndex).toBe(0);

    const activePanel =
      container.querySelector<HTMLElement>('[role="tabpanel"]');

    expect(activePanel?.getAttribute('aria-labelledby')).toBe(tabs[2].id);
    expect(activePanel?.textContent).toContain('Usage panel');

    unmount();
  });

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

  it('keeps lazily mounted content after first activation', () => {
    const { container, unmount } = render(
      <Tabs defaultValue='overview' keepMounted lazyMount>
        <Tabs.List aria-label='Mounting tabs'>
          <Tabs.Trigger value='overview'>Overview</Tabs.Trigger>
          <Tabs.Trigger value='usage'>Usage</Tabs.Trigger>
        </Tabs.List>

        <Tabs.Content value='overview'>Overview panel</Tabs.Content>
        <Tabs.Content value='usage'>Usage panel</Tabs.Content>
      </Tabs>
    );
    const tabs = container.querySelectorAll<HTMLButtonElement>('[role="tab"]');

    expect(container.querySelectorAll('[role="tabpanel"]')).toHaveLength(1);

    act(() => {
      tabs[1].click();
    });

    expect(container.querySelectorAll('[role="tabpanel"]')).toHaveLength(2);

    act(() => {
      tabs[0].click();
    });

    const panels = container.querySelectorAll<HTMLElement>('[role="tabpanel"]');

    expect(panels).toHaveLength(2);
    expect(panels[1].hidden).toBe(true);

    unmount();
  });

  it('exposes indicator and trigger slots through the compound export', () => {
    expect(Tabs.Indicator).toBeDefined();
    expect(Tabs.Icon).toBeDefined();
    expect(Tabs.Badge).toBeDefined();
  });

  it('warns without crashing when a controlled value has no trigger', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);

    const { container, unmount } = render(
      <Tabs value='billing' onValueChange={() => undefined}>
        <Tabs.List aria-label='Controlled missing value'>
          <Tabs.Trigger value='general'>General</Tabs.Trigger>
        </Tabs.List>

        <Tabs.Content value='general'>General panel</Tabs.Content>
      </Tabs>
    );

    expect(container.querySelector('[role="tabpanel"]')).toBeNull();
    expect(warn).toHaveBeenCalledWith(
      'Tabs: value "billing" does not match any Tabs.Trigger.'
    );

    warn.mockRestore();
    unmount();
  });

  it('warns when trigger values are duplicated', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);

    const { unmount } = render(
      <Tabs defaultValue='general'>
        <Tabs.List aria-label='Duplicate values'>
          <Tabs.Trigger value='general'>General</Tabs.Trigger>
          <Tabs.Trigger value='general'>Duplicate general</Tabs.Trigger>
        </Tabs.List>

        <Tabs.Content value='general'>General panel</Tabs.Content>
      </Tabs>
    );

    expect(warn).toHaveBeenCalledWith(
      'Tabs.Trigger values must be unique. Duplicate value: "general".'
    );

    warn.mockRestore();
    unmount();
  });
});
