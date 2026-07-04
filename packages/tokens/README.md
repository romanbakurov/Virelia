# @vellira-ui/tokens

Shared design tokens for Vellira.

This package is the single source of truth for primitive colors, semantic colors, component tokens, typography, spacing, radius, shadows, and z-index values used by both the Web and React Native packages.

## Features

- Shared design tokens
- Semantic color system
- Renderer-neutral theme objects
- Generated CSS variables
- TypeScript-first API

---

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

theme.components.button.primary.default.bg;
theme.components.input.default.bg; // may be a hex color or transparent

theme.tokens.typography.family.regular;
theme.tokens.spacing[4];
theme.tokens.radius.md;

lightTheme.name;
darkTheme.name;
highContrastTheme.name;
```

---

## Semantic Color Tokens

The package provides semantic color groups in addition to the base palette.

Current semantic groups include:

- `surface`
- `text`
- `border`
- `status`
- `focus`
- `divider`
- `navigation`
- `skeleton`

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

Using semantic tokens instead of raw palette values makes components easier to maintain and prepares the design system for future theming.

---

## Component Tokens

Component tokens define renderer-neutral values for component states.

```ts
theme.components.button.primary.default.bg;
theme.components.input.focus.border;
theme.components.dropdown.content.bg;
```

Color-like component tokens may use either hex colors or the literal `transparent` when the intended rendered value is transparent.

---

## CSS Variables

Generated CSS variables are available for Web projects.

```ts
import '@vellira-ui/tokens/css';
```

Examples:

```css
--color-mono-0
--surface-default
--text-primary
--border-default
--button-primary-default-bg
```

---

## Development

Build the package:

```bash
pnpm --filter @vellira-ui/tokens build
```

The build generates:

- TypeScript declarations
- CSS variables
- distributable artifacts

Token path unions, CSS variable name unions, and theme structure types are generated from the token source files:

```bash
pnpm --filter @vellira-ui/tokens generate:types
```

Use `generate:types:check` or the package test script to verify the generated token types are up to date.

---

## Principles

The token system follows a few core principles:

- Semantic tokens over hardcoded colors
- Shared across Web and React Native
- Stable public API
- Predictable naming
- Easy future support for multiple themes
