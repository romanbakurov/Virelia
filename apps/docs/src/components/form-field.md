# FormField

FormField provides shared field semantics for labels, descriptions, errors,
required state, disabled state, invalid state, generated ids, and accessible
relationships. It is the infrastructure layer used by Input and the foundation
for other form controls.

<StorybookFrame
  story="formField.withInputContext"
  title="FormField with Input context"
  :height="520"
/>

## When To Use

Use FormField when a custom layout needs one field contract for label,
description, error, required, disabled, invalid, size, and accessibility.
For ordinary text fields, prefer the Input shorthand API.

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

## Contract

FormField owns field layout and semantic wiring. Compatible Vellira controls
consume FormField context automatically.

| Responsibility              | Owner                         |
| --------------------------- | ----------------------------- |
| Label and layout            | `FormField`                   |
| Generated ids               | `FormField`                   |
| `aria-labelledby`           | `FormField` + compatible child |
| `aria-describedby`          | `FormField` + compatible child |
| `aria-invalid`              | `FormField` + compatible child |
| Value and validation logic   | App                           |
| Control-specific appearance | Child control                 |

FormField provides these values through context:

```tsx
{
  controlId,
  labelId,
  descriptionId,
  errorId,
  required,
  disabled,
  invalid,
  size,
  ariaLabelledBy,
  ariaDescribedBy,
}
```

## Web Notes

Input consumes FormField context automatically. Do not repeat `id`, `required`,
`disabled`, `invalid`, or `aria-describedby` unless you are building a custom
control.

```tsx
<FormField label='Workspace' required disabled invalid size='lg'>
  <Input placeholder='vellira-design' />
</FormField>
```

Child props still have clear precedence. For `size`, the child prop wins over
FormField context. For `required`, `disabled`, and `invalid`, FormField and the
child are combined so a child cannot accidentally unset a field-level state.

## Optional And Info Content

Use `optionalText` instead of manually composing the label. Do not combine
`required` and `optionalText`.

```tsx
<FormField label='Display name' optionalText='Optional'>
  <Input />
</FormField>
```

Use `labelInfo` for an info affordance next to the label. FormField accepts a
ReactNode and does not create a tooltip by itself.

```tsx
<FormField label='API key' labelInfo={<InfoTooltip />}>
  <Input />
</FormField>
```

## Layout

Use vertical layout for most forms. Use horizontal layout for dense settings
surfaces.

```tsx
<FormField
  label='Workspace'
  description='Visible in audit logs.'
  orientation='horizontal'
  labelPosition='start'
>
  <Input />
</FormField>
```

## Custom Controls

For non-Vellira controls, FormField still provides layout and stable ids. The
custom control must consume the context or receive the relevant props from your
adapter.

```tsx
import { FormField, useFormFieldContext } from '@vellira-ui/react';

function FileUploadControl() {
  const field = useFormFieldContext();
  return (
    <input
      id={field?.controlId}
      type='file'
      aria-labelledby={field?.ariaLabelledBy}
      aria-describedby={field?.ariaDescribedBy}
      aria-invalid={field?.invalid || undefined}
      required={field?.required}
      disabled={field?.disabled}
    />
  );
}

<FormField label='Avatar' description='PNG or JPG up to 2 MB.'>
  <FileUploadControl />
</FormField>;
```

## Native Notes

Native FormField keeps the same conceptual props. Native controls may support a
smaller layout surface in the first version, but the contract stays aligned
with web.

```tsx
<FormField
  label='Email'
  description='Used for login.'
  error='Invalid email'
  required
  disabled
  invalid
  size='md'
>
  <Input />
</FormField>
```

## See Also

- [Input](/components/input), [Select](/components/select), and
  [RadioGroup](/components/radio-group) for built-in field components.
