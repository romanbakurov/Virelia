# Input

Input captures short free-form text with a stable label, validation state, and
optional adornments. It is the right choice for names, emails, search terms,
URLs, numbers, and other compact text values.

<StorybookFrame
  id="primitives-input--validation"
  title="Input validation"
  :height="420"
/>

## When To Use

Use Input when users need to type a value that cannot be represented as a short
fixed option list. Use Select or RadioGroup when the allowed values are known
and selection is safer than typing.

```tsx
<Input
  label='Email'
  type='email'
  value={email}
  onChange={(event) => setEmail(event.target.value)}
  placeholder='name@example.com'
/>
```

Native Input uses a value callback instead of a DOM event.

```tsx
<Input
  label='Email'
  type='email'
  value={email}
  onChange={setEmail}
/>
```

## Field Anatomy

| Part | Guidance |
| --- | --- |
| Label | Prefer a visible label over placeholder-only UI. |
| Description | Use for format, business rule, or persistence hints. |
| Error | Keep it actionable and specific. |
| Adornment | Use icons or compact text for context, not long instructions. |
| Clear action | Use for search, filters, and optional text fields where reset is common. |

## Validation

Validation state should be owned by the app. Input renders the error state and
connects the message to the control, but it does not decide whether a value is
valid.

```tsx
<Input
  label='Workspace slug'
  value={slug}
  onChange={(event) => setSlug(event.target.value)}
  description='Use lowercase letters, numbers, and hyphens.'
  error={slugError}
/>
```

## Real Example: Profile Settings

```tsx
import { Button, Input } from '@vellira-ui/react';
import { useState } from 'react';

export function ProfileSettings() {
  const [name, setName] = useState('Roman Bakurov');
  const [email, setEmail] = useState('roman@vellira.dev');
  const emailError = email.includes('@') ? undefined : 'Enter a valid email.';

  return (
    <form onSubmit={saveProfile}>
      <Input
        label='Display name'
        value={name}
        onChange={(event) => setName(event.target.value)}
        autoComplete='name'
      />
      <Input
        label='Work email'
        type='email'
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        autoComplete='email'
        description='Used for invoices, audit logs, and security alerts.'
        error={emailError}
      />
      <Button type='submit' disabled={Boolean(emailError)}>
        Save profile
      </Button>
    </form>
  );
}
```

## Clearable Inputs

Clearable inputs split typing and clearing into different callbacks. Controlled
inputs should clear their state in `onClear`.

```tsx
<Input
  label='Search'
  value={query}
  onChange={(event) => setQuery(event.target.value)}
  clearable
  onClear={() => setQuery('')}
/>
```

## Accessibility

- Prefer visible `label`.
- Use `description` for persistent help text, not placeholders.
- Error content should describe how to fix the value.
- Interactive right adornments need their own accessible names and focus
  behavior.
- Native behavior should be checked on iOS VoiceOver and Android TalkBack when
  using custom keyboard types or secure text entry.

## See Also

- [FormField](/components/form-field) for wrapping custom controls.
- [Select](/components/select) and [RadioGroup](/components/radio-group) for fixed choices.
