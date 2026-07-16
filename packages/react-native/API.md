# Vellira Native Component API

API reference for `@vellira-ui/react-native`.

Import public components from the package root:

```tsx
import {
  Button,
  Checkbox,
  Input,
  Modal,
  Select,
  ThemeProvider,
  useTheme,
} from '@vellira-ui/react-native';
```

The native package uses React Native `StyleSheet` styles and consumes shared design tokens from `@vellira-ui/tokens`.

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
- Native-only props such as `onPress`, `style`, `textStyle`, `ViewStyle`, and `TextStyle` stay in the native package.
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

`TooltipDelay` uses this shape:

```ts
type TooltipDelay = {
  open?: number;
  close?: number;
};
```

## Button

Pressable action component with appearances, sizes, optional icons, loading state,
and full-width layout support.

```tsx
import { Search } from '@vellira-ui/icons';
import { Button } from '@vellira-ui/react-native';

<Button color='primary' appearance='solid' size='md' onPress={handleSave}>
  Save
</Button>;

<Button accessibilityLabel='Search' iconOnly iconStart={<Search />} />;
```

<!-- api-docgen:start native.ButtonProps.Button -->

| Prop                 | Type                                     | Required | Description                                                 |
| -------------------- | ---------------------------------------- | -------- | ----------------------------------------------------------- |
| `children`           | `ReactNode`                              | No       | Button content.                                             |
| `iconStart`          | `ButtonIconElement`                      | No       | Icon rendered before content.                               |
| `iconEnd`            | `ButtonIconElement`                      | No       | Icon rendered after content.                                |
| `fullWidth`          | `boolean`                                | No       | Makes the component fill its container width.               |
| `onPress`            | `(event: GestureResponderEvent) => void` | No       | React Native press handler.                                 |
| `style`              | `StyleProp<ViewStyle>`                   | No       | Extra root style.                                           |
| `accessibilityLabel` | `string`                                 | No       | Accessible label for screen readers.                        |
| `iconSize`           | `number`                                 | No       | Icon size in pixels.                                        |
| `size`               | `ButtonSize`                             | No       | Button size.                                                |
| `disabled`           | `boolean`                                | No       | Disables interaction.                                       |
| `textStyle`          | `StyleProp<TextStyle>`                   | No       | Extra text style.                                           |
| `testID`             | `string`                                 | No       | Test identifier.                                            |
| `color`              | `ButtonColor`                            | No       | Visual tone: primary, neutral, success, warning, or danger. |
| `loading`            | `boolean`                                | No       | Shows an activity indicator and disables interaction.       |
| `loadingText`        | `string`                                 | No       | Replaces visible content while loading.                     |
| `iconOnly`           | `boolean`                                | No       | Hides visible text for icon-only actions.                   |
| `badge`              | `ReactNode`                              | No       | Compact badge rendered after the label.                     |
| `shortcut`           | `ReactNode`                              | No       | Keyboard shortcut hint rendered after the label.            |
| `appearance`         | `ButtonAppearance`                       | No       | Visual style: solid, outline, ghost, soft, or link.         |
| `shape`              | `ButtonShape`                            | No       | Corner shape: square, rounded, or pill.                     |

<!-- api-docgen:end native.ButtonProps.Button -->

Icon-only buttons must provide `accessibilityLabel`. Icons should be Vellira icon
elements such as `<Search />`; Button injects the current icon `color` and
`size`. When `iconOnly` is enabled, visible `children` are not rendered; use
`accessibilityLabel` as the accessible action name.

## Checkbox

Boolean input with controlled and uncontrolled modes, helper text, validation
state, and mixed selection support.

```tsx
import { Checkbox } from '@vellira-ui/react-native';

<Checkbox
  checked={accepted}
  onCheckedChange={setAccepted}
  label='Accept terms'
  description='Required to continue.'
/>;
```

<!-- api-docgen:start native.CheckboxProps.Checkbox -->

| Prop                | Type                                                | Required | Description                                   |
| ------------------- | --------------------------------------------------- | -------- | --------------------------------------------- |
| `label`             | `string`                                            | No       | Visible label rendered next to the control.   |
| `description`       | `string`                                            | No       | Helper text rendered below the checkbox row.  |
| `style`             | `StyleProp<ViewStyle>`                              | No       | Extra style for the clickable wrapper.        |
| `error`             | `string`                                            | No       | Error message rendered for invalid state.     |
| `checked`           | `boolean`                                           | No       | Controlled checked state.                     |
| `defaultChecked`    | `boolean`                                           | No       | Initial checked state for uncontrolled usage. |
| `disabled`          | `boolean`                                           | No       | Disables interaction.                         |
| `required`          | `boolean`                                           | No       | Marks the checkbox as required.               |
| `indeterminate`     | `boolean`                                           | No       | Displays a mixed selection state.             |
| `size`              | `CheckboxSize`                                      | No       | Checkbox size.                                |
| `onCheckedChange`   | `(checked: boolean) => void`                        | No       | Called when the user changes the state.       |
| `icon`              | `ReactNode`                                         | No       | Icon rendered inside the component.           |
| `indeterminateIcon` | `ReactNode`                                         | No       | —                                             |
| `color`             | `import("@vellira-ui/types").CheckboxColor`         | No       | —                                             |
| `labelPosition`     | `import("@vellira-ui/types").CheckboxLabelPosition` | No       | —                                             |

<!-- api-docgen:end native.CheckboxProps.Checkbox -->

`style` applies to the clickable `Pressable` row. When no visible `label` is
rendered, provide `accessibilityLabel`; the icon-only touch target remains at
least 44px square. `description`, `error`, and any explicit
`accessibilityHint` are merged into the resolved accessibility hint so
settings-style rows remain useful without wrapping the checkbox in `FormField`.

## Input

Labeled native text input with shared value contract.

```tsx
import { Input } from '@vellira-ui/react-native';

<Input
  label='Email'
  value={email}
  onChange={setEmail}
  type='email'
  placeholder='name@example.com'
/>;
```

`Input` also accepts React Native `TextInputProps`, except `value`, `onChange`, `onChangeText`, and `editable`, which are controlled by the Vellira API.

Clearable inputs use separate callbacks for typing and clear actions:

- typing into the input calls `onChange`;
- pressing the clear action calls `onClear`;
- controlled inputs should clear their value inside `onClear`;
- uncontrolled inputs clear their internal value and then call `onClear`.

Native Input accessibility should be verified on real devices with VoiceOver and
TalkBack for focus visibility, read-only announcement and styling, and
description/error announcement behavior.

<!-- api-docgen:start native.InputProps.Input -->

| Prop              | Type                      | Required | Description                                      |
| ----------------- | ------------------------- | -------- | ------------------------------------------------ |
| `type`            | `InputType`               | No       | Semantic input type used by the component.       |
| `containerStyle`  | `StyleProp<ViewStyle>`    | No       | Extra style for the field container.             |
| `inputStyle`      | `StyleProp<TextStyle>`    | No       | Extra style for the input element.               |
| `value`           | `string`                  | No       | Controlled value.                                |
| `onChange`        | `(value: string) => void` | No       | Called with the next value.                      |
| `iconSize`        | `number`                  | No       | Icon size in pixels.                             |
| `clearIcon`       | `InputIconElement`        | No       | —                                                |
| `testID`          | `string`                  | No       | —                                                |
| `keyboardType`    | `KeyboardTypeOptions`     | No       | —                                                |
| `secureTextEntry` | `boolean`                 | No       | —                                                |
| `defaultValue`    | `string`                  | No       | Initial uncontrolled value.                      |
| `label`           | `string`                  | No       | Visible label.                                   |
| `placeholder`     | `string`                  | No       | Placeholder text.                                |
| `size`            | `InputSize`               | No       | Input size.                                      |
| `disabled`        | `boolean`                 | No       | Disables interaction.                            |
| `readOnly`        | `boolean`                 | No       | Marks the input as read-only.                    |
| `required`        | `boolean`                 | No       | Marks the field as required.                     |
| `clearable`       | `boolean`                 | No       | Shows a clear action when the input has a value. |
| `onClear`         | `() => void`              | No       | Called when the clear action is pressed.         |
| `error`           | `string`                  | No       | Error message rendered for invalid state.        |
| `description`     | `string`                  | No       | Additional descriptive text.                     |
| `clearIconTone`   | `InputAdornmentTone`      | No       | Color tone for the clear icon.                   |
| `leftIcon`        | `InputIconElement`        | No       | Icon rendered before content.                    |
| `rightIcon`       | `InputIconElement`        | No       | Icon rendered after content.                     |
| `leftIconTone`    | `InputAdornmentTone`      | No       | Color tone for the left icon.                    |
| `rightIconTone`   | `InputAdornmentTone`      | No       | Color tone for the right icon.                   |

<!-- api-docgen:end native.InputProps.Input -->

## FormField

Layout helper for labels, errors, and custom field controls.

```tsx
import { FormField } from '@vellira-ui/react-native';
import { TextInput } from 'react-native';

<FormField label='Email' error={error}>
  <TextInput accessibilityLabel='Email' value={email} onChangeText={setEmail} />
</FormField>;
```

`FormField` is a presentational wrapper. The wrapped control remains
responsible for its own `accessibilityLabel`, role, disabled/editable state, and
interaction behavior. Error text is announced with a polite live region, and the
root exposes disabled state when `disabled` is set.

<!-- api-docgen:start native.FormFieldProps.FormField -->

| Prop               | Type                   | Required | Description                       |
| ------------------ | ---------------------- | -------- | --------------------------------- |
| `label`            | `ReactNode`            | No       | Field label.                      |
| `error`            | `ReactNode`            | No       | Error message.                    |
| `children`         | `ReactNode`            | Yes      | Field control or custom content.  |
| `style`            | `StyleProp<ViewStyle>` | No       | Extra container style.            |
| `labelStyle`       | `StyleProp<TextStyle>` | No       | Extra label text style.           |
| `errorStyle`       | `StyleProp<TextStyle>` | No       | Extra error text style.           |
| `required`         | `boolean`              | No       | Marks the field as required.      |
| `disabled`         | `boolean`              | No       | Renders the disabled field state. |
| `description`      | `ReactNode`            | No       | Additional descriptive text.      |
| `controlStyle`     | `StyleProp<ViewStyle>` | No       | Extra control wrapper style.      |
| `descriptionStyle` | `StyleProp<TextStyle>` | No       | Extra description text style.     |

<!-- api-docgen:end native.FormFieldProps.FormField -->

## RadioGroup

Single-selection group with controlled and uncontrolled modes.

```tsx
import { Radio, RadioGroup } from '@vellira-ui/react-native';

<RadioGroup label='Plan' defaultValue='basic' orientation='vertical'>
  <Radio value='basic' label='Basic' />
  <Radio value='pro' label='Pro' />
</RadioGroup>;
```

### RadioGroup Props

<!-- api-docgen:start native.RadioGroupProps.RadioGroupProps -->

| Prop               | Type                          | Required | Description                           |
| ------------------ | ----------------------------- | -------- | ------------------------------------- |
| `label`            | `ReactNode`                   | No       | Group label.                          |
| `children`         | `ReactNode`                   | No       | Radio controls rendered by the group. |
| `error`            | `string`                      | No       | Error message.                        |
| `orientation`      | `RadioGroupOrientation`       | No       | Layout direction.                     |
| `style`            | `StyleProp<ViewStyle>`        | No       | Extra group style.                    |
| `itemsStyle`       | `StyleProp<ViewStyle>`        | No       | Extra items wrapper style.            |
| `labelStyle`       | `StyleProp<TextStyle>`        | No       | Extra label text style.               |
| `value`            | `string`                      | No       | Controlled selected value.            |
| `defaultValue`     | `string`                      | No       | Initial value for uncontrolled usage. |
| `onValueChange`    | `(value: RadioValue) => void` | No       | Called when selection changes.        |
| `required`         | `boolean`                     | No       | Marks the group as required.          |
| `disabled`         | `boolean`                     | No       | Disables the whole group.             |
| `description`      | `ReactNode`                   | No       | Additional descriptive text.          |
| `size`             | `RadioSize`                   | No       | Size inherited by child radios.       |
| `descriptionStyle` | `StyleProp<TextStyle>`        | No       | —                                     |
| `errorStyle`       | `StyleProp<TextStyle>`        | No       | —                                     |
| `color`            | `RadioColor`                  | No       | —                                     |

<!-- api-docgen:end native.RadioGroupProps.RadioGroupProps -->

### Radio Props

<!-- api-docgen:start native.RadioProps.RadioProps -->

| Prop               | Type                         | Required | Description                                            |
| ------------------ | ---------------------------- | -------- | ------------------------------------------------------ |
| `value`            | `string`                     | Yes      | Value represented by the radio control.                |
| `label`            | `ReactNode`                  | No       | Visible label displayed next to the radio control.     |
| `description`      | `ReactNode`                  | No       | Supporting text displayed below the label.             |
| `checked`          | `boolean`                    | No       | Current checked state for controlled usage.            |
| `defaultChecked`   | `boolean`                    | No       | Initial checked state for uncontrolled usage.          |
| `onCheckedChange`  | `(checked: boolean) => void` | No       | Called when the checked state changes.                 |
| `disabled`         | `boolean`                    | No       | Disables interaction with the radio control.           |
| `required`         | `boolean`                    | No       | Marks the radio control as required for accessibility. |
| `error`            | `string`                     | No       | Validation error displayed below the radio control.    |
| `size`             | `RadioSize`                  | No       | Radio control size.                                    |
| `containerStyle`   | `StyleProp<ViewStyle>`       | No       | Extra root container style.                            |
| `labelStyle`       | `StyleProp<TextStyle>`       | No       | Extra label text style.                                |
| `descriptionStyle` | `StyleProp<TextStyle>`       | No       | Extra description text style.                          |
| `errorStyle`       | `StyleProp<TextStyle>`       | No       | Extra error text style.                                |
| `icon`             | `ReactNode`                  | No       | Icon rendered inside the component.                    |
| `color`            | `RadioColor`                 | No       | —                                                      |

<!-- api-docgen:end native.RadioProps.RadioProps -->

`RadioGroup color` sets the default selected color for child radios. Individual
`Radio` items can override it with their own `color`. Use `icon` on `Radio`
only when the default selected dot should be replaced by a product-specific
indicator.

## Select

Single-selection native dropdown field.

```tsx
import { Select } from '@vellira-ui/react-native';

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
choices can live in a picker sheet. Use `RadioGroup` when there are only a few
choices and keeping them visible helps comparison. Use `Dropdown` for action
menus, not for form values.

### Select Native Behavior

Native `Select` opens a picker sheet. Changing the picker updates a draft value
only. The selected value is committed through `Done`; `Cancel` and the backdrop
close the sheet without changing the current value.

### Select Accessibility Notes

Provide a visible `label` whenever possible. If the UI cannot show a label, pass
`accessibilityLabel`. Required and invalid states are reflected on the trigger,
and error text is announced through the field error region. Use
`accessibilityHint` when the surrounding screen needs more guidance than the
default picker hint.

### Select Props

<!-- api-docgen:start native.SelectProps.SelectProps -->

| Prop                 | Type                      | Required | Description                                       |
| -------------------- | ------------------------- | -------- | ------------------------------------------------- |
| `label`              | `string`                  | No       | Visible field label.                              |
| `options`            | `SelectOption[]`          | Yes      | Options rendered in the dropdown.                 |
| `placeholder`        | `string`                  | No       | Text shown when no value is selected.             |
| `error`              | `ReactNode`               | No       | Error message.                                    |
| `style`              | `StyleProp<ViewStyle>`    | No       | Extra container style.                            |
| `triggerStyle`       | `StyleProp<ViewStyle>`    | No       | Extra trigger style.                              |
| `textStyle`          | `StyleProp<TextStyle>`    | No       | Extra text style.                                 |
| `value`              | `string`                  | No       | Controlled selected value.                        |
| `defaultValue`       | `string`                  | No       | Initial selected value for uncontrolled usage.    |
| `onChange`           | `(value: string) => void` | No       | Called when the user selects an option.           |
| `required`           | `boolean`                 | No       | Marks the field as required.                      |
| `disabled`           | `boolean`                 | No       | Disables interaction.                             |
| `description`        | `string`                  | No       | Additional descriptive text.                      |
| `pickerStyle`        | `StyleProp<ViewStyle>`    | No       | Extra picker style.                               |
| `accessibilityLabel` | `string`                  | No       | Accessible label for screen readers.              |
| `size`               | `SelectSize`              | No       | Select size.                                      |
| `accessibilityHint`  | `string`                  | No       | Additional accessibility hint for screen readers. |

<!-- api-docgen:end native.SelectProps.SelectProps -->

### SelectOption

<!-- api-docgen:start native.SelectOption.SelectOption -->

| Prop       | Type      | Required | Description           |
| ---------- | --------- | -------- | --------------------- |
| `label`    | `string`  | Yes      | Visible option label. |
| `value`    | `string`  | Yes      | Option value.         |
| `disabled` | `boolean` | No       | Disables this option. |

<!-- api-docgen:end native.SelectOption.SelectOption -->

## Dropdown

Native menu component with item, group, and separator entries.

```tsx
import { Dropdown } from '@vellira-ui/react-native';

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
custom non-text triggers, provide `accessibilityLabel` and add
`accessibilityHint` when the surrounding screen needs extra guidance.

### Dropdown Props

<!-- api-docgen:start native.DropdownProps.DropdownProps -->

| Prop                 | Type                      | Required | Description                                       |
| -------------------- | ------------------------- | -------- | ------------------------------------------------- |
| `label`              | `ReactNode`               | No       | Default trigger label.                            |
| `trigger`            | `ReactNode`               | No       | Custom trigger content.                           |
| `items`              | `DropdownItem[]`          | Yes      | Menu model.                                       |
| `style`              | `StyleProp<ViewStyle>`    | No       | Extra root style.                                 |
| `triggerStyle`       | `StyleProp<ViewStyle>`    | No       | Extra trigger style.                              |
| `itemStyle`          | `StyleProp<ViewStyle>`    | No       | Extra item style.                                 |
| `textStyle`          | `StyleProp<TextStyle>`    | No       | Extra text style.                                 |
| `disabled`           | `boolean`                 | No       | Disables the trigger.                             |
| `onSelect`           | `(value: string) => void` | No       | Called when a menu item is selected.              |
| `icon`               | `ReactNode`               | No       | Icon rendered inside the component.               |
| `arrowIcon`          | `ReactNode`               | No       | Custom arrow icon rendered in the trigger.        |
| `showArrow`          | `boolean`                 | No       | Controls whether the trigger arrow is rendered.   |
| `contentStyle`       | `StyleProp<ViewStyle>`    | No       | Extra content style.                              |
| `accessibilityLabel` | `string`                  | No       | Accessible label for screen readers.              |
| `accessibilityHint`  | `string`                  | No       | Additional accessibility hint for screen readers. |
| `size`               | `DropdownSize`            | No       | Dropdown size.                                    |
| `open`               | `boolean`                 | No       | Controlled open state.                            |
| `defaultOpen`        | `boolean`                 | No       | Initial uncontrolled open state.                  |
| `onOpenChange`       | `(open: boolean) => void` | No       | Called when the open state changes.               |

<!-- api-docgen:end native.DropdownProps.DropdownProps -->

### Dropdown Items

| Shape               | Required Props           | Optional Props                                   | Description                                     |
| ------------------- | ------------------------ | ------------------------------------------------ | ----------------------------------------------- |
| `DropdownMenuItem`  | `value`, `label`         | `type`, `disabled`, `icon`, `danger`, `textWrap` | Selectable action. `type` defaults to `'item'`. |
| `DropdownGroup`     | `type: 'group'`, `label` | None                                             | Flat group heading for the following entries.   |
| `DropdownSeparator` | `type: 'separator'`      | None                                             | Visual separator.                               |

`items` is a flat array. Use a `DropdownGroup` entry as a heading before the
items it labels; groups do not own nested `items`.

## Tabs

Compound tab navigation for native screens.

```tsx
import { Tabs } from '@vellira-ui/react-native';

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

<!-- api-docgen:start native.TabsProps.TabsProps -->

| Prop                 | Type                      | Required | Description                                        |
| -------------------- | ------------------------- | -------- | -------------------------------------------------- |
| `children`           | `ReactNode`               | Yes      | `Tabs.List`, `Tabs.Tab`, and `Tabs.Panel` content. |
| `appearance`         | `TabsAppearance`          | No       | Visual style.                                      |
| `style`              | `StyleProp<ViewStyle>`    | No       | Extra root style.                                  |
| `activeIndex`        | `number`                  | No       | Currently active tab index.                        |
| `defaultActiveIndex` | `number`                  | No       | Initially active tab index.                        |
| `onChange`           | `(index: number) => void` | No       | Called when the value changes.                     |
| `orientation`        | `Orientation`             | No       | Layout orientation.                                |

<!-- api-docgen:end native.TabsProps.TabsProps -->

### Tabs.List Props

<!-- api-docgen:start native.TabsListProps.TabsListProps -->

| Prop       | Type                   | Required | Description       |
| ---------- | ---------------------- | -------- | ----------------- |
| `children` | `ReactNode`            | Yes      | Tab buttons.      |
| `style`    | `StyleProp<ViewStyle>` | No       | Extra list style. |

<!-- api-docgen:end native.TabsListProps.TabsListProps -->

### Tabs.Tab Props

<!-- api-docgen:start native.TabProps.TabsTabProps -->

| Prop        | Type                   | Required | Description                                  |
| ----------- | ---------------------- | -------- | -------------------------------------------- |
| `children`  | `ReactNode`            | No       | Tab label.                                   |
| `icon`      | `ReactNode`            | No       | Icon rendered inside the tab.                |
| `style`     | `StyleProp<ViewStyle>` | No       | Extra tab style.                             |
| `textStyle` | `StyleProp<TextStyle>` | No       | Extra label text style.                      |
| `index`     | `number`               | Yes      | Tab index used to connect the tab and panel. |
| `disabled`  | `boolean`              | No       | Disables this tab.                           |

<!-- api-docgen:end native.TabProps.TabsTabProps -->

### Tabs.Panel Props

<!-- api-docgen:start native.TabsPanelProps.TabsPanelProps -->

| Prop       | Type                   | Required | Description                      |
| ---------- | ---------------------- | -------- | -------------------------------- |
| `children` | `ReactNode`            | No       | Panel content.                   |
| `style`    | `StyleProp<ViewStyle>` | No       | Extra panel style.               |
| `index`    | `number`               | Yes      | Panel index matching `Tabs.Tab`. |

<!-- api-docgen:end native.TabsPanelProps.TabsPanelProps -->

## Tooltip

Floating helper text around a native target.

```tsx
import { Tooltip, Button } from '@vellira-ui/react-native';

<Tooltip content='More actions' placement='top'>
  <Button>More</Button>
</Tooltip>;
```

<!-- api-docgen:start native.TooltipProps.Tooltip -->

| Prop           | Type                      | Required | Description                           |
| -------------- | ------------------------- | -------- | ------------------------------------- |
| `content`      | `ReactNode`               | Yes      | Tooltip content.                      |
| `children`     | `ReactNode`               | Yes      | Trigger element.                      |
| `maxWidth`     | `number`                  | No       | Maximum tooltip width.                |
| `style`        | `StyleProp<ViewStyle>`    | No       | Extra root style.                     |
| `textStyle`    | `StyleProp<TextStyle>`    | No       | Extra tooltip text style.             |
| `placement`    | `FloatingPlacement`       | No       | Preferred tooltip placement.          |
| `disabled`     | `boolean`                 | No       | Prevents the tooltip from opening.    |
| `delay`        | `TooltipDelay`            | No       | Open and close delay in milliseconds. |
| `onOpenChange` | `(open: boolean) => void` | No       | Called when the open state changes.   |
| `contentStyle` | `StyleProp<ViewStyle>`    | No       | Extra content style.                  |

<!-- api-docgen:end native.TooltipProps.Tooltip -->

## Modal

Native dialog with backdrop close behavior and compound content sections.

```tsx
import { Button, Modal } from '@vellira-ui/react-native';

<Modal isOpen={isOpen} onClose={closeModal}>
  <Modal.Content>
    <Modal.Header title='Delete file' />
    <Modal.Body>Are you sure you want to delete this file?</Modal.Body>
    <Modal.Footer>
      <Button color='neutral' appearance='solid' onPress={closeModal}>
        Cancel
      </Button>
    </Modal.Footer>
  </Modal.Content>
</Modal>;
```

### Modal Props

<!-- api-docgen:start native.ModalProps.ModalProps -->

| Prop              | Type                   | Required | Description                                       |
| ----------------- | ---------------------- | -------- | ------------------------------------------------- |
| `children`        | `ReactNode`            | Yes      | Modal content.                                    |
| `overlayStyle`    | `StyleProp<ViewStyle>` | No       | Extra overlay style.                              |
| `contentStyle`    | `StyleProp<ViewStyle>` | No       | Extra content style.                              |
| `isOpen`          | `boolean`              | Yes      | Controls dialog visibility.                       |
| `onClose`         | `() => void`           | Yes      | Called when the modal requests to close.          |
| `closeOnBackdrop` | `boolean`              | No       | Allows closing by pressing the backdrop.          |
| `closeOnEsc`      | `boolean`              | No       | Shared contract prop. Useful for parity with web. |
| `closeOnClick`    | `boolean`              | No       | Deprecated alias kept for compatibility.          |

<!-- api-docgen:end native.ModalProps.ModalProps -->

### Modal Compound Components

| Component       | Props                                                                                  | Description            |
| --------------- | -------------------------------------------------------------------------------------- | ---------------------- |
| `Modal.Content` | `children?: ReactNode`, `style?: ViewStyle`                                            | Main dialog surface.   |
| `Modal.Header`  | `children?: ReactNode`, `title?: string`, `style?: ViewStyle`, `textStyle?: TextStyle` | Header/title section.  |
| `Modal.Body`    | `children?: ReactNode`, `style?: ViewStyle`                                            | Body section.          |
| `Modal.Footer`  | `children?: ReactNode`, `style?: ViewStyle`                                            | Action/footer section. |

### Modal Accessibility

Provide a clear title and body copy for screen reader users. The native implementation exposes modal structure and close behavior, while the consuming app remains responsible for meaningful labels and actions.

## ThemeProvider

Provides theme context for native components.

```tsx
import { ThemeProvider } from '@vellira-ui/react-native';

<ThemeProvider defaultTheme='dark'>
  <App />
</ThemeProvider>;
```

### ThemeProvider Props

<!-- api-docgen:start native.ThemeProviderProps.ThemeProvider -->

<!-- api-docgen:start native.ThemeProviderProps.ThemeProviderProps -->

| Prop            | Type                                  | Required | Description                               |
| --------------- | ------------------------------------- | -------- | ----------------------------------------- |
| `children`      | `ReactNode`                           | Yes      | Content wrapped by the provider.          |
| `theme`         | `'light' \| 'dark' \| 'highContrast'` | No       | Controlled theme value.                   |
| `defaultTheme`  | `'light' \| 'dark' \| 'highContrast'` | No       | Initial theme for uncontrolled usage.     |
| `onThemeChange` | `(theme: NativeThemeName) => void`    | No       | Called whenever the active theme changes. |

<!-- api-docgen:end native.ThemeProviderProps.ThemeProviderProps -->
<!-- api-docgen:end native.ThemeProviderProps.ThemeProvider -->

### Supported Themes

| Theme          | Description                 |
| -------------- | --------------------------- |
| `light`        | Default light theme.        |
| `dark`         | Dark theme.                 |
| `highContrast` | High contrast native theme. |

## useTheme

Returns the current native theme, current theme name, and a function to update it.

```tsx
import { useTheme } from '@vellira-ui/react-native';

function ThemeReader() {
  const { themeName, theme, setTheme } = useTheme();

  return null;
}
```

### Returns

| Property    | Type                               | Description                |
| ----------- | ---------------------------------- | -------------------------- |
| `themeName` | `NativeThemeName`                  | Current active theme name. |
| `theme`     | `NativeTheme`                      | Current token object.      |
| `setTheme`  | `(theme: NativeThemeName) => void` | Updates the active theme.  |
