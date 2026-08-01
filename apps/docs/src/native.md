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
        onValueChange={setEmail}
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
      <Button color='primary' appearance='solid'>
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

| Component    | Core props                                                                                                                | Role                  |
| ------------ | ------------------------------------------------------------------------------------------------------------------------- | --------------------- |
| `Button`     | `appearance`, `color`, `shape`, `iconStart`, `iconEnd`, `accessibilityLabel`                                              | Buttons and actions   |
| `Checkbox`   | `checked`, `defaultChecked`, `onCheckedChange`, `size`, `color`, `label`, `description`, `error`, `indeterminate`, `icon` | Boolean input         |
| `Input`      | `label`, `description`, `value`, `onValueChange`, `type`, `error`, `mask`, `format`                                       | Text input            |
| `FormField`  | `label`, `description`, `error`, `required`, `disabled`, `children`                                                       | Labels and validation |
| `Radio`      | `value`, `label`, `checked`, `defaultChecked`, `onCheckedChange`, `size`, `color`, `error`, `icon`                        | Radio option          |
| `RadioGroup` | `label`, `description`, `children`, `value`, `defaultValue`, `onValueChange`, `orientation`, `size`, `color`              | Single selection      |
| `Select`     | `label`, `description`, `children`, `value`, `defaultValue`, `onValueChange`, `color`, `variant`, `size`, `presentation`  | Selection control     |
| `Dropdown`   | `children`, `label`, `trigger`, `icon`, `open`, `defaultOpen`, `onOpenChange`, `presentation`, `size`, `color`            | Context menu          |
| `Tabs`       | `value`, `defaultValue`, `onValueChange`, `orientation`, `variant`                                                        | Tab navigation        |
| `Tooltip`    | `children`, `placement`, `delay`, `disabled`, `Tooltip.Trigger`, `Tooltip.Content`                                        | Contextual helper     |
| `Modal`      | `open`, `defaultOpen`, `onOpenChange`, `closeOnOutsidePress`, compound sections                                           | Dialog and overlay    |

Native `Select` opens a sheet, modal, or popover depending on `presentation`.
Options render through native list content; `Select.Item` is the primary API,
with `options` still available as a simple fallback. Option rows keep a small
2px gap between items so selected and hovered states remain visually separated
in dense native lists.

## Select Usage Guidelines

Use `Select` for a single form value from a compact list. Use `RadioGroup` when
there are only a few options and users should compare them without opening a
picker. Use `Dropdown` for contextual actions, not saved form values. For
longer multiple lists, split options into `Select.Group` sections and use
`selectable` group actions when users commonly select an entire section.

```tsx
import { Select } from '@vellira-ui/react-native';

export function TeamSelect() {
  return (
    <Select
      label='Teams'
      multiple
      closeOnSelect={false}
      clearable
      searchable
      defaultValue={['team-product', 'team-engineering', 'team-support']}
      placeholder='Select teams'
    >
      <Select.Group label='Core teams' selectable selectLabel='All core'>
        <Select.Item value='team-product' label='Product' />
        <Select.Item value='team-engineering' label='Engineering' />
        <Select.Item value='team-design' label='Design' />
        <Select.Item value='team-research' label='Research' />
        <Select.Item value='team-data' label='Data' />
      </Select.Group>

      <Select.Group label='Operations' selectable selectLabel='All operations'>
        <Select.Item value='team-support' label='Support' />
        <Select.Item value='team-success' label='Success' />
        <Select.Item value='team-sales' label='Sales' />
        <Select.Item value='team-marketing' label='Marketing' />
        <Select.Item value='team-finance' label='Finance' />
      </Select.Group>

      <Select.Group label='Platform' selectable selectLabel='All platform'>
        <Select.Item value='team-infrastructure' label='Infrastructure' />
        <Select.Item value='team-security' label='Security' />
        <Select.Item value='team-devex' label='Developer Experience' />
        <Select.Item value='team-qa' label='QA' />
      </Select.Group>
    </Select>
  );
}
```

In multiple mode the trigger displays the first two selected labels and then a
`+N` count for additional selections. `maxSelected` limits both individual item
presses and selectable group actions; disabled items are skipped by group
selection.

For accessibility, prefer a visible `label`; if no label can be rendered, pass
`accessibilityLabel`. Error text is announced by the field error region, and
`accessibilityHint` can add screen-specific guidance beyond the default picker
hint.

## Dropdown Usage Guidelines

Use `Dropdown` for contextual actions, not saved form values. Compose native
menus with `Dropdown.Trigger`, `Dropdown.Content`, `Dropdown.Item`,
`Dropdown.Group`, `Dropdown.Label`, and `Dropdown.Separator`. Use
`accessibilityLabel` for icon-only or custom triggers and `accessibilityHint`
when the screen needs extra guidance.

Native Dropdown mirrors the web compound API and token model. Use
`color='primary' | 'neutral' | 'success' | 'warning' | 'danger'` on the root to
choose the semantic palette for trigger, content, and pressed item states. Use
`Dropdown.Item color='danger'` for destructive actions. The root `trigger` prop
is a convenience escape hatch for custom trigger content; it is still wrapped by
the Dropdown trigger so press handling and open state stay owned by the
component.

## Button

Native Button maps to React Native `Pressable`, uses `onPress`, and accepts
native styling hooks through `style` and `textStyle`. Use Vellira icon elements
for `iconStart` and `iconEnd`; Button injects the active icon color and size.
Use `iconSize` to override the size-derived icon value. `badge` and `shortcut`
render compact metadata after the label, and are hidden automatically for
icon-only actions.

```tsx
import { Filter, Save, Search } from '@vellira-ui/icons';
import { Button } from '@vellira-ui/react-native';
import { useState } from 'react';
import { View } from 'react-native';

export function ButtonExamples() {
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  return (
    <>
      <Button color='primary' appearance='solid' onPress={handleSave}>
        Save
      </Button>

      <Button loading={isSaving} loadingText='Saving...'>
        Save
      </Button>

      <Button badge='3' iconStart={<Filter />} shortcut='⌘F'>
        Filters
      </Button>

      <Button accessibilityLabel='Search' iconOnly iconStart={<Search />} />

      <Button accessibilityLabel='Save draft' iconStart={<Save />} />

      <View accessibilityLabel='Editor toolbar'>
        <Button
          accessibilityLabel='Save'
          appearance='ghost'
          iconOnly
          iconStart={<Save />}
        />
        <Button appearance='ghost' iconStart={<Filter />}>
          Filter
        </Button>
        <Button appearance='ghost' iconSize={18} iconStart={<Search />}>
          Search
        </Button>
      </View>

      <Button
        color='danger'
        appearance='soft'
        onPress={() => setConfirmingDelete(true)}
      >
        Delete workspace
      </Button>

      {confirmingDelete ? (
        <View accessibilityLiveRegion='polite'>
          <Button
            color='neutral'
            appearance='ghost'
            disabled={deleting}
            onPress={() => setConfirmingDelete(false)}
          >
            Cancel
          </Button>
          <Button
            color='danger'
            loading={deleting}
            loadingText='Deleting...'
            onPress={() => setDeleting(true)}
          >
            Delete
          </Button>
        </View>
      ) : null}
    </>
  );
}
```

Pass `loadingText` before the loading state is active when the loading label is
longer than the default label. Button measures both labels and keeps the text
slot stable as `loading` changes.

When `iconOnly` is omitted, Button automatically switches to icon-only layout if
it receives `iconStart` or `iconEnd` without visible children. Provide
`accessibilityLabel` in that case.

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
      <Tabs defaultValue='profile'>
        <Tabs.List>
          <Tabs.Trigger value='profile'>Profile</Tabs.Trigger>
          <Tabs.Trigger value='security'>Security</Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value='profile'>Profile settings</Tabs.Content>
        <Tabs.Content value='security'>Security settings</Tabs.Content>
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
