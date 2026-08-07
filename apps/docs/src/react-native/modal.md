---
title: React Native Modal
description: Build native dialogs with Vellira Modal using compound triggers, overlays, controlled state, animations, outside dismissal, Portal composition, and accessible actions.
---

# Modal

Modal is a compound native dialog for blocking workflows, confirmations, and focused tasks.

## Basic Usage

```tsx
import { Button, Modal, Portal } from '@vellira-ui/react-native';

<Modal open={open} onOpenChange={setOpen}>
  <Modal.Trigger asChild>
    <Button>Open modal</Button>
  </Modal.Trigger>

  <Portal>
    <Modal.Overlay>
      <Modal.Content>
        <Modal.Header>Delete file</Modal.Header>
        <Modal.Body>Are you sure you want to delete this file?</Modal.Body>
        <Modal.Footer>
          <Modal.Close>
            <Button color='neutral' appearance='solid'>
              Cancel
            </Button>
          </Modal.Close>
        </Modal.Footer>
      </Modal.Content>
    </Modal.Overlay>
  </Portal>
</Modal>;
```

## Controlled And Uncontrolled

```tsx
<Modal open={open} onOpenChange={setOpen}>
  ...
</Modal>

<Modal defaultOpen>
  ...
</Modal>
```

## Outside Dismissal

```tsx
<Modal closeOnOutsidePress={false}>...</Modal>
```

Disable backdrop dismissal for destructive confirmation or required decisions.

`closeOnEscape` is reserved for API parity with Web.

## Animation

```tsx
<Modal animation='fade' duration={200} easing='ease-out'>
  ...
</Modal>
```

Choose motion that is short and appropriate for the surface. Ensure the dialog remains understandable when reduced motion is preferred.

## Destructive Confirmation

```tsx
<Modal open={open} onOpenChange={setOpen}>
  <Portal>
    <Modal.Overlay>
      <Modal.Content>
        <Modal.Header>Delete workspace?</Modal.Header>
        <Modal.Body>This action cannot be undone.</Modal.Body>
        <Modal.Footer>
          <Modal.Close>
            <Button appearance='ghost' color='neutral'>
              Cancel
            </Button>
          </Modal.Close>

          <Button
            color='danger'
            loading={isDeleting}
            loadingText='Deleting...'
            onPress={handleDelete}
          >
            Delete
          </Button>
        </Modal.Footer>
      </Modal.Content>
    </Modal.Overlay>
  </Portal>
</Modal>
```

## Compound Components

| Component       | Purpose                 |
| --------------- | ----------------------- |
| `Modal.Trigger` | Opens the modal         |
| `Modal.Overlay` | Native backdrop         |
| `Modal.Content` | Dialog surface          |
| `Modal.Header`  | Header or title section |
| `Modal.Body`    | Main content            |
| `Modal.Footer`  | Actions                 |
| `Modal.Close`   | Closes the modal        |

## Accessibility

- Provide a clear title and body copy.
- Use specific action labels such as “Delete workspace”.
- Do not rely on danger color as the only warning.
- Keep at least one clear way to close non-required dialogs.
- Test focus, reading order, backdrop dismissal, and screen-reader announcements on iOS and Android.

## See Also

- [Portal](/react-native/portal)
- [Button](/react-native/button)
- [FormField](/react-native/form-field)
