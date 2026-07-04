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

```bash
pnpm add @vellira-ui/tokens
```

```bash
npm install @vellira-ui/tokens
```

```bash
yarn add @vellira-ui/tokens
```

## Theme Objects

Import a ready-to-use theme object and access semantic or component tokens
directly.

```ts
import { theme } from '@vellira-ui/tokens';

theme.semantic.surface.default;
theme.semantic.text.primary;

theme.components.button.primary.default.bg;

theme.tokens.radius.md;
```

Import a specific theme when your application needs explicit theme selection.

```ts
import { darkTheme, highContrastTheme, lightTheme } from '@vellira-ui/tokens';

lightTheme.name;
darkTheme.name;
highContrastTheme.name;
```

## CSS Variables

Import generated CSS variables into any web application.

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

| Group        | Description                                   |
| ------------ | --------------------------------------------- |
| `colors`     | Primitive color palettes                      |
| `semantic`   | Semantic aliases for UI meaning               |
| `components` | Component-specific tokens                     |
| `tokens`     | Spacing, radius, typography, shadows, z-index |

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

## Principle

Always prefer semantic tokens over raw colors in application code.

Primitive palettes exist to build semantic tokens. Product code should consume
semantic meanings such as surface, text, border, status, and component tokens
instead of directly referencing palette values.

For the full layering model, see [Theme Architecture](/theme-architecture).
