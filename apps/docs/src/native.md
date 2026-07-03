# Native

`@romanbakurov/vellira-native` is the React Native renderer for Vellira. It uses
React Native primitives and `StyleSheet`, but follows the same public component
language as the web package.

## Install

```bash
pnpm add @romanbakurov/vellira-native
```

Peer dependencies:

```bash
pnpm add react react-native
```

## Example

```tsx
import {
  Button,
  Checkbox,
  Input,
  RadioGroup,
} from '@romanbakurov/vellira-native';
import { useState } from 'react';
import { View } from 'react-native';

export function PreferencesScreen() {
  const [email, setEmail] = useState('');

  return (
    <View style={{ gap: 16, padding: 24 }}>
      <Input
        label='Email'
        value={email}
        onChange={setEmail}
        placeholder='name@example.com'
      />
      <RadioGroup
        label='Theme'
        options={[
          { label: 'System', value: 'system' },
          { label: 'Light', value: 'light' },
          { label: 'Dark', value: 'dark' },
        ]}
      />
      <Checkbox label='Send product updates' />
      <Button variant='primary'>Apply</Button>
    </View>
  );
}
```

## Storybook and Playground

Native stories live next to components in `packages/vellira-native/src` and are
consumed by the dedicated on-device Storybook app at `apps/native-storybook`.

```bash
pnpm --filter native-storybook start
pnpm --filter native-storybook ios
pnpm --filter native-storybook android
```

Use `apps/native-playground` for manual Expo checks while building product
flows outside Storybook.

```bash
pnpm --filter native-playground start
```

## Testing

```bash
pnpm --filter @romanbakurov/vellira-native test
```

The package uses Vitest with a lightweight React Native mock to validate state,
callbacks, accessibility props, and conditional rendering without requiring a
simulator.
