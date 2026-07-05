# Native

`@vellira-ui/react-native` is the React Native renderer for Vellira. It uses
React Native primitives and `StyleSheet`, but follows the same public component
language as the web package.

## Install

```bash
pnpm add @vellira-ui/react-native
```

Required peer dependencies:

```bash
pnpm add react react-native
```

## Example

```tsx
import { Button, Checkbox, Input, RadioGroup } from '@vellira-ui/react-native';
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
      <Button color='primary' variant='solid'>
        Apply
      </Button>
    </View>
  );
}
```

## Available Components

Every native component exports TypeScript props from the package root. The full
generated reference lives in
[`packages/react-native/API.md`](https://github.com/vellira-dev/Vellira/blob/main/packages/react-native/api.md).

| Component    | Role                  |
| ------------ | --------------------- |
| `Button`     | Buttons and actions   |
| `Checkbox`   | Boolean input         |
| `Input`      | Text input            |
| `FormField`  | Labels and validation |
| `RadioGroup` | Single selection      |
| `Select`     | Selection control     |
| `Dropdown`   | Context menu          |
| `Tabs`       | Tab navigation        |
| `Tooltip`    | Contextual helper     |
| `Modal`      | Dialog and overlay    |

## Controlled and Uncontrolled

Most form components support both controlled and uncontrolled usage.

Use controlled props when application state owns the value.

```tsx
import { Checkbox, RadioGroup } from '@vellira-ui/react-native';
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
import { Checkbox, Tabs } from '@vellira-ui/react-native';

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
  required state, and error text through React Native accessibility APIs.
- Interactive components keep press handling and disabled behavior inside the
  renderer package.
- Modal and overlay components keep platform rendering details out of
  application code.
- Consumers still own meaningful copy, validation timing, screen flow, and
  platform-specific announcements.

## Theming

Applications can import shared design tokens to build layouts that visually match Vellira components.

```tsx
import { theme } from '@vellira-ui/tokens';
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

Native stories live alongside their components and are used for on-device
development and review.

Use Storybook to inspect component states. Use an Expo or product app shell for
manual checks of screen-level flows outside Storybook.

## Testing

```bash
pnpm --filter @vellira-ui/react-native test
```

The package uses Vitest with a lightweight React Native mock to validate state,
callbacks, accessibility props, and conditional rendering without requiring a
simulator.

## Development

```bash
pnpm --filter @vellira-ui/react-native typecheck
pnpm --filter @vellira-ui/react-native build
pnpm --filter @vellira-ui/react-native test
```

## Platform Support

Vellira Native targets modern React Native applications built with the current
supported React Native releases.

Vellira supports both Expo and bare React Native projects.
