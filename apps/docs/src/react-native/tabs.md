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

  <Tabs.Content value='overview'>
    Overview content
  </Tabs.Content>
  <Tabs.Content value='settings'>
    Settings content
  </Tabs.Content>
</Tabs>
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
  <Tabs.Icon><Inbox /></Tabs.Icon>
  Inbox
  <Tabs.Badge>12</Tabs.Badge>
</Tabs.Trigger>
```

Explicit compound slots take precedence over the `icon` prop.

## Mounting Policy

By default, only the active panel is mounted.

```tsx
<Tabs keepMounted>
  ...
</Tabs>
```

Use `keepMounted` when inactive panels must preserve local state.

```tsx
<Tabs lazyMount>
  ...
</Tabs>
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

- Use short, distinct trigger labels.
- Do not use color alone to identify the active tab.
- Keep trigger values stable across renders.
- Verify scrollable tab rows and panel changes with VoiceOver and TalkBack.
- Preserve panel state deliberately rather than mounting every expensive screen by default.

## See Also

- [Select](/react-native/select)
- [Button](/react-native/button)
