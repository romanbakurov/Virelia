# Vellira Native Component API

API reference for `@romanbakurov/vellira-native`.

Import public components from the package root:

```tsx
import {
  Button,
  Input,
  Modal,
  Select,
  ThemeProvider,
  useTheme,
} from '@romanbakurov/vellira-native';
```

The native package uses React Native `StyleSheet` styles and consumes shared design tokens from `@romanbakurov/vellira-tokens`.

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

- Shared base contracts come from `@romanbakurov/vellira-types`.
- Native-only props such as `onPress`, `style`, `textStyle`, `ViewStyle`, and `TextStyle` stay in the native package.
- Text and icons that render React elements use `ReactNode`.
- Components that support both controlled and uncontrolled usage expose `value` or `checked` plus `defaultValue` or `defaultChecked`.
- `disabled` prevents user interaction where the component supports it.
- `error` is a display prop. Validation still belongs to the consuming app.

## Shared Types

| Type                | Values                                                                      |
| ------------------- | --------------------------------------------------------------------------- |
| `ButtonColor`       | `'primary'`, `'secondary'`, `'danger'`                                      |
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

Pressable action component with variants and sizes.

```tsx
import { Button } from '@romanbakurov/vellira-native';

<Button variant='primary' size='md' onPress={handleSave}>
  Save
</Button>;
```

<!-- api-docgen:start native.ButtonProps.Button -->

| Prop                 | Type                   | Required | Description                                           |
| -------------------- | ---------------------- | -------- | ----------------------------------------------------- |
| `children`           | `ReactNode`            | No       | Button content.                                       |
| `leftIcon`           | `ButtonIconElement`    | No       | Icon rendered before content.                         |
| `rightIcon`          | `ButtonIconElement`    | No       | Icon rendered after content.                          |
| `fullWidth`          | `boolean`              | No       | Makes the component fill its container width.         |
| `onPress`            | `() => void`           | No       | React Native press handler.                           |
| `style`              | `StyleProp<ViewStyle>` | No       | Extra root style.                                     |
| `accessibilityLabel` | `string`               | No       | Accessible label for screen readers.                  |
| `iconSize`           | `number`               | No       | Icon size in pixels.                                  |
| `variant`            | `ButtonColor`          | No       | Visual color variant.                                 |
| `size`               | `ControlSize`          | No       | Button size.                                          |
| `disabled`           | `boolean`              | No       | Disables interaction.                                 |
| `testID`             | `string`               | No       | Test identifier forwarded to the native root element. |

<!-- api-docgen:end native.ButtonProps.Button -->

## Checkbox

Boolean input with controlled and uncontrolled modes.

```tsx
import { Checkbox } from '@romanbakurov/vellira-native';

<Checkbox
  checked={accepted}
  onCheckedChange={setAccepted}
  label='Accept terms'
/>;
```

<!-- api-docgen:start native.CheckboxProps.Checkbox -->

| Prop              | Type                         | Required | Description                                           |
| ----------------- | ---------------------------- | -------- | ----------------------------------------------------- |
| `label`           | `string`                     | No       | Text label rendered next to the control.              |
| `style`           | `StyleProp<ViewStyle>`       | No       | Extra container style.                                |
| `error`           | `string`                     | No       | Error message rendered for invalid state.             |
| `checked`         | `boolean`                    | No       | Controlled checked state.                             |
| `defaultChecked`  | `boolean`                    | No       | Initial checked state for uncontrolled usage.         |
| `disabled`        | `boolean`                    | No       | Disables interaction.                                 |
| `onCheckedChange` | `(checked: boolean) => void` | No       | Called when the user changes the state.               |
| `testID`          | `string`                     | No       | Test identifier forwarded to the native root element. |

<!-- api-docgen:end native.CheckboxProps.Checkbox -->

## Input

Labeled native text input with shared value contract.

```tsx
import { Input } from '@romanbakurov/vellira-native';

<Input
  label='Email'
  value={email}
  onChange={setEmail}
  type='email'
  placeholder='name@example.com'
/>;
```

`Input` also accepts React Native `TextInputProps`, except `value`, `onChange`, `onChangeText`, and `editable`, which are controlled by the Vellira API.

<!-- api-docgen:start native.InputProps.Input -->

| Prop             | Type                      | Required | Description                                |
| ---------------- | ------------------------- | -------- | ------------------------------------------ |
| `label`          | `string`                  | Yes      | Visible label.                             |
| `placeholder`    | `string`                  | No       | Placeholder text.                          |
| `size`           | `ControlSize`             | No       | Input size.                                |
| `error`          | `string`                  | No       | Error message rendered under the input.    |
| `type`           | `InputType`               | No       | Semantic input type used by the component. |
| `containerStyle` | `StyleProp<ViewStyle>`    | No       | Extra style for the field container.       |
| `inputStyle`     | `StyleProp<TextStyle>`    | No       | Extra style for the input element.         |
| `value`          | `string`                  | Yes      | Controlled value.                          |
| `onChange`       | `(value: string) => void` | Yes      | Called with the next value.                |
| `disabled`       | `boolean`                 | No       | Disables the input.                        |
| `required`       | `boolean`                 | No       | Marks the field as required.               |
| `leftIcon`       | `InputIconElement`        | No       | Icon rendered before content.              |
| `iconSize`       | `number`                  | No       | Icon size in pixels.                       |

<!-- api-docgen:end native.InputProps.Input -->

## FormField

Layout helper for labels, errors, and custom field controls.

```tsx
import { FormField, Input } from '@romanbakurov/vellira-native';

<FormField label='Email' error={error}>
  <Input label='Email' value={email} onChange={setEmail} />
</FormField>;
```

<!-- api-docgen:start native.FormFieldProps.FormField -->

| Prop               | Type                   | Required | Description                                           |
| ------------------ | ---------------------- | -------- | ----------------------------------------------------- |
| `label`            | `string`               | No       | Field label.                                          |
| `error`            | `string`               | No       | Error message.                                        |
| `children`         | `ReactNode`            | Yes      | Field control or custom content.                      |
| `style`            | `StyleProp<ViewStyle>` | No       | Extra container style.                                |
| `labelStyle`       | `StyleProp<TextStyle>` | No       | Extra label text style.                               |
| `errorStyle`       | `StyleProp<TextStyle>` | No       | Extra error text style.                               |
| `required`         | `boolean`              | No       | Marks the field as required.                          |
| `disabled`         | `boolean`              | No       | Renders the disabled field state.                     |
| `description`      | `string`               | No       | Additional descriptive text.                          |
| `controlStyle`     | `StyleProp<ViewStyle>` | No       | —                                                     |
| `descriptionStyle` | `StyleProp<TextStyle>` | No       | —                                                     |
| `testID`           | `string`               | No       | Test identifier forwarded to the native root element. |

<!-- api-docgen:end native.FormFieldProps.FormField -->

## RadioGroup

Single-selection group with controlled and uncontrolled modes.

```tsx
import { RadioGroup } from '@romanbakurov/vellira-native';

<RadioGroup
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

<!-- api-docgen:start native.RadioGroupProps.RadioGroupProps -->

| Prop           | Type                      | Required | Description                                           |
| -------------- | ------------------------- | -------- | ----------------------------------------------------- |
| `label`        | `string`                  | No       | Group label.                                          |
| `options`      | `RadioOption[]`           | Yes      | Options rendered by the group.                        |
| `error`        | `string`                  | No       | Error message.                                        |
| `orientation`  | `Orientation`             | No       | Layout direction.                                     |
| `style`        | `StyleProp<ViewStyle>`    | No       | Extra group style.                                    |
| `optionStyle`  | `StyleProp<ViewStyle>`    | No       | Extra option style.                                   |
| `labelStyle`   | `StyleProp<TextStyle>`    | No       | Extra label text style.                               |
| `value`        | `string`                  | No       | Controlled selected value.                            |
| `defaultValue` | `string`                  | No       | Initial value for uncontrolled usage.                 |
| `onChange`     | `(value: string) => void` | No       | Called when selection changes.                        |
| `required`     | `boolean`                 | No       | Marks the group as required.                          |
| `disabled`     | `boolean`                 | No       | Disables the whole group.                             |
| `description`  | `string`                  | No       | Additional descriptive text.                          |
| `testID`       | `string`                  | No       | Test identifier forwarded to the native root element. |

<!-- api-docgen:end native.RadioGroupProps.RadioGroupProps -->

### RadioOption

<!-- api-docgen:start native.RadioOption.RadioOption -->

| Prop       | Type      | Required | Description           |
| ---------- | --------- | -------- | --------------------- |
| `label`    | `string`  | Yes      | Visible option label. |
| `value`    | `string`  | Yes      | Option value.         |
| `disabled` | `boolean` | No       | Disables this option. |

<!-- api-docgen:end native.RadioOption.RadioOption -->

## Select

Single-selection native dropdown field.

```tsx
import { Select } from '@romanbakurov/vellira-native';

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

<!-- api-docgen:start native.SelectProps.SelectProps -->

| Prop                 | Type                      | Required | Description                                           |
| -------------------- | ------------------------- | -------- | ----------------------------------------------------- |
| `label`              | `string`                  | No       | Visible field label.                                  |
| `options`            | `SelectOption[]`          | Yes      | Options rendered in the dropdown.                     |
| `placeholder`        | `string`                  | No       | Text shown when no value is selected.                 |
| `error`              | `string`                  | No       | Error message.                                        |
| `style`              | `StyleProp<ViewStyle>`    | No       | Extra container style.                                |
| `triggerStyle`       | `StyleProp<ViewStyle>`    | No       | Extra trigger style.                                  |
| `textStyle`          | `StyleProp<TextStyle>`    | No       | Extra text style.                                     |
| `value`              | `string`                  | No       | Controlled selected value.                            |
| `defaultValue`       | `string`                  | No       | Initial selected value for uncontrolled usage.        |
| `onChange`           | `(value: string) => void` | No       | Called when the user selects an option.               |
| `required`           | `boolean`                 | No       | Marks the field as required.                          |
| `disabled`           | `boolean`                 | No       | Disables interaction.                                 |
| `description`        | `string`                  | No       | Additional descriptive text.                          |
| `pickerStyle`        | `StyleProp<TextStyle>`    | No       | —                                                     |
| `accessibilityLabel` | `string`                  | No       | Accessible label for screen readers.                  |
| `size`               | `ControlSize`             | No       | —                                                     |
| `testID`             | `string`                  | No       | Test identifier forwarded to the native root element. |

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
import { Dropdown } from '@romanbakurov/vellira-native';

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

<!-- api-docgen:start native.DropdownProps.DropdownProps -->

| Prop           | Type                      | Required | Description                                           |
| -------------- | ------------------------- | -------- | ----------------------------------------------------- |
| `label`        | `string`                  | No       | Default trigger label.                                |
| `trigger`      | `ReactNode`               | No       | Custom trigger content.                               |
| `items`        | `DropdownItem[]`          | Yes      | Menu model.                                           |
| `style`        | `StyleProp<ViewStyle>`    | No       | Extra root style.                                     |
| `triggerStyle` | `StyleProp<ViewStyle>`    | No       | Extra trigger style.                                  |
| `itemStyle`    | `StyleProp<ViewStyle>`    | No       | Extra item style.                                     |
| `textStyle`    | `StyleProp<TextStyle>`    | No       | Extra text style.                                     |
| `disabled`     | `boolean`                 | No       | Disables the trigger.                                 |
| `onSelect`     | `(value: string) => void` | No       | Called when a menu item is selected.                  |
| `icon`         | `ReactNode`               | No       | Icon rendered inside the component.                   |
| `arrowIcon`    | `ReactNode`               | No       | Custom arrow icon rendered in the trigger.            |
| `showArrow`    | `boolean`                 | No       | Controls whether the trigger arrow is rendered.       |
| `textWrap`     | `TextWrap`                | No       | —                                                     |
| `testID`       | `string`                  | No       | Test identifier forwarded to the native root element. |

<!-- api-docgen:end native.DropdownProps.DropdownProps -->

### Dropdown Items

| Shape               | Required Props                    | Optional Props                                   | Description                                   |
| ------------------- | --------------------------------- | ------------------------------------------------ | --------------------------------------------- |
| `DropdownMenuItem`  | `value`, `label`                  | `type`, `disabled`, `icon`, `danger`, `textWrap` | Selectable item. `type` defaults to `'item'`. |
| `DropdownGroup`     | `type: 'group'`, `label`, `items` | None                                             | Labeled group of menu entries.                |
| `DropdownSeparator` | `type: 'separator'`               | None                                             | Visual separator.                             |

## Tabs

Compound tab navigation for native screens.

```tsx
import { Tabs } from '@romanbakurov/vellira-native';

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

| Prop                 | Type                      | Required | Description                                           |
| -------------------- | ------------------------- | -------- | ----------------------------------------------------- |
| `children`           | `ReactNode`               | Yes      | `Tabs.List`, `Tabs.Tab`, and `Tabs.Panel` content.    |
| `appearance`         | `TabsAppearance`          | No       | Visual style.                                         |
| `style`              | `StyleProp<ViewStyle>`    | No       | Extra root style.                                     |
| `activeIndex`        | `number`                  | No       | Currently active tab index.                           |
| `defaultActiveIndex` | `number`                  | No       | Initially active tab index.                           |
| `onChange`           | `(index: number) => void` | No       | Called when the value changes.                        |
| `orientation`        | `Orientation`             | No       | Layout orientation.                                   |
| `testID`             | `string`                  | No       | Test identifier forwarded to the native root element. |

<!-- api-docgen:end native.TabsProps.TabsProps -->

### Tabs.List Props

<!-- api-docgen:start native.TabsListProps.TabsListProps -->

| Prop       | Type                   | Required | Description                                           |
| ---------- | ---------------------- | -------- | ----------------------------------------------------- |
| `children` | `ReactNode`            | Yes      | Tab buttons.                                          |
| `style`    | `StyleProp<ViewStyle>` | No       | Extra list style.                                     |
| `testID`   | `string`               | No       | Test identifier forwarded to the native root element. |

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

| Prop       | Type                   | Required | Description                                           |
| ---------- | ---------------------- | -------- | ----------------------------------------------------- |
| `children` | `ReactNode`            | No       | Panel content.                                        |
| `style`    | `StyleProp<ViewStyle>` | No       | Extra panel style.                                    |
| `index`    | `number`               | Yes      | Panel index matching `Tabs.Tab`.                      |
| `testID`   | `string`               | No       | Test identifier forwarded to the native root element. |

<!-- api-docgen:end native.TabsPanelProps.TabsPanelProps -->

## Tooltip

Floating helper text around a native target.

```tsx
import { Tooltip, Button } from '@romanbakurov/vellira-native';

<Tooltip content='More actions' placement='top'>
  <Button>More</Button>
</Tooltip>;
```

<!-- api-docgen:start native.TooltipProps.Tooltip -->

| Prop           | Type                      | Required | Description                                           |
| -------------- | ------------------------- | -------- | ----------------------------------------------------- |
| `content`      | `ReactNode`               | Yes      | Tooltip content.                                      |
| `children`     | `ReactNode`               | Yes      | Trigger element.                                      |
| `maxWidth`     | `number`                  | No       | Maximum tooltip width.                                |
| `style`        | `StyleProp<ViewStyle>`    | No       | Extra root style.                                     |
| `textStyle`    | `StyleProp<TextStyle>`    | No       | Extra tooltip text style.                             |
| `placement`    | `FloatingPlacement`       | No       | Preferred tooltip placement.                          |
| `disabled`     | `boolean`                 | No       | Prevents the tooltip from opening.                    |
| `delay`        | `TooltipDelay`            | No       | Open and close delay in milliseconds.                 |
| `onOpenChange` | `(open: boolean) => void` | No       | —                                                     |
| `contentStyle` | `StyleProp<ViewStyle>`    | No       | Extra content style.                                  |
| `testID`       | `string`                  | No       | Test identifier forwarded to the native root element. |

<!-- api-docgen:end native.TooltipProps.Tooltip -->

## Modal

Native dialog with backdrop close behavior and compound content sections.

```tsx
import { Button, Modal } from '@romanbakurov/vellira-native';

<Modal isOpen={isOpen} onClose={closeModal}>
  <Modal.Content>
    <Modal.Header title='Delete file' />
    <Modal.Body>Are you sure you want to delete this file?</Modal.Body>
    <Modal.Footer>
      <Button variant='secondary' onPress={closeModal}>
        Cancel
      </Button>
    </Modal.Footer>
  </Modal.Content>
</Modal>;
```

### Modal Props

<!-- api-docgen:start native.ModalProps.ModalProps -->

| Prop              | Type                   | Required | Description                                           |
| ----------------- | ---------------------- | -------- | ----------------------------------------------------- |
| `children`        | `ReactNode`            | Yes      | Modal content.                                        |
| `overlayStyle`    | `StyleProp<ViewStyle>` | No       | Extra overlay style.                                  |
| `contentStyle`    | `StyleProp<ViewStyle>` | No       | Extra content style.                                  |
| `isOpen`          | `boolean`              | Yes      | Controls dialog visibility.                           |
| `onClose`         | `() => void`           | Yes      | Called when the modal requests to close.              |
| `closeOnBackdrop` | `boolean`              | No       | Allows closing by pressing the backdrop.              |
| `closeOnEsc`      | `boolean`              | No       | Shared contract prop. Useful for parity with web.     |
| `style`           | `StyleProp<ViewStyle>` | No       | Extra root style.                                     |
| `testID`          | `string`               | No       | Test identifier forwarded to the native root element. |

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
import { ThemeProvider } from '@romanbakurov/vellira-native';

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
import { useTheme } from '@romanbakurov/vellira-native';

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
