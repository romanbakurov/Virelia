# Select

Select lets users choose one saved value from a compact list. It is a field, not
an action menu.

<StorybookFrame
  id="components-select--selection"
  title="Select interaction"
  :height="420"
/>

## When To Use

Use Select when the value belongs to a form or persistent setting and the list
does not need to stay visible. Use Dropdown for contextual commands. Use
RadioGroup for short lists where comparison matters.

```tsx
<Select
  label='Role'
  value={role}
  onChange={setRole}
  placeholder='Choose role'
  options={[
    { value: 'admin', label: 'Admin' },
    { value: 'editor', label: 'Editor' },
    { value: 'viewer', label: 'Viewer' },
  ]}
/>
```

## Option Model

Keep option values stable and serializable. Labels are user-facing; values are
application state.

```tsx
const roleOptions = [
  { value: 'admin', label: 'Admin' },
  { value: 'editor', label: 'Editor' },
  { value: 'viewer', label: 'Viewer', disabled: true },
];
```

## Web Behavior

Web Select supports controlled and uncontrolled open state, placement,
typeahead, keyboard navigation, disabled options, errors, descriptions, and
matching dropdown width to the trigger.

Use `aria-label` only when a visible label cannot be rendered.

## Native Behavior

Native Select opens a picker sheet. The picker edits a draft value first; `Done`
commits the value, while `Cancel` and backdrop close discard the draft.

## Real Example: Member Role

```tsx
import { Button, Select } from '@vellira-ui/react';
import { useState } from 'react';

const roleOptions = [
  { value: 'owner', label: 'Owner' },
  { value: 'admin', label: 'Admin' },
  { value: 'editor', label: 'Editor' },
  { value: 'viewer', label: 'Viewer' },
];

export function MemberRoleForm() {
  const [role, setRole] = useState('editor');

  return (
    <form onSubmit={saveRole}>
      <Select
        label='Workspace role'
        description='Role changes take effect immediately.'
        value={role}
        onChange={setRole}
        options={roleOptions}
      />
      <Button type='submit'>Save role</Button>
    </form>
  );
}
```

## Accessibility

- Prefer a visible label.
- Error text should tell users how to choose a valid value.
- Disabled options should explain unavailable states elsewhere when the reason
  is not obvious.
- Do not use Select for destructive or command actions.

## See Also

- [Dropdown](/components/dropdown) for action menus.
- [RadioGroup](/components/radio-group) for short visible choice sets.
