# Dropdown

Dropdown is for contextual actions: commands that apply to the current object,
row, account, or page. It is not a form field and does not own a selected value.

<StorybookFrame
  story="dropdown.basic"
  title="Dropdown actions"
  :height="420"
/>

## When To Use

Use Dropdown when several actions share the same trigger and do not need to be
visible all the time. Use Select when the user is choosing a saved value.

```tsx
<Dropdown color='primary' placement='bottom-end'>
  <Dropdown.Trigger asChild>
    <Button appearance='outline' color='neutral'>
      Actions
    </Button>
  </Dropdown.Trigger>

  <Dropdown.Content>
    <Dropdown.Group>
      <Dropdown.Label>Report</Dropdown.Label>
      <Dropdown.Item onSelect={renameReport}>Rename</Dropdown.Item>
      <Dropdown.Item onSelect={duplicateReport}>Duplicate</Dropdown.Item>
    </Dropdown.Group>

    <Dropdown.Separator />

    <Dropdown.Item color='danger' onSelect={deleteReport}>
      Delete
    </Dropdown.Item>
  </Dropdown.Content>
</Dropdown>
```

## Contract

Dropdown executes actions. Do not add Select props such as `value`,
`defaultValue`, `onValueChange`, `placeholder`, `required`, `invalid`, or
`FormField` behavior.

Use `Dropdown.Item onSelect` instead of `onClick`. `onSelect` runs for pointer,
keyboard, and touch selection. Call `event.preventDefault()` to keep the menu
open.

```tsx
<Dropdown.Item
  onSelect={(event) => {
    event.preventDefault();
    openAdvancedDialog();
  }}
>
  Advanced action
</Dropdown.Item>
```

## Trigger Guidance

Use `Dropdown.Trigger asChild` with Button for most triggers.

```tsx
import { More } from '@vellira-ui/icons';
import { Button, Dropdown } from '@vellira-ui/react';

<Dropdown>
  <Dropdown.Trigger asChild>
    <Button aria-label='More invoice actions' iconOnly iconStart={<More />} />
  </Dropdown.Trigger>

  <Dropdown.Content>
    <Dropdown.Item>Duplicate</Dropdown.Item>
    <Dropdown.Item color='danger'>Delete</Dropdown.Item>
  </Dropdown.Content>
</Dropdown>;
```

## Checkbox And Radio Items

Checkbox items are for toggleable menu settings and do not close by default.
Radio items store their value inside `Dropdown.RadioGroup`, not on the root.

```tsx
<Dropdown closeOnSelect={false}>
  <Dropdown.Trigger>Preferences</Dropdown.Trigger>
  <Dropdown.Content>
    <Dropdown.CheckboxItem checked={showGrid} onCheckedChange={setShowGrid}>
      Show grid
    </Dropdown.CheckboxItem>

    <Dropdown.RadioGroup value={theme} onValueChange={setTheme}>
      <Dropdown.RadioItem value='light'>Light</Dropdown.RadioItem>
      <Dropdown.RadioItem value='dark'>Dark</Dropdown.RadioItem>
      <Dropdown.RadioItem value='system'>System</Dropdown.RadioItem>
    </Dropdown.RadioGroup>
  </Dropdown.Content>
</Dropdown>
```

## Accessibility

- Trigger uses `aria-haspopup="menu"`, `aria-expanded`, and `aria-controls`.
- Content uses `role="menu"`.
- Items use `role="menuitem"`, `menuitemcheckbox`, or `menuitemradio`.
- Do not use `role="listbox"` or `role="option"` for Dropdown.
- Disabled link items remove `href` and expose `aria-disabled`.

## See Also

- [Button](/components/button) for triggers and command buttons.
- [Select](/components/select) for value selection.
- [Modal](/components/modal) for confirmation flows.
