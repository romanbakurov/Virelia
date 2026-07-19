import { act } from 'react';

import type { ComponentProps } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { Button } from '../../primitives/Button';
import { expectNoA11yViolations } from '../../test-utils/a11y';
import { render } from '../../test-utils/render';

import { Dropdown } from './Dropdown';

function pressKey(target: EventTarget, key: string) {
  act(() => {
    target.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true }));
  });
}

function renderActions(props: Partial<ComponentProps<typeof Dropdown>> = {}) {
  const onEdit = vi.fn();
  const onDelete = vi.fn();
  const result = render(
    <Dropdown {...props}>
      <Dropdown.Trigger>Actions</Dropdown.Trigger>
      <Dropdown.Content>
        <Dropdown.Item onSelect={onEdit}>Edit</Dropdown.Item>
        <Dropdown.Item disabled>Archive</Dropdown.Item>
        <Dropdown.Separator />
        <Dropdown.Item color='danger' onSelect={onDelete}>
          Delete
        </Dropdown.Item>
      </Dropdown.Content>
    </Dropdown>
  );

  return { ...result, onDelete, onEdit };
}

afterEach(() => {
  document.body.innerHTML = '';
});

describe('Dropdown', () => {
  it('opens menu and selects an enabled action item', () => {
    const { container, onEdit, unmount } = renderActions();
    const trigger = container.querySelector<HTMLButtonElement>('button');

    act(() => trigger?.click());

    expect(trigger?.getAttribute('aria-haspopup')).toBe('menu');
    expect(trigger?.getAttribute('aria-expanded')).toBe('true');
    expect(document.querySelector('[role="menu"]')).not.toBeNull();
    expect(document.querySelector('[role="option"]')).toBeNull();

    act(() => {
      Array.from(document.querySelectorAll<HTMLElement>('[role="menuitem"]'))
        .find((item) => item.textContent?.includes('Archive'))
        ?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    });

    expect(onEdit).not.toHaveBeenCalled();
    expect(document.querySelector('[role="menu"]')).not.toBeNull();

    act(() => {
      document
        .querySelector<HTMLElement>('[role="menuitem"]')
        ?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    });

    expect(onEdit).toHaveBeenCalledTimes(1);
    expect(document.querySelector('[role="menu"]')).toBeNull();
    expect(document.activeElement).toBe(trigger);

    unmount();
  });

  it('locks body scroll for modal menus and restores focus on Escape', () => {
    const { container, unmount } = render(
      <Dropdown modal>
        <Dropdown.Trigger>Actions</Dropdown.Trigger>
        <Dropdown.Content>
          <Dropdown.Item>Edit</Dropdown.Item>
        </Dropdown.Content>
      </Dropdown>
    );
    const trigger = container.querySelector<HTMLButtonElement>('button');

    pressKey(trigger!, 'Enter');

    const menu = document.querySelector<HTMLElement>('[role="menu"]');

    expect(document.body.style.overflow).toBe('hidden');

    pressKey(menu!, 'Escape');

    expect(document.body.style.overflow).toBe('');
    expect(document.activeElement).toBe(trigger);

    unmount();
  });

  it('opens and selects the active item from keyboard', async () => {
    const { container, onDelete, unmount } = renderActions();
    const trigger = container.querySelector<HTMLButtonElement>('button');

    pressKey(trigger!, 'Enter');

    const menu = document.querySelector<HTMLElement>('[role="menu"]');

    await expectNoA11yViolations(document.body);

    expect(document.activeElement).toBe(menu);
    expect(menu?.getAttribute('aria-activedescendant')).toBe(
      `${menu?.id}-item-0`
    );

    pressKey(menu!, 'ArrowDown');

    expect(menu?.getAttribute('aria-activedescendant')).toBe(
      `${menu?.id}-item-2`
    );

    pressKey(menu!, 'Enter');

    expect(onDelete).toHaveBeenCalledTimes(1);
    expect(trigger?.getAttribute('aria-expanded')).toBe('false');
    expect(document.activeElement).toBe(trigger);

    unmount();
  });

  it('keeps the menu open when onSelect prevents default', () => {
    const onSelect = vi.fn((event) => event.preventDefault());
    const { container, unmount } = render(
      <Dropdown>
        <Dropdown.Trigger>Actions</Dropdown.Trigger>
        <Dropdown.Content>
          <Dropdown.Item onSelect={onSelect}>Advanced</Dropdown.Item>
        </Dropdown.Content>
      </Dropdown>
    );
    const trigger = container.querySelector<HTMLButtonElement>('button');

    act(() => trigger?.click());
    act(() => {
      document
        .querySelector<HTMLElement>('[role="menuitem"]')
        ?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    });

    expect(onSelect).toHaveBeenCalledTimes(1);
    expect(document.querySelector('[role="menu"]')).not.toBeNull();

    unmount();
  });

  it('supports Trigger asChild without rendering an extra button', () => {
    const { container, unmount } = render(
      <Dropdown>
        <Dropdown.Trigger asChild>
          <Button appearance='outline' color='neutral'>
            Actions
          </Button>
        </Dropdown.Trigger>
        <Dropdown.Content>
          <Dropdown.Item>Edit</Dropdown.Item>
        </Dropdown.Content>
      </Dropdown>
    );

    expect(container.querySelectorAll('button')).toHaveLength(1);

    act(() => {
      container.querySelector('button')?.click();
    });

    expect(document.querySelector('[role="menu"]')).not.toBeNull();

    unmount();
  });

  it('supports link items and secures blank targets', () => {
    const { container, unmount } = render(
      <Dropdown>
        <Dropdown.Trigger>Actions</Dropdown.Trigger>
        <Dropdown.Content>
          <Dropdown.Item href='/settings' target='_blank'>
            Settings
          </Dropdown.Item>
          <Dropdown.Item href='/disabled' disabled>
            Disabled link
          </Dropdown.Item>
        </Dropdown.Content>
      </Dropdown>
    );

    act(() => {
      container.querySelector('button')?.click();
    });

    const links =
      document.querySelectorAll<HTMLAnchorElement>('a[role="menuitem"]');

    expect(links[0]?.getAttribute('href')).toBe('/settings');
    expect(links[0]?.getAttribute('rel')).toBe('noreferrer noopener');
    expect(links[1]?.hasAttribute('href')).toBe(false);
    expect(links[1]?.getAttribute('aria-disabled')).toBe('true');

    unmount();
  });

  it('supports checkbox and radio action items', () => {
    const onCheckedChange = vi.fn();
    const onValueChange = vi.fn();
    const { container, unmount } = render(
      <Dropdown closeOnSelect={false}>
        <Dropdown.Trigger>Actions</Dropdown.Trigger>
        <Dropdown.Content>
          <Dropdown.CheckboxItem
            defaultChecked
            onCheckedChange={onCheckedChange}
          >
            Show grid
          </Dropdown.CheckboxItem>
          <Dropdown.RadioGroup
            defaultValue='light'
            onValueChange={onValueChange}
          >
            <Dropdown.RadioItem value='light'>Light</Dropdown.RadioItem>
            <Dropdown.RadioItem value='dark'>Dark</Dropdown.RadioItem>
          </Dropdown.RadioGroup>
        </Dropdown.Content>
      </Dropdown>
    );

    act(() => {
      container.querySelector('button')?.click();
    });

    const checkbox = document.querySelector<HTMLElement>(
      '[role="menuitemcheckbox"]'
    );
    const radios = document.querySelectorAll<HTMLElement>(
      '[role="menuitemradio"]'
    );

    expect(checkbox?.getAttribute('aria-checked')).toBe('true');
    expect(radios[0]?.getAttribute('aria-checked')).toBe('true');

    act(() => checkbox?.click());
    act(() => radios[1]?.click());

    expect(onCheckedChange).toHaveBeenCalledWith(false);
    expect(onValueChange).toHaveBeenCalledWith('dark');
    expect(document.querySelector('[role="menu"]')).not.toBeNull();

    unmount();
  });

  it('supports controlled radio groups', () => {
    const onValueChange = vi.fn();
    const { container, unmount } = render(
      <Dropdown closeOnSelect={false}>
        <Dropdown.Trigger>Actions</Dropdown.Trigger>
        <Dropdown.Content>
          <Dropdown.RadioGroup value='dark' onValueChange={onValueChange}>
            <Dropdown.RadioItem value='light'>Light</Dropdown.RadioItem>
            <Dropdown.RadioItem value='dark'>Dark</Dropdown.RadioItem>
          </Dropdown.RadioGroup>
        </Dropdown.Content>
      </Dropdown>
    );

    act(() => {
      container.querySelector('button')?.click();
    });

    const radios = document.querySelectorAll<HTMLElement>(
      '[role="menuitemradio"]'
    );

    expect(radios[0]?.getAttribute('aria-checked')).toBe('false');
    expect(radios[1]?.getAttribute('aria-checked')).toBe('true');

    act(() => radios[0]?.click());

    expect(onValueChange).toHaveBeenCalledWith('light');

    unmount();
  });

  it('renders groups, labels, separators, metadata, empty, and loading states', () => {
    const { container, rerender, unmount } = render(
      <Dropdown defaultOpen>
        <Dropdown.Trigger>Actions</Dropdown.Trigger>
        <Dropdown.Content>
          <Dropdown.Group>
            <Dropdown.Label>Project</Dropdown.Label>
            <Dropdown.Item
              icon={<span data-testid='icon' />}
              description='Change details'
              badge='New'
              shortcut='⌘E'
            >
              Edit
            </Dropdown.Item>
          </Dropdown.Group>
          <Dropdown.Separator />
        </Dropdown.Content>
      </Dropdown>
    );

    expect(document.body.textContent).toContain('Project');
    expect(document.body.textContent).toContain('Change details');
    expect(document.body.textContent).toContain('New');
    expect(document.body.textContent).toContain('⌘E');
    expect(document.querySelector('[data-testid="icon"]')).not.toBeNull();
    expect(document.querySelector('[role="separator"]')).not.toBeNull();

    rerender(
      <Dropdown defaultOpen>
        <Dropdown.Trigger>Actions</Dropdown.Trigger>
        <Dropdown.Content>
          <Dropdown.Empty>No actions</Dropdown.Empty>
        </Dropdown.Content>
      </Dropdown>
    );

    expect(document.body.textContent).toContain('No actions');

    rerender(
      <Dropdown defaultOpen loading loadingText='Loading actions'>
        <Dropdown.Trigger>Actions</Dropdown.Trigger>
        <Dropdown.Content />
      </Dropdown>
    );

    expect(document.body.textContent).toContain('Loading actions');
    expect(container.querySelector('button')).not.toBeNull();

    unmount();
  });

  it('supports controlled open state, disabled root, and className', () => {
    const onOpenChange = vi.fn();
    const { container, rerender, unmount } = render(
      <Dropdown open={false} onOpenChange={onOpenChange} className='root-test'>
        <Dropdown.Trigger>Actions</Dropdown.Trigger>
        <Dropdown.Content>
          <Dropdown.Item>Edit</Dropdown.Item>
        </Dropdown.Content>
      </Dropdown>
    );

    act(() => {
      container.querySelector('button')?.click();
    });

    expect(onOpenChange).toHaveBeenCalledWith(true);
    expect(document.querySelector('[role="menu"]')).toBeNull();
    expect(container.querySelector('.root-test')).not.toBeNull();

    rerender(
      <Dropdown disabled>
        <Dropdown.Trigger>Actions</Dropdown.Trigger>
        <Dropdown.Content>
          <Dropdown.Item>Edit</Dropdown.Item>
        </Dropdown.Content>
      </Dropdown>
    );

    act(() => {
      container.querySelector('button')?.click();
    });

    expect(document.querySelector('[role="menu"]')).toBeNull();

    unmount();
  });

  it('opens submenu from keyboard and returns with ArrowLeft', () => {
    const onEmail = vi.fn();
    const { container, unmount } = render(
      <Dropdown>
        <Dropdown.Trigger>Actions</Dropdown.Trigger>
        <Dropdown.Content>
          <Dropdown.Sub>
            <Dropdown.SubTrigger>Share</Dropdown.SubTrigger>
            <Dropdown.SubContent>
              <Dropdown.Item onSelect={onEmail}>Email</Dropdown.Item>
              <Dropdown.Item>Copy link</Dropdown.Item>
            </Dropdown.SubContent>
          </Dropdown.Sub>
        </Dropdown.Content>
      </Dropdown>
    );

    const trigger = container.querySelector<HTMLButtonElement>('button');
    pressKey(trigger!, 'Enter');

    const menu = document.querySelector<HTMLElement>('[role="menu"]');

    pressKey(menu!, 'ArrowRight');

    const menus = document.querySelectorAll('[role="menu"]');

    expect(menus).toHaveLength(2);
    expect(document.body.textContent).toContain('Email');

    pressKey(menu!, 'ArrowLeft');

    expect(document.querySelectorAll('[role="menu"]')).toHaveLength(1);

    pressKey(menu!, 'ArrowRight');

    const email = Array.from(
      document.querySelectorAll<HTMLElement>('[role="menuitem"]')
    ).find((item) => item.textContent?.includes('Email'));

    act(() => email?.click());

    expect(onEmail).toHaveBeenCalledTimes(1);
    expect(document.querySelector('[role="menu"]')).toBeNull();

    unmount();
  });

  it('opens rich submenu from hover and renders submenu structure', () => {
    vi.useFakeTimers();

    const { container, unmount } = render(
      <Dropdown>
        <Dropdown.Trigger>Actions</Dropdown.Trigger>
        <Dropdown.Content>
          <Dropdown.Sub>
            <Dropdown.SubTrigger>
              <Dropdown.ItemIcon>
                <span data-testid='share-icon' />
              </Dropdown.ItemIcon>
              Share
              <Dropdown.ItemShortcut>⌘S</Dropdown.ItemShortcut>
            </Dropdown.SubTrigger>
            <Dropdown.SubContent>
              <Dropdown.Label>Share via</Dropdown.Label>
              <Dropdown.Separator />
              <Dropdown.Item>
                <Dropdown.ItemIcon>
                  <span data-testid='email-icon' />
                </Dropdown.ItemIcon>
                Email
              </Dropdown.Item>
            </Dropdown.SubContent>
          </Dropdown.Sub>
        </Dropdown.Content>
      </Dropdown>
    );

    act(() => {
      container.querySelector('button')?.click();
    });

    const subTrigger = document.querySelector<HTMLElement>('[role="menuitem"]');

    act(() => {
      subTrigger?.dispatchEvent(
        new MouseEvent('mouseover', {
          bubbles: true,
          relatedTarget: document.body,
        })
      );
      vi.advanceTimersByTime(120);
    });

    expect(document.querySelectorAll('[role="menu"]')).toHaveLength(2);
    expect(document.body.textContent).toContain('Share via');
    expect(document.body.textContent).toContain('Email');
    expect(document.querySelector('[data-testid="email-icon"]')).not.toBeNull();
    expect(document.querySelectorAll('[role="separator"]')).toHaveLength(1);

    unmount();
    vi.useRealTimers();
  });
});
