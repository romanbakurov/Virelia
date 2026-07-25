import { act, useState } from 'react';

import { afterEach, describe, expect, it, vi } from 'vitest';

import { render } from '../../test-utils/render';

import { Tabs } from './Tabs';

import triggerStyles from './Trigger/TabsTrigger.module.scss';

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

function RemovableActiveTriggerExample() {
  const [showSettings, setShowSettings] = useState(true);

  return (
    <>
      <button
        type='button'
        onClick={() => setShowSettings((current) => !current)}
      >
        Toggle settings
      </button>

      <Tabs defaultValue='home'>
        <Tabs.List aria-label='Dynamic tabs'>
          <Tabs.Trigger value='home'>Home</Tabs.Trigger>
          <Tabs.Trigger value='profile'>Profile</Tabs.Trigger>
          {showSettings && (
            <Tabs.Trigger value='settings'>Settings</Tabs.Trigger>
          )}
          <Tabs.Indicator data-testid='indicator' />
        </Tabs.List>

        <Tabs.Content value='home'>Home panel</Tabs.Content>
        <Tabs.Content value='profile'>Profile panel</Tabs.Content>
        {showSettings && (
          <Tabs.Content value='settings'>Settings panel</Tabs.Content>
        )}
      </Tabs>
    </>
  );
}

function RemovableSiblingTriggerExample() {
  const [showProfile, setShowProfile] = useState(true);

  return (
    <>
      <button
        type='button'
        onClick={() => setShowProfile((current) => !current)}
      >
        Toggle profile
      </button>

      <Tabs defaultValue='home'>
        <Tabs.List aria-label='Dynamic tabs'>
          <Tabs.Trigger value='home'>Home</Tabs.Trigger>
          {showProfile && <Tabs.Trigger value='profile'>Profile</Tabs.Trigger>}
          <Tabs.Trigger value='settings'>Settings</Tabs.Trigger>
          <Tabs.Indicator data-testid='indicator' />
        </Tabs.List>

        <Tabs.Content value='home'>Home panel</Tabs.Content>
        {showProfile && (
          <Tabs.Content value='profile'>Profile panel</Tabs.Content>
        )}
        <Tabs.Content value='settings'>Settings panel</Tabs.Content>
      </Tabs>
    </>
  );
}

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
  document.body.innerHTML = '';
});

const rect = ({
  left = 0,
  right = 0,
  top = 0,
  width = 0,
  height = 0,
}: Partial<DOMRect> = {}) =>
  ({
    x: left,
    y: top,
    left,
    right,
    top,
    bottom: top + height,
    width,
    height,
    toJSON: () => ({}),
  }) as DOMRect;

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

  it('renders trigger slots, simple badge content, and scrollable list state', () => {
    const { container, unmount } = render(
      <Tabs defaultValue='settings' scrollable>
        <Tabs.List aria-label='Rich tabs'>
          <Tabs.Trigger
            value='settings'
            icon={<span>prop icon</span>}
            badge={4}
          >
            Settings
          </Tabs.Trigger>

          <Tabs.Trigger value='advanced'>
            <Tabs.Icon>
              <span>slot icon</span>
            </Tabs.Icon>
            <span>Advanced</span>
            <Tabs.Badge>New</Tabs.Badge>
          </Tabs.Trigger>
        </Tabs.List>

        <Tabs.Content value='settings'>Settings panel</Tabs.Content>
        <Tabs.Content value='advanced'>Advanced panel</Tabs.Content>
      </Tabs>
    );

    expect(
      container
        .querySelector('[role="tablist"]')
        ?.getAttribute('data-scrollable')
    ).toBe('');
    expect(container.textContent).toContain('prop icon');
    expect(container.textContent).toContain('4');
    expect(container.textContent).toContain('slot icon');
    expect(container.textContent).toContain('New');

    unmount();
  });

  it('applies size modifiers to triggers', () => {
    const { container, unmount } = render(
      <Tabs defaultValue='overview' size='lg'>
        <Tabs.List aria-label='Sized tabs'>
          <Tabs.Trigger value='overview'>Overview</Tabs.Trigger>
        </Tabs.List>

        <Tabs.Content value='overview'>Overview panel</Tabs.Content>
      </Tabs>
    );

    const tab = container.querySelector<HTMLButtonElement>('[role="tab"]');

    expect(tab?.className).toContain(triggerStyles.lg);

    unmount();
  });

  it('renders the visual indicator from active trigger geometry', async () => {
    const disconnect = vi.fn();
    const observe = vi.fn();

    vi.stubGlobal(
      'ResizeObserver',
      class ResizeObserver {
        observe = observe;
        disconnect = disconnect;
      }
    );

    Object.defineProperty(document, 'fonts', {
      configurable: true,
      value: { ready: Promise.resolve() },
    });

    vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(
      function getBoundingClientRect() {
        const element = this as HTMLElement;

        if (element.id.includes('trigger-settings')) {
          return rect({ left: 24, right: 88, top: 12, width: 64, height: 32 });
        }

        return rect({ left: 8, right: 208, top: 4, width: 200, height: 40 });
      }
    );

    const { container, unmount } = render(
      <Tabs defaultValue='settings' variant='segmented'>
        <Tabs.List aria-label='Indicator tabs'>
          <Tabs.Trigger value='general'>General</Tabs.Trigger>
          <Tabs.Trigger value='settings'>Settings</Tabs.Trigger>
          <Tabs.Indicator data-testid='indicator' />
        </Tabs.List>

        <Tabs.Content value='general'>General panel</Tabs.Content>
        <Tabs.Content value='settings'>Settings panel</Tabs.Content>
      </Tabs>
    );

    await act(async () => undefined);

    const indicator = container.querySelector<HTMLElement>(
      '[data-testid="indicator"]'
    );

    expect(indicator?.getAttribute('aria-hidden')).toBe('true');
    expect(indicator?.style.width).toBe('64px');
    expect(indicator?.style.transform).toBe('translate3d(16px, 0, 0)');
    expect(observe).toHaveBeenCalled();

    unmount();

    expect(disconnect).toHaveBeenCalled();
  });

  it('animates the line indicator through a collapsed capsule', async () => {
    const animate = vi.fn();

    Object.defineProperty(HTMLElement.prototype, 'animate', {
      configurable: true,
      value: animate,
    });

    vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(
      function getBoundingClientRect() {
        const element = this as HTMLElement;

        if (element.id.includes('trigger-general')) {
          return rect({ left: 16, right: 80, top: 0, width: 64, height: 32 });
        }

        if (element.id.includes('trigger-settings')) {
          return rect({ left: 120, right: 216, top: 0, width: 96, height: 32 });
        }

        return rect({ left: 0, right: 240, top: 0, width: 240, height: 40 });
      }
    );

    const { container, unmount } = render(
      <Tabs defaultValue='general'>
        <Tabs.List aria-label='Animated indicator tabs'>
          <Tabs.Trigger value='general'>General</Tabs.Trigger>
          <Tabs.Trigger value='settings'>Settings</Tabs.Trigger>
          <Tabs.Indicator data-testid='indicator' />
        </Tabs.List>

        <Tabs.Content value='general'>General panel</Tabs.Content>
        <Tabs.Content value='settings'>Settings panel</Tabs.Content>
      </Tabs>
    );

    await act(async () => undefined);

    act(() => {
      container
        .querySelector<HTMLButtonElement>('[id*="trigger-settings"]')
        ?.click();
    });

    await act(async () => undefined);

    expect(animate).toHaveBeenCalledWith(
      [
        {
          width: '64px',
          transform: 'translate3d(16px, 0, 0)',
          offset: 0,
        },
        {
          width: '8px',
          transform: 'translate3d(44px, 0, 0)',
          offset: 0.28,
        },
        {
          width: '8px',
          transform: 'translate3d(164px, 0, 0)',
          offset: 0.64,
        },
        {
          width: '96px',
          transform: 'translate3d(120px, 0, 0)',
          offset: 1,
        },
      ],
      {
        duration: 360,
        easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
        fill: 'none',
      }
    );

    unmount();
  });

  it('positions the indicator under the active trigger in rtl', async () => {
    vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(
      function getBoundingClientRect() {
        const element = this as HTMLElement;

        if (element.id.includes('trigger-settings')) {
          return rect({ left: 96, right: 176, top: 0, width: 80, height: 32 });
        }

        return rect({ left: 24, right: 224, top: 0, width: 200, height: 40 });
      }
    );

    const { container, unmount } = render(
      <Tabs defaultValue='settings' dir='rtl'>
        <Tabs.List aria-label='RTL indicator tabs'>
          <Tabs.Trigger value='general'>General</Tabs.Trigger>
          <Tabs.Trigger value='settings'>Settings</Tabs.Trigger>
          <Tabs.Indicator data-testid='indicator' />
        </Tabs.List>

        <Tabs.Content value='general'>General panel</Tabs.Content>
        <Tabs.Content value='settings'>Settings panel</Tabs.Content>
      </Tabs>
    );

    await act(async () => undefined);

    const indicator = container.querySelector<HTMLElement>(
      '[data-testid="indicator"]'
    );

    expect(indicator?.style.width).toBe('80px');
    expect(indicator?.style.transform).toBe('translate3d(72px, 0, 0)');

    unmount();
  });

  it('renders a vertical indicator using trigger height', async () => {
    vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(
      function getBoundingClientRect() {
        const element = this as HTMLElement;

        if (element.id.includes('trigger-settings')) {
          return rect({ left: 0, right: 120, top: 42, width: 120, height: 36 });
        }

        return rect({ left: 0, right: 140, top: 10, width: 140, height: 120 });
      }
    );

    const { container, unmount } = render(
      <Tabs defaultValue='settings' orientation='vertical'>
        <Tabs.List aria-label='Vertical indicator tabs'>
          <Tabs.Trigger value='general'>General</Tabs.Trigger>
          <Tabs.Trigger value='settings'>Settings</Tabs.Trigger>
          <Tabs.Indicator data-testid='indicator' />
        </Tabs.List>

        <Tabs.Content value='general'>General panel</Tabs.Content>
        <Tabs.Content value='settings'>Settings panel</Tabs.Content>
      </Tabs>
    );

    await act(async () => undefined);

    const indicator = container.querySelector<HTMLElement>(
      '[data-testid="indicator"]'
    );

    expect(indicator?.style.height).toBe('36px');
    expect(indicator?.style.transform).toBe('translate3d(0, 32px, 0)');

    unmount();
  });

  it('moves selection and indicator when the active trigger is removed', async () => {
    vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(
      function getBoundingClientRect() {
        const element = this as HTMLElement;

        if (element.id.includes('trigger-profile')) {
          return rect({ left: 64, right: 144, top: 0, width: 80, height: 32 });
        }

        if (element.id.includes('trigger-settings')) {
          return rect({ left: 144, right: 232, top: 0, width: 88, height: 32 });
        }

        return rect({ left: 0, right: 240, top: 0, width: 240, height: 40 });
      }
    );

    const { container, unmount } = render(<RemovableActiveTriggerExample />);

    await act(async () => undefined);

    act(() => {
      container
        .querySelector<HTMLButtonElement>('[id*="trigger-settings"]')
        ?.click();
    });

    await act(async () => undefined);

    act(() => {
      container.querySelector<HTMLButtonElement>('button')?.click();
    });

    await act(async () => undefined);

    const tabs = container.querySelectorAll<HTMLButtonElement>('[role="tab"]');
    const indicator = container.querySelector<HTMLElement>(
      '[data-testid="indicator"]'
    );

    expect([...tabs].map((tab) => tab.textContent)).toEqual([
      'Home',
      'Profile',
    ]);
    expect(tabs[1].getAttribute('aria-selected')).toBe('true');
    expect(indicator?.style.width).toBe('80px');
    expect(indicator?.style.transform).toBe('translate3d(64px, 0, 0)');

    unmount();
  });

  it('repositions the indicator when a sibling trigger is removed', async () => {
    vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(
      function getBoundingClientRect() {
        const element = this as HTMLElement;
        const profileExists = Boolean(
          document.querySelector('[id*="trigger-profile"]')
        );

        if (element.id.includes('trigger-settings')) {
          return profileExists
            ? rect({ left: 144, right: 232, top: 0, width: 88, height: 32 })
            : rect({ left: 64, right: 152, top: 0, width: 88, height: 32 });
        }

        if (element.id.includes('trigger-profile')) {
          return rect({ left: 64, right: 144, top: 0, width: 80, height: 32 });
        }

        return rect({ left: 0, right: 240, top: 0, width: 240, height: 40 });
      }
    );

    const { container, unmount } = render(<RemovableSiblingTriggerExample />);

    await act(async () => undefined);

    act(() => {
      container
        .querySelector<HTMLButtonElement>('[id*="trigger-settings"]')
        ?.click();
    });

    await act(async () => undefined);

    const indicator = container.querySelector<HTMLElement>(
      '[data-testid="indicator"]'
    );

    expect(indicator?.style.transform).toBe('translate3d(144px, 0, 0)');

    act(() => {
      container.querySelector<HTMLButtonElement>('button')?.click();
    });

    await act(async () => undefined);

    expect(
      container.querySelector<HTMLButtonElement>('[id*="trigger-settings"]')
    ).not.toBeNull();
    expect(indicator?.style.width).toBe('88px');
    expect(indicator?.style.transform).toBe('translate3d(64px, 0, 0)');

    unmount();
  });

  it('keeps all content mounted when keepMounted is enabled', () => {
    const { container, unmount } = render(
      <Tabs defaultValue='overview' keepMounted>
        <Tabs.List aria-label='Keep mounted tabs'>
          <Tabs.Trigger value='overview'>Overview</Tabs.Trigger>
          <Tabs.Trigger value='usage'>Usage</Tabs.Trigger>
        </Tabs.List>

        <Tabs.Content value='overview'>Overview panel</Tabs.Content>
        <Tabs.Content value='usage'>Usage panel</Tabs.Content>
      </Tabs>
    );

    const panels = container.querySelectorAll<HTMLElement>('[role="tabpanel"]');

    expect(panels).toHaveLength(2);
    expect(panels[0].hidden).toBe(false);
    expect(panels[1].hidden).toBe(true);

    unmount();
  });

  it('force mounts inactive content independently of root mounting policy', () => {
    const { container, unmount } = render(
      <Tabs defaultValue='overview'>
        <Tabs.List aria-label='Force mounted tabs'>
          <Tabs.Trigger value='overview'>Overview</Tabs.Trigger>
          <Tabs.Trigger value='usage'>Usage</Tabs.Trigger>
        </Tabs.List>

        <Tabs.Content value='overview'>Overview panel</Tabs.Content>
        <Tabs.Content value='usage' forceMount>
          Usage panel
        </Tabs.Content>
      </Tabs>
    );

    const panels = container.querySelectorAll<HTMLElement>('[role="tabpanel"]');

    expect(panels).toHaveLength(2);
    expect(panels[1].hidden).toBe(true);

    unmount();
  });

  it('applies root disabled state to triggers', () => {
    const onValueChange = vi.fn();
    const { container, unmount } = render(
      <Tabs defaultValue='overview' disabled onValueChange={onValueChange}>
        <Tabs.List aria-label='Disabled tabs'>
          <Tabs.Trigger value='overview'>Overview</Tabs.Trigger>
          <Tabs.Trigger value='usage'>Usage</Tabs.Trigger>
        </Tabs.List>

        <Tabs.Content value='overview'>Overview panel</Tabs.Content>
        <Tabs.Content value='usage'>Usage panel</Tabs.Content>
      </Tabs>
    );

    const tabs = container.querySelectorAll<HTMLButtonElement>('[role="tab"]');

    expect(tabs[0].disabled).toBe(true);
    expect(tabs[0].getAttribute('data-disabled')).toBe('');

    act(() => {
      tabs[1].click();
    });

    expect(onValueChange).not.toHaveBeenCalled();
    expect(tabs[0].getAttribute('aria-selected')).toBe('true');

    unmount();
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

    unmount();
  });

  it('warns when content has no matching trigger', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);

    const { unmount } = render(
      <Tabs defaultValue='general'>
        <Tabs.List aria-label='Missing trigger value'>
          <Tabs.Trigger value='general'>General</Tabs.Trigger>
        </Tabs.List>

        <Tabs.Content value='general'>General panel</Tabs.Content>
        <Tabs.Content value='orphan' forceMount>
          Orphan panel
        </Tabs.Content>
      </Tabs>
    );

    expect(warn).toHaveBeenCalledWith(
      'Tabs.Content value "orphan" does not match any Tabs.Trigger.'
    );

    unmount();
  });
});
