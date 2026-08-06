---
title: React Portal
description: Render Vellira overlays outside the normal DOM hierarchy with Portal and PortalProvider while preserving React context and custom container control.
---

# Portal

Portal renders React content into a DOM node outside the normal parent hierarchy.

Use it for overlays such as modals, popovers, dropdowns, and tooltips when the floating surface must escape clipping, stacking, or layout constraints.

## Basic Usage

```tsx
import { Portal } from '@vellira-ui/react';

<Portal>
  <div role='dialog'>
    Portal content
  </div>
</Portal>
```

Portal preserves the same React tree even though the DOM node is rendered elsewhere.

## With Modal

```tsx
import {
  Button,
  Modal,
  Portal,
} from '@vellira-ui/react';

<Modal open={open} onOpenChange={setOpen}>
  <Modal.Trigger asChild>
    <Button>Open modal</Button>
  </Modal.Trigger>

  <Portal>
    <Modal.Overlay />

    <Modal.Content>
      <Modal.Header>
        <Modal.Title>Delete project?</Modal.Title>
        <Modal.Description>
          This action cannot be undone.
        </Modal.Description>
      </Modal.Header>

      <Modal.Footer>
        <Modal.Close asChild>
          <Button appearance='ghost' color='neutral'>
            Cancel
          </Button>
        </Modal.Close>

        <Button color='danger' onClick={deleteProject}>
          Delete
        </Button>
      </Modal.Footer>
    </Modal.Content>
  </Portal>
</Modal>
```

Use the overlay component to provide dialog semantics, focus management, dismissal behavior, and accessible labels. Portal only controls where the content is mounted.

## Custom Container

Pass `container` when the overlay must render inside a specific DOM element.

```tsx
import { Portal } from '@vellira-ui/react';
import { useRef } from 'react';

export function WorkspaceOverlay() {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <>
      <div ref={containerRef} />

      <Portal container={containerRef.current}>
        <div>Workspace overlay</div>
      </Portal>
    </>
  );
}
```

The container may be an `Element` or `DocumentFragment`.

Portal returns `null` until a valid target is available, so container refs should be resolved after mounting.

## PortalProvider

PortalProvider supplies a default container to every nested Portal.

```tsx
import {
  Portal,
  PortalProvider,
} from '@vellira-ui/react';
import { useRef } from 'react';

export function EmbeddedApp() {
  const overlayRootRef = useRef<HTMLDivElement>(null);

  return (
    <div className='embedded-app'>
      <div ref={overlayRootRef} className='overlay-root' />

      <PortalProvider container={overlayRootRef.current}>
        <Workspace />
      </PortalProvider>
    </div>
  );
}

function Workspace() {
  return (
    <Portal>
      <div>Rendered into the provider container</div>
    </Portal>
  );
}
```

A container passed directly to Portal takes precedence over the PortalProvider container.

## Container Priority

Portal resolves its target in this order:

1. the `container` passed directly to Portal;
2. the nearest PortalProvider container;
3. the default portal root resolved by Vellira.

Use a direct container for one exceptional overlay. Use PortalProvider when an entire application area should share the same overlay root.

## When To Use PortalProvider

PortalProvider is useful for:

- embedded applications;
- micro-frontends;
- isolated product surfaces;
- custom stacking contexts;
- testing environments;
- applications that cannot mount overlays at the document root.

## Server Rendering

Portal does not render until a client-side target exists.

Avoid accessing `document` while rendering server components. Resolve custom containers after mounting.

```tsx
import { Portal } from '@vellira-ui/react';
import { useEffect, useState } from 'react';

export function ClientPortal({
  children,
}: {
  children: React.ReactNode;
}) {
  const [container, setContainer] = useState<Element | null>(null);

  useEffect(() => {
    setContainer(document.querySelector('#overlay-root'));
  }, []);

  return (
    <Portal container={container}>
      {children}
    </Portal>
  );
}
```

## Styling And Stacking

Portal escapes ancestor layout and overflow, but it does not create visual styling automatically.

The rendered surface still needs appropriate:

- positioning;
- inset values;
- width and height;
- backdrop styles;
- `z-index`;
- pointer-event behavior.

Prefer the styles supplied by Vellira overlay components instead of rebuilding them around a raw Portal.

## Accessibility

Portal does not add accessibility semantics.

The rendered content remains responsible for:

- roles such as `dialog`, `menu`, or `tooltip`;
- accessible names and descriptions;
- focus management;
- keyboard dismissal;
- outside interaction;
- restoring focus after closing.

DOM position may differ from the visual trigger position, so verify screen-reader reading order and focus behavior in composed overlays.

## API

### Portal

| Prop | Type | Required | Description |
| --- | --- | --- | --- |
| `children` | `ReactNode` | Yes | Content rendered through the portal. |
| `container` | `Element \| DocumentFragment \| null` | No | Explicit portal target. |

### PortalProvider

| Prop | Type | Required | Description |
| --- | --- | --- | --- |
| `children` | `ReactNode` | Yes | Application content that can use the provider target. |
| `container` | `Element \| DocumentFragment \| null` | No | Default target for nested Portal instances. |

## See Also

- [Modal](/react/modal)
- [Popover](/react/popover)
- [Dropdown](/react/dropdown)
- [Tooltip](/react/tooltip)
