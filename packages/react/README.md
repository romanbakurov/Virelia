# @vellira-ui/react

React component package for Vellira.

This package contains the web implementation of the design system. It extends shared contracts from `@vellira-ui/types`, uses shared tokens from `@vellira-ui/tokens`, and keeps DOM, CSS, accessibility ids, and browser events inside the web layer.

## Components

- Button
- Checkbox
- Input
- FormField
- Radio
- RadioGroup
- Select
- Dropdown
- Tabs
- Tooltip
- Modal

Each public component has Storybook coverage and Vitest unit coverage.

For detailed props, shared types, examples, and compound component APIs, see
[Web Component API](./API.md).

## Installation

```bash
pnpm add @vellira-ui/react
```

## Usage

Import the stylesheet once in your app entry point:

```tsx
import '@vellira-ui/react/styles';
```

Then use the components:

```tsx
import { Button, Checkbox, Input } from '@vellira-ui/react';
import { useState } from 'react';

export function Example() {
  const [email, setEmail] = useState('');
  const [accepted, setAccepted] = useState(false);

  return (
    <form>
      <Input
        label='Email'
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        placeholder='name@example.com'
      />
      <Checkbox
        label='Accept terms'
        description='Required to create an account.'
        checked={accepted}
        onCheckedChange={setAccepted}
      />
      <Button color='primary' variant='solid'>
        Submit
      </Button>
    </form>
  );
}
```

### Button Notes

Use the standard `aria-label` attribute for icon-only web buttons:

```tsx
import { Search } from '@vellira-ui/icons';

<Button aria-label='Search' iconOnly leftIcon={<Search />} />;
```

`loading` disables interaction and can replace the visible label with
`loadingText`.

### Checkbox Notes

Use `description` for settings-style helper text when the checkbox is not
wrapped in `FormField`. For checkbox rows without a visible label, provide
`aria-label` or `aria-labelledby`.

### Select Notes

Use `Select` for one form value from a compact list, `RadioGroup` for a few
visible choices, and `Dropdown` for action menus. Prefer a visible `label`; if
the design has no visible label, provide `aria-label`.

```tsx
import { Select } from '@vellira-ui/react';
import { useState } from 'react';

export function RoleSelect() {
  const [role, setRole] = useState('editor');

  return (
    <Select
      label='Role'
      value={role}
      onChange={setRole}
      options={[
        { label: 'Admin', value: 'admin' },
        { label: 'Editor', value: 'editor' },
        { label: 'Viewer', value: 'viewer' },
      ]}
    />
  );
}
```

### FormField Notes

`FormField` is a presentational wrapper for custom web controls. Pass `id` to
`FormField` and the same `id` to the wrapped control; the root wrapper does not
receive that `id`, which avoids duplicate DOM ids. The child control remains
responsible for `aria-describedby`, `aria-invalid`, `required`, `disabled` and
interaction behavior.

## Testing

Run only web tests:

```bash
pnpm --filter @vellira-ui/react test
```

The web package uses Vitest with `jsdom`. Tests live next to components as `*.test.tsx` and use a small local render helper based on `react-dom/client`.

## Storybook

Run web Storybook from the workspace root:

```bash
pnpm --filter @vellira-ui/react-storybook dev
```

Stories live next to components as `*.stories.tsx` and are also used for Chromatic visual review.

## Development

```bash
pnpm --filter @vellira-ui/react build
pnpm --filter @vellira-ui/react test
```
