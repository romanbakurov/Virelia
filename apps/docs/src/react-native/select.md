---
title: React Native Select
description: Build native single and multiple selection fields with sheets, modals, popovers, search, groups, virtualization, validation, and accessible triggers.
---

# Select

Select lets users choose one or more saved values from a compact list presented as a native sheet, modal, or popover.

## When To Use

Use Select when options are known but do not need to remain visible. Use RadioGroup for a few visible choices and Dropdown for contextual commands.

## Basic Usage

```tsx
import { Select } from '@vellira-ui/react-native';

<Select
  label='Country'
  value={country}
  onValueChange={(nextCountry) => setCountry(nextCountry)}
  placeholder='Choose country'
  searchable
  clearable
>
  <Select.Item value='fr' label='France' />
  <Select.Item value='us' label='United States' />
</Select>;
```

## Presentation

```tsx
<Select presentation='auto' />
<Select presentation='sheet' />
<Select presentation='modal' />
<Select presentation='popover' />
```

`auto` uses a bottom sheet on small screens and an anchored popover on wider screens.

## Compound API

```tsx
<Select label='Country' placeholder='Choose country'>
  <Select.Trigger />
  <Select.Content>
    <Select.Search placeholder='Search country...' />
    <Select.Group label='Europe'>
      <Select.Item value='fr' label='France' description='Paris' badge='EU' />
      <Select.Item value='de' label='Germany' description='Berlin' badge='EU' />
    </Select.Group>
    <Select.Separator />
    <Select.Empty>No countries found</Select.Empty>
    <Select.Loading>Searching...</Select.Loading>
  </Select.Content>
</Select>
```

## Multiple Selection

```tsx
<Select
  label='Teams'
  multiple
  maxSelected={10}
  closeOnSelect={false}
  defaultValue={['product', 'engineering']}
>
  <Select.Group label='Core teams' selectable selectLabel='All core'>
    <Select.Item value='product' label='Product' />
    <Select.Item value='engineering' label='Engineering' />
    <Select.Item value='design' label='Design' />
  </Select.Group>
</Select>
```

Selectable group actions respect disabled options and `maxSelected`.

## Options Array

```tsx
<Select
  label='Role'
  options={[
    { value: 'admin', label: 'Admin' },
    { value: 'editor', label: 'Editor' },
    { value: 'viewer', label: 'Viewer', disabled: true },
  ]}
/>
```

## Async Search

```tsx
<Select
  label='Customer'
  searchable
  onSearch={searchCustomers}
  filterOptions={false}
  loading={isSearching}
  loadingText='Searching customers...'
  empty='No customers found'
/>
```

When `onSearch` is provided, built-in local filtering defaults to off.

## Virtualization

Options render through FlatList. Use `virtual` for large collections.

```tsx
<Select
  virtual={{
    initialNumToRender: 20,
    windowSize: 7,
  }}
/>
```

## Custom Rendering

Use `renderValue` for the trigger and `renderOption` for option rows when the built-in structure is insufficient.

## Validation

```tsx
<Select
  label='Country'
  required
  invalid={Boolean(error)}
  error={error}
  accessibilityHint='Opens a list of supported countries'
/>
```

## Accessibility

- Prefer a visible label.
- Use `accessibilityLabel` when the field cannot display one.
- Required and invalid states are reflected on the trigger.
- Error content is announced through the field error region.
- Add `accessibilityHint` only when the default list behavior needs more context.
- Verify sheet, modal, and popover flows with VoiceOver and TalkBack.

## See Also

- [RadioGroup](/react-native/radio-group)
- [Dropdown](/react-native/dropdown)
