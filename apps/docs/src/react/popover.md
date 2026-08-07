---
title: Popover – Accessible React Popover Component
description: Build accessible React popovers with controlled state, modal behavior, flexible positioning, anchors, arrows, and keyboard interactions.
---

# Popover

Popover displays interactive floating content next to a trigger or a separate
anchor. Use it for contextual actions, settings, forms, filters, and other
content that needs more structure than a `Tooltip`.

<StorybookFrame
story="popover.basic"
title="Popover"
:height="420"
/>

## When To Use

Use Popover when users need to interact with contextual content without leaving
the current screen.

Good examples include:

- quick settings
- compact forms
- contextual filters
- additional item details
- action menus that do not require menu semantics

Use `Tooltip` for short, non-interactive helper text. Use `Modal` when the content
must interrupt the current workflow or require a focused decision.

```tsx
import { Button, Popover } from '@vellira-ui/react';

export function WorkspacePopover() {
  return (
    <Popover>
      <Popover.Trigger asChild>
        <Button>Workspace settings</Button>
      </Popover.Trigger>

      <Popover.Content>
        <Popover.Arrow />

        <Popover.Title>Workspace settings</Popover.Title>

        <Popover.Description>
          Configure preferences for this workspace.
        </Popover.Description>

        <Popover.Close asChild>
          <Button appearance='ghost' size='sm'>
            Close
          </Button>
        </Popover.Close>
      </Popover.Content>
    </Popover>
  );
}
```

## Compound API

Popover uses a compound component API:

```tsx
<Popover>
  <Popover.Anchor />
  <Popover.Trigger />
  <Popover.Content>
    <Popover.Arrow />
    <Popover.Title />
    <Popover.Description />
    <Popover.Close />
  </Popover.Content>
</Popover>
```

`Popover.Trigger` controls the `open` state. `Popover.Content` renders the
floating dialog. `Popover.Anchor` can optionally provide a separate positioning
reference.

## Controlled State

Use `open` and `onOpenChange` when Popover visibility must follow application
state.

```tsx
import { useState } from 'react';

import { Button, Popover } from '@vellira-ui/react';

export function ControlledPopover() {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>
        <Button>{open ? 'Close settings' : 'Open settings'}</Button>
      </Popover.Trigger>

      <Popover.Content>
        <Popover.Arrow />

        <Popover.Title>Controlled popover</Popover.Title>

        <Popover.Description>
          This Popover is controlled through React state.
        </Popover.Description>
      </Popover.Content>
    </Popover>
  );
}
```

Use `defaultOpen` when the Popover should manage its own state but start open.

## Open Change Details

`onOpenChange` receives the next state and details describing why the state
changed.

```tsx
<Popover
  onOpenChange={(open, details) => {
    console.log(open, details.reason);
  }}
>
  {/* ... */}
</Popover>
```

Possible `reason` values include:

- trigger
- close
- escape-key
- outside-press
- programmatic

## Positioning

Use `side` and align to control the preferred content position.

```tsx
<Popover side='right' align='start' sideOffset={12}>
  <Popover.Trigger asChild>
    <Button>Open details</Button>
  </Popover.Trigger>

  <Popover.Content>
    <Popover.Arrow />
    <Popover.Title>Project details</Popover.Title>
  </Popover.Content>
</Popover>
```

Supported sides:

```text
top
right
bottom
left
```

Supported alignments:

```text
start
center
end
```

When `avoidCollisions` is enabled, Popover may flip or shift to remain inside
the viewport.

```tsx
<Popover side='top' align='center' collisionPadding={12} avoidCollisions>
  {/* ... */}
</Popover>
```

## Arrow

Use `Popover.Arrow` to visually connect floating content to its reference
element.

```tsx
<Popover.Content>
  <Popover.Arrow />
  <Popover.Title>Workspace settings</Popover.Title>
</Popover.Content>
```

`Popover.Arrow` can be aligned independently:

```tsx
<Popover.Arrow align='start' />
<Popover.Arrow align='center' />
<Popover.Arrow align='end' />
```

Use `offset` for a precise static position:

```tsx
<Popover.Arrow offset={24} />
```

`Popover.Arrow` dimensions and styling can also be customized:

```tsx
<Popover.Arrow width={16} height={8} tipRadius={1} strokeWidth={1} />
```

## Separate Anchor

By default, Popover content is positioned relative to `Popover.Trigger`.

Use `Popover.Anchor` when one element should control the position while another
element controls the open state.

```tsx
import { Button, Popover } from '@vellira-ui/react';

export function AnchoredPopover() {
  return (
    <Popover side='bottom' align='start'>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 16,
        }}
      >
        <Popover.Anchor asChild>
          <div
            style={{
              padding: 16,
              border: '1px dashed currentColor',
              borderRadius: 8,
            }}
          >
            Position relative to me
          </div>
        </Popover.Anchor>

        <Popover.Trigger asChild>
          <Button>Toggle popover</Button>
        </Popover.Trigger>
      </div>

      <Popover.Content>
        <Popover.Arrow />

        <Popover.Title>Separate anchor</Popover.Title>

        <Popover.Description>
          The trigger controls visibility while the anchor controls positioning.
        </Popover.Description>
      </Popover.Content>
    </Popover>
  );
}
```

When the Popover closes, focus is restored to the trigger rather than the
anchor.

## Modal Behavior

Use `modal` when interaction and focus should remain inside the Popover while it is open.

```tsx
<Popover modal>
  <Popover.Trigger asChild>
    <Button>Open preferences</Button>
  </Popover.Trigger>

  <Popover.Content>
    <Popover.Arrow />

    <Popover.Title>Preferences</Popover.Title>

    <Popover.Description>
      Change the active workspace preferences.
    </Popover.Description>

    <input aria-label='Workspace name' />

    <Popover.Close asChild>
      <Button>Save</Button>
    </Popover.Close>
  </Popover.Content>
</Popover>
```

Modal Popover behavior includes:

- focus moves inside the content
- focus remains inside while using Tab
- background scrolling is locked
- surrounding content is hidden from assistive technology
- focus returns to the trigger when the Popover closes

Use non-modal behavior for lightweight contextual content that should not block
the rest of the page.

## Focus Management

Use `initialFocus` to select the element that should receive focus when the
Popover opens.

```tsx
import { useRef } from 'react';

import { Button, Popover } from '@vellira-ui/react';

export function FocusedPopover() {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <Popover>
      <Popover.Trigger asChild>
        <Button>Rename project</Button>
      </Popover.Trigger>

      <Popover.Content initialFocus={inputRef}>
        <Popover.Title>Rename project</Popover.Title>

        <input ref={inputRef} aria-label='Project name' />
      </Popover.Content>
    </Popover>
  );
}
```

Set `returnFocus={false}` only when another part of the application explicitly
manages focus after the Popover closes.

## Dismiss Behavior

Popover closes on Escape and outside pointer press by default.

```tsx
<Popover.Content closeOnEscape closeOnOutsidePress>
  {/* ... */}
</Popover.Content>
```

Either behavior can be disabled:

```tsx
<Popover.Content closeOnEscape={false} closeOnOutsidePress={false}>
  {/* ... */}
</Popover.Content>
```

Prevent automatic dismissal from an event handler when the application needs
to keep the Popover open:

```tsx
<Popover.Content
  onPointerDownOutside={(event) => {
    event.preventDefault();
  }}
>
  {/* ... */}
</Popover.Content>
```

The same pattern works with `onEscapeKeyDown`, `onInteractOutside`,
`onOpenAutoFocus`, and `onCloseAutoFocus`.

## Rendering Without A Portal

Popover renders through a Portal by default.

Set `portal={false}` when the content must remain inside the current DOM
hierarchy.

```tsx
<Popover portal={false}>
  <Popover.Trigger asChild>
    <Button>Open inline popover</Button>
  </Popover.Trigger>

  <Popover.Content>
    <Popover.Title>Inline content</Popover.Title>
  </Popover.Content>
</Popover>
```

Inline content may be clipped by parent elements using `overflow: hidden`.

## Accessibility

- `Popover.Content` uses `role="dialog"`.
- `Popover.Title` provides the accessible dialog name.
- `Popover.Description` provides the accessible description.
- The trigger exposes `aria-expanded` and `aria-controls`.
- Escape closes the Popover unless explicitly `disabled`.
- Focus returns to the trigger after closing by default.
- Modal Popovers trap focus and isolate surrounding content.
- Do not use Popover as a replacement for essential visible instructions.
- Keep interactive content keyboard accessible.
- Always provide a clear accessible name through `Popover.Title` or another
  explicit labeling strategy.

## See Also

- [Tooltip](/react/tooltip) for short, non-interactive helper text.
- [Dropdown](/react/dropdown) for menu actions and selection semantics.
- [Modal](/react/modal) for blocking workflows and larger dialogs.
- [Button](/react/button) for accessible trigger controls.
