---
title: React Native FormField
description: Compose custom native controls with Vellira FormField labels, descriptions, validation messages, required state, layout, and styles.
---

# FormField

FormField is a presentational layout helper for labels, descriptions, messages, errors, and custom native controls.

Do not wrap components that already render their own field chrome, such as Input, Select, or RadioGroup.

## Basic Usage

```tsx
import { FormField } from '@vellira-ui/react-native';
import { TextInput } from 'react-native';

<FormField
  label='Email'
  description='Used for account recovery.'
  error={error}
  required
>
  <TextInput
    accessibilityLabel='Email'
    value={email}
    onChangeText={setEmail}
  />
</FormField>
```

The wrapped control remains responsible for its accessibility label, role, disabled or editable state, and interactions.

## Layout

```tsx
<FormField
  label='Workspace'
  labelPosition='top'
  orientation='vertical'
  size='sm'
>
  <CustomWorkspaceControl />
</FormField>
```

For compact settings rows:

```tsx
<FormField
  label='Notifications'
  labelPosition='start'
  orientation='horizontal'
>
  <CustomSwitch />
</FormField>
```

## Description, Message, And Error

```tsx
<FormField
  label='Invite code'
  description='Codes expire after 24 hours.'
  message='Checking code...'
  messageTone='neutral'
  error={inviteError}
>
  <CustomCodeInput />
</FormField>
```

Use `invalid` when the visual invalid state is needed without an error node.

## Label Information And Actions

```tsx
<FormField
  label='API key'
  labelInfo={<InfoIcon />}
  labelAction={<HelpAction />}
  optionalText='Optional'
>
  <CustomSecretControl />
</FormField>
```

## Styling

```tsx
<FormField
  style={{ gap: 8 }}
  controlStyle={{ marginTop: 4 }}
  labelStyle={{ fontWeight: '600' }}
  descriptionStyle={{ opacity: 0.72 }}
  errorStyle={{ marginTop: 4 }}
>
  <CustomControl />
</FormField>
```

## Accessibility

- FormField provides layout and supporting text, not the control semantics.
- The child must expose an appropriate accessibility label and state.
- Error text uses a polite live region.
- `disabled` exposes disabled state on the root, but the child must also disable its own interaction.
- Test custom field composition on both iOS and Android.

## See Also

- [Input](/react-native/input)
- [Select](/react-native/select)
- [RadioGroup](/react-native/radio-group)
