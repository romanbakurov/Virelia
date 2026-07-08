# @vellira-ui/react-native

React Native component package for Vellira.

This package contains iOS-inspired native components built with React Native `StyleSheet`. Components use shared colors, typography, spacing, and radius from `@vellira-ui/tokens`, shared behavior from `@vellira-ui/core`, and renderer-neutral contracts from `@vellira-ui/types`.

## Components

- Button
- Checkbox
- Input
- FormField
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

  return (
    <View style={{ gap: 16 }}>
      <Input label='Email' value={email} onChange={setEmail} />
      <Checkbox label='Accept terms' />
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
