---
description: Build anchored floating surfaces with Vellira Popover using
  compound components, positioning, alignment, arrows, custom anchors,
  controlled state, and native accessibility.
title: React Native Popover
---

# Popover

Popover displays rich contextual content anchored to another element.
Unlike Tooltip, Popover can contain interactive controls such as
buttons, inputs, filters, and settings panels.

## Open in Storybook

Use the **Components → Popover** stories to explore:

- Basic
- Controlled
- Positioning
- Alignment
- Offsets
- Without Outside Close
- Rich Content
- Separate Anchor
- Custom Styles

## When To Use

Use Popover for:

- contextual settings
- inline forms
- profile cards
- formatting toolbars
- filters
- inspector panels

Use **Tooltip** for short helper text and **Modal** when the user must
complete or acknowledge a task before continuing.

## Basic Usage

```tsx
import { Button, Popover } from '@vellira-ui/react-native';

<Popover>
  <Popover.Trigger asChild>
    <Button>Open popover</Button>
  </Popover.Trigger>

  <Popover.Content>
    <Popover.Arrow />

    <Popover.Title>Workspace settings</Popover.Title>

    <Popover.Description>
      Configure preferences for this workspace.
    </Popover.Description>

    <Popover.Close asChild>
      <Button>Done</Button>
    </Popover.Close>
  </Popover.Content>
</Popover>;
```

## Controlled State

```tsx
<Popover
  open={open}
  onOpenChange={setOpen}
>
```

## Uncontrolled State

```tsx
<Popover defaultOpen>
```

## Compound API

Component Purpose

---

Popover.Trigger Opens the popover
Popover.Content Floating surface
Popover.Title Accessible heading
Popover.Description Supporting text
Popover.Arrow Visual connection to the trigger
Popover.Close Closes the popover
Popover.Anchor Uses a different positioning anchor

## Positioning

```tsx
<Popover side='bottom' align='center' sideOffset={8} />
```

Supported sides:

- top
- right
- bottom
- left

Supported alignment:

- start
- center
- end

`sideOffset` controls the distance between the trigger and the floating
surface.

## Separate Anchor

Use `Popover.Anchor` when the trigger and positioning target should be
different elements.

## Rich Content

Popover supports arbitrary React Native content including forms.

```tsx
<Popover.Content>
  <Popover.Title>Workspace</Popover.Title>

  <Input label='Workspace name' value={name} onValueChange={setName} />

  <Button onPress={save}>Save</Button>
</Popover.Content>
```

## Outside Press

By default the popover closes when the user presses outside.

```tsx
<Popover closeOnOutsidePress={false}>
```

Disable outside dismissal only when the interaction requires an explicit
confirmation.

## Accessibility

- Provide a meaningful trigger label.
- Use Title for the primary heading.
- Use Description for supporting context.
- Verify VoiceOver and TalkBack announcements.
- Ensure interactive controls remain reachable inside the popover.
- Prefer Modal for blocking workflows.

## See Also

- [Tooltip](/react-native/tooltip)
- [Dropdown](/react-native/dropdown)
- [Modal](/react-native/modal)
