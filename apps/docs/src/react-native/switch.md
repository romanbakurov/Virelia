---
title: React Native Switch
description: Build accessible React Native switches with controlled and uncontrolled state, validation, disabled behavior, and native accessibility semantics.
---

# Switch

Switch represents an immediate boolean setting such as enabling notifications,
turning synchronization on or off, or changing a persistent preference.

Use Switch when the setting takes effect immediately. Use Checkbox when the
value behaves like an independent form selection.

## Basic Usage

```tsx
import { Switch } from '@vellira-ui/react-native';

<Switch accessibilityLabel='Enable notifications' defaultChecked />;
```

## Controlled Usage

```tsx
import { Switch } from '@vellira-ui/react-native';
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

| Prop                 | Purpose                                            |
| -------------------- | -------------------------------------------------- |
| `accessibilityLabel` | Accessible name. Defaults to `Switch`.             |
| `checked`            | Controlled checked state.                          |
| `defaultChecked`     | Initial checked state for uncontrolled usage.      |
| `onCheckedChange`    | Receives the next boolean state after interaction. |
| `disabled`           | Disables interaction.                              |
| `required`           | Marks the setting as required.                     |
| `invalid`            | Marks the setting as invalid.                      |

## Accessibility

Switch uses `accessibilityRole='switch'` and exposes checked and disabled state
through `accessibilityState`.

Provide a meaningful `accessibilityLabel` for every production switch whose
purpose is not already obvious from surrounding accessible content.

Required and invalid state are currently communicated through the component's
accessibility hint.

Verify state announcements with VoiceOver and TalkBack when Switch is used in
critical settings flows.

## When To Use

Use Switch for settings that apply immediately:

- Notifications.
- Background synchronization.
- Feature enablement.
- Persistent user preferences.

Use Checkbox for form-like independent selections.

## See Also

- [Checkbox](/react-native/checkbox)
- [FormField](/react-native/form-field)
- [React Switch](/react/switch)
