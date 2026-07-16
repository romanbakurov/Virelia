# Modal

Modal is for focused decisions and blocking workflows. It should reduce the
current page to one clear task, then return users to where they were.

## When To Use

Use Modal for confirmations, short forms, permissions, or decisions that should
interrupt the current workflow. Do not use it for large multi-page flows or
content users need to compare with the page behind it.

```tsx
<Modal isOpen={open} onClose={() => setOpen(false)}>
  <Modal.Content>
    <Modal.Header>Invite teammate</Modal.Header>
    <Modal.Body>
      Send an invitation to join this workspace.
    </Modal.Body>
    <Modal.Footer>
      <Button appearance='ghost' color='neutral' onClick={() => setOpen(false)}>
        Cancel
      </Button>
      <Button>Send invite</Button>
    </Modal.Footer>
  </Modal.Content>
</Modal>
```

## Destructive Confirmation

Irreversible actions should use plain language, a danger action, and a safe
secondary path.

```tsx
<Modal isOpen={confirmingDelete} onClose={close}>
  <Modal.Content>
    <Modal.Header>Delete workspace?</Modal.Header>
    <Modal.Body>
      This permanently deletes projects, members, and billing history.
    </Modal.Body>
    <Modal.Footer>
      <Button appearance='ghost' color='neutral' disabled={deleting} onClick={close}>
        Cancel
      </Button>
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
</Modal>
```

## Real Example: Invite Teammate

```tsx
import { Button, Input, Modal, Select } from '@vellira-ui/react';
import { useState } from 'react';

export function InviteTeammateDialog() {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('editor');
  const [sending, setSending] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>Invite teammate</Button>
      <Modal isOpen={open} onClose={() => setOpen(false)}>
        <Modal.Content>
          <Modal.Header>Invite teammate</Modal.Header>
          <Modal.Body>
            <Input
              label='Email'
              type='email'
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
            <Select
              label='Role'
              value={role}
              onChange={setRole}
              options={[
                { value: 'admin', label: 'Admin' },
                { value: 'editor', label: 'Editor' },
                { value: 'viewer', label: 'Viewer' },
              ]}
            />
          </Modal.Body>
          <Modal.Footer>
            <Button appearance='ghost' color='neutral' onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button
              loading={sending}
              loadingText='Sending invite...'
              onClick={() => setSending(true)}
            >
              Send invite
            </Button>
          </Modal.Footer>
        </Modal.Content>
      </Modal>
    </>
  );
}
```

## Anatomy

| Part | Guidance |
| --- | --- |
| Header | State the decision or task. |
| Body | Explain consequence, scope, or required input. |
| Footer | Put the safe action and primary action in a predictable order. |
| Backdrop | Close only when losing work is not risky. |

## Accessibility

- Provide a visible title with `Modal.Header`.
- Use `Modal.Body` for descriptive content.
- Keep at least one obvious close/cancel path.
- Disable or show loading on the final action while async work is pending.
- For destructive flows, do not rely only on color. Use explicit wording.

## See Also

- [Button](/components/button) for loading and danger actions.
- [FormField](/components/form-field) for modal forms.
