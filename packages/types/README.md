# @vellira-ui/types

Platform-agnostic component contracts for Vellira.

This package defines shared value, state, sizing, positioning, and component
contracts used by the React and React Native implementations.

It intentionally avoids React, DOM, CSS, and React Native-specific props.
Renderer packages extend these contracts with platform-specific fields such as
`children`, `className`, `style`, accessibility properties, and event handlers.

## Installation

```bash
pnpm add @vellira-ui/types
```

## Purpose

- Share stable contracts between web and native
- Keep component APIs aligned across renderers
- Centralize shared value and state types
- Avoid coupling shared definitions to React or a rendering platform

## Usage

```ts
import type { BaseCheckboxProps } from '@vellira-ui/types';

export interface CheckboxProps extends BaseCheckboxProps {
  label?: string;
}
```

Shared contracts cover component APIs including Button, Checkbox, FormField,
Modal, Popover, Radio, Select, Tabs, and Tooltip.

## Documentation

- [React](https://docs.vellira.dev/react/)
- [React Native](https://docs.vellira.dev/react-native/)

## Development

```bash
pnpm --filter @vellira-ui/types build
pnpm --filter @vellira-ui/types typecheck
```
