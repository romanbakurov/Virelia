---
title: Switch – React Toggle Component
description: Build accessible React switches with controlled and uncontrolled state, validation, disabled behavior, and TypeScript support.
---

# Switch

Switch represents an immediate boolean setting such as enabling notifications,
turning a feature on or off, or changing a preference.

Use Switch when changing the value takes effect immediately. Use Checkbox when
the value is part of a form submission or represents an independent selection.

## Basic Usage

```tsx
import { Switch } from '@vellira-ui/react';

<Switch accessibilityLabel='Enable notifications' defaultChecked />;
```

## Controlled Usage

Use `checked` with `onCheckedChange` when application state owns the value.

```tsx
import { Switch } from '@vellira-ui/react';
import { useState } from 'react';

export function NotificationsSetting() {
  const [enabled, setEnabled] = useState(false);

  return (
    <Switch
      accessibilityLabel='Enable notifications'
      checked={enabled}
      onCheckedChange={setEnabled}
    />
  );
}
```

## Uncontrolled Usage

Use `defaultChecked` when the component can own its own state.

```tsx
<Switch accessibilityLabel='Enable automatic updates' defaultChecked />
```

## States

```tsx
<Switch accessibilityLabel='Available setting' />

<Switch accessibilityLabel='Enabled setting' checked />

<Switch accessibilityLabel='Unavailable setting' disabled />

<Switch accessibilityLabel='Required setting' required />

<Switch accessibilityLabel='Invalid setting' invalid />
```

## API Shape

| Prop                 | Purpose                                                   |
| -------------------- | --------------------------------------------------------- |
| `accessibilityLabel` | Accessible name for the switch. Defaults to `Switch`.     |
| `checked`            | Controlled checked state.                                 |
| `defaultChecked`     | Initial checked state for uncontrolled usage.             |
| `onCheckedChange`    | Receives the next boolean state after interaction.        |
| `disabled`           | Disables interaction.                                     |
| `required`           | Marks the switch as required for accessibility semantics. |
| `invalid`            | Marks the switch as invalid.                              |

## Accessibility

Switch renders a native `button` with `role='switch'` and exposes its state with
`aria-checked`.

Provide a meaningful `accessibilityLabel` whenever the surrounding content does
not already make the purpose obvious. Do not rely on the default `Switch` label
for production interfaces with multiple switches.

`required` maps to `aria-required`, `invalid` maps to `aria-invalid`, and
`disabled` uses the native disabled button state.

```tsx
<Switch
  accessibilityLabel='Use dark theme'
  checked={darkMode}
  onCheckedChange={setDarkMode}
/>
```

## When To Use

Use Switch for settings that take effect immediately:

- Enable or disable notifications.
- Turn synchronization on or off.
- Enable a product feature.
- Toggle a persistent preference.

Use Checkbox instead when the user is selecting values before submitting a form.

## See Also

- [Checkbox](/react/checkbox) for independent form selections.
- [FormField](/react/form-field) for labels, descriptions, and validation layout.
- [React Native Switch](/react-native/switch) for the native implementation.
