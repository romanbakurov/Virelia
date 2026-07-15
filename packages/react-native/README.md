# @vellira-ui/react-native

React Native component package for Vellira.

This package contains iOS-inspired native components built with React Native `StyleSheet`. Components use shared colors, typography, spacing, and radius from `@vellira-ui/tokens`, shared behavior from `@vellira-ui/core`, and renderer-neutral contracts from `@vellira-ui/types`.

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

Each public native component has React Native Storybook coverage and Vitest unit coverage.

For detailed props, shared types, examples, and compound component APIs, see
[Native Component API](./API.md).

## Installation

```bash
pnpm add @vellira-ui/react-native
```

Peer dependencies:

- `react`
- `react-native`

## Usage

```tsx
import { Button, Checkbox, Input } from '@vellira-ui/react-native';
import { useState } from 'react';
import { View } from 'react-native';

export function Example() {
  const [email, setEmail] = useState('');
  const [accepted, setAccepted] = useState(false);

  return (
    <View style={{ gap: 16 }}>
      <Input label='Email' value={email} onChange={setEmail} />
      <Checkbox
        label='Accept terms'
        description='Required to create an account.'
        checked={accepted}
        onCheckedChange={setAccepted}
      />
      <Button color='primary' variant='solid'>
        Continue
      </Button>
    </View>
  );
}
```

### Button Notes

Use `accessibilityLabel` for icon-only native buttons:

```tsx
import { Search } from '@vellira-ui/icons';

<Button accessibilityLabel='Search' iconOnly leftIcon={<Search />} />;
```

Button icons are React elements from `@vellira-ui/icons`; the component injects
the current icon color and size. `loading` disables interaction and can replace
the visible label with `loadingText`.

### Checkbox Notes

Use `description` for settings-style helper text when the checkbox is not
wrapped in `FormField`. For checkbox rows without a visible label, provide
`accessibilityLabel`.

### Select Notes

Use `Select` for one form value from a compact list, `RadioGroup` for a few
visible choices, and `Dropdown` for action menus. Native `Select` commits the
picker draft only when the user presses `Done`; `Cancel` and the backdrop close
without changing the selected value.

```tsx
import { Select } from '@vellira-ui/react-native';
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

### Dropdown Notes

Use `Dropdown` for contextual actions, not saved form values. The `items` model
is flat: use `{ type: 'group', label }` as a heading before related actions and
`{ type: 'separator' }` between sections. Use `open`, `defaultOpen`, and
`onOpenChange` for menu state, and `onSelect` for the selected action value.

```tsx
import type { DropdownItem } from '@vellira-ui/react-native';
import { Dropdown } from '@vellira-ui/react-native';

const items: DropdownItem[] = [
  { type: 'group', label: 'File' },
  { label: 'Duplicate', value: 'duplicate' },
  { type: 'separator' },
  { label: 'Delete', value: 'delete', danger: true },
];

<Dropdown label='Actions' items={items} onSelect={handleAction} />;
```

### FormField Notes

`FormField` is a presentational wrapper for custom native controls. Do not wrap
components that already render their own field chrome, such as `Input`, `Select`
or `RadioGroup`. The wrapped control should provide its own
`accessibilityLabel`, role, disabled/editable state and interaction behavior.
`FormField` only provides layout, text styling, required mark, disabled root
state and polite error announcement.

## Testing

Run only native tests:

```bash
pnpm --filter @vellira-ui/react-native test
```

The native package uses Vitest with a lightweight local `react-native` mock. These tests validate component state, callbacks, accessibility props, and conditional rendering without requiring an iOS or Android simulator.

Native tests and test utilities are excluded from the package build through `tsconfig.json`.

## Storybook

Native stories live next to components as `*.stories.tsx` and are consumed by `apps/native-storybook`.

Run on-device Storybook from the workspace root:

```bash
pnpm --filter native-storybook start
pnpm --filter native-storybook ios
pnpm --filter native-storybook android
```

## Development

```bash
pnpm --filter @vellira-ui/react-native build
pnpm --filter @vellira-ui/react-native test
```

Run the Expo playground:

```bash
pnpm --filter native-playground start
```
