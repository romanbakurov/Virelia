---
title: Design Tokens
description: Explore Vellira design tokens for colors, typography, spacing, radii, shadows, and theming across React and React Native.
---

# Tokens

`@vellira-ui/tokens` is the single source of truth for the Vellira
design language.

It provides:

- primitive color palettes;
- semantic design tokens;
- component tokens;
- generated CSS variables;
- ready-to-use theme objects for JavaScript and TypeScript.

## Installation

::: code-group

```bash [pnpm]
pnpm add @vellira-ui/tokens
```

```bash [npm]
npm install @vellira-ui/tokens
```

```bash [yarn]
yarn add @vellira-ui/tokens
```

:::

## Theme Objects

Import a ready-to-use theme object and access semantic or component tokens
directly.

```ts
import { theme } from '@vellira-ui/tokens';

theme.semantic.surface.default;
theme.semantic.text.primary;

theme.components.button.primary.solid.default.bg;

theme.tokens.radius.md;
```

Import the shared theme object to access semantic and component tokens.

```ts
import { darkTheme, highContrastTheme, lightTheme } from '@vellira-ui/tokens';

lightTheme.name;
darkTheme.name;
highContrastTheme.name;
```

## Available Themes

Vellira ships with three built-in themes:

- Light
- Dark
- High Contrast

## CSS Variables

Import the generated CSS variables once in your application entry point.

```ts
import '@vellira-ui/tokens/css';
```

Use semantic variables in CSS when styling application surfaces.

```css
.card {
  color: var(--text-primary);
  background: var(--surface-default);
  border: 1px solid var(--border-default);
}
```

The same variables can be used inline when a component needs a local style.

```tsx
<div
  style={{
    background: 'var(--surface-default)',
    color: 'var(--text-primary)',
  }}
/>
```

## Token Groups

| Group        | Description               |
| ------------ | ------------------------- |
| `colors`     | Primitive color palettes  |
| `semantic`   | UI meaning                |
| `components` | Component states          |
| `tokens`     | Shared design foundations |

### `colors`

Primitive palettes define raw brand, status, neutral, gray, and mono values.
They are the base material for the rest of the system.

### `semantic`

Semantic tokens describe UI meaning instead of raw color names.

Common semantic groups include:

- `surface`
- `text`
- `border`
- `status`
- `focus`
- `divider`
- `navigation`
- `skeleton`

### `components`

Component tokens define stateful values for component APIs. Buttons, inputs,
dropdowns, modals, tabs, and other components can consume these values without
hardcoding palette references.

### `tokens`

The `tokens` group contains non-color foundations such as spacing, radius,
typography, shadows, and z-index values.

## Best Practice

Always prefer semantic tokens over raw colors in application code.

Primitive palettes should rarely be referenced directly in application code.

Instead, prefer semantic and component tokens so that visual changes remain
centralized inside the design system.

For the full layering model, see [Theme Architecture](/theme-architecture).
