# Vellira Web Component API

API reference for `@vellira-ui/react`.

Import the package styles once in your application entry point:

```tsx
import '@vellira-ui/react/styles';
```

Then import public components from the package root:

```tsx
import {
  Button,
  Checkbox,
  Dropdown,
  FormField,
  Input,
  Modal,
  RadioGroup,
  Select,
  Tabs,
  ThemeProvider,
  Tooltip,
  useTheme,
} from '@vellira-ui/react';
```

## Contents

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
- ThemeProvider
- useTheme

## API Conventions

- Shared base contracts come from `@vellira-ui/types`.
- Web-only props such as `className`, `onClick`, DOM ids, and browser accessibility attributes stay in the web package.
- Text and icons that render React elements use `ReactNode`.
- Components that support both controlled and uncontrolled usage expose `value` or `checked` plus `defaultValue` or `defaultChecked`.
- `disabled` prevents user interaction where the component supports it.
- `error` is a display prop. Validation still belongs to the consuming app.

## Shared Types

| Type                | Values                                                                      |
| ------------------- | --------------------------------------------------------------------------- |
| `ButtonColor`       | `'primary'`, `'secondary'`, `'close'`, `'danger'`                           |
| `ButtonSize`        | `'sm'`, `'md'`, `'lg'`                                                      |
| `InputSize`         | `'sm'`, `'md'`, `'lg'`                                                      |
| `InputType`         | `'text'`, `'email'`, `'password'`, `'number'`, `'search'`, `'tel'`, `'url'` |
| `Orientation`       | `'horizontal'`, `'vertical'`                                                |
| `TextWrap`          | `'nowrap'`, `'wrap'`, `'truncate'`                                          |
| `TabsAppearance`    | `'default'`, `'underline'`, `'pills'`                                       |
| `FloatingPlacement` | `'top'`, `'bottom'`, `'left'`, `'right'`                                    |
| `ThemeName`         | `'light'`, `'dark'`, `'high-contrast'`, `'highContrast'`                    |

### TooltipDelay

```ts
type TooltipDelay = {
  open?: number;
  close?: number;
};
```

## Button

Clickable action component with variants, sizes, optional icons, loading state,
and full-width layout support.

```tsx
import { Search } from '@vellira-ui/icons';
import { Button } from '@vellira-ui/react';

<Button color='primary' variant='solid' size='md' onClick={handleSave}>
  Save
</Button>;

<Button aria-label='Search' iconOnly leftIcon={<Search />} />;
```

<!-- api-docgen:start web.ButtonProps.Button -->

| Prop          | Type            | Required | Description                                             |
| ------------- | --------------- | -------- | ------------------------------------------------------- |
| `children`    | `ReactNode`     | No       | Button content.                                         |
| `leftIcon`    | `ReactNode`     | No       | Icon rendered before content.                           |
| `rightIcon`   | `ReactNode`     | No       | Icon rendered after content.                            |
| `fullWidth`   | `boolean`       | No       | Makes the button fill its container width.              |
| `variant`     | `ButtonVariant` | No       | Visual variant: `solid`, `outline`, or `ghost`.         |
| `size`        | `ButtonSize`    | No       | Button size.                                            |
| `disabled`    | `boolean`       | No       | Disables interaction.                                   |
| `color`       | `ButtonColor`   | No       | Visual tone: `primary`, `secondary`, `close`, `danger`. |
| `loading`     | `boolean`       | No       | Shows a spinner and disables interaction.               |
| `loadingText` | `string`        | No       | Replaces visible content while loading.                 |
| `iconOnly`    | `boolean`       | No       | Hides visible text for icon-only actions.               |

<!-- api-docgen:end web.ButtonProps.Button -->

Icon-only buttons must provide the standard `aria-label` attribute. Web Button
does not expose a camelCase accessible-label alias. Button also accepts standard
`button` attributes such as `type`, `className`, and `onClick`; its default
`type` is `button`.

## Checkbox

Boolean input with controlled and uncontrolled modes.

```tsx
import { Checkbox } from '@vellira-ui/react';

<Checkbox
  checked={accepted}
  onCheckedChange={setAccepted}
  label='Accept terms'
/>;
```

<!-- api-docgen:start web.CheckboxProps.Checkbox -->

| Prop              | Type                         | Required | Description                                   |
| ----------------- | ---------------------------- | -------- | --------------------------------------------- |
| `label`           | `string`                     | No       | Text label rendered next to the control.      |
| `className`       | `string`                     | No       | Extra CSS class for the root element.         |
| `error`           | `string`                     | No       | Error message rendered for invalid state.     |
| `checked`         | `boolean`                    | No       | Controlled checked state.                     |
| `defaultChecked`  | `boolean`                    | No       | Initial checked state for uncontrolled usage. |
| `disabled`        | `boolean`                    | No       | Disables interaction.                         |
| `onCheckedChange` | `(checked: boolean) => void` | No       | Called when the user changes the state.       |

<!-- api-docgen:end web.CheckboxProps.Checkbox -->

## Input

Labeled text input with shared value contract and web input attributes.

```tsx
import { Input } from '@vellira-ui/react';

<Input
  label='Email'
  value={email}
  onChange={(event) => setEmail(event.target.value)}
  type='email'
  placeholder='name@example.com'
/>;
```

For controlled clearable inputs, update the controlled value in `onClear`.
`onChange` is reserved for input value changes from the input element.

<!-- api-docgen:start web.InputProps.Input -->

| Prop                 | Type                                                     | Required | Description                                      |
| -------------------- | -------------------------------------------------------- | -------- | ------------------------------------------------ |
| `id`                 | `string`                                                 | No       | Input id. Generated internally when omitted.     |
| `className`          | `string`                                                 | No       | Extra CSS class for the root element.            |
| `autoComplete`       | `string`                                                 | No       | HTML autocomplete value.                         |
| `name`               | `string`                                                 | No       | —                                                |
| `description`        | `string`                                                 | No       | Additional descriptive text.                     |
| `leftAdornment`      | `ReactNode`                                              | No       | —                                                |
| `rightAdornment`     | `ReactNode`                                              | No       | —                                                |
| `clearIcon`          | `ReactNode`                                              | No       | —                                                |
| `type`               | `HTMLInputTypeAttribute`                                 | No       | HTML input type.                                 |
| `value`              | `string \| number \| readonly string[]`                  | No       | Controlled value.                                |
| `defaultValue`       | `string \| number \| readonly string[]`                  | No       | Initial uncontrolled value.                      |
| `onChange`           | `ChangeEventHandler<HTMLInputElement, HTMLInputElement>` | No       | Called when the value changes.                   |
| `label`              | `string`                                                 | No       | Visible label.                                   |
| `placeholder`        | `string`                                                 | No       | Placeholder text.                                |
| `size`               | `InputSize`                                              | No       | Input size.                                      |
| `disabled`           | `boolean`                                                | No       | Disables interaction.                            |
| `readOnly`           | `boolean`                                                | No       | Marks the input as read-only.                    |
| `required`           | `boolean`                                                | No       | Marks the field as required.                     |
| `clearable`          | `boolean`                                                | No       | Shows a clear action when the input has a value. |
| `onClear`            | `() => void`                                             | No       | Called when the clear action is pressed.         |
| `error`              | `string`                                                 | No       | Error message rendered for invalid state.        |
| `leftAdornmentTone`  | `InputAdornmentTone`                                     | No       | Color tone for the left adornment.               |
| `rightAdornmentTone` | `InputAdornmentTone`                                     | No       | Color tone for the right adornment.              |
| `clearIconTone`      | `InputAdornmentTone`                                     | No       | Color tone for the clear icon.                   |

<!-- api-docgen:end web.InputProps.Input -->

## FormField

Layout helper for labels, errors, and custom field controls.

```tsx
import { FormField, Input } from '@vellira-ui/react';

<FormField label='Email' error={error}>
  <Input />
</FormField>;
```

<!-- api-docgen:start web.FormFieldProps.FormField -->

| Prop          | Type        | Required | Description                                    |
| ------------- | ----------- | -------- | ---------------------------------------------- |
| `id`          | `string`    | No       | Id used to connect the label with the control. |
| `label`       | `string`    | No       | Field label.                                   |
| `error`       | `string`    | No       | Error message.                                 |
| `children`    | `ReactNode` | Yes      | Field control or custom content.               |
| `required`    | `boolean`   | No       | Marks the field as required.                   |
| `disabled`    | `boolean`   | No       | Renders the disabled field state.              |
| `description` | `string`    | No       | Additional descriptive text.                   |
| `className`   | `string`    | No       | Extra CSS class for the root element.          |

<!-- api-docgen:end web.FormFieldProps.FormField -->

## RadioGroup

Single-selection group with controlled and uncontrolled modes.

```tsx
import { RadioGroup } from '@vellira-ui/react';

<RadioGroup
  name='plan'
  label='Plan'
  defaultValue='basic'
  orientation='vertical'
  options={[
    { value: 'basic', label: 'Basic' },
    { value: 'pro', label: 'Pro' },
  ]}
/>;
```

### RadioGroup Props

<!-- api-docgen:start web.RadioGroupProps.RadioGroupProps -->

| Prop           | Type                      | Required | Description                           |
| -------------- | ------------------------- | -------- | ------------------------------------- |
| `label`        | `string`                  | No       | Group label.                          |
| `name`         | `string`                  | Yes      | Radio input name.                     |
| `options`      | `RadioOption[]`           | Yes      | Options rendered by the group.        |
| `error`        | `string`                  | No       | Error message.                        |
| `orientation`  | `Orientation`             | No       | Layout direction.                     |
| `className`    | `string`                  | No       | Extra CSS class for the root element. |
| `value`        | `string`                  | No       | Controlled selected value.            |
| `defaultValue` | `string`                  | No       | Initial value for uncontrolled usage. |
| `onChange`     | `(value: string) => void` | No       | Called when selection changes.        |
| `required`     | `boolean`                 | No       | Marks the group as required.          |
| `disabled`     | `boolean`                 | No       | Disables the whole group.             |
| `description`  | `string`                  | No       | Additional descriptive text.          |

<!-- api-docgen:end web.RadioGroupProps.RadioGroupProps -->

### RadioOption

<!-- api-docgen:start web.RadioOption.RadioOption -->

| Prop       | Type      | Required | Description           |
| ---------- | --------- | -------- | --------------------- |
| `label`    | `string`  | Yes      | Visible option label. |
| `value`    | `string`  | Yes      | Option value.         |
| `disabled` | `boolean` | No       | Disables this option. |

<!-- api-docgen:end web.RadioOption.RadioOption -->

## Select

Single-selection dropdown field.

```tsx
import { Select } from '@vellira-ui/react';

<Select
  label='Country'
  value={country}
  onChange={setCountry}
  placeholder='Choose country'
  options={[
    { value: 'fr', label: 'France' },
    { value: 'us', label: 'United States' },
  ]}
/>;
```

### Select Props

<!-- api-docgen:start web.SelectProps.SelectProps -->

| Prop           | Type                      | Required | Description                                    |
| -------------- | ------------------------- | -------- | ---------------------------------------------- |
| `label`        | `string`                  | No       | Visible field label.                           |
| `id`           | `string`                  | No       | Trigger id.                                    |
| `name`         | `string`                  | No       | Field name.                                    |
| `options`      | `SelectOption[]`          | Yes      | Options rendered in the dropdown.              |
| `placeholder`  | `string`                  | No       | Text shown when no value is selected.          |
| `error`        | `string`                  | No       | Error message.                                 |
| `className`    | `string`                  | No       | Extra CSS class for the root element.          |
| `value`        | `string`                  | No       | Controlled selected value.                     |
| `defaultValue` | `string`                  | No       | Initial selected value for uncontrolled usage. |
| `onChange`     | `(value: string) => void` | No       | Called when the user selects an option.        |
| `required`     | `boolean`                 | No       | Marks the field as required.                   |
| `disabled`     | `boolean`                 | No       | Disables interaction.                          |
| `description`  | `string`                  | No       | Additional descriptive text.                   |

<!-- api-docgen:end web.SelectProps.SelectProps -->

### SelectOption

<!-- api-docgen:start web.SelectOption.SelectOption -->

| Prop       | Type      | Required | Description           |
| ---------- | --------- | -------- | --------------------- |
| `label`    | `string`  | Yes      | Visible option label. |
| `value`    | `string`  | Yes      | Option value.         |
| `disabled` | `boolean` | No       | Disables this option. |

<!-- api-docgen:end web.SelectOption.SelectOption -->

## Dropdown

Menu component with item, group, and separator entries.

```tsx
import { Dropdown } from '@vellira-ui/react';

<Dropdown
  label='Actions'
  items={[
    { type: 'item', value: 'edit', label: 'Edit' },
    { type: 'separator' },
    { type: 'item', value: 'delete', label: 'Delete', danger: true },
  ]}
  onSelect={handleSelect}
/>;
```

### Dropdown Props

<!-- api-docgen:start web.DropdownProps.DropdownProps -->

| Prop                | Type                      | Required | Description                                     |
| ------------------- | ------------------------- | -------- | ----------------------------------------------- |
| `label`             | `string`                  | No       | Default trigger label.                          |
| `trigger`           | `ReactNode`               | No       | Custom trigger content.                         |
| `icon`              | `ReactNode`               | No       | Icon rendered in the default trigger.           |
| `arrowIcon`         | `ReactNode`               | No       | Custom arrow icon rendered in the trigger.      |
| `items`             | `DropdownItem[]`          | Yes      | Menu model.                                     |
| `placement`         | `Placement`               | No       | Floating UI menu placement.                     |
| `className`         | `string`                  | No       | Extra CSS class for the root element.           |
| `rotateAngle`       | `number`                  | No       | Rotation angle for the trigger arrow.           |
| `matchTriggerWidth` | `boolean`                 | No       | Makes the menu match the trigger width.         |
| `showArrow`         | `boolean`                 | No       | Controls whether the trigger arrow is rendered. |
| `textWrap`          | `TextWrap`                | No       | Default text wrapping behavior for items.       |
| `disabled`          | `boolean`                 | No       | Disables the trigger.                           |
| `onSelect`          | `(value: string) => void` | No       | Called when a menu item is selected.            |

<!-- api-docgen:end web.DropdownProps.DropdownProps -->

### Dropdown Items

| Shape               | Required Props                    | Optional Props                                   | Description                                   |
| ------------------- | --------------------------------- | ------------------------------------------------ | --------------------------------------------- |
| `DropdownMenuItem`  | `value`, `label`                  | `type`, `disabled`, `icon`, `danger`, `textWrap` | Selectable item. `type` defaults to `'item'`. |
| `DropdownGroup`     | `type: 'group'`, `label`, `items` | None                                             | Labeled group of menu entries.                |
| `DropdownSeparator` | `type: 'separator'`               | None                                             | Visual separator.                             |

## Tabs

Compound tab navigation with keyboard support.

```tsx
import { Tabs } from '@vellira-ui/react';

<Tabs defaultActiveIndex={0} orientation='horizontal' appearance='underline'>
  <Tabs.List>
    <Tabs.Tab index={0}>Overview</Tabs.Tab>
    <Tabs.Tab index={1}>Settings</Tabs.Tab>
  </Tabs.List>
  <Tabs.Panel index={0}>Overview content</Tabs.Panel>
  <Tabs.Panel index={1}>Settings content</Tabs.Panel>
</Tabs>;
```

### Tabs Props

<!-- api-docgen:start web.TabsProps.TabsProps -->

| Prop                 | Type                      | Required | Description                                        |
| -------------------- | ------------------------- | -------- | -------------------------------------------------- |
| `children`           | `ReactNode`               | Yes      | `Tabs.List`, `Tabs.Tab`, and `Tabs.Panel` content. |
| `className`          | `string`                  | No       | Extra CSS class for the root element.              |
| `activeIndex`        | `number`                  | No       | Currently active tab index.                        |
| `defaultActiveIndex` | `number`                  | No       | Initially active tab index.                        |
| `onChange`           | `(index: number) => void` | No       | Called when the value changes.                     |
| `orientation`        | `Orientation`             | No       | Keyboard and layout orientation.                   |
| `appearance`         | `TabsAppearance`          | No       | Visual style.                                      |

<!-- api-docgen:end web.TabsProps.TabsProps -->

### Tabs.List Props

<!-- api-docgen:start web.TabsListProps.TabsListProps -->

| Prop       | Type        | Required | Description  |
| ---------- | ----------- | -------- | ------------ |
| `children` | `ReactNode` | Yes      | Tab buttons. |

<!-- api-docgen:end web.TabsListProps.TabsListProps -->

### Tabs.Tab Props

<!-- api-docgen:start web.TabProps.TabsTabProps -->

| Prop        | Type                                                    | Required | Description                                  |
| ----------- | ------------------------------------------------------- | -------- | -------------------------------------------- |
| `children`  | `ReactNode`                                             | Yes      | Tab label.                                   |
| `icon`      | `ReactNode`                                             | No       | Icon rendered inside the component.          |
| `className` | `string`                                                | No       | Extra CSS class.                             |
| `onClick`   | `(e: MouseEvent<HTMLButtonElement> \| null) => void`    | No       | Click handler.                               |
| `onKeyDown` | `(e: KeyboardEvent<HTMLButtonElement> \| null) => void` | No       | Keyboard handler.                            |
| `index`     | `number`                                                | Yes      | Tab index used to connect the tab and panel. |
| `disabled`  | `boolean`                                               | No       | Disables this tab.                           |

<!-- api-docgen:end web.TabProps.TabsTabProps -->

### Tabs.Panel Props

<!-- api-docgen:start web.TabsPanelProps.TabsPanelProps -->

| Prop        | Type        | Required | Description                      |
| ----------- | ----------- | -------- | -------------------------------- |
| `children`  | `ReactNode` | Yes      | Panel content.                   |
| `className` | `string`    | No       | Extra CSS class.                 |
| `index`     | `number`    | Yes      | Panel index matching `Tabs.Tab`. |

<!-- api-docgen:end web.TabsPanelProps.TabsPanelProps -->

## Tooltip

Floating helper text that appears around a target element.

```tsx
import { Tooltip, Button } from '@vellira-ui/react';

<Tooltip content='More actions' placement='top' className=''>
  <Button aria-label='More actions'>...</Button>
</Tooltip>;
```

<!-- api-docgen:start web.TooltipProps.Tooltip -->

| Prop           | Type                      | Required | Description                            |
| -------------- | ------------------------- | -------- | -------------------------------------- |
| `content`      | `ReactNode`               | Yes      | —                                      |
| `children`     | `ReactNode`               | Yes      | Content rendered inside the component. |
| `maxWidth`     | `string \| number`        | No       | —                                      |
| `className`    | `string`                  | No       | Extra CSS class for the root element.  |
| `placement`    | `FloatingPlacement`       | No       | —                                      |
| `disabled`     | `boolean`                 | No       | Disables interaction.                  |
| `delay`        | `TooltipDelay`            | No       | —                                      |
| `onOpenChange` | `(open: boolean) => void` | No       | —                                      |

<!-- api-docgen:end web.TooltipProps.Tooltip -->

## Modal

Accessible dialog with backdrop, keyboard close behavior, and compound content sections.

```tsx
import { Button, Modal } from '@vellira-ui/react';

<Modal isOpen={isOpen} onClose={closeModal}>
  <Modal.Content>
    <Modal.Header>Delete file</Modal.Header>
    <Modal.Body>Are you sure you want to delete this file?</Modal.Body>
    <Modal.Footer>
      <Button color='secondary' variant='solid' onClick={closeModal}>
        Cancel
      </Button>
    </Modal.Footer>
  </Modal.Content>
</Modal>;
```

### Modal Props

<!-- api-docgen:start web.ModalProps.ModalProps -->

| Prop              | Type         | Required | Description                              |
| ----------------- | ------------ | -------- | ---------------------------------------- |
| `children`        | `ReactNode`  | Yes      | Modal content.                           |
| `isOpen`          | `boolean`    | Yes      | Controls dialog visibility.              |
| `onClose`         | `() => void` | Yes      | Called when the modal requests to close. |
| `closeOnBackdrop` | `boolean`    | No       | Allows closing by clicking the backdrop. |
| `closeOnEsc`      | `boolean`    | No       | Allows closing with the Escape key.      |
| `closeOnClick`    | `boolean`    | No       | Deprecated alias kept for compatibility. |

<!-- api-docgen:end web.ModalProps.ModalProps -->

### Modal Compound Components

| Component       | Props                  | Description            |
| --------------- | ---------------------- | ---------------------- |
| `Modal.Content` | `children?: ReactNode` | Main dialog surface.   |
| `Modal.Header`  | `children?: ReactNode` | Header/title section.  |
| `Modal.Body`    | `children?: ReactNode` | Body section.          |
| `Modal.Footer`  | `children?: ReactNode` | Action/footer section. |

### Modal Accessibility

Use `Modal.Header` for a visible title and `Modal.Body` for descriptive content. The web implementation wires dialog semantics and keyboard behavior inside the component, while the consuming app remains responsible for meaningful text and focusable actions.

## ThemeProvider

Provides theme context for all Vellira components.

```tsx
import '@vellira-ui/tokens/css';
import { ThemeProvider } from '@vellira-ui/react';

<ThemeProvider defaultTheme='dark'>
  <App />
</ThemeProvider>;
```

### ThemeProvider Props

<!-- api-docgen:start web.ThemeProviderProps.ThemeProvider -->

<!-- api-docgen:start web.ThemeProviderProps.ThemeProviderProps -->

| Prop            | Type                         | Required | Description                               |
| --------------- | ---------------------------- | -------- | ----------------------------------------- |
| `children`      | `ReactNode`                  | Yes      | Content wrapped by the provider.          |
| `theme`         | `ThemeName`                  | No       | Controlled theme value.                   |
| `defaultTheme`  | `ThemeName`                  | No       | Initial theme for uncontrolled usage.     |
| `onThemeChange` | `(theme: ThemeName) => void` | No       | Called whenever the active theme changes. |

<!-- api-docgen:end web.ThemeProviderProps.ThemeProviderProps -->
<!-- api-docgen:end web.ThemeProviderProps.ThemeProvider -->

### Supported Themes

| Theme           | Description                         |
| --------------- | ----------------------------------- |
| `light`         | Default light theme.                |
| `dark`          | Dark theme.                         |
| `high-contrast` | High contrast theme.                |
| `highContrast`  | Alias accepted by the provider API. |

### Controlled

```tsx
import { useState } from 'react';

const [theme, setTheme] = useState('light');

<ThemeProvider theme={theme} onThemeChange={setTheme}>
  <App />
</ThemeProvider>;
```

### Uncontrolled

```tsx
<ThemeProvider defaultTheme='light'>
  <App />
</ThemeProvider>
```

The provider renders:

```html
<div data-vellira-theme="dark"></div>
```

## useTheme

Returns the current theme and a function to update it.

### Usage

```tsx
import { useTheme } from '@vellira-ui/react';

function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <button
      type='button'
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
    >
      Toggle theme
    </button>
  );
}
```

### Returns

| Property   | Type                         | Description               |
| ---------- | ---------------------------- | ------------------------- |
| `theme`    | `ThemeName`                  | Current active theme.     |
| `setTheme` | `(theme: ThemeName) => void` | Updates the active theme. |

> `useTheme` must be used inside `ThemeProvider`.

## Accessibility

All interactive components support:

- keyboard navigation
- focus management
- screen readers
- WAI-ARIA attributes where applicable
