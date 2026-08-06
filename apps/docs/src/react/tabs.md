---
title: Tabs – React Tabs Component
description: Accessible React tabs with keyboard navigation, controlled state, and flexible layouts.
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

Use Tabs for sections that are siblings: Overview, Usage, Billing, Security.
Do not use Tabs for a stepper, a wizard, or unrelated navigation destinations.

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

## Parts

| Part             | Purpose                                      |
| ---------------- | -------------------------------------------- |
| `Tabs`           | Root state, orientation, variant, and color. |
| `Tabs.List`      | `tablist` layout and optional scrolling.     |
| `Tabs.Trigger`   | Selects one value.                           |
| `Tabs.Content`   | Panel for a matching value.                  |
| `Tabs.Indicator` | Visual indicator.                            |
| `Tabs.Icon`      | Compound trigger icon slot.                  |
| `Tabs.Badge`     | Compound trigger badge slot.                 |

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

Horizontal LTR tabs use `ArrowRight` and `ArrowLeft` for next and previous.
Horizontal RTL reverses those directions. Vertical tabs use `ArrowDown` and
`ArrowUp`. `Home` moves to the first enabled trigger, and `End` moves to the
last enabled trigger. Disabled triggers are skipped.

With `activationMode='automatic'`, focus and selection move together. With
`activationMode='manual'`, arrow keys move focus and `Enter` or `Space` selects.
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

- Each `Tabs.Trigger` value should match a `Tabs.Content` value.
- Disabled tabs should be rare and explainable from surrounding UI.
- Keyboard order should follow visual order.
- Panels should not unmount critical unsaved user input unless the app handles
  persistence intentionally.

## See Also

- [Button](/react/button) for actions inside tab panels.
- [Select](/react/select) when mobile space requires compact section
  switching.
