# Modal

Modal is for focused decisions and blocking workflows. It should reduce the
current page to one clear task, then return users to where they were.

<StorybookFrame
  story="modal.basic"
  title="Modal basic interaction"
  :height="460"
/>

## When To Use

Use Modal for confirmations, short forms, permissions, or decisions that should
interrupt the current workflow. Do not use it for large multi-page flows or
content users need to compare with the page behind it.

```tsx
import { Button, Modal, Portal } from '@vellira-ui/react';

<Modal open={open} onOpenChange={setOpen}>
  <Modal.Trigger asChild>
    <Button>Invite teammate</Button>
  </Modal.Trigger>

  <Portal>
    <Modal.Overlay />
    <Modal.Content>
      <Modal.Header>
        <div>
          <Modal.Title>Invite teammate</Modal.Title>
          <Modal.Description>
            Send an invitation to join this workspace.
          </Modal.Description>
        </div>
        <Modal.Close />
      </Modal.Header>
      <Modal.Body>Choose a role and send the invite.</Modal.Body>
      <Modal.Footer>
        <Modal.Close asChild>
          <Button appearance='ghost' color='neutral'>
            Cancel
          </Button>
        </Modal.Close>
        <Button>Send invite</Button>
      </Modal.Footer>
    </Modal.Content>
  </Portal>
</Modal>;
```

## Destructive Confirmation

Irreversible actions should use plain language, a danger action, and a safe
secondary path.

```tsx
<Modal
  open={confirmingDelete}
  onOpenChange={setConfirmingDelete}
  role='alertdialog'
>
  <Portal>
    <Modal.Overlay />
    <Modal.Content>
      <Modal.Header>
        <div>
          <Modal.Title>Delete workspace?</Modal.Title>
          <Modal.Description>
            This permanently deletes projects, members, and billing history.
          </Modal.Description>
        </div>
        <Modal.Close />
      </Modal.Header>
      <Modal.Body>This action cannot be undone.</Modal.Body>
      <Modal.Footer>
        <Modal.Close asChild>
          <Button appearance='ghost' color='neutral' disabled={deleting}>
            Cancel
          </Button>
        </Modal.Close>
        <Button
          color='danger'
          loading={deleting}
          loadingText='Deleting...'
          onClick={deleteWorkspace}
        >
          Delete workspace
        </Button>
      </Modal.Footer>
    </Modal.Content>
  </Portal>
</Modal>
```

## Real Example: Invite Teammate

```tsx
import { Button, Input, Modal, Portal, Select } from '@vellira-ui/react';
import { useState } from 'react';

export function InviteTeammateDialog() {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('editor');
  const [sending, setSending] = useState(false);

  return (
    <Modal open={open} onOpenChange={setOpen}>
      <Modal.Trigger asChild>
        <Button>Invite teammate</Button>
      </Modal.Trigger>

      <Portal>
        <Modal.Overlay />
        <Modal.Content>
          <Modal.Header>
            <div>
              <Modal.Title>Invite teammate</Modal.Title>
              <Modal.Description>
                Send an invitation to join this workspace.
              </Modal.Description>
            </div>
            <Modal.Close />
          </Modal.Header>
          <Modal.Body>
            <Input
              label='Email'
              type='email'
              value={email}
              onValueChange={setEmail}
            />
            <Select label='Role' value={role} onValueChange={setRole}>
              <Select.Item value='admin'>Admin</Select.Item>
              <Select.Item value='editor'>Editor</Select.Item>
              <Select.Item value='viewer'>Viewer</Select.Item>
            </Select>
          </Modal.Body>
          <Modal.Footer>
            <Modal.Close asChild>
              <Button appearance='ghost' color='neutral'>
                Cancel
              </Button>
            </Modal.Close>
            <Button
              loading={sending}
              loadingText='Sending invite...'
              onClick={() => setSending(true)}
            >
              Send invite
            </Button>
          </Modal.Footer>
        </Modal.Content>
      </Portal>
    </Modal>
  );
}
```

## Anatomy

| Part    | Guidance                                                         |
| ------- | ---------------------------------------------------------------- |
| Trigger | Opens the dialog through `Modal.Trigger`.                        |
| Portal  | Renders overlay layers through the shared `Portal` primitive.    |
| Overlay | Dims the page and can close when outside press is enabled.       |
| Header  | Groups `Modal.Title`, `Modal.Description`, and close affordance. |
| Body    | Explain consequence, scope, or required input.                   |
| Footer  | Put the safe action and primary action in a predictable order.   |
| Close   | Use `Modal.Close` for cancel and icon close controls.            |

## Styling

Modal uses component tokens for overlay color, content surface, border, radius,
shadow, spacing, and close-button states. Prefer theme tokens for custom form
controls inside modal bodies so light, dark, and high-contrast themes stay in
sync.

The default motion is a scale/fade entrance with a small vertical lift:
backdrop opacity runs for 180ms on open and 150ms on close; content animates
opacity, scale, and `translateY` over the same timings. Use `animation='slide'`,
`animation='fade'`, or `animation='none'` when the product surface needs a
different motion profile. `duration` accepts either a number or
`{ open, close }`, and `easing='standard'` is the default curve.

## Accessibility

- Provide a visible `Modal.Title` or pass `ariaLabel` to `Modal.Content`.
- Use `Modal.Description` for descriptive content, especially `alertdialog`.
- Keep at least one obvious close/cancel path with `Modal.Close`.
- Disable or show loading on the final action while async work is pending.
- For destructive flows, do not rely only on color. Use explicit wording.

## See Also

- [Button](/components/button) for loading and danger actions.
- [FormField](/components/form-field) for modal forms.
