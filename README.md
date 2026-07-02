# Vellira

TypeScript-first design system monorepo for React and React Native.

Vellira provides a unified component ecosystem built around shared design tokens, reusable interaction logic, renderer-neutral base types, and platform-specific implementations for Web and React Native.

The project focuses on:

- Cross-platform consistency
- Accessibility-first components
- Strong TypeScript support
- Stable public APIs
- Automated quality assurance
- Production-ready release automation

![React](https://img.shields.io/badge/React-19.2.3-blue)
![React Native](https://img.shields.io/badge/React%20Native-0.85.3-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x%20%2F%206.x-blue)
![Storybook](https://img.shields.io/badge/Storybook-10.4-ff4785)
![License](https://img.shields.io/github/license/romanbakurov/Vellira)

---

# Links

- [Storybook Demo](https://main--6a07269cf7126a71ef2f62ca.chromatic.com)
- [Chromatic Library](https://www.chromatic.com/library?appId=6a07269cf7126a71ef2f62ca&branch=main)
- [GitHub Repository](https://github.com/romanbakurov/Vellira)

---

# Documentation

Project documentation:

- [Contributing Guide](./CONTRIBUTING.md)
- [Component Conventions](./docs/COMPONENT_CONVENTIONS.md)
- [Package Conventions](./docs/PACKAGE_CONVENTIONS.md)
- [Web Component API](./packages/vellira-web/API.md)
- [Native Component API](./packages/vellira-native/API.md)
- [Changelog](./CHANGELOG.md)

---

# Packages

| Package                        | Purpose                               |
| ------------------------------ | ------------------------------------- |
| `@romanbakurov/vellira-web`    | React web component library           |
| `@romanbakurov/vellira-native` | React Native component library        |
| `@romanbakurov/vellira-core`   | Shared hooks and interaction logic    |
| `@romanbakurov/vellira-types`  | Renderer-neutral TypeScript contracts |
| `@romanbakurov/vellira-icons`  | Shared icon library                   |
| `@romanbakurov/vellira-tokens` | Design tokens and theme               |
| `@romanbakurov/vellira-assets` | Shared fonts and static assets        |

---

# Apps

| App                      | Purpose               |
| ------------------------ | --------------------- |
| `apps/web-storybook`     | Web Storybook         |
| `apps/native-playground` | Expo playground       |
| `apps/native-storybook`  | on-device Storybook   |
| `apps/web-playground`          | Local Vite playground |

---

# Architecture

```text
apps/
├── web-storybook
├── native-playground
├── native-storybook
└── web-playground

packages/
├── vellira-web
├── vellira-native
├── vellira-core
├── vellira-types
├── vellira-icons
├── vellira-tokens
└── vellira-assets
```

Each package has a single responsibility.

- **tokens** provide colors, spacing, typography, shadows, radius, z-index and theme.
- **types** define renderer-neutral public contracts.
- **core** contains reusable runtime logic and hooks.
- **icons** provides shared icon components.
- **assets** provides shared fonts and static assets.
- **web** contains DOM-specific implementations.
- **native** contains React Native implementations.

The architecture intentionally keeps rendering code separate while sharing behavior and APIs whenever possible.

---

# Component Support

| Component  | Web | Native | Tests | Stories |
| ---------- | --- | ------ | ----- | ------- |
| Button     | ✅  | ✅     | ✅    | ✅      |
| Checkbox   | ✅  | ✅     | ✅    | ✅      |
| Input      | ✅  | ✅     | ✅    | ✅      |
| FormField  | ✅  | ✅     | ✅    | ✅      |
| RadioGroup | ✅  | ✅     | ✅    | ✅      |
| Select     | ✅  | ✅     | ✅    | ✅      |
| Dropdown   | ✅  | ✅     | ✅    | ✅      |
| Tabs       | ✅  | ✅     | ✅    | ✅      |
| Tooltip    | ✅  | ✅     | ✅    | ✅      |
| Modal      | ✅  | ✅     | ✅    | ✅      |

All components share the same design language while providing platform-specific rendering and behavior.

---

# Installation

Packages are published under the `@romanbakurov` scope.

Configure GitHub Packages if required:

```bash
@romanbakurov:registry=https://npm.pkg.github.com
```

Install the packages you need:

```bash
pnpm add @romanbakurov/vellira-web
pnpm add @romanbakurov/vellira-native
pnpm add @romanbakurov/vellira-icons
pnpm add @romanbakurov/vellira-tokens
pnpm add @romanbakurov/vellira-assets
```

---

# Web Example

```tsx
import '@romanbakurov/vellira-web/styles';

import { Button, Checkbox, Input } from '@romanbakurov/vellira-web';
import { useState } from 'react';

export default function App() {
  const [email, setEmail] = useState('');

  return (
    <>
      <Input
        label='Email'
        value={email}
        onChange={setEmail}
        placeholder='name@example.com'
      />

      <Checkbox label='Accept terms' defaultChecked />

      <Button variant='primary' size='md'>
        Submit
      </Button>
    </>
  );
}
```

---

# React Native Example

```tsx
import { Button, Checkbox, Input } from '@romanbakurov/vellira-native';
import { View } from 'react-native';
import { useState } from 'react';

export default function App() {
  const [email, setEmail] = useState('');

  return (
    <View
      style={{
        padding: 24,
        gap: 16,
      }}
    >
      <Input
        label='Email'
        value={email}
        onChange={setEmail}
        placeholder='name@example.com'
      />

      <Checkbox label='Accept terms' />

      <Button variant='primary' size='md'>
        Continue
      </Button>
    </View>
  );
}
```

---

# Design Tokens

Vellira exposes a shared `theme` object through
`@romanbakurov/vellira-tokens`.

```ts
import { darkTheme, lightTheme, theme } from '@romanbakurov/vellira-tokens';

theme.semantic.surface.default;
theme.semantic.text.primary;
theme.components.button.primary.default.bg;

theme.tokens.spacing[4];
theme.tokens.radius.md;
theme.tokens.typography.family.regular;
theme.tokens.typography.size.md;

lightTheme.name;
darkTheme.semantic.focus.ring;
```

Tokens are available as:

- TypeScript objects
- generated CSS variables
- React Native theme values

The same tokens are consumed by both renderer packages.

---

# Shared Core

`@romanbakurov/vellira-core` contains reusable interaction logic shared by both renderers.

Current public hooks include:

- `useControllableState`
- `useKeyboardNavigation`
- `useTabsKeyboard`

The core package intentionally contains no renderer-specific code and can be shared across Web and React Native implementations.

---

# Development

Install dependencies:

```bash
pnpm install
```

---

## Run Storybook

Start the web Storybook:

```bash
pnpm --filter @vellira/web-storybook dev
```

Run the native playground:

```bash
pnpm --filter native-playground start
```

Run the native Storybook:

```bash
pnpm --filter native-storybook ios
pnpm --filter native-storybook android
```

---

## Local Playground

Run the local Vite playground:

```bash
pnpm --filter web-playground dev
```

---

## Development Workflow

Typical workflow:

1. Create a feature branch.
2. Implement your changes.
3. Run the complete quality pipeline.
4. Open a Pull Request.
5. Merge into `main`.
6. Semantic Release publishes the next version automatically.

See also:

- [Contributing Guide](./CONTRIBUTING.md)

---

## Quality Pipeline

Before opening a Pull Request, run:

```bash
pnpm ci
```

`pnpm ci` runs the same quality gates as the main CI workflow:

```bash
pnpm ci:quality
pnpm ci:build
pnpm ci:typecheck
pnpm ci:playwright
pnpm ci:test
pnpm ci:smoke
```

Every command above must pass successfully. For focused local checks, run the narrower scripts directly: `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm test:coverage`, `pnpm build`, `pnpm smoke:packages`, `pnpm check:public-api`, or `pnpm docs:api:check`.

---

## Package-specific Commands

Run tests for a specific package:

```bash
pnpm --filter @romanbakurov/vellira-web test
pnpm --filter @romanbakurov/vellira-native test
```

Build a specific package:

```bash
pnpm --filter @romanbakurov/vellira-web build
pnpm --filter @romanbakurov/vellira-native build
pnpm --filter @romanbakurov/vellira-tokens build
```

---

# Development Tooling

Create a new component:

```bash
pnpm create:component Button web primitives
pnpm create:component Switch native primitives
pnpm create:component Badge both primitives
```

Additional project conventions:

- [Component Conventions](./docs/COMPONENT_CONVENTIONS.md)
- [Package Conventions](./docs/PACKAGE_CONVENTIONS.md)

---

# Migration

## Versioning

Vellira follows Semantic Versioning.

| Version         | Meaning                               |
| --------------- | ------------------------------------- |
| Patch (`x.y.Z`) | Bug fixes and internal improvements   |
| Minor (`x.Y.z`) | New features without breaking changes |
| Major (`X.y.z`) | Breaking API changes                  |

---

## Updating Packages

Update packages using your package manager:

```bash
pnpm up @romanbakurov/vellira-web
pnpm up @romanbakurov/vellira-native
pnpm up @romanbakurov/vellira-icons
pnpm up @romanbakurov/vellira-tokens
pnpm up @romanbakurov/vellira-assets
```

Then reinstall dependencies:

```bash
pnpm install
```

---

## Breaking Changes

Breaking changes are introduced only in major releases.

Each major release includes:

- migration guide
- upgrade notes
- replacement APIs
- updated documentation

See:

- [CHANGELOG.md](./CHANGELOG.md)

---

## Public API

Vellira maintains stable public package exports.

Every release validates package export keys and public symbol snapshots using automated checks.

Breaking changes are introduced only in major releases whenever possible.

---

## Package Smoke Tests

Every published package is validated using smoke tests before release.

Smoke tests verify:

- package installation
- runtime imports
- public exports
- cross-package compatibility

This helps ensure that published packages work exactly as consumers expect.

---

# Quality

Vellira is built with reliability and long-term maintainability in mind.

The project uses:

- ESLint
- Prettier
- TypeScript Strict Mode
- Vitest for Web unit testing
- Vitest with React Native mocks for Native unit testing
- Package Smoke Tests
- Public API validation
- API documentation validation
- Storybook for Web
- React Native on-device Storybook
- Chromatic for visual review
- Husky
- lint-staged
- Semantic Release

Every Pull Request must successfully pass the complete quality pipeline before merging.

---

# Release Process

Vellira uses **Semantic Release** to automate versioning and publishing.

Each release automatically performs:

- Lint
- Type checking
- Unit tests
- Coverage validation
- Package builds
- Package Smoke Tests
- Public API validation
- API documentation validation
- GitHub Release generation

Package versions are managed automatically.

No manual version updates are required.

---

# Project Principles

Vellira is guided by a small set of engineering principles.

## Cross-platform first

Web and React Native components should expose familiar APIs while respecting each platform's behavior.

---

## Stable Public APIs

Public exports are treated as long-term contracts.

Internal implementation details should never become part of the public API unintentionally.

---

## Shared Design Language

Web and Native components are built from the same design tokens, interaction patterns, and accessibility principles.

Rendering is platform-specific.

Behavior should remain consistent whenever possible.

---

## Accessibility by Default

Accessibility is considered a core feature rather than an optional enhancement.

Components should support keyboard navigation, screen readers, focus management, and platform accessibility APIs.

---

## Strong Type Safety

TypeScript definitions are treated as part of the public API.

Public types should remain predictable and well documented.

---

## Small Focused Packages

Every package should have a single responsibility.

Packages communicate through stable public contracts rather than internal implementation details.

---

## Automated Quality

Every change should be validated automatically through linting, testing, coverage, smoke tests, documentation validation, and public API checks.

---

## Documentation First

Documentation evolves together with the implementation.

Public APIs, examples, Storybook stories, and migration notes should always remain up to date.

---

# Roadmap

Upcoming areas of development include:

- Additional components
- Expanded accessibility coverage
- More design tokens
- Performance improvements
- Additional Storybook examples
- Improved documentation
- Additional package integrations

See GitHub Issues and Discussions for ongoing work.

---

# Contributing

Contributions are welcome.

Please read:

- [Contributing Guide](./CONTRIBUTING.md)
- [Component Conventions](./docs/COMPONENT_CONVENTIONS.md)
- [Package Conventions](./docs/PACKAGE_CONVENTIONS.md)

before opening a Pull Request.

---

# License

This project is licensed under the MIT License.

See the [LICENSE](./LICENSE) file for details.
