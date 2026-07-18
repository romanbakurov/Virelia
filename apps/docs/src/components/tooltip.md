# Tooltip

Tooltip provides short, non-critical helper text for a focused or hovered
control. It should clarify UI, not carry required instructions.

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
import { Button, Tooltip } from '@vellira-ui/react';

<Tooltip content='Copy project ID'>
  <Button aria-label='Copy project ID' iconOnly iconStart={<Copy />} />
</Tooltip>;
```

## Content Guidance

| Good                                        | Avoid                                   |
| ------------------------------------------- | --------------------------------------- |
| `Copy project ID`                           | Paragraphs or multi-step instructions   |
| `Only workspace owners can delete projects` | Critical validation only shown on hover |
| `Press ⌘K to open command menu`             | Interactive content inside the tooltip  |

## Delays And Placement

Use short open delays for icon-heavy toolbars. Use a close delay only when the
tooltip should feel forgiving during pointer movement.

```tsx
import { Filter } from '@vellira-ui/icons';
import { Button, Tooltip } from '@vellira-ui/react';

<Tooltip
  content='Filter invoices'
  placement='top'
  delay={{ open: 250, close: 100 }}
>
  <Button iconOnly aria-label='Filter invoices' iconStart={<Filter />} />
</Tooltip>;
```

## Real Example: Dense Toolbar

```tsx
import { Download, Filter, Search } from '@vellira-ui/icons';
import { Button, Tooltip } from '@vellira-ui/react';

export function InvoiceToolbar() {
  return (
    <div role='toolbar' aria-label='Invoice actions'>
      <Tooltip content='Search invoices'>
        <Button aria-label='Search invoices' iconOnly iconStart={<Search />} />
      </Tooltip>
      <Tooltip content='Filter invoices'>
        <Button aria-label='Filter invoices' iconOnly iconStart={<Filter />} />
      </Tooltip>
      <Tooltip content='Export CSV'>
        <Button aria-label='Export CSV' iconOnly iconStart={<Download />} />
      </Tooltip>
    </div>
  );
}
```

## Accessibility

- The trigger still needs its own accessible name.
- Do not rely on Tooltip for essential form instructions.
- Keep content concise.
- Native tooltip behavior should be tested with touch and screen reader flows,
  because hover does not exist on most mobile devices.

## See Also

- [Button](/components/button) for icon-only trigger requirements.
- [FormField](/components/form-field) for persistent helper text.
