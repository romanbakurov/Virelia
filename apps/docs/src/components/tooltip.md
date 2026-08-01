# Tooltip

Tooltip provides short, non-critical helper text for a focused, hovered, or
long-pressed control. It should clarify UI, not carry required instructions.

<StorybookFrame
  story="tooltip.triggers"
  title="Tooltip triggers"
  :height="360"
/>

## When To Use

Use Tooltip to explain an icon, terse label, disabled action, or keyboard
shortcut. Use visible text, description, or validation copy when users must read
the content to complete the task.

```tsx
import { Copy } from '@vellira-ui/icons';
import { Button, Portal, Tooltip } from '@vellira-ui/react';

<Tooltip>
  <Tooltip.Trigger asChild>
    <Button aria-label='Copy project ID' iconOnly iconStart={<Copy />} />
  </Tooltip.Trigger>
  <Portal>
    <Tooltip.Content withArrow>Copy project ID</Tooltip.Content>
  </Portal>
</Tooltip>;
```

## Web Usage

Web Tooltip opens from hover and focus. Use `Tooltip.Trigger asChild` when the
trigger is an existing Vellira control, and render floating content through
`Portal` so it is not clipped by parent layout.

```tsx
import { Copy } from '@vellira-ui/icons';
import { Button, Portal, Tooltip } from '@vellira-ui/react';

export function CopyProjectId() {
  return (
    <Tooltip placement='top' delay={{ open: 250, close: 100 }}>
      <Tooltip.Trigger asChild>
        <Button aria-label='Copy project ID' iconOnly iconStart={<Copy />} />
      </Tooltip.Trigger>
      <Portal>
        <Tooltip.Content withArrow>Copy project ID</Tooltip.Content>
      </Portal>
    </Tooltip>
  );
}
```

## Native Usage

Native Tooltip uses the same compound structure as Web, but opens from long
press instead of hover. Keep the trigger accessible on its own and put short
helper copy inside `Tooltip.Content`.

```tsx
import { Info } from '@vellira-ui/icons/native';
import { Button, Tooltip } from '@vellira-ui/react-native';

export function WorkspaceInfo() {
  return (
    <Tooltip placement='top' delay={{ open: 250, close: 2500 }}>
      <Tooltip.Trigger>
        <Button accessibilityLabel='Workspace info' iconStart={<Info />} />
      </Tooltip.Trigger>

      <Tooltip.Content withArrow>
        Only workspace owners can change billing.
      </Tooltip.Content>
    </Tooltip>
  );
}
```

## Controlled State

Use `open` and `onOpenChange` when Tooltip visibility must follow another
piece of UI state. Use `defaultOpen` for previews, onboarding hints, and tests
that need the content mounted immediately.

```tsx
import { useState } from 'react';

import { Info } from '@vellira-ui/icons';
import { Button, Portal, Tooltip } from '@vellira-ui/react';

export function ControlledTooltip() {
  const [open, setOpen] = useState(false);

  return (
    <Tooltip open={open} onOpenChange={setOpen}>
      <Tooltip.Trigger asChild>
        <Button aria-label='Show billing help' iconOnly iconStart={<Info />} />
      </Tooltip.Trigger>
      <Portal>
        <Tooltip.Content withArrow>
          Billing changes are saved per workspace.
        </Tooltip.Content>
      </Portal>
    </Tooltip>
  );
}
```

## Content Guidance

| Good                                        | Avoid                                   |
| ------------------------------------------- | --------------------------------------- |
| `Copy project ID`                           | Paragraphs or multi-step instructions   |
| `Only workspace owners can delete projects` | Critical validation only shown on hover |
| `Press Cmd+K to open command menu`          | Interactive content inside the tooltip  |

## Delays And Placement

Use short open delays for icon-heavy toolbars. Use a close delay only when the
tooltip should feel forgiving during pointer movement or native auto-hide.
Both web and native support the same placement names: `top`, `right`, `bottom`,
`left`, plus `*-start` and `*-end` variants.

```tsx
import { Filter } from '@vellira-ui/icons';
import { Button, Portal, Tooltip } from '@vellira-ui/react';

export function FilterTooltip() {
  return (
    <Tooltip placement='bottom-start' delay={{ open: 150, close: 100 }}>
      <Tooltip.Trigger asChild>
        <Button iconOnly aria-label='Filter invoices' iconStart={<Filter />} />
      </Tooltip.Trigger>
      <Portal>
        <Tooltip.Content withArrow>Filter invoices</Tooltip.Content>
      </Portal>
    </Tooltip>
  );
}
```

## Force Mounted Content

Use `forceMount` when animation, measurement, or snapshot coverage needs the
content node to exist while the tooltip is closed. Hidden force-mounted content
should still contain concise helper copy.

```tsx
import { Info } from '@vellira-ui/icons';
import { Button, Portal, Tooltip } from '@vellira-ui/react';

<Tooltip open={false}>
  <Tooltip.Trigger asChild>
    <Button aria-label='Plan details' iconOnly iconStart={<Info />} />
  </Tooltip.Trigger>
  <Portal>
    <Tooltip.Content forceMount withArrow>
      Available on Pro workspaces.
    </Tooltip.Content>
  </Portal>
</Tooltip>;
```

## Real Example: Dense Toolbar

```tsx
import { Download, Filter, Search } from '@vellira-ui/icons';
import { Button, Portal, Tooltip } from '@vellira-ui/react';

export function InvoiceToolbar() {
  return (
    <div role='toolbar' aria-label='Invoice actions'>
      <Tooltip>
        <Tooltip.Trigger asChild>
          <Button
            aria-label='Search invoices'
            iconOnly
            iconStart={<Search />}
          />
        </Tooltip.Trigger>
        <Portal>
          <Tooltip.Content withArrow>Search invoices</Tooltip.Content>
        </Portal>
      </Tooltip>
      <Tooltip>
        <Tooltip.Trigger asChild>
          <Button
            aria-label='Filter invoices'
            iconOnly
            iconStart={<Filter />}
          />
        </Tooltip.Trigger>
        <Portal>
          <Tooltip.Content withArrow>Filter invoices</Tooltip.Content>
        </Portal>
      </Tooltip>
      <Tooltip>
        <Tooltip.Trigger asChild>
          <Button aria-label='Export CSV' iconOnly iconStart={<Download />} />
        </Tooltip.Trigger>
        <Portal>
          <Tooltip.Content withArrow>Export CSV</Tooltip.Content>
        </Portal>
      </Tooltip>
    </div>
  );
}
```

## Accessibility

- The trigger still needs its own accessible name.
- Do not rely on Tooltip for essential form instructions.
- Keep content concise.
- Web Tooltip opens on focus for keyboard users.
- Native tooltip behavior should be tested with touch and screen reader flows.

## See Also

- [Button](/components/button) for icon-only trigger requirements.
- [FormField](/components/form-field) for persistent helper text.
