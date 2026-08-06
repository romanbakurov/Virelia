---
title: React Native Tooltip
description: Add native contextual helper text with Vellira Tooltip using compound triggers, placement, delay, controlled state, outside dismissal, and optional arrows.
---

# Tooltip

Tooltip shows short contextual helper text around a native target.

Use it for brief clarification. Keep required instructions visible in the screen instead.

## Basic Usage

```tsx
import { Button, Tooltip } from '@vellira-ui/react-native';

<Tooltip placement='top'>
  <Tooltip.Trigger>
    <Button>More</Button>
  </Tooltip.Trigger>

  <Tooltip.Content withArrow>
    More actions
  </Tooltip.Content>
</Tooltip>
```

## Controlled State

```tsx
<Tooltip open={open} onOpenChange={setOpen}>
  ...
</Tooltip>
```

Or use `defaultOpen` for uncontrolled state.

## Placement And Offset

```tsx
<Tooltip placement='bottom' offset={8}>
  ...
</Tooltip>
```

Available placements are `top`, `bottom`, `left`, and `right`.

## Delay

```tsx
<Tooltip delay={500}>
  ...
</Tooltip>
```

Or configure open and close independently:

```tsx
<Tooltip delay={{ open: 500, close: 150 }}>
  ...
</Tooltip>
```

## Outside Dismissal

```tsx
<Tooltip closeOnOutsidePress>
  ...
</Tooltip>
```

## Disabled Tooltip

```tsx
<Tooltip disabled>
  ...
</Tooltip>
```

The trigger may also be disabled independently.

## Force Mount

```tsx
<Tooltip.Content forceMount>
  Helper text
</Tooltip.Content>
```

Use this for measurement or animation needs, not as a default.

## Styling

```tsx
<Tooltip style={{ alignSelf: 'flex-start' }}>
  <Tooltip.Trigger style={{ borderRadius: 8 }}>
    <Button>Help</Button>
  </Tooltip.Trigger>

  <Tooltip.Content
    withArrow
    style={{ maxWidth: 240 }}
    textStyle={{ textAlign: 'center' }}
  >
    This setting applies to the current workspace.
  </Tooltip.Content>
</Tooltip>
```

## Accessibility

- Tooltip content must not be the only place for required instructions.
- Icon-only triggers still need `accessibilityLabel`.
- Ensure users can discover the same meaning without hover.
- Keep text short and non-interactive.
- Verify opening, dismissal, and screen-reader behavior on both platforms.

## See Also

- [Button](/react-native/button)
- [FormField](/react-native/form-field)
