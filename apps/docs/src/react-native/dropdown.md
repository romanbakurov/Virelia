---
title: React Native Dropdown
description: Build contextual native action menus with Vellira Dropdown using compound items, controlled open state, search, command mode, loading, and semantic colors.
---

# Dropdown

Dropdown presents contextual actions such as copy, rename, archive, delete, and account commands.

Do not use Dropdown as a saved form value control. Use Select for that purpose.

## Basic Usage

```tsx
import { Button, Dropdown } from '@vellira-ui/react-native';

<Dropdown label='Actions'>
  <Dropdown.Trigger>
    <Button>Actions</Button>
  </Dropdown.Trigger>

  <Dropdown.Content presentation='auto'>
    <Dropdown.Label>File</Dropdown.Label>
    <Dropdown.Item value='edit' onSelect={handleEdit}>
      Edit
    </Dropdown.Item>
    <Dropdown.Separator />
    <Dropdown.Item value='delete' color='danger' onSelect={handleDelete}>
      Delete
    </Dropdown.Item>
  </Dropdown.Content>
</Dropdown>;
```

## Controlled Open State

```tsx
<Dropdown open={open} onOpenChange={setOpen}>
  ...
</Dropdown>
```

Or initialize uncontrolled state:

```tsx
<Dropdown defaultOpen>...</Dropdown>
```

## Custom Trigger

```tsx
<Dropdown
  accessibilityLabel='Project actions'
  accessibilityHint='Opens a menu of project commands'
>
  <Dropdown.Trigger>
    <Button
      accessibilityLabel='Project actions'
      iconOnly
      iconStart={<MoreHorizontal />}
    />
  </Dropdown.Trigger>
  <Dropdown.Content>...</Dropdown.Content>
</Dropdown>
```

Prefer visible trigger text where practical.

## Presentation

```tsx
<Dropdown presentation='auto' />
<Dropdown presentation='sheet' />
<Dropdown presentation='modal' />
<Dropdown presentation='popover' />
```

## Search And Command Mode

```tsx
<Dropdown
  searchable
  command
  searchPlaceholder='Search commands'
  onSearch={setQuery}
  empty='No commands found'
>
  ...
</Dropdown>
```

Use controlled `searchValue` or uncontrolled `defaultSearchValue` when the app needs to retain the query.

## Loading

```tsx
<Dropdown loading loadingText='Loading actions...'>
  ...
</Dropdown>
```

## Selection Behavior

`closeOnSelect` controls whether the menu closes after an item runs. Keep it enabled for normal commands. Disable it only for workflows that intentionally apply multiple menu actions.

## Styling And Color

```tsx
<Dropdown
  color='primary'
  style={{ alignSelf: 'flex-start' }}
  triggerStyle={{ minWidth: 160 }}
  contentStyle={{ maxHeight: 360 }}
  itemStyle={{ minHeight: 44 }}
  textStyle={{ fontSize: 15 }}
>
  ...
</Dropdown>
```

The root color controls the semantic trigger and menu palette. Destructive items may override it with danger styling.

## Accessibility

- Use visible trigger text when possible.
- Provide `accessibilityLabel` for custom or icon-only triggers.
- Use `accessibilityHint` only when opening the menu is not obvious.
- Keep destructive commands clearly named.
- Confirm outside dismissal, focus return, and item announcements on real devices.

## See Also

- [Select](/react-native/select)
- [Button](/react-native/button)
- [Modal](/react-native/modal)
