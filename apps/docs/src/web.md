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
    <Tabs defaultValue='profile'>
      <Tabs.List>
        <Tabs.Trigger value='profile'>Profile</Tabs.Trigger>
        <Tabs.Trigger value='security'>Security</Tabs.Trigger>
      </Tabs.List>

      <Tabs.Content value='profile'>
        <Input
          label='Display name'
          value={displayName}
          onValueChange={setDisplayName}
          placeholder='Roman Bakurov'
        />
        <Select label='Role'>
          <Select.Item value='admin'>Admin</Select.Item>
          <Select.Item value='editor'>Editor</Select.Item>
          <Select.Item value='viewer'>Viewer</Select.Item>
        </Select>
        <Button color='primary' appearance='solid'>
          Save changes
        </Button>
      </Tabs.Content>
      <Tabs.Content value='security'>Security settings</Tabs.Content>
    </Tabs>
  );
}
```

## Available Components

Every component exports TypeScript props from the package root. The full
generated reference lives in
[`packages/react/API.md`](https://github.com/vellira-dev/Vellira/blob/main/packages/react/API.md).

| Component    | Core props                                                                                                                | State model                |
| ------------ | ------------------------------------------------------------------------------------------------------------------------- | -------------------------- |
| `Button`     | `appearance`, `color`, `shape`, `iconStart`, `iconEnd`, `fullWidth`, `aria-label`                                         | disabled, loading          |
| `Checkbox`   | `checked`, `defaultChecked`, `onCheckedChange`, `size`, `color`, `label`, `description`, `error`, `indeterminate`, `icon` | controlled or uncontrolled |
| `Input`      | `label`, `value`, `onValueChange`, `type`, `size`, `variant`, `color`, `error`, `mask`, `format`                          | controlled or uncontrolled |
| `FormField`  | `label`, `description`, `error`, `required`, `disabled`, `invalid`, `children`                                            | field semantics            |
| `Radio`      | `value`, `label`, `checked`, `defaultChecked`, `onCheckedChange`, `size`, `color`, `error`, `icon`                        | controlled or uncontrolled |
| `RadioGroup` | `name`, `children`, `value`, `defaultValue`, `onValueChange`, `orientation`, `size`, `color`                              | controlled or uncontrolled |
| `Select`     | `label`, `description`, `children`, `value`, `defaultValue`, `onValueChange`, `size`, `open`, `error`                     | controlled or uncontrolled |
| `Dropdown`   | `children`, `open`, `defaultOpen`, `onOpenChange`, `placement`, `size`, `color`, `matchTriggerWidth`, `closeOnSelect`     | controlled or uncontrolled |
| `Tabs`       | `value`, `defaultValue`, `onValueChange`, `orientation`, `variant`                                                        | controlled or uncontrolled |
| `Tooltip`    | `children`, `open`, `defaultOpen`, `onOpenChange`, `placement`, `delay`, `Tooltip.Trigger`, `Tooltip.Content`             | controlled or uncontrolled |
| `Modal`      | `open`, `defaultOpen`, `onOpenChange`, `closeOnOutsidePress`, `closeOnEscape`, compound sections                          | controlled or uncontrolled |

## Select Usage Guidelines

Use `Select` for a single form value from a compact list. Use `RadioGroup` when
there are only a few options and users should compare them without opening an
overlay. Use `Dropdown` for contextual actions, not saved form values.

For accessibility, prefer a visible `label`; if no label can be rendered, pass
`aria-label`. Select connects validation content through `aria-describedby`,
sets invalid state when `error` is present, supports required state, and exposes
keyboard behavior for Enter, Space, Arrow keys, Home, End, typeahead search,
Escape and Tab.

## Dropdown Usage Guidelines

Use `Dropdown` for contextual actions, not saved form values. Compose actions
with `Dropdown.Trigger`, `Dropdown.Content`, `Dropdown.Item`,
`Dropdown.Group`, `Dropdown.Label`, and `Dropdown.Separator`. Use
`Dropdown.Item onSelect` for commands and keep Select-style value props on
`Select`.

Dropdown uses semantic colors through `color='primary' | 'neutral' |
'success' | 'warning' | 'danger'`. The color controls trigger, content, focus,
and item interaction tokens; destructive actions should still use
`Dropdown.Item color='danger'`. Rich rows can use props (`icon`, `description`,
`badge`, `shortcut`) or explicit slots such as `Dropdown.ItemIcon`,
`Dropdown.ItemDescription`, `Dropdown.ItemBadge`, and `Dropdown.ItemShortcut`.

## Button

Web Button uses native button semantics, defaults to `type="button"`, and
accepts standard DOM attributes such as `className`, `onClick`, and
`aria-label`.

```tsx
import { Filter, Save, Search } from '@vellira-ui/icons';
import { Button, Modal, Portal } from '@vellira-ui/react';
import { useState } from 'react';

export function ButtonExamples() {
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  return (
    <>
      <Button color='primary' appearance='solid' onClick={handleSave}>
        Save
      </Button>

      <Button loading={isSaving} loadingText='Saving...'>
        Save
      </Button>

      <Button aria-label='Search' iconOnly iconStart={<Search />} />

      <div role='toolbar' aria-label='Editor toolbar'>
        <Button
          aria-label='Save'
          appearance='ghost'
          iconOnly
          iconStart={<Save />}
        />
        <Button appearance='ghost' iconStart={<Filter />}>
          Filter
        </Button>
      </div>

      <Button
        color='danger'
        appearance='soft'
        onClick={() => setConfirmingDelete(true)}
      >
        Delete workspace
      </Button>

      <Modal
        open={confirmingDelete}
        onOpenChange={setConfirmingDelete}
        role='alertdialog'
      >
        <Portal>
          <Modal.Overlay />
          <Modal.Content>
            <Modal.Header>
              <div>
                <Modal.Title>Delete workspace?</Modal.Title>
                <Modal.Description>
                  This action cannot be undone.
                </Modal.Description>
              </div>
              <Modal.Close />
            </Modal.Header>
            <Modal.Footer>
              <Modal.Close asChild>
                <Button color='neutral' appearance='ghost' disabled={deleting}>
                  Cancel
                </Button>
              </Modal.Close>
              <Button
                color='danger'
                loading={deleting}
                loadingText='Deleting...'
                onClick={() => setDeleting(true)}
              >
                Delete
              </Button>
            </Modal.Footer>
          </Modal.Content>
        </Portal>
      </Modal>
    </>
  );
}
```

Pass `loadingText` even in the idle render when the loading label is longer than
the default label. Button reserves that label width and avoids horizontal layout
shift when `loading` turns on.

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
      <Select label='Role' value={role} onValueChange={setRole}>
        <Select.Item value='admin'>Admin</Select.Item>
        <Select.Item value='editor'>Editor</Select.Item>
        <Select.Item value='viewer'>Viewer</Select.Item>
      </Select>
    </>
  );
}
```

Use default props when the component can own its initial state.

```tsx
import { Checkbox, Radio, RadioGroup, Tabs } from '@vellira-ui/react';

export function UncontrolledPreferences() {
  return (
    <>
      <Checkbox
        defaultChecked
        label='Remember this device'
        description='Skip verification prompts on this browser.'
      />
      <RadioGroup name='theme' label='Theme' defaultValue='system'>
        <Radio value='system' label='System' />
        <Radio value='light' label='Light' />
        <Radio value='dark' label='Dark' />
      </RadioGroup>
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

Vellira Web components implement browser-specific accessibility behavior while
keeping the public API platform-independent.

- `Button` supports accessible labels for icon-only or ambiguous actions through
  the standard `aria-label` attribute. It does not expose a camelCase
  accessible-label alias.
- `Input`, `Checkbox`, `Select`, and `RadioGroup` wire labels, descriptions,
  required state, disabled state, and error text. `FormField` provides the same
  visual structure for custom controls, while the wrapped control owns its own
  ARIA props and interaction state.
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

Storybook loads the shared Vellira font assets and applies
`var(--font-family-base)` across the manager UI, story canvas, and docs mode so
examples match the production typography contract.

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
