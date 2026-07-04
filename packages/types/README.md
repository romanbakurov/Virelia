# @vellira-ui/types

Platform-agnostic base types for Vellira packages.

This package intentionally avoids React, DOM, CSS, and React Native-specific props. Platform packages extend these base contracts with renderer-specific fields such as `children`, `className`, `style`, accessibility ids, and event handlers.

## Purpose

- Share stable value/state contracts between web and native.
- Keep public component APIs aligned without coupling packages to one renderer.
- Avoid pulling `react` into shared type definitions.

## Usage

```ts
import type { BaseCheckboxProps } from '@vellira-ui/types';

export interface CheckboxProps extends BaseCheckboxProps {
  label?: string;
}
```

## Development

```bash
pnpm --filter @vellira-ui/types build
```
