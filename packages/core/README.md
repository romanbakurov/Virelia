# @vellira-ui/core

Platform-neutral behavior contracts and utilities for Vellira.

This internal package contains shared behavior types and helper functions used
by `@vellira-ui/react` and `@vellira-ui/react-native`. Platform-specific hooks,
DOM behavior, CSS, accessibility handling, rendering, and native interactions
remain in the corresponding renderer packages.

## Installation

```bash
pnpm add @vellira-ui/core
```

## Responsibilities

- Focus behavior contracts and utilities
- Overlay behavior contracts
- Portal behavior contracts
- Shared event utilities
- Platform-neutral behavior types

## Package Structure

```text
src/
└── behavior/
    ├── focus/
    │   ├── focusUtils.ts
    │   └── types.ts
    ├── overlay/
    │   └── types.ts
    ├── portal/
    │   └── types.ts
    └── utils/
        ├── events.ts
        └── types.ts
```

## Usage

This package is primarily consumed internally by the Vellira renderer
packages.

Application code should normally import components and public APIs from:

- `@vellira-ui/react`
- `@vellira-ui/react-native`

## Documentation

- [React](https://docs.vellira.dev/react/)
- [React Native](https://docs.vellira.dev/react-native/)

## Development

```bash
pnpm --filter @vellira-ui/core build
pnpm --filter @vellira-ui/core typecheck
```
