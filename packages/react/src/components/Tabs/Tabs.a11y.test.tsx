import { act } from 'react';

import { afterEach, describe, expect, it } from 'vitest';

import { expectNoA11yViolations } from '../../test-utils/a11y';
import { render } from '../../test-utils/render';

import { Tabs } from './Tabs';

function TabsExample() {
  return (
    <Tabs defaultValue='overview'>
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

afterEach(() => {
  document.body.innerHTML = '';
});

describe('Tabs accessibility', () => {
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

  it('renders navigation mode without tab ARIA semantics', async () => {
    const { container, unmount } = render(
      <nav aria-label='Primary navigation'>
        <Tabs mode='navigation' defaultValue='components'>
          <Tabs.List>
            <Tabs.Trigger value='components' asChild>
              <a href='/components'>Components</a>
            </Tabs.Trigger>

            <Tabs.Trigger value='themes' asChild>
              <a href='/themes'>Themes</a>
            </Tabs.Trigger>
          </Tabs.List>
        </Tabs>
      </nav>
    );

    await expectNoA11yViolations(container);

    expect(container.querySelector('[role="tablist"]')).toBeNull();
    expect(container.querySelector('[role="tab"]')).toBeNull();

    const links = container.querySelectorAll<HTMLAnchorElement>('a');

    expect(links[0].getAttribute('aria-current')).toBe('page');
    expect(links[1].getAttribute('aria-current')).toBeNull();

    unmount();
  });
});
