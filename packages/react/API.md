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
| `ButtonAppearance`  | `'solid'`, `'outline'`, `'ghost'`, `'soft'`, `'link'`                       |
| `ButtonColor`       | `'primary'`, `'neutral'`, `'success'`, `'warning'`, `'danger'`              |
| `ButtonShape`       | `'square'`, `'rounded'`, `'pill'`                                           |
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

Clickable action component with appearances, sizes, optional icons, loading state,
and full-width layout support.

```tsx
import { Search } from '@vellira-ui/icons';
import { Button } from '@vellira-ui/react';

<Button color='primary' appearance='solid' size='md' onClick={handleSave}>
  Save
</Button>;

<Button aria-label='Search' iconOnly iconStart={<Search />} />;
```

<!-- api-docgen:start web.ButtonProps.Button -->

| Prop          | Type               | Required | Description                                                  |
| ------------- | ------------------ | -------- | ------------------------------------------------------------ |
| `children`    | `ReactNode`        | No       | Button content.                                              |
| `iconStart`   | `ReactNode`        | No       | Icon rendered before content.                                |
| `iconEnd`     | `ReactNode`        | No       | Icon rendered after content.                                 |
| `fullWidth`   | `boolean`          | No       | Makes the button fill its container width.                   |
| `size`        | `ButtonSize`       | No       | Button size.                                                 |
| `disabled`    | `boolean`          | No       | Disables interaction.                                        |
| `color`       | `ButtonColor`      | No       | Visual tone: primary, neutral, success, warning, or danger.  |
| `loading`     | `boolean`          | No       | Shows a spinner and disables interaction.                    |
| `loadingText` | `string`           | No       | Replaces visible content while loading.                      |
| `iconOnly`    | `boolean`          | No       | Hides visible text for icon-only actions.                    |
| `spinner`     | `ReactNode`        | No       | Custom loading indicator.                                    |
| `tooltip`     | `string`           | No       | Native title tooltip text.                                   |
| `badge`       | `ReactNode`        | No       | Compact badge rendered after the label.                      |
| `shortcut`    | `ReactNode`        | No       | Keyboard shortcut hint rendered after the label.             |
| `asChild`     | `boolean`          | No       | Composes Button behavior and styling onto the child element. |
| `appearance`  | `ButtonAppearance` | No       | Visual style: solid, outline, ghost, soft, or link.          |
| `shape`       | `ButtonShape`      | No       | Corner shape: square, rounded, or pill.                      |

<!-- api-docgen:end web.ButtonProps.Button -->

Icon-only buttons must provide the standard `aria-label` attribute. Web Button
does not expose a camelCase accessible-label alias. When `iconOnly` is enabled,
visible `children` are not rendered; use `aria-label` as the accessible action
name. Button also accepts standard `button` attributes such as `type`,
`className`, and `onClick`; its default `type` is `button`.

## Checkbox

Boolean input with controlled and uncontrolled modes, helper text, validation
state, and mixed selection support.

```tsx
import { Checkbox } from '@vellira-ui/react';

<Checkbox
  checked={accepted}
  onCheckedChange={setAccepted}
  label='Accept terms'
  description='Required to continue.'
/>;
```

<!-- api-docgen:start web.CheckboxProps.Checkbox -->

| Prop                | Type                                                | Required | Description                                      |
| ------------------- | --------------------------------------------------- | -------- | ------------------------------------------------ |
| `label`             | `ReactNode`                                         | No       | Visible label rendered next to the control.      |
| `description`       | `ReactNode`                                         | No       | Helper text rendered below the checkbox row.     |
| `wrapperClassName`  | `string`                                            | No       | Extra CSS class for the clickable label wrapper. |
| `error`             | `string`                                            | No       | Error message rendered for invalid state.        |
| `checked`           | `boolean`                                           | No       | Controlled checked state.                        |
| `defaultChecked`    | `boolean`                                           | No       | Initial checked state for uncontrolled usage.    |
| `disabled`          | `boolean`                                           | No       | Disables interaction.                            |
| `required`          | `boolean`                                           | No       | Marks the checkbox as required.                  |
| `indeterminate`     | `boolean`                                           | No       | Displays and announces a mixed selection state.  |
| `size`              | `CheckboxSize`                                      | No       | Checkbox size.                                   |
| `onCheckedChange`   | `(checked: boolean) => void`                        | No       | Called when the user changes the state.          |
| `icon`              | `ReactNode`                                         | No       | Icon rendered inside the component.              |
| `indeterminateIcon` | `ReactNode`                                         | No       | —                                                |
| `color`             | `import("@vellira-ui/types").CheckboxColor`         | No       | —                                                |
| `labelPosition`     | `import("@vellira-ui/types").CheckboxLabelPosition` | No       | —                                                |

<!-- api-docgen:end web.CheckboxProps.Checkbox -->

Checkbox accepts standard `input[type="checkbox"]` attributes except the state
props controlled by Vellira (`checked`, `defaultChecked`, `onChange`, `type`,
and native `size`). `className` styles the root container; use
`wrapperClassName` for the clickable label row. When no visible `label` is
rendered, provide `aria-label` or `aria-labelledby`; the icon-only hit target
remains at least 44px square. `description` and `error` are associated through
`aria-describedby`.

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

Clearable inputs use separate callbacks for typing and clear actions:

- typing into the input calls `onChange`;
- pressing the clear action calls `onClear`;
- controlled inputs should clear their value inside `onClear`;
- uncontrolled inputs clear their internal value and then call `onClear`.

`rightAdornment` is an arbitrary slot. Interactive content rendered there is
responsible for its own accessible name, focus handling, and keyboard behavior.

<!-- api-docgen:start web.InputProps.Input -->

| Prop                 | Type                                                     | Required | Description                                      |
| -------------------- | -------------------------------------------------------- | -------- | ------------------------------------------------ |
| `id`                 | `string`                                                 | No       | Input id. Generated internally when omitted.     |
| `className`          | `string`                                                 | No       | Extra CSS class for the input element.           |
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

<FormField id='email' label='Email' error={error}>
  <Input id='email' />
</FormField>;
```

`FormField` uses `id` to connect the visible label and generated
`{id}-description` / `{id}-error` content with the control. Pass the same `id`
to the wrapped control and add `aria-describedby`, `aria-invalid`, `required`,
and `disabled` to that control when needed. The root wrapper does not receive the
`id`, which avoids duplicate DOM ids.

<!-- api-docgen:start web.FormFieldProps.FormField -->

| Prop                   | Type        | Required | Description                                         |
| ---------------------- | ----------- | -------- | --------------------------------------------------- |
| `id`                   | `string`    | No       | ID used to connect the label with the control.      |
| `label`                | `ReactNode` | No       | Field label.                                        |
| `description`          | `ReactNode` | No       | Additional descriptive content.                     |
| `error`                | `ReactNode` | No       | Error message or custom validation content.         |
| `children`             | `ReactNode` | Yes      | Field control or custom content.                    |
| `required`             | `boolean`   | No       | Marks the field as required.                        |
| `disabled`             | `boolean`   | No       | Renders the disabled field state.                   |
| `controlClassName`     | `string`    | No       | Extra CSS class for the control wrapper.            |
| `labelClassName`       | `string`    | No       | Extra CSS class for the label element.              |
| `descriptionClassName` | `string`    | No       | Extra CSS class for the description element.        |
| `errorClassName`       | `string`    | No       | Extra CSS class for the validation message element. |

<!-- api-docgen:end web.FormFieldProps.FormField -->

## RadioGroup

Single-selection group with controlled and uncontrolled modes.

```tsx
import { Radio, RadioGroup } from '@vellira-ui/react';

<RadioGroup
  name='plan'
  label='Plan'
  defaultValue='basic'
  orientation='vertical'
>
  <Radio value='basic' label='Basic' />
  <Radio value='pro' label='Pro' />
</RadioGroup>;
```

### RadioGroup Props

<!-- api-docgen:start web.RadioGroupProps.RadioGroupProps -->

| Prop            | Type                          | Required | Description                           |
| --------------- | ----------------------------- | -------- | ------------------------------------- |
| `label`         | `ReactNode`                   | No       | Group label.                          |
| `name`          | `string`                      | No       | Radio input name.                     |
| `children`      | `ReactNode`                   | No       | Radio controls rendered by the group. |
| `error`         | `string`                      | No       | Error message.                        |
| `orientation`   | `RadioGroupOrientation`       | No       | Layout direction.                     |
| `value`         | `string`                      | No       | Controlled selected value.            |
| `defaultValue`  | `string`                      | No       | Initial value for uncontrolled usage. |
| `onValueChange` | `(value: RadioValue) => void` | No       | Called when selection changes.        |
| `required`      | `boolean`                     | No       | Marks the group as required.          |
| `disabled`      | `boolean`                     | No       | Disables the whole group.             |
| `description`   | `ReactNode`                   | No       | Additional descriptive text.          |
| `size`          | `RadioSize`                   | No       | Size inherited by child radios.       |
| `color`         | `RadioColor`                  | No       | —                                     |

<!-- api-docgen:end web.RadioGroupProps.RadioGroupProps -->

### Radio Props

<!-- api-docgen:start web.RadioProps.RadioProps -->

| Prop               | Type                         | Required | Description                                           |
| ------------------ | ---------------------------- | -------- | ----------------------------------------------------- |
| `value`            | `string`                     | Yes      | Value submitted by the radio control.                 |
| `label`            | `ReactNode`                  | No       | Text label displayed next to the radio control.       |
| `description`      | `ReactNode`                  | No       | Additional supporting text displayed below the label. |
| `checked`          | `boolean`                    | No       | Current checked state for controlled usage.           |
| `defaultChecked`   | `boolean`                    | No       | Initial checked state for uncontrolled usage.         |
| `onCheckedChange`  | `(checked: boolean) => void` | No       | Called when the standalone checked state changes.     |
| `disabled`         | `boolean`                    | No       | Disables user interaction.                            |
| `required`         | `boolean`                    | No       | Marks the radio control as required.                  |
| `error`            | `string`                     | No       | Validation error message displayed under the radio.   |
| `size`             | `RadioSize`                  | No       | Radio control size.                                   |
| `wrapperClassName` | `string`                     | No       | Class name applied to the clickable label wrapper.    |
| `icon`             | `ReactNode`                  | No       | Icon rendered inside the component.                   |
| `color`            | `RadioColor`                 | No       | —                                                     |

<!-- api-docgen:end web.RadioProps.RadioProps -->

`RadioGroup color` sets the default selected color for child radios. Individual
`Radio` items can override it with their own `color`. Use `icon` on `Radio`
only when the default selected dot should be replaced by a product-specific
indicator.

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

### Select Usage Guidelines

Use `Select` when the user chooses one value from a compact list and the
available choices do not need to stay visible after selection. Use
`RadioGroup` when there are only a few choices and comparing them side by side
helps the decision. Use `Dropdown` for action menus such as copy, rename or
delete, not for form values.

### Select Accessibility Notes

Provide a visible `label` whenever possible. If the UI cannot show a label, pass
`aria-label` so the trigger has a stable accessible name. Error content is
connected to the trigger through `aria-describedby` and marks the trigger
invalid. Keyboard users can open the list with Enter, Space or Arrow keys,
navigate with ArrowUp/ArrowDown, jump with Home/End, type to search matching
options, select with Enter or Space, and close with Escape.

### Select Props

<!-- api-docgen:start web.SelectProps.SelectProps -->

| Prop                | Type                                                         | Required | Description                                      |
| ------------------- | ------------------------------------------------------------ | -------- | ------------------------------------------------ |
| `label`             | `ReactNode`                                                  | No       | Visible field label.                             |
| `id`                | `string`                                                     | No       | Trigger id.                                      |
| `name`              | `string`                                                     | No       | Field name.                                      |
| `options`           | `SelectOption[]`                                             | Yes      | Options rendered in the dropdown.                |
| `placeholder`       | `string`                                                     | No       | Text shown when no value is selected.            |
| `error`             | `ReactNode`                                                  | No       | Error message.                                   |
| `className`         | `string`                                                     | No       | Extra CSS class for the root element.            |
| `value`             | `string`                                                     | No       | Controlled selected value.                       |
| `defaultValue`      | `string`                                                     | No       | Initial selected value for uncontrolled usage.   |
| `onChange`          | `(value: string) => void`                                    | No       | Called when the user selects an option.          |
| `required`          | `boolean`                                                    | No       | Marks the field as required.                     |
| `disabled`          | `boolean`                                                    | No       | Disables interaction.                            |
| `description`       | `ReactNode`                                                  | No       | Additional descriptive text.                     |
| `placement`         | `'top-start' \| 'top-end' \| 'bottom-start' \| 'bottom-end'` | No       | Preferred dropdown placement.                    |
| `matchTriggerWidth` | `boolean`                                                    | No       | Matches the dropdown width to the trigger width. |
| `open`              | `boolean`                                                    | No       | Controlled open state.                           |
| `defaultOpen`       | `boolean`                                                    | No       | Initial uncontrolled open state.                 |
| `onOpenChange`      | `(open: boolean) => void`                                    | No       | Called when the open state changes.              |
| `triggerClassName`  | `string`                                                     | No       | Extra CSS class for the trigger element.         |
| `dropdownClassName` | `string`                                                     | No       | Extra CSS class for the dropdown element.        |
| `size`              | `SelectSize`                                                 | No       | Select size.                                     |
| `aria-label`        | `string`                                                     | No       | Accessible trigger label.                        |
| `noOptionsText`     | `ReactNode`                                                  | No       | Content shown when no options are available.     |
| `onBlur`            | `FocusEventHandler<HTMLButtonElement>`                       | No       | Called when the trigger loses focus.             |
| `onFocus`           | `FocusEventHandler<HTMLButtonElement>`                       | No       | Called when the trigger receives focus.          |

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
    { type: 'group', label: 'File' },
    { type: 'item', value: 'edit', label: 'Edit' },
    { type: 'separator' },
    { type: 'item', value: 'delete', label: 'Delete', danger: true },
  ]}
  onSelect={handleSelect}
/>;
```

### Dropdown Usage Guidelines

Use `Dropdown` for contextual actions such as copy, rename, archive, delete or
account commands. It reports the selected action through `onSelect`; it should
not be used as a form value control. Use `Select` when the user chooses one
saved value from a compact list. Use `RadioGroup` when there are only a few
choices and keeping them visible helps comparison.

The menu open state can be controlled with `open` and `onOpenChange`, or left
uncontrolled with `defaultOpen`. Prefer a visible text trigger; for icon-only or
non-text triggers, provide `ariaLabel` so the trigger and menu have a stable
accessible name.

### Dropdown Props

<!-- api-docgen:start web.DropdownProps.DropdownProps -->

| Prop                | Type                      | Required | Description                                                |
| ------------------- | ------------------------- | -------- | ---------------------------------------------------------- |
| `label`             | `ReactNode`               | No       | Default trigger label.                                     |
| `trigger`           | `ReactNode`               | No       | Custom trigger content.                                    |
| `icon`              | `ReactNode`               | No       | Icon rendered in the default trigger.                      |
| `arrowIcon`         | `ReactNode`               | No       | Custom arrow icon rendered in the trigger.                 |
| `items`             | `DropdownItem[]`          | Yes      | Menu model.                                                |
| `placement`         | `Placement`               | No       | Floating UI menu placement.                                |
| `className`         | `string`                  | No       | Extra CSS class for the root element.                      |
| `rotateAngle`       | `number`                  | No       | Rotation angle for the trigger arrow.                      |
| `matchTriggerWidth` | `boolean`                 | No       | Makes the menu match the trigger width.                    |
| `showArrow`         | `boolean`                 | No       | Controls whether the trigger arrow is rendered.            |
| `textWrap`          | `TextWrap`                | No       | Default text wrapping behavior for items.                  |
| `disabled`          | `boolean`                 | No       | Disables the trigger.                                      |
| `onSelect`          | `(value: string) => void` | No       | Called when a menu item is selected.                       |
| `ariaLabel`         | `string`                  | No       | Accessible trigger label for icon-only or custom triggers. |
| `triggerClassName`  | `string`                  | No       | Extra CSS class for the trigger element.                   |
| `contentClassName`  | `string`                  | No       | Extra CSS class for the menu content element.              |
| `itemClassName`     | `string`                  | No       | Extra CSS class applied to every menu item.                |
| `size`              | `DropdownSize`            | No       | Dropdown size.                                             |
| `open`              | `boolean`                 | No       | Controlled open state.                                     |
| `defaultOpen`       | `boolean`                 | No       | Initial uncontrolled open state.                           |
| `onOpenChange`      | `(open: boolean) => void` | No       | Called when the open state changes.                        |

<!-- api-docgen:end web.DropdownProps.DropdownProps -->

### Dropdown Items

| Shape               | Required Props           | Optional Props                                               | Description                                     |
| ------------------- | ------------------------ | ------------------------------------------------------------ | ----------------------------------------------- |
| `DropdownMenuItem`  | `value`, `label`         | `type`, `disabled`, `icon`, `danger`, `shortcut`, `textWrap` | Selectable action. `type` defaults to `'item'`. |
| `DropdownGroup`     | `type: 'group'`, `label` | None                                                         | Flat group heading for the following entries.   |
| `DropdownSeparator` | `type: 'separator'`      | None                                                         | Visual separator.                               |

`items` is a flat array. Use a `DropdownGroup` entry as a heading before the
items it labels; groups do not own nested `items`.

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
| `placement`    | `FloatingPlacement`       | No       | Preferred dropdown placement.          |
| `disabled`     | `boolean`                 | No       | Disables interaction.                  |
| `delay`        | `TooltipDelay`            | No       | —                                      |
| `onOpenChange` | `(open: boolean) => void` | No       | Called when the open state changes.    |

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
      <Button color='neutral' appearance='solid' onClick={closeModal}>
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
