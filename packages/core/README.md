# @vellira-ui/core

Shared interaction and state logic for Vellira.

This package contains hooks that can be reused by web and native packages when the behavior is platform-neutral.

## Exports

- `useControllableState`
- `useKeyboardNavigation`
- `useTabsKeyboard`

Internal or experimental hooks are not exported from the package root until they are part of the supported public API.

## Usage

```ts
import { useControllableState } from '@vellira-ui/core';

const [value, setValue] = useControllableState({
  value,
  defaultValue: '',
  onChange,
});
```

## Development

```bash
pnpm --filter @vellira-ui/core build
pnpm --filter @vellira-ui/core typecheck
```
