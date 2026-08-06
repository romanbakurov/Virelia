---
title: React Native Input
description: Capture native text with Vellira Input using validation, clear actions, password reveal, icons, masks, formatting, counters, and TextInput props.
---

# Input

Input captures short free-form text such as names, emails, search terms, URLs, numbers, and passwords.

## Basic Usage

```tsx
import { Input } from '@vellira-ui/react-native';

<Input
  label='Email'
  type='email'
  value={email}
  onValueChange={setEmail}
  placeholder='name@example.com'
/>
```

Input accepts native `TextInputProps` except `value`, `onChange`, `onChangeText`, and `editable`, which are managed by the Vellira API.

## Controlled And Uncontrolled

```tsx
<Input value={name} onValueChange={setName} />

<Input defaultValue='Vellira' />
```

## Field Semantics

```tsx
<Input
  label='Work email'
  description='Used for invoices and security alerts.'
  required
  value={email}
  onValueChange={setEmail}
  error={emailError}
/>
```

Validation remains in the app.

```tsx
const emailError = email.includes('@')
  ? undefined
  : 'Enter a valid email.';
```

## Clearable Input

```tsx
<Input
  label='Search'
  value={query}
  onValueChange={setQuery}
  clearable
  onClear={() => setQuery('')}
/>
```

Typing calls `onValueChange`. Pressing the clear action calls `onClear`. Controlled inputs should update their state inside `onClear`.

## Icons

```tsx
import { Search } from '@vellira-ui/icons';

<Input
  accessibilityLabel='Search projects'
  type='search'
  value={query}
  onValueChange={setQuery}
  placeholder='Search projects'
  startIcon={<Search />}
  clearable
/>
```

Use `startIconTone`, `endIconTone`, and `clearIconTone` for semantic adornment colors.

## Password Reveal

```tsx
<Input
  label='Password'
  type='password'
  value={password}
  onValueChange={setPassword}
  revealPassword
/>
```

## Masks And Formatting

```tsx
<Input
  label='Phone'
  mask='+33 # ## ## ## ##'
  onValueChange={setPhone}
/>

<Input
  label='Amount'
  value={amount}
  onValueChange={setAmount}
  format={(value) => Number(value).toLocaleString('en-US')}
  parse={(value) => value.replace(/,/g, '')}
/>
```

## Counter

```tsx
<Input
  label='Project name'
  value={name}
  onValueChange={setName}
  maxLength={60}
  showCounter
/>
```

## Native Input Props

```tsx
<Input
  label='Phone'
  type='tel'
  keyboardType='phone-pad'
  autoComplete='tel'
  returnKeyType='done'
/>
```

## Styling

```tsx
<Input
  containerStyle={{ marginBottom: 16 }}
  inputStyle={{ fontSize: 16 }}
/>
```

## Accessibility

- Prefer a visible label.
- Use description for persistent guidance, not placeholders.
- Use actionable error messages.
- Verify keyboard type, secure entry, read-only state, and announcements with VoiceOver and TalkBack.
- `loading` preserves the current value while making the control non-editable.

## See Also

- [FormField](/react-native/form-field)
- [Select](/react-native/select)
- [RadioGroup](/react-native/radio-group)
