# FormField

FormField provides consistent layout for labels, descriptions, errors, required
state, disabled state, and custom field controls.

<StorybookFrame
  story="formField.complete"
  title="FormField complete example"
  :height="520"
/>

## When To Use

Use FormField when a custom control needs the same field chrome as Input,
Select, Checkbox, or RadioGroup. Do not wrap standard Vellira fields just to add
another label if the component already supports `label`, `description`, and
`error`.

```tsx
<FormField
  id='avatar'
  label='Avatar'
  description='PNG or JPG up to 2 MB.'
  error={avatarError}
>
  <FileUpload id='avatar' aria-describedby='avatar-description avatar-error' />
</FormField>
```

## Contract

FormField is presentational. The child control owns its own value, disabled
state, validation attributes, and interaction behavior.

| Responsibility                               | Owner                   |
| -------------------------------------------- | ----------------------- |
| Label and layout                             | `FormField`             |
| `aria-describedby` and `aria-invalid`        | Child control on web    |
| `accessibilityLabel` and `accessibilityHint` | Child control on native |
| Value and validation state                   | App                     |
| Disabled interaction                         | Child control           |

## Web Notes

Pass the same `id` to FormField and the wrapped control. Add the generated
description and error ids to the control when needed.

```tsx
<FormField id='timezone' label='Timezone' error={error}>
  <TimezonePicker
    id='timezone'
    aria-invalid={Boolean(error)}
    aria-describedby={error ? 'timezone-error' : undefined}
  />
</FormField>
```

## Real Example: File Upload Field

```tsx
import { Button, FormField } from '@vellira-ui/react';
import { useId, useState } from 'react';

export function AvatarField() {
  const id = useId();
  const [fileName, setFileName] = useState('');
  const error = fileName.endsWith('.svg') ? 'Upload PNG or JPG instead.' : '';

  return (
    <FormField
      id={id}
      label='Avatar'
      description='PNG or JPG up to 2 MB.'
      error={error}
    >
      <input
        id={id}
        type='file'
        accept='image/png,image/jpeg'
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : `${id}-description`}
        onChange={(event) => {
          setFileName(event.target.files?.[0]?.name ?? '');
        }}
      />
      <Button type='button' appearance='outline' color='neutral'>
        Upload new avatar
      </Button>
    </FormField>
  );
}
```

## Native Notes

Native FormField wraps the visual layout, but the wrapped control must still
provide screen reader labels and hints.

```tsx
<FormField label='Timezone' error={error}>
  <TimezonePicker
    accessibilityLabel='Timezone'
    accessibilityHint={error ?? 'Choose your reporting timezone.'}
  />
</FormField>
```

## See Also

- [Input](/components/input), [Select](/components/select), and
  [RadioGroup](/components/radio-group) for built-in field components.
