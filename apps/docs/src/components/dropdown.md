# Dropdown

Dropdown is for contextual actions: commands that apply to the current object,
row, account, or page. It is not a form field.

<StorybookFrame
  id="components-dropdown--with-groups"
  title="Dropdown with groups"
  :height="420"
/>

## When To Use

Use Dropdown when several actions share the same trigger and do not need to be
visible all the time. Use Select when the user is choosing a saved value.

```tsx
<Dropdown
  label='Report actions'
  items={[
    { type: 'group', label: 'Report' },
    { type: 'item', value: 'rename', label: 'Rename' },
    { type: 'item', value: 'duplicate', label: 'Duplicate' },
    { type: 'separator' },
    { type: 'item', value: 'delete', label: 'Delete', danger: true },
  ]}
  onSelect={handleReportAction}
/>
```

## Item Model

Dropdown uses a flat model. Groups label following entries; they do not own
nested child arrays.

| Item | Purpose |
| --- | --- |
| `item` | Selectable command with `value` and `label`. |
| `group` | Non-interactive heading for following actions. |
| `separator` | Visual divider between action clusters. |
| `danger` | Destructive or high-risk item styling. |
| `shortcut` | Keyboard command hint for advanced workflows. |

## Trigger Guidance

Prefer visible text for important actions. Icon-only triggers need a stable
accessible label.

```tsx
import { DropdownMenu } from '@vellira-ui/icons';
import { Button, Dropdown } from '@vellira-ui/react';

<Dropdown
  ariaLabel='More invoice actions'
  trigger={
    <Button
      aria-label='More invoice actions'
      iconOnly
      iconStart={<DropdownMenu />}
    />
  }
  items={items}
/>
```

Native uses `accessibilityLabel` and can also use `accessibilityHint` when the
surrounding screen needs more context.

## Controlled Open State

Control open state when another surface needs to close the menu, analytics need
explicit open tracking, or business rules can block opening.

```tsx
<Dropdown
  open={open}
  onOpenChange={setOpen}
  label='Actions'
  items={items}
/>
```

## Real Example: Table Row Actions

```tsx
import { Dropdown, Modal, Button } from '@vellira-ui/react';
import { useState } from 'react';

export function ProjectRowActions({ project }) {
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  return (
    <>
      <Dropdown
        ariaLabel={`Actions for ${project.name}`}
        label='Actions'
        items={[
          { value: 'open', label: 'Open project' },
          { value: 'rename', label: 'Rename' },
          { value: 'duplicate', label: 'Duplicate' },
          { type: 'separator' },
          { value: 'delete', label: 'Delete', danger: true },
        ]}
        onSelect={(value) => {
          if (value === 'delete') {
            setConfirmingDelete(true);
            return;
          }
          runProjectAction(project.id, value);
        }}
      />

      <Modal
        isOpen={confirmingDelete}
        onClose={() => setConfirmingDelete(false)}
      >
        <Modal.Content>
          <Modal.Header>Delete {project.name}?</Modal.Header>
          <Modal.Body>This removes the project for every member.</Modal.Body>
          <Modal.Footer>
            <Button appearance='ghost' color='neutral'>Cancel</Button>
            <Button color='danger'>Delete project</Button>
          </Modal.Footer>
        </Modal.Content>
      </Modal>
    </>
  );
}
```

## Accessibility

- Do not put saved values in Dropdown; use Select.
- Use danger items sparingly and confirm irreversible actions.
- Keep item labels verb-first: Rename, Duplicate, Archive, Delete.
- Disabled actions should have an explanation nearby when the reason is not
  obvious.

## See Also

- [Button](/components/button) for triggers and command buttons.
- [Select](/components/select) for value selection.
- [Modal](/components/modal) for confirmation flows.
