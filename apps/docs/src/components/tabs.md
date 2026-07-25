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
  <Tabs.List>
    <Tabs.Trigger value='overview'>Overview</Tabs.Trigger>
    <Tabs.Trigger value='usage'>Usage</Tabs.Trigger>
    <Tabs.Trigger value='billing'>Billing</Tabs.Trigger>
  </Tabs.List>
  <Tabs.Content value='overview'>Overview content</Tabs.Content>
  <Tabs.Content value='usage'>Usage content</Tabs.Content>
  <Tabs.Content value='billing'>Billing content</Tabs.Content>
</Tabs>
```

## Appearance

| Variant     | Use For                                             |
| ----------- | --------------------------------------------------- |
| `line`      | Dense pages, headers, settings, and dashboards.     |
| `pills`     | Compact filters or highly visible section switches. |
| `segmented` | Related modes inside compact app surfaces.          |

## Controlled State

Control active tab when it syncs with the URL, analytics, persistence, or
another panel.

```tsx
<Tabs value={activeTab} onValueChange={setActiveTab}>
  ...
</Tabs>
```

## Real Example: Account Settings

```tsx
import { Button, Input, Select, Tabs } from '@vellira-ui/react';
import { useState } from 'react';

export function AccountSettings() {
  const [activeTab, setActiveTab] = useState('profile');

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} variant='line'>
      <Tabs.List>
        <Tabs.Trigger value='profile'>Profile</Tabs.Trigger>
        <Tabs.Trigger value='security'>Security</Tabs.Trigger>
        <Tabs.Trigger value='billing'>Billing</Tabs.Trigger>
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

- [Button](/components/button) for actions inside tab panels.
- [Select](/components/select) when mobile space requires compact section
  switching.
