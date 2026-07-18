# Input

Input captures short free-form text with field semantics, validation state,
icons, addons, clear actions, password reveal, masks, formatting, and counters.
It is the right choice for names, emails, search terms, URLs, numbers, and
other compact text values.

<StorybookFrame
  story="input.validation"
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
  onValueChange={setEmail}
  placeholder='name@example.com'
/>
```

The same value callback is used by Native Input.

## Field Composition

For common fields, use the shorthand API directly on Input. Input renders
FormField internally and wires the label, description, error, required state,
and accessibility attributes.

```tsx
<Input
  label='Email'
  description='Used for login.'
  error={emailError}
  required
  value={email}
  onValueChange={setEmail}
/>
```

For custom layouts, compose Input inside FormField. Input receives `id`,
`aria-labelledby`, `aria-describedby`, `required`, `disabled`, `invalid`, and
`size` from FormField context.

```tsx
<FormField
  label='Email'
  description='Used for login.'
  error={emailError}
  required
  size='sm'
>
  <Input value={email} onValueChange={setEmail} />
</FormField>
```

## Field Anatomy

| Part         | Guidance                                                                 |
| ------------ | ------------------------------------------------------------------------ |
| Label        | Prefer a visible label over placeholder-only UI.                         |
| Description  | Use for format, business rule, or persistence hints.                     |
| Error        | Keep it actionable and specific.                                         |
| Icons        | Use `startIcon` and `endIcon` for visual context.                        |
| Addons       | Use `startAddon` and `endAddon` for segmented values like URLs.          |
| Prefix       | Use `prefix` and `suffix` for inline units or symbols.                   |
| Clear action | Use for search, filters, and optional text fields where reset is common. |

## Recommended Patterns

Use the full FormField composition when the field participates in a larger form
layout or needs shared field state.

```tsx
<FormField
  label='Email'
  description='Used for login.'
  error={emailError}
  required
>
  <Input
    type='email'
    value={email}
    onValueChange={setEmail}
    placeholder='name@example.com'
  />
</FormField>
```

Use a clearable search input when the value is temporary and reset is a primary
action.

```tsx
import { Search } from '@vellira-ui/icons';

<Input
  aria-label='Search projects'
  type='search'
  value={query}
  onValueChange={setQuery}
  placeholder='Search projects'
  startIcon={<Search />}
  clearable
/>;
```

Use password reveal on the normal Input component instead of creating a separate
PasswordInput.

```tsx
<Input
  label='Password'
  type='password'
  value={password}
  onValueChange={setPassword}
  revealPassword
/>
```

## Composition

Input is designed to compose with other Vellira primitives instead of owning
every workflow itself.

### Input + FormField

Use this when the page owns field layout, or when several controls need the same
semantic contract.

```tsx
<FormField
  label='Workspace slug'
  description='Used in workspace URLs.'
  size='sm'
>
  <Input
    value={slug}
    onValueChange={setSlug}
    startAddon='https://'
    endAddon='.vellira.dev'
  />
</FormField>
```

### Input + Tooltip

Use Tooltip for a short explanation of an icon or terse affordance. Keep
required instructions in `description`.

```tsx
import { Settings } from '@vellira-ui/icons';
import { Button, FormField, Input, Tooltip } from '@vellira-ui/react';

<FormField
  label='API key'
  description='Never share this value in public channels.'
  labelInfo={
    <Tooltip content='Create keys in workspace settings.'>
      <Button
        aria-label='Where to create API keys'
        iconOnly
        iconStart={<Settings />}
      />
    </Tooltip>
  }
>
  <Input value={apiKey} onValueChange={setApiKey} />
</FormField>;
```

### Input + Validation

Keep validation logic in the app and pass the result into Input.

```tsx
const emailError = email.includes('@') ? undefined : 'Enter a valid email.';

<Input
  label='Work email'
  type='email'
  value={email}
  onValueChange={setEmail}
  error={emailError}
/>;
```

### Input + Dropdown

Use Dropdown next to Input for contextual commands, not for saved field values.

```tsx
import { Button, Dropdown, Input } from '@vellira-ui/react';
import { More } from '@vellira-ui/icons';

<div className='fieldRow'>
  <Input
    label='Project name'
    value={projectName}
    onValueChange={setProjectName}
  />
  <Dropdown
    ariaLabel='Project name actions'
    trigger={
      <Button aria-label='Project name actions' iconOnly iconStart={<More />} />
    }
    items={[
      { value: 'copy', label: 'Copy name' },
      { value: 'reset', label: 'Reset' },
    ]}
    onSelect={handleProjectNameAction}
  />
</div>;
```

### Input + Command Palette

Use Input as the query control inside a command palette, while the command list
owns filtering, selection, and keyboard behavior.

```tsx
import { Search } from '@vellira-ui/icons';
import { Input } from '@vellira-ui/react';

<div role='dialog' aria-label='Command palette'>
  <Input
    aria-label='Search commands'
    value={query}
    onValueChange={setQuery}
    placeholder='Search commands'
    startIcon={<Search />}
    clearable
    autoFocus
  />
  <CommandList query={query} onSelect={runCommand} />
</div>;
```

## Appearance

Input supports the same color language as the newer controls.

```tsx
<Input color='primary' variant='outline' />
<Input color='neutral' variant='filled' />
<Input color='success' variant='soft' />
<Input color='warning' />
<Input color='danger' />
```

Use `size='sm' | 'md' | 'lg'` directly on Input, or set size once on
FormField and let Input inherit it.

```tsx
<FormField label='Workspace' size='sm'>
  <Input placeholder='vellira-design' />
</FormField>
```

## Validation

Validation state should be owned by the app. Input renders the error state and
connects the message to the control, but it does not decide whether a value is
valid.

```tsx
<Input
  label='Workspace slug'
  value={slug}
  onValueChange={setSlug}
  description='Use lowercase letters, numbers, and hyphens.'
  invalid={Boolean(slugError)}
  error={slugError}
/>
```

`error` implies invalid styling. Use `invalid` when the field should look
invalid without showing an error message.

```tsx
<Input label='Invite code' invalid />
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
        onValueChange={setName}
        autoComplete='name'
      />
      <Input
        label='Work email'
        type='email'
        value={email}
        onValueChange={setEmail}
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
  onValueChange={setQuery}
  clearable
  onClear={() => setQuery('')}
/>
```

When a right-side action is available, Input uses a predictable priority:
`loading` first, then `clearable`, then `revealPassword`, then `endIcon`.

```tsx
<Input
  label='Password'
  type='password'
  value={password}
  onValueChange={setPassword}
  clearable
  revealPassword
/>
```

## Icons, Addons, And Affixes

Use icons for visual context, addons for segmented field chrome, and prefix or
suffix for inline units.

```tsx
<Input label='Search' type='search' clearable />

<Input
  label='Domain'
  startAddon='https://'
  endAddon='.com'
  placeholder='vellira'
/>

<Input label='Weight' suffix='kg' type='number' />
```

## Masks And Formatting

String masks use `#` for digits. Use `format` and `parse` when the displayed
value should differ from the stored value.

```tsx
<Input label='Phone' mask='+33 # ## ## ## ##' onValueChange={setPhone} />

<Input
  label='Amount'
  value={amount}
  onValueChange={setAmount}
  format={(value) => Number(value).toLocaleString('en-US')}
  parse={(value) => value.replace(/,/g, '')}
  prefix='$'
/>
```

## Accessibility

- Prefer visible `label`.
- Use `description` for persistent help text, not placeholders.
- Error content should describe how to fix the value.
- Input and FormField automatically connect label, description, error, and
  counter ids when using the built-in API.
- `loading` makes the control read-only while preserving the current value.
- Native behavior should be checked on iOS VoiceOver and Android TalkBack when
  using custom keyboard types or secure text entry.

## See Also

- [FormField](/components/form-field) for wrapping custom controls.
- [Select](/components/select) and [RadioGroup](/components/radio-group) for fixed choices.
