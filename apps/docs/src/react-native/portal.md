---
title: React Native Portal
description: Compose React Native overlays with the Vellira Portal primitive and PortalProvider while preserving a shared cross-platform overlay API.
---

# Portal

Portal is the shared primitive for explicit overlay composition.

The current native adapter renders children in place while preserving API parity for overlays such as Modal.

## Basic Usage

```tsx
import { Modal, Portal } from '@vellira-ui/react-native';

<Portal>
  <Modal.Content>Content</Modal.Content>
</Portal>
```

## With Modal

```tsx
<Modal open={open} onOpenChange={setOpen}>
  <Portal>
    <Modal.Overlay>
      <Modal.Content>
        <Modal.Header>Settings</Modal.Header>
        <Modal.Body>Modal content</Modal.Body>
      </Modal.Content>
    </Modal.Overlay>
  </Portal>
</Modal>
```

## PortalProvider

PortalProvider supplies a default container or host value to nested Portal instances.

```tsx
import {
  PortalProvider,
  ThemeProvider,
} from '@vellira-ui/react-native';

<ThemeProvider>
  <PortalProvider>
    <App />
  </PortalProvider>
</ThemeProvider>
```

## Container

The optional `container` prop is reserved for native host integration.

```tsx
<Portal container={customHost}>
  <Overlay />
</Portal>
```

Do not depend on physical reparenting until a host integration is explicitly configured by the package.

## When To Use

Use Portal with overlay primitives that document Portal composition, including Modal. Avoid adding Portal around ordinary screen content.

## Accessibility

Portal does not add dialog semantics, focus behavior, labels, or dismissal logic. The overlay component remains responsible for those behaviors.

## See Also

- [Modal](/react-native/modal)
- [Tooltip](/react-native/tooltip)
- [Dropdown](/react-native/dropdown)
