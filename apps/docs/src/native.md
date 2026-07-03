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

## API Surface

Every native component exports TypeScript props from the package root. The full
generated reference lives in
[`packages/vellira-native/API.md`](https://github.com/romanbakurov/Vellira/blob/main/packages/vellira-native/API.md).

| Component    | Role                                                                 |
| ------------ | -------------------------------------------------------------------- |
| `Button`     | Primary, secondary, danger, size, disabled, and full-width actions   |
| `Checkbox`   | Binary choice with controlled and uncontrolled state                 |
| `Input`      | Text entry with label, placeholder, state, and accessibility support |
| `FormField`  | Field composition for labels, descriptions, and error text           |
| `RadioGroup` | Single choice control using shared state contracts                   |
| `Select`     | Native selection trigger and option handling                         |
| `Dropdown`   | Trigger, content, groups, items, and separators                      |
| `Tabs`       | Tab list, tab items, panels, and shared keyboard state logic         |
| `Tooltip`    | Anchored helper content                                              |
| `Modal`      | Overlay, content, header, body, and footer primitives                |

## Controlled and Uncontrolled

Use controlled props when application state owns the value.

```tsx
import { Checkbox, RadioGroup } from '@romanbakurov/vellira-native';
import { useState } from 'react';

export function ControlledPreferences() {
  const [enabled, setEnabled] = useState(false);
  const [theme, setTheme] = useState('system');

  return (
    <>
      <Checkbox
        checked={enabled}
        onCheckedChange={setEnabled}
        label='Send product updates'
      />
      <RadioGroup
        label='Theme'
        value={theme}
        onChange={setTheme}
        options={[
          { label: 'System', value: 'system' },
          { label: 'Light', value: 'light' },
          { label: 'Dark', value: 'dark' },
        ]}
      />
    </>
  );
}
```

Use default props when the component can own its initial state.

```tsx
import { Checkbox, Tabs } from '@romanbakurov/vellira-native';

export function UncontrolledPreferences() {
  return (
    <>
      <Checkbox defaultChecked label='Remember this device' />
      <Tabs defaultActiveIndex={0}>
        <Tabs.List>
          <Tabs.Tab index={0}>Profile</Tabs.Tab>
          <Tabs.Tab index={1}>Security</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel index={0}>Profile settings</Tabs.Panel>
        <Tabs.Panel index={1}>Security settings</Tabs.Panel>
      </Tabs>
    </>
  );
}
```

## Accessibility

Vellira Native components map shared component contracts to React Native
accessibility props where the platform supports them.

- Inputs, selection controls, and field wrappers expose labels, disabled state,
  required state, and error text through native-friendly props.
- Interactive components keep press handling and disabled behavior inside the
  renderer package.
- Modal and overlay components keep platform rendering details out of
  application code.
- Consumers still own meaningful copy, validation timing, screen flow, and
  platform-specific announcements.

## Theming

Native components consume the shared token package through renderer-native
styles. Product code can also import theme objects directly when building
screens around Vellira components.

```tsx
import { theme } from '@romanbakurov/vellira-tokens';
import { View } from 'react-native';

export function ScreenShell({ children }: { children: React.ReactNode }) {
  return (
    <View
      style={{
        flex: 1,
        padding: theme.tokens.spacing[6],
        backgroundColor: theme.semantic.surface.default,
      }}
    >
      {children}
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

## Development

```bash
pnpm --filter @romanbakurov/vellira-native build
pnpm --filter @romanbakurov/vellira-native test
pnpm --filter native-playground start
```
