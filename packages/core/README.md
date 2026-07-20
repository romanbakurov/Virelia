# @vellira-ui/core

Shared interaction and state logic for Vellira.

This package contains hooks that can be reused by web and native packages when the behavior is platform-neutral.

## Exports

- `useControllableState`
- `useKeyboardNavigation`
- `useTabsKeyboard`
- `useOverlayStack`
- `useOverlayDismiss`
- `useScrollLock`
- `useAriaIsolation`
- `useFocusScope`
- `usePortal`

Behavior hooks live under `src/behavior` internally and are exported from the package root when they are platform-neutral.

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
