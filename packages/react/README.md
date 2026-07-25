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
        onValueChange={setEmail}
        placeholder='name@example.com'
      />
      <Checkbox
        label='Accept terms'
        description='Required to create an account.'
        checked={accepted}
        onCheckedChange={setAccepted}
      />
      <Button color='primary' appearance='solid'>
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

<Button aria-label='Search' iconOnly iconStart={<Search />} />;
```

`loading` disables interaction and can replace the visible label with
`loadingText`.

### Checkbox Notes

Use `description` for settings-style helper text when the checkbox is not
wrapped in `FormField`. For checkbox rows without a visible label, provide
`aria-label` or `aria-labelledby`.

```tsx
import { Checkbox } from '@vellira-ui/react';
import { useState } from 'react';

export function TermsCheckbox() {
  const [accepted, setAccepted] = useState(false);

  return (
    <Checkbox
      label='Accept terms'
      description='Required to continue.'
      checked={accepted}
      onCheckedChange={setAccepted}
      required
      color='primary'
      size='md'
    />
  );
}
```

### Radio Notes

Use standalone `Radio` for low-level composition. Prefer `RadioGroup` when the
choice belongs to a single saved form value.

```tsx
import { Radio, RadioGroup } from '@vellira-ui/react';
import { useState } from 'react';

export function PlanRadioGroup() {
  const [plan, setPlan] = useState('pro');

  return (
    <RadioGroup
      name='plan'
      label='Plan'
      description='Choose the billing plan.'
      value={plan}
      onValueChange={setPlan}
      color='primary'
      size='md'
    >
      <Radio value='starter' label='Starter' />
      <Radio value='pro' label='Pro' />
      <Radio value='enterprise' label='Enterprise' />
    </RadioGroup>
  );
}
```

### FormField Notes

Use `FormField` for custom controls that do not render their own field chrome.
`bindControl` is useful for native form controls because it injects generated
ids and ARIA state into the direct child.

```tsx
import { FormField } from '@vellira-ui/react';

<FormField
  label='Workspace'
  description='Connected through generated id and aria props.'
  error='Use lowercase letters, numbers and hyphens.'
  required
  bindControl
>
  <input placeholder='vellira-design' />
</FormField>;
```

### Select Notes

Use `Select` for one or more saved form values from a compact list,
`RadioGroup` for a few visible choices, and `Dropdown` for action menus. Prefer
a visible `label`; if the design has no visible label, provide `aria-label`.

```tsx
import { Select } from '@vellira-ui/react';
import { useState } from 'react';

export function RoleSelect() {
  const [role, setRole] = useState('editor');

  return (
    <Select label='Role' value={role} onValueChange={setRole}>
      <Select.Item value='admin'>Admin</Select.Item>
      <Select.Item value='editor'>Editor</Select.Item>
      <Select.Item value='viewer'>Viewer</Select.Item>
    </Select>
  );
}
```

```tsx
export function TeamSelect() {
  const [teams, setTeams] = useState<string[]>(['product']);

  return (
    <Select
      label='Teams'
      description='Choose teams by item or group.'
      value={teams}
      onValueChange={setTeams}
      multiple
      maxSelected={12}
      closeOnSelect={false}
      searchable
      clearable
      color='primary'
      variant='outline'
    >
      <Select.Group label='Core teams' selectable selectLabel='All core teams'>
        <Select.Item value='product'>Product</Select.Item>
        <Select.Item value='engineering'>Engineering</Select.Item>
        <Select.Item value='design'>Design</Select.Item>
        <Select.Item value='research'>Research</Select.Item>
        <Select.Item value='data'>Data</Select.Item>
      </Select.Group>
      <Select.Separator />
      <Select.Group label='Operations' selectable>
        <Select.Item value='support'>Support</Select.Item>
        <Select.Item value='success'>Success</Select.Item>
        <Select.Item value='sales'>Sales</Select.Item>
        <Select.Item value='marketing'>Marketing</Select.Item>
        <Select.Item value='finance'>Finance</Select.Item>
      </Select.Group>
      <Select.Separator />
      <Select.Group label='Platform' selectable>
        <Select.Item value='infrastructure'>Infrastructure</Select.Item>
        <Select.Item value='security'>Security</Select.Item>
        <Select.Item value='devex'>Developer Experience</Select.Item>
        <Select.Item value='qa'>QA</Select.Item>
      </Select.Group>
    </Select>
  );
}
```

For custom composition, use the compound parts directly:

```tsx
<Select label='Country' value={country} onValueChange={setCountry}>
  <Select.Trigger>
    <Select.Value />
    <Select.Icon />
  </Select.Trigger>
  <Select.Content>
    <Select.Search placeholder='Search country' />
    <Select.Label>Europe</Select.Label>
    <Select.Item value='fr'>
      <Select.ItemIcon>FR</Select.ItemIcon>
      France
      <Select.ItemDescription>Paris workspace</Select.ItemDescription>
      <Select.ItemBadge>EU</Select.ItemBadge>
    </Select.Item>
    <Select.Separator />
    <Select.Empty>No countries found</Select.Empty>
    <Select.Loading>Loading countries...</Select.Loading>
  </Select.Content>
</Select>
```

In multiple mode, `Select.Group selectable` adds a group-level action. It
selects enabled items until `maxSelected` is reached and clears the group when
all selectable group items are already selected. For long lists, reopening the
dropdown keeps the selected item active and visible.

### Dropdown Notes

Use `Dropdown` for contextual actions, not saved form values. Compose actions
with `Dropdown.Trigger`, `Dropdown.Content`, `Dropdown.Item`, groups, labels,
and separators. Use `open`, `defaultOpen`, and `onOpenChange` for menu state.
Use root `color` for the semantic trigger and menu palette, and item
`color='danger'` for destructive commands.

```tsx
import { Dropdown } from '@vellira-ui/react';

<Dropdown color='primary'>
  <Dropdown.Trigger>Actions</Dropdown.Trigger>
  <Dropdown.Content>
    <Dropdown.Group>
      <Dropdown.Label>File</Dropdown.Label>
      <Dropdown.Item description='Creates a copy' onSelect={duplicate}>
        Duplicate
      </Dropdown.Item>
    </Dropdown.Group>
    <Dropdown.Separator />
    <Dropdown.Item color='danger' onSelect={deleteFile}>
      Delete
    </Dropdown.Item>
  </Dropdown.Content>
</Dropdown>;
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
