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
import {
  Button,
  Checkbox,
  Input,
  Radio,
  RadioGroup,
} from '@vellira-ui/react-native';
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
      <RadioGroup label='Theme'>
        <Radio value='system' label='System' />
        <Radio value='light' label='Light' />
        <Radio value='dark' label='Dark' />
      </RadioGroup>
      <Checkbox
        label='Send product updates'
        description='Receive release notes and billing updates.'
      />
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
[`packages/react-native/API.md`](https://github.com/vellira-dev/Vellira/blob/main/packages/react-native/API.md).

| Component    | Core props                                                                                             | Role                  |
| ------------ | ------------------------------------------------------------------------------------------------------ | --------------------- |
| `Button`     | `variant`, `size`, `leftIcon`, `rightIcon`, `accessibilityLabel`                                       | Buttons and actions   |
| `Checkbox`   | `label`, `description`, `checked`, `defaultChecked`, `onCheckedChange`, `error`                        | Boolean input         |
| `Input`      | `label`, `description`, `value`, `onChange`, `type`, `error`                                           | Text input            |
| `FormField`  | `label`, `description`, `error`, `required`, `disabled`, `children`                                    | Labels and validation |
| `Radio`      | `value`, `label`, `checked`, `defaultChecked`, `onCheckedChange`, `error`                              | Radio option          |
| `RadioGroup` | `label`, `description`, `children`, `value`, `defaultValue`, `onValueChange`                           | Single selection      |
| `Select`     | `label`, `description`, `options`, `value`, `defaultValue`, `onChange`, `size`, `pickerStyle`, `error` | Selection control     |
| `Dropdown`   | `items`, `trigger`, `icon`, `open`, `defaultOpen`, `onSelect`, `disabled`                              | Context menu          |
| `Tabs`       | `activeIndex`, `defaultActiveIndex`, `onChange`, `orientation`, `appearance`                           | Tab navigation        |
| `Tooltip`    | `content`, `placement`, `delay`, `disabled`                                                            | Contextual helper     |
| `Modal`      | `isOpen`, `onClose`, `closeOnBackdrop`, compound sections                                              | Dialog and overlay    |

Native `Select` opens a picker sheet. Changing the picker wheel updates a draft
value only; the selection is committed through `Done`, while `Cancel` and the
backdrop close the sheet without changing the selected value.

## Select Usage Guidelines

Use `Select` for a single form value from a compact list. Use `RadioGroup` when
there are only a few options and users should compare them without opening a
picker. Use `Dropdown` for contextual actions, not saved form values.

For accessibility, prefer a visible `label`; if no label can be rendered, pass
`accessibilityLabel`. Error text is announced by the field error region, and
`accessibilityHint` can add screen-specific guidance beyond the default picker
hint.

## Dropdown Usage Guidelines

Use `Dropdown` for contextual actions, not saved form values. The native model
is a flat `items` array with action entries, `{ type: 'group', label }`
headings and `{ type: 'separator' }` dividers. Use `accessibilityLabel` for
icon-only or custom triggers and `accessibilityHint` when the screen needs
extra guidance.

## Button

Native Button maps to React Native `Pressable`, uses `onPress`, and accepts
native styling hooks through `style` and `textStyle`. Use Vellira icon elements
for `leftIcon` and `rightIcon`; Button injects the active icon color and size.

```tsx
import { Search } from '@vellira-ui/icons';
import { Button } from '@vellira-ui/react-native';

export function ButtonExamples() {
  return (
    <>
      <Button color='primary' variant='solid' onPress={handleSave}>
        Save
      </Button>

      <Button loading loadingText='Saving...'>
        Save
      </Button>

      <Button accessibilityLabel='Search' iconOnly leftIcon={<Search />} />
    </>
  );
}
```

## FormField

Native `FormField` is a presentational wrapper for custom controls. Use it for
layout, label text, descriptions, required marks and validation text. Do not wrap
`Input`, `Select` or `RadioGroup`, because those components already include
their own field structure. The child control must keep its own
`accessibilityLabel`, role, disabled/editable state and interaction behavior.

## Controlled and Uncontrolled

Most form components support both controlled and uncontrolled usage.

Use controlled props when application state owns the value.

```tsx
import { Checkbox, Radio, RadioGroup } from '@vellira-ui/react-native';
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
        description='Receive release notes and billing updates.'
      />
      <RadioGroup label='Theme' value={theme} onValueChange={setTheme}>
        <Radio value='system' label='System' />
        <Radio value='light' label='Light' />
        <Radio value='dark' label='Dark' />
      </RadioGroup>
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
      <Checkbox
        defaultChecked
        label='Remember this device'
        description='Skip verification prompts on this device.'
      />
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

- `Button` uses `accessibilityLabel` for icon-only or ambiguous actions. Its
  hover state changes background on web-compatible targets; focus adds a ring
  without changing the background.
- Inputs, checkboxes, selection controls, and field wrappers expose labels,
  descriptions, disabled state, required state, and error text through React
  Native accessibility APIs.
- Checkbox rows without a visible label should use `accessibilityLabel`; mixed
  selection rows can use `indeterminate`.
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
