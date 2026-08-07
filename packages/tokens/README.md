# @vellira-ui/tokens

Shared design tokens for Vellira.

This package is the single source of truth for primitive colors, semantic
tokens, component tokens, typography, spacing, radius, shadows, and z-index
values used by both the React and React Native packages.

## Installation

```bash
pnpm add @vellira-ui/tokens
```

## Features

- Shared design tokens
- Semantic color system
- Renderer-neutral theme objects
- Component-level tokens
- Generated CSS variables
- TypeScript-first API

## Usage

```ts
import {
  darkTheme,
  highContrastTheme,
  lightTheme,
  theme,
} from '@vellira-ui/tokens';

theme.semantic.surface.default;
theme.semantic.text.primary;
theme.semantic.border.default;
theme.semantic.status.success.fg;

theme.components.button.primary.solid.default.bg;
theme.components.input.default.bg;

theme.tokens.typography.family.regular;
theme.tokens.spacing[4];
theme.tokens.radius.md;

lightTheme.name;
darkTheme.name;
highContrastTheme.name;
```

## Semantic Tokens

The package provides semantic groups that describe intent instead of coupling
components to raw palette values.

Current semantic groups include:

- `action`
- `border`
- `control`
- `divider`
- `focus`
- `icons`
- `menu`
- `navigation`
- `overlay`
- `shadow`
- `skeleton`
- `status`
- `surface`
- `text`

Example:

```ts
theme.semantic.surface.default;
theme.semantic.surface.elevated;

theme.semantic.text.primary;
theme.semantic.text.secondary;

theme.semantic.border.default;

theme.semantic.status.success.fg;
theme.semantic.status.error.fg;
```

Using semantic tokens instead of raw palette values keeps component styling
consistent across renderers and themes.

## Component Tokens

Component tokens define renderer-neutral values for component states and
surfaces.

```ts
theme.components.button.primary.solid.default.bg;
theme.components.input.focus.border;
theme.components.dropdown.content.bg;
theme.components.popover.content.bg;
theme.components.modal.content.bg;
theme.components.tooltip.content.bg;
```

Color-like component tokens may use either colors or the literal `transparent`
when the intended rendered value is transparent.

## CSS Variables

Generated CSS variables are available for web projects:

```ts
import '@vellira-ui/tokens/css';
```

Examples:

```css
--color-mono-0
--surface-default
--text-primary
--border-default
--button-primary-solid-default-bg
```

## Documentation

- [Design Tokens](https://docs.vellira.dev/design-system/tokens)
- [Theme Architecture](https://docs.vellira.dev/design-system/theme-architecture)
- [React](https://docs.vellira.dev/react/)
- [React Native](https://docs.vellira.dev/react-native/)

## Development

Build the package:

```bash
pnpm --filter @vellira-ui/tokens build
```

Token path unions, CSS variable name unions, and theme structure types are
generated from the token source files:

```bash
pnpm --filter @vellira-ui/tokens generate:types
```

Verify that generated token types are up to date:

```bash
pnpm --filter @vellira-ui/tokens generate:types:check
```

## Principles

- Semantic tokens over hardcoded colors
- Shared across React and React Native
- Stable public API
- Predictable naming
- Theme-ready architecture
