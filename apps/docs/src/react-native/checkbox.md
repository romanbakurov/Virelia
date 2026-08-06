---
title: React Native Checkbox
description: Use Vellira Checkbox for controlled, uncontrolled, required, disabled, error, and indeterminate boolean selection in React Native.
---

# Checkbox

Checkbox represents an independent boolean choice and supports controlled, uncontrolled, and mixed selection states.

## Basic Usage

```tsx
import { Checkbox } from '@vellira-ui/react-native';

<Checkbox
  checked={accepted}
  onCheckedChange={setAccepted}
  label='Accept terms'
  description='Required to continue.'
/>
```

## Controlled And Uncontrolled

```tsx
<Checkbox
  checked={enabled}
  onCheckedChange={setEnabled}
  label='Enable notifications'
/>

<Checkbox
  defaultChecked
  label='Remember this device'
/>
```

## Indeterminate State

```tsx
<Checkbox
  checked={allSelected}
  indeterminate={someSelected && !allSelected}
  onCheckedChange={toggleAll}
  label='Select all projects'
/>
```

Use `indeterminate` for partial group selection. It is a visual mixed state, not a third stored boolean value.

## Validation

```tsx
<Checkbox
  required
  checked={accepted}
  onCheckedChange={setAccepted}
  label='Accept the terms'
  error={showError ? 'Accept the terms to continue.' : undefined}
/>
```

## Custom Icons And Color

```tsx
<Checkbox
  color='success'
  icon={<CustomCheck />}
  indeterminateIcon={<CustomMinus />}
  label='Completed'
/>
```

## Label Position

Use `labelPosition` when the product layout requires the label before or after the control. Keep one position consistent within a settings surface.

## Styling

```tsx
<Checkbox
  style={{ paddingVertical: 8 }}
  label='Weekly summary'
  description='Receive a digest every Monday.'
/>
```

`style` applies to the clickable Pressable row.

## Accessibility

- Prefer a visible `label`.
- When no label is rendered, provide `accessibilityLabel`.
- `description`, `error`, and an explicit `accessibilityHint` contribute to the resolved hint.
- The icon-only touch target remains at least 44px square.
- Confirm mixed-state announcements with VoiceOver and TalkBack.

## See Also

- [RadioGroup](/react-native/radio-group)
- [FormField](/react-native/form-field)
