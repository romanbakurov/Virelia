---
title: React Native Tabs
description: Organize native screens with Vellira Tabs using compound triggers, stable values, variants, scrollable lists, controlled state, and panel mounting policies.
---

# Tabs

Tabs organize related sections inside a native screen while keeping one section active at a time.

## Basic Usage

```tsx
import { Tabs } from '@vellira-ui/react-native';

<Tabs defaultValue='overview' orientation='horizontal' variant='line'>
  <Tabs.List scrollable>
    <Tabs.Trigger value='overview'>Overview</Tabs.Trigger>
    <Tabs.Trigger value='settings'>Settings</Tabs.Trigger>
  </Tabs.List>

  <Tabs.Content value='overview'>Overview content</Tabs.Content>
  <Tabs.Content value='settings'>Settings content</Tabs.Content>
</Tabs>;
```

Trigger and content values must match. Selection does not depend on render order.

## Controlled Usage

```tsx
<Tabs value={tab} onValueChange={setTab}>
  ...
</Tabs>
```

## Variants And Color

```tsx
<Tabs variant='line' color='primary' />
<Tabs variant='pills' color='neutral' />
<Tabs variant='segmented' color='success' />
```

Available sizes are `sm`, `md`, and `lg`.

## Scrollable Lists

```tsx
<Tabs.List scrollable>
  {sections.map((section) => (
    <Tabs.Trigger key={section.id} value={section.id}>
      {section.label}
    </Tabs.Trigger>
  ))}
</Tabs.List>
```

Use a scrollable list when tabs do not fit comfortably on a phone screen.

## Trigger Content

```tsx
<Tabs.Trigger
  value='inbox'
  icon={<Inbox />}
  badge='12'
  description='Unread messages'
>
  Inbox
</Tabs.Trigger>
```

For custom ordering:

```tsx
<Tabs.Trigger value='inbox'>
  <Tabs.Icon>
    <Inbox />
  </Tabs.Icon>
  Inbox
  <Tabs.Badge>12</Tabs.Badge>
</Tabs.Trigger>
```

Explicit compound slots take precedence over the `icon` prop.

## Mounting Policy

By default, only the active panel is mounted.

```tsx
<Tabs keepMounted>...</Tabs>
```

Use `keepMounted` when inactive panels must preserve local state.

```tsx
<Tabs lazyMount>...</Tabs>
```

Use `lazyMount` to defer a panel until it is activated for the first time.

```tsx
<Tabs.Content value='editor' forceMount>
  ...
</Tabs.Content>
```

`forceMount` overrides the root policy for one panel.

## Disabled State

```tsx
<Tabs disabled>
  ...
</Tabs>

<Tabs.Trigger value='billing' disabled>
  Billing
</Tabs.Trigger>
```

## Accessibility

In the default `mode='tabs'`, Tabs exposes native tab semantics where available.
`Tabs.List` exposes the tab list, while triggers expose their selected and
disabled states.

In `mode='navigation'`, Tabs does not expose tab semantics. When `asChild` is
used, the composed child keeps responsibility for the semantics appropriate to
the navigation destination.

- Use short, distinct trigger labels.
- Do not use color alone to identify the active item.
- Keep trigger values stable across renders.
- Disabled triggers should be rare and clearly understandable.
- Verify scrollable tab rows and navigation with VoiceOver and TalkBack.
- Preserve panel state deliberately rather than mounting every expensive screen
  by default.

## Navigation Mode

Use `mode='navigation'` when the triggers represent navigation destinations
rather than panels in the current screen.

```tsx
import { Pressable, Text } from 'react-native';

import { Tabs } from '@vellira-ui/react-native';

<Tabs mode='navigation' defaultValue='overview' variant='line'>
  <Tabs.List>
    <Tabs.Trigger value='overview' asChild>
      <Pressable>
        <Text>Overview</Text>
      </Pressable>
    </Tabs.Trigger>

    <Tabs.Trigger value='projects' asChild>
      <Pressable>
        <Text>Projects</Text>
      </Pressable>
    </Tabs.Trigger>

    <Tabs.Trigger value='settings' asChild>
      <Pressable>
        <Text>Settings</Text>
      </Pressable>
    </Tabs.Trigger>

    <Tabs.Indicator />
  </Tabs.List>
</Tabs>;
```

Navigation mode differs from regular tabs:

- `Tabs.List` does not expose tab-list semantics.
- `Tabs.Trigger asChild` composes trigger behavior onto the child.
- `Tabs.Content` is not required.
- the selected value still drives the active visual state and indicator.
- use your application's navigation or router component as the composed child
  when a trigger should change screens or routes.

Use the default `mode='tabs'` when triggers switch related content within the
same screen.

## See Also

- [Select](/react-native/select)
- [Button](/react-native/button)
