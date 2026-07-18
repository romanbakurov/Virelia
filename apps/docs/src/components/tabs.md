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
<Tabs defaultActiveIndex={0} appearance='underline'>
  <Tabs.List>
    <Tabs.Tab index={0}>Overview</Tabs.Tab>
    <Tabs.Tab index={1}>Usage</Tabs.Tab>
    <Tabs.Tab index={2}>Billing</Tabs.Tab>
  </Tabs.List>
  <Tabs.Panel index={0}>Overview content</Tabs.Panel>
  <Tabs.Panel index={1}>Usage content</Tabs.Panel>
  <Tabs.Panel index={2}>Billing content</Tabs.Panel>
</Tabs>
```

## Appearance

| Appearance  | Use For                                             |
| ----------- | --------------------------------------------------- |
| `default`   | General app surfaces.                               |
| `underline` | Dense pages, headers, settings, and dashboards.     |
| `pills`     | Compact filters or highly visible section switches. |

## Controlled State

Control active tab when it syncs with the URL, analytics, persistence, or
another panel.

```tsx
<Tabs activeIndex={activeTab} onChange={setActiveTab}>
  ...
</Tabs>
```

## Real Example: Account Settings

```tsx
import { Button, Input, Select, Tabs } from '@vellira-ui/react';
import { useState } from 'react';

export function AccountSettings() {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <Tabs
      activeIndex={activeTab}
      onChange={setActiveTab}
      appearance='underline'
    >
      <Tabs.List>
        <Tabs.Tab index={0}>Profile</Tabs.Tab>
        <Tabs.Tab index={1}>Security</Tabs.Tab>
        <Tabs.Tab index={2}>Billing</Tabs.Tab>
      </Tabs.List>

      <Tabs.Panel index={0}>
        <Input label='Display name' defaultValue='Roman Bakurov' />
        <Button>Save profile</Button>
      </Tabs.Panel>
      <Tabs.Panel index={1}>
        <Button appearance='outline' color='neutral'>
          Reset password
        </Button>
      </Tabs.Panel>
      <Tabs.Panel index={2}>
        <Select label='Plan' defaultValue='pro'>
          <Select.Item value='starter'>Starter</Select.Item>
          <Select.Item value='pro'>Pro</Select.Item>
        </Select>
      </Tabs.Panel>
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

- Each `Tabs.Tab` index must match its `Tabs.Panel` index.
- Disabled tabs should be rare and explainable from surrounding UI.
- Keyboard order should follow visual order.
- Panels should not unmount critical unsaved user input unless the app handles
  persistence intentionally.

## See Also

- [Button](/components/button) for actions inside tab panels.
- [Select](/components/select) when mobile space requires compact section
  switching.
