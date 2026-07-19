# Select

Select lets users choose one or more saved values from a compact list. It is a
field, not an action menu.

<StorybookFrame
  story="select.selection"
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
  onValueChange={setRole}
  placeholder='Choose role'
>
  <Select.Item value='admin'>Admin</Select.Item>
  <Select.Item value='editor'>Editor</Select.Item>
  <Select.Item value='viewer'>Viewer</Select.Item>
</Select>
```

## Option Model

Keep option values stable and serializable. Labels are user-facing; values are
application state.

```tsx
<Select.Item value='admin'>Admin</Select.Item>
<Select.Item value='editor'>Editor</Select.Item>
<Select.Item value='viewer' disabled>
  Viewer
</Select.Item>
```

## Compound API

Use `Select.Item` for options. Add `Select.Trigger` and `Select.Content` only
when the trigger or dropdown needs custom composition.

```tsx
<Select label='Country' value={country} onValueChange={setCountry}>
  <Select.Trigger>
    <Select.Value />
    <Select.Icon />
  </Select.Trigger>
  <Select.Content>
    <Select.Search placeholder='Search country' />
    <Select.Label>Europe</Select.Label>
    <Select.Item value='fr'>
      <Select.ItemIcon>FR</Select.ItemIcon>
      France
      <Select.ItemDescription>Paris workspace</Select.ItemDescription>
      <Select.ItemBadge>EU</Select.ItemBadge>
    </Select.Item>
    <Select.Separator />
    <Select.Empty>No countries found</Select.Empty>
    <Select.Loading>Loading countries...</Select.Loading>
  </Select.Content>
</Select>
```

## Multiple And Group Selection

Set `multiple` when a field can contain several values. The trigger shows the
first 10 selected labels and then a `+N` count for the rest. Use
`maxSelected` to cap individual option selection and group selection.

`Select.Group selectable` adds a group-level action in multiple mode. The action
selects enabled options in that group until `maxSelected` is reached; pressing it
again clears the group when all selectable group items are selected.

```tsx
<Select
  label='Teams'
  value={teams}
  onValueChange={setTeams}
  multiple
  maxSelected={12}
  closeOnSelect={false}
  searchable
  clearable
  placeholder='Choose teams'
>
  <Select.Group label='Core teams' selectable selectLabel='All core teams'>
    <Select.Item value='product'>Product</Select.Item>
    <Select.Item value='engineering'>Engineering</Select.Item>
    <Select.Item value='design'>Design</Select.Item>
    <Select.Item value='research'>Research</Select.Item>
    <Select.Item value='data'>Data</Select.Item>
  </Select.Group>
  <Select.Separator />
  <Select.Group label='Operations' selectable selectLabel='All operations'>
    <Select.Item value='support'>Support</Select.Item>
    <Select.Item value='success'>Success</Select.Item>
    <Select.Item value='sales'>Sales</Select.Item>
    <Select.Item value='marketing'>Marketing</Select.Item>
    <Select.Item value='finance'>Finance</Select.Item>
  </Select.Group>
  <Select.Separator />
  <Select.Group label='Platform' selectable selectLabel='All platform'>
    <Select.Item value='infrastructure'>Infrastructure</Select.Item>
    <Select.Item value='security'>Security</Select.Item>
    <Select.Item value='devex'>Developer Experience</Select.Item>
    <Select.Item value='qa'>QA</Select.Item>
  </Select.Group>
</Select>
```

## Web Behavior

Web Select supports controlled and uncontrolled open state, placement,
typeahead, keyboard navigation, disabled options, errors, descriptions, and
matching dropdown width to the trigger. When a selected option is in the middle
of a long list, reopening the dropdown keeps that option active and scrolls it
into view without requiring user scroll.

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
        onValueChange={setRole}
      >
        <Select.Item value='owner'>Owner</Select.Item>
        <Select.Item value='admin'>Admin</Select.Item>
        <Select.Item value='editor'>Editor</Select.Item>
        <Select.Item value='viewer'>Viewer</Select.Item>
      </Select>
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
