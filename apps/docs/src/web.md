# Web

`@vellira-ui/react` contains the React DOM implementation of Vellira.
It owns DOM structure, CSS modules, browser events, accessibility ids, and web
overlay behavior while reusing shared tokens, types, and core hooks.

## Install

```bash
pnpm add @vellira-ui/react
```

Import the stylesheet once.

```tsx
import '@vellira-ui/react/styles';
```

## Example

```tsx
import { Button, Input, Select, Tabs } from '@vellira-ui/react';
import { useState } from 'react';

export function AccountPanel() {
  const [displayName, setDisplayName] = useState('');

  return (
    <Tabs defaultActiveIndex={0}>
      <Tabs.List>
        <Tabs.Tab index={0}>Profile</Tabs.Tab>
        <Tabs.Tab index={1}>Security</Tabs.Tab>
      </Tabs.List>

      <Tabs.Panel index={0}>
        <Input
          label='Display name'
          value={displayName}
          onChange={setDisplayName}
          placeholder='Roman Bakurov'
        />
        <Select
          label='Role'
          options={[
            { label: 'Admin', value: 'admin' },
            { label: 'Editor', value: 'editor' },
            { label: 'Viewer', value: 'viewer' },
          ]}
        />
        <Button color='primary' variant='solid'>
          Save changes
        </Button>
      </Tabs.Panel>
      <Tabs.Panel index={1}>Security settings</Tabs.Panel>
    </Tabs>
  );
}
```

## Available Components

Every component exports TypeScript props from the package root. The full
generated reference lives in
[`packages/react/API.md`](https://github.com/vellira-dev/Vellira/blob/main/packages/react/API.md).

| Component    | Core props                                                                                       | State model                   |
| ------------ | ------------------------------------------------------------------------------------------------ | ----------------------------- |
| `Button`     | `variant`, `size`, `leftIcon`, `rightIcon`, `fullWidth`, `aria-label`                            | disabled, loading             |
| `Checkbox`   | `label`, `description`, `checked`, `defaultChecked`, `onCheckedChange`, `error`, `indeterminate` | controlled or uncontrolled    |
| `Input`      | `label`, `value`, `onChange`, `type`, `size`, `error`, `autoComplete`                            | controlled                    |
| `FormField`  | `label`, `description`, `error`, `required`, `disabled`, `children`                              | presentation wrapper          |
| `RadioGroup` | `name`, `options`, `value`, `defaultValue`, `onChange`, `orientation`                            | controlled or uncontrolled    |
| `Select`     | `options`, `value`, `defaultValue`, `onChange`, `placeholder`, `error`                           | controlled or uncontrolled    |
| `Dropdown`   | `items`, `trigger`, `placement`, `matchTriggerWidth`, `textWrap`, `onSelect`                     | open state managed internally |
| `Tabs`       | `activeIndex`, `defaultActiveIndex`, `onChange`, `orientation`, `appearance`                     | controlled or uncontrolled    |
| `Tooltip`    | `content`, `placement`, `delay`, `disabled`, `onOpenChange`, `maxWidth`                          | open state managed internally |
| `Modal`      | `isOpen`, `onClose`, `closeOnBackdrop`, `closeOnEsc`, compound sections                          | controlled                    |

## Button

Web Button uses native button semantics, defaults to `type="button"`, and
accepts standard DOM attributes such as `className`, `onClick`, and
`aria-label`.

```tsx
import { Search } from '@vellira-ui/icons';
import { Button } from '@vellira-ui/react';

export function ButtonExamples() {
  return (
    <>
      <Button color='primary' variant='solid' onClick={handleSave}>
        Save
      </Button>

      <Button loading loadingText='Saving...'>
        Save
      </Button>

      <Button aria-label='Search' iconOnly leftIcon={<Search />} />
    </>
  );
}
```

## Controlled and Uncontrolled

Most form components support both controlled and uncontrolled usage.

Use controlled props when application state owns the current value.

```tsx
import { useState } from 'react';
import { Checkbox, Select } from '@vellira-ui/react';

export function ControlledSettings() {
  const [enabled, setEnabled] = useState(false);
  const [role, setRole] = useState('editor');

  return (
    <>
      <Checkbox
        checked={enabled}
        onCheckedChange={setEnabled}
        label='Enable notifications'
        description='Send product and billing updates to this account.'
      />
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
    </>
  );
}
```

Use default props when the component can own its initial state.

```tsx
import { Checkbox, RadioGroup, Tabs } from '@vellira-ui/react';

export function UncontrolledPreferences() {
  return (
    <>
      <Checkbox
        defaultChecked
        label='Remember this device'
        description='Skip verification prompts on this browser.'
      />
      <RadioGroup
        name='theme'
        label='Theme'
        defaultValue='system'
        options={[
          { label: 'System', value: 'system' },
          { label: 'Light', value: 'light' },
          { label: 'Dark', value: 'dark' },
        ]}
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

Vellira Web components implement browser-specific accessibility behavior while
keeping the public API platform-independent.

- `Button` supports accessible labels for icon-only or ambiguous actions through
  the standard `aria-label` attribute. It does not expose a camelCase
  accessible-label alias.
- `Input`, `Checkbox`, `Select`, `RadioGroup`, and `FormField` wire labels,
  descriptions, required state, disabled state, and error text.
- Checkbox rows without a visible label should use `aria-label` or
  `aria-labelledby`; mixed states use `indeterminate`.
- `RadioGroup`, `Tabs`, menus, tooltips, and overlays include keyboard behavior
  appropriate to their role.
- `Modal` owns dialog visibility, escape handling, backdrop close behavior, and
  compound sections for title, body, and actions.
- Consumers still own meaningful copy, validation timing, focus targets after
  submit, and product-specific announcements.

## Theming

Import `@vellira-ui/react/styles` once for base component styles.
Theme values come from the shared token package and are exposed as CSS
variables.

```tsx
import '@vellira-ui/react/styles';
import { ThemeProvider } from '@vellira-ui/react';

export function Root() {
  return (
    <ThemeProvider defaultTheme='light'>
      <App />
    </ThemeProvider>
  );
}
```

```css
.account-shell {
  color: var(--text-primary);
  background: var(--surface-default);
  border: 1px solid var(--border-default);
}
```

`ThemeProvider` supports `light`, `dark`, and `high-contrast` themes, plus a
controlled `theme`/`onThemeChange` pair for application-level theme switching.

## Storybook

Explore every component with interactive controls, accessibility states, and
live examples.

[Open Storybook](https://storybook.vellira.dev)

## Development

```bash
pnpm --filter @vellira-ui/react typecheck
pnpm --filter @vellira-ui/react build
pnpm --filter @vellira-ui/react test
pnpm --filter @vellira-ui/react-storybook dev
```

## Browser Support

Vellira targets modern evergreen browsers supported by React.

The library relies on standard browser APIs and does not require additional
polyfills in modern environments.
