---
title: Tabs – React Tabs Component
description: Accessible React tabs and navigation with keyboard support, controlled state, and flexible layouts.
---

# Tabs

Tabs organize peer sections of the same context. They work best for dense
product surfaces where switching should be fast and predictable.

<StorybookFrame
  story="tabs.controlled"
  title="Controlled Tabs"
  :height="420"
/>

## When To Use

Use `mode='tabs'` for sections that are siblings within the same context:
Overview, Usage, Billing, Security.

Use `mode='navigation'` when the same Tabs visual language should represent
navigation destinations such as product sections or application pages.

Do not use Tabs for a stepper or wizard.

```tsx
<Tabs defaultValue='overview' variant='line'>
  <Tabs.List aria-label='Account sections'>
    <Tabs.Trigger value='overview'>Overview</Tabs.Trigger>
    <Tabs.Trigger value='usage'>Usage</Tabs.Trigger>
    <Tabs.Trigger value='billing'>Billing</Tabs.Trigger>
    <Tabs.Indicator />
  </Tabs.List>

  <Tabs.Content value='overview'>Overview content</Tabs.Content>
  <Tabs.Content value='usage'>Usage content</Tabs.Content>
  <Tabs.Content value='billing'>Billing content</Tabs.Content>
</Tabs>
```

Tabs are value-based. Use stable string values instead of relying on trigger
order, so triggers can be reordered, inserted, removed, or conditionally
rendered without breaking the content relationship.

## Navigation Mode

Use `mode='navigation'` when triggers represent navigation destinations instead
of tab panels.

Compose each trigger with a native link by using `asChild`:

```tsx
<nav aria-label='Primary navigation'>
  <Tabs mode='navigation' defaultValue='components'>
    <Tabs.List>
      <Tabs.Trigger value='components' asChild>
        <a href='/components'>Components</a>
      </Tabs.Trigger>

      <Tabs.Trigger value='themes' asChild>
        <a href='/themes'>Themes</a>
      </Tabs.Trigger>

      <Tabs.Trigger value='roadmap' asChild>
        <a href='/roadmap'>Roadmap</a>
      </Tabs.Trigger>

      <Tabs.Indicator />
    </Tabs.List>
  </Tabs>
</nav>
```

Navigation mode preserves the native semantics of the composed link:

Tabs.List does not render role='tablist'
composed triggers do not render role='tab'
the active destination uses aria-current='page'
Tabs.Content is not required
disabled navigation triggers are removed from the keyboard tab order
arrow, Home, and End keyboard navigation remains available

Wrap navigation Tabs in an appropriate navigation landmark such as
`<nav aria-label='Primary navigation'>`

## Parts

| Part             | Purpose                                               |
| ---------------- | ----------------------------------------------------- |
| `Tabs`           | Root state, mode, orientation, variant, and color.    |
| `Tabs.List`      | Trigger layout, tab-list semantics, and scrolling.    |
| `Tabs.Trigger`   | Selects a value or composes a navigation destination. |
| `Tabs.Content`   | Panel for a matching value in tabs mode.              |
| `Tabs.Indicator` | Visual indicator.                                     |
| `Tabs.Icon`      | Compound trigger icon slot.                           |
| `Tabs.Badge`     | Compound trigger badge slot.                          |

## Appearance

| Variant     | Use For                                             |
| ----------- | --------------------------------------------------- |
| `line`      | Dense pages, headers, settings, and dashboards.     |
| `pills`     | Compact filters or highly visible section switches. |
| `segmented` | Related modes inside compact app surfaces.          |

Use `Tabs.Indicator` with `line` and `segmented` when you want the moving
indicator. `pills` can use the same indicator, but the active trigger styling is
usually enough for compact filters.

## Controlled State

Control active tab when it syncs with the URL, analytics, persistence, or
another panel.

Controlled state can also be used in navigation mode when the active
destination is derived from application routing.

```tsx
<Tabs value={activeTab} onValueChange={setActiveTab}>
  ...
</Tabs>
```

If no `defaultValue` is provided in uncontrolled mode, Tabs selects the first
enabled trigger. A controlled `value` that does not match any trigger does not
self-correct; development builds warn and render no active panel.

## Mounting

| Props                                 | Behavior                                                   |
| ------------------------------------- | ---------------------------------------------------------- |
| neither `keepMounted` nor `lazyMount` | Only the active content is mounted.                        |
| `keepMounted`                         | All content is mounted and inactive panels are hidden.     |
| `lazyMount`                           | Content mounts only after its value has been activated.    |
| `keepMounted lazyMount`               | Content mounts on first activation and then stays mounted. |

Use `forceMount` on a single `Tabs.Content` when one panel should stay mounted
regardless of the root policy.

```tsx
<Tabs.Content value='editor' forceMount>
  <HeavyEditor />
</Tabs.Content>
```

## Scrollable Lists

Scrolling belongs to `Tabs.List`, not the root.

```tsx
<Tabs defaultValue='activity'>
  <Tabs.List aria-label='Workspace sections' scrollable>
    <Tabs.Trigger value='overview'>Overview</Tabs.Trigger>
    <Tabs.Trigger value='activity'>Activity</Tabs.Trigger>
    <Tabs.Trigger value='members'>Members</Tabs.Trigger>
    <Tabs.Trigger value='settings'>Settings</Tabs.Trigger>
    <Tabs.Indicator />
  </Tabs.List>
</Tabs>
```

## Keyboard

Horizontal triggers use `ArrowRight` and `ArrowLeft` for next and previous in
LTR layouts. RTL reverses those directions. Vertical triggers use `ArrowDown`
and `ArrowUp`. `Home` moves to the first enabled trigger, and `End` moves to the
last enabled trigger. Disabled triggers are skipped.

In `mode='tabs'`, `activationMode='automatic'` moves focus and selection
together. With `activationMode='manual'`, arrow keys move focus and `Enter` or
`Space` selects the focused tab.

In `mode='navigation'`, composed links preserve their native link activation
behavior while directional keyboard navigation remains available.

`PageUp` and `PageDown` are not part of the Tabs keyboard contract.

## Real Example: Account Settings

```tsx
import { Button, Input, Select, Tabs } from '@vellira-ui/react';
import { useState } from 'react';

export function AccountSettings() {
  const [activeTab, setActiveTab] = useState('profile');

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} variant='line'>
      <Tabs.List aria-label='Account settings'>
        <Tabs.Trigger value='profile'>Profile</Tabs.Trigger>
        <Tabs.Trigger value='security'>Security</Tabs.Trigger>
        <Tabs.Trigger value='billing'>Billing</Tabs.Trigger>
        <Tabs.Indicator />
      </Tabs.List>

      <Tabs.Content value='profile'>
        <Input label='Display name' defaultValue='Roman Bakurov' />
        <Button>Save profile</Button>
      </Tabs.Content>
      <Tabs.Content value='security'>
        <Button appearance='outline' color='neutral'>
          Reset password
        </Button>
      </Tabs.Content>
      <Tabs.Content value='billing'>
        <Select label='Plan' defaultValue='pro'>
          <Select.Item value='starter'>Starter</Select.Item>
          <Select.Item value='pro'>Pro</Select.Item>
        </Select>
      </Tabs.Content>
    </Tabs>
  );
}
```

## Layout Guidance

- Keep tab labels short.
- Avoid wrapping tab labels across multiple lines.
- Use vertical orientation only when the page has enough horizontal space.
- Do not put primary actions inside tab labels; put them in the active panel or
  page header.

## Accessibility

In `mode='tabs'`, Tabs follow the WAI-ARIA tabs pattern:

- `Tabs.List` exposes tab-list semantics.
- `Tabs.Trigger` exposes tab semantics and selection state.
- `Tabs.Content` exposes tab-panel semantics.
- each `Tabs.Trigger` value should match a `Tabs.Content` value.
- triggers and panels are connected through accessible IDs.
- disabled tabs are skipped during keyboard navigation.

In `mode='navigation'`, Tabs preserve navigation semantics instead:

- `Tabs.List` does not expose tab-list semantics.
- `Tabs.Trigger asChild` preserves the native semantics of the composed link.
- the active destination is exposed with `aria-current='page'`.
- `Tabs.Content` is not required.
- disabled navigation triggers are removed from the tab order.
- the Tabs component should be placed inside an appropriate navigation
  landmark when it represents site or application navigation.

In both modes, keyboard order should follow visual order.

Panels in tabs mode should not unmount critical unsaved user input unless the
application handles persistence intentionally.

## Mode

| Value        | Semantics                                     | Content Required |
| ------------ | --------------------------------------------- | ---------------- |
| `tabs`       | WAI-ARIA tabs and tab panels                  | Yes              |
| `navigation` | Native navigation through composed link items | No               |

`tabs` is the default mode.

`Tabs.Trigger asChild` is intended for `mode='navigation'`. It composes the
trigger behavior and visual state onto a single child element such as a link
## See Also

- [Button](/react/button) for actions inside tab panels.
- [Select](/react/select) when mobile space requires compact section
  switching.
