# Checkbox

Checkbox represents an independent boolean choice. It works for agreements,
settings, row selection, and mixed selection summaries.

<StorybookFrame
  id="primitives-checkbox--states"
  title="Checkbox states"
  :height="520"
/>

## When To Use

Use Checkbox when each option can be turned on or off without requiring another
option to turn off. Use RadioGroup when exactly one option must be selected.
Use Button for commands and Toggle-like buttons for transient pressed state.

```tsx
<Checkbox
  checked={accepted}
  onCheckedChange={setAccepted}
  label='Accept terms'
  description='Required before creating the workspace.'
/>
```

## Common Patterns

### Settings Row

```tsx
<Checkbox
  defaultChecked
  label='Email product updates'
  description='Receive important release and billing updates.'
/>
```

### Mixed Selection

Use `indeterminate` when a parent row represents a partial child selection.

```tsx
<Checkbox
  checked={allSelected}
  indeterminate={someSelected && !allSelected}
  onCheckedChange={toggleAll}
  label='Select all projects'
/>
```

### Error State

```tsx
<Checkbox
  required
  checked={accepted}
  onCheckedChange={setAccepted}
  label='I accept the data processing agreement'
  error='Accept the agreement to continue.'
/>
```

## Real Example: Notification Preferences

```tsx
import { Button, Checkbox } from '@vellira-ui/react';
import { useState } from 'react';

export function NotificationPreferences() {
  const [security, setSecurity] = useState(true);
  const [product, setProduct] = useState(false);
  const [billing, setBilling] = useState(true);

  return (
    <form onSubmit={savePreferences}>
      <Checkbox
        checked={security}
        onCheckedChange={setSecurity}
        label='Security alerts'
        description='Required for sign-in, password, and permission changes.'
        disabled
      />
      <Checkbox
        checked={billing}
        onCheckedChange={setBilling}
        label='Billing updates'
        description='Invoices, payment failures, and plan changes.'
      />
      <Checkbox
        checked={product}
        onCheckedChange={setProduct}
        label='Product updates'
        description='New components, migration notes, and release summaries.'
      />
      <Button type='submit'>Save preferences</Button>
    </form>
  );
}
```

## Accessibility

- Keep the label close to the control and make it descriptive.
- Use `description` for durable context, not hover-only help.
- When no visible label is rendered, provide `aria-label` on web or
  `accessibilityLabel` on native.
- Do not use indeterminate as a third submitted value. It is a visual and
  accessibility state for partial selection.

## See Also

- [RadioGroup](/components/radio-group) for mutually exclusive choices.
- [FormField](/components/form-field) for custom field layout.
