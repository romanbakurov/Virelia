# Button

Button is the action primitive for Vellira. It should feel precise enough for
enterprise workflows and flexible enough for product surfaces with icons,
badges, keyboard shortcuts, links, and destructive actions.

## When To Use

Use Button for immediate actions: saving, submitting, confirming, opening a
menu, navigating to a route, or triggering a command. Use a native link when the
only behavior is inline text navigation inside prose.

| Pattern | Recommended API |
| --- | --- |
| Primary product action | `appearance="solid" color="primary"` |
| Secondary action near a primary | `appearance="outline" color="neutral"` or `appearance="ghost" color="neutral"` |
| Low-emphasis toolbar action | `appearance="ghost"` with an icon |
| Non-blocking success action | `appearance="soft" color="success"` |
| Destructive intent | `color="danger"` with confirmation when the action is irreversible |
| Text navigation | `appearance="link"` or `href` when a button should render as navigation |

## Appearance And Color

Button separates visual structure from semantic tone.

```tsx
<Button appearance='solid' color='primary'>Save</Button>
<Button appearance='outline' color='neutral'>Cancel</Button>
<Button appearance='ghost' color='danger'>Delete</Button>
<Button appearance='soft' color='success'>Published</Button>
<Button appearance='link' color='primary'>Open details</Button>
```

Use `appearance` for hierarchy and surface treatment. Use `color` for intent.
This keeps the API scalable without creating one-off variants like
`dangerOutline` or `secondaryGhost`.

## Premium Action Patterns

### Loading Without Layout Shift

Pass `loadingText` even before loading starts when the loading label is longer
than the idle label. Button reserves the wider label so dense toolbars and form
footers do not jump.

```tsx
<Button loading={isSaving} loadingText='Saving changes...'>
  Save
</Button>
```

### Icon And Shortcut

Use icons for scanning and shortcuts for command-heavy interfaces. Keep the
visible label unless the action is truly self-evident and has an accessible
name.

```tsx
import { Search } from '@vellira-ui/icons';

<Button iconStart={<Search />} shortcut='⌘K'>
  Search
</Button>
```

### Icon Only

Icon-only buttons need an accessible name.

```tsx
import { Search } from '@vellira-ui/icons';

<Button aria-label='Open command menu' iconOnly iconStart={<Search />} />
```

On native, use `accessibilityLabel`.

```tsx
import { Search } from '@vellira-ui/icons';

<Button accessibilityLabel='Open command menu' iconOnly iconStart={<Search />} />
```

### Destructive Confirmation

Use a soft or ghost danger action to open confirmation, then a solid danger
button inside the modal for the final destructive step.

```tsx
<Button
  appearance='soft'
  color='danger'
  onClick={() => setConfirmingDelete(true)}
>
  Delete workspace
</Button>

<Modal isOpen={confirmingDelete} onClose={() => setConfirmingDelete(false)}>
  <Modal.Content>
    <Modal.Header>Delete workspace?</Modal.Header>
    <Modal.Body>This cannot be undone.</Modal.Body>
    <Modal.Footer>
      <Button appearance='ghost' color='neutral'>Cancel</Button>
      <Button color='danger' loading={isDeleting} loadingText='Deleting...'>
        Delete
      </Button>
    </Modal.Footer>
  </Modal.Content>
</Modal>
```

### Real Example: Project Header Actions

```tsx
import { Copy, Folder, Plus, Settings } from '@vellira-ui/icons';
import { Button, Dropdown } from '@vellira-ui/react';

export function ProjectHeaderActions({ project }) {
  return (
    <div role='toolbar' aria-label={`${project.name} actions`}>
      <Button
        appearance='solid'
        color='primary'
        iconStart={<Plus />}
        onClick={() => createProjectInvite(project.id)}
      >
        Invite
      </Button>
      <Button
        appearance='outline'
        color='neutral'
        iconStart={<Copy />}
        shortcut='⌘D'
        onClick={() => duplicateProject(project.id)}
      >
        Duplicate
      </Button>
      <Dropdown
        ariaLabel='More project actions'
        trigger={
          <Button
            aria-label='More project actions'
            appearance='ghost'
            color='neutral'
            iconOnly
            iconStart={<Settings />}
          />
        }
        items={[
          { value: 'archive', label: 'Archive', icon: <Folder /> },
          { type: 'separator' },
          { value: 'delete', label: 'Delete', danger: true },
        ]}
        onSelect={(value) => runProjectAction(project.id, value)}
      />
    </div>
  );
}
```

## Web Links And Composition

Use `href`, `target`, `download`, or `asChild` when the action should adopt link
or router semantics. Preserve accessible names and disabled behavior when
composing with custom children.

```tsx
<Button href='/billing' appearance='link'>
  Billing settings
</Button>

<Button asChild appearance='solid'>
  <RouterLink to='/projects/new'>New project</RouterLink>
</Button>
```

## Accessibility

- Provide `aria-label` for icon-only web buttons.
- Provide `accessibilityLabel` for icon-only native buttons.
- Loading disables interaction and should communicate progress with clear text.
- Do not use a danger color as the only warning for irreversible actions.
- Keep target size comfortable for touch surfaces, especially icon-only actions.

## See Also

- [Modal](/components/modal) for confirmation flows.
- [Dropdown](/components/dropdown) for grouped actions.
- [Web API](https://github.com/vellira-dev/vellira/blob/main/packages/react/API.md#button)
- [Native API](https://github.com/vellira-dev/vellira/blob/main/packages/react-native/API.md#button)
