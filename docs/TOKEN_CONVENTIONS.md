# Token Conventions

This document defines how tokens should be named, layered, and consumed.

## Layering

Tokens flow in one direction:

```text
primitive colors
  ↓
semantic tokens
  ↓
component tokens
  ↓
renderer implementation
```

Renderer components must not use primitive colors directly.

Good:

```ts
theme.semantic.text.primary;
theme.components.button.primary.solid.default.bg;
```

Bad:

```ts
theme.colors.primary[600];
colors.primary[600];
```

Primitive colors are implementation details of the token package.

## Primitive Tokens

Primitive tokens describe raw scales.

Examples:

- `colors.primary[600]`
- `colors.vellira[950]`
- `colors.success[500]`
- `tokens.spacing[4]`
- `tokens.radius.md`

Use primitive tokens only when authoring semantic or component tokens.

## Semantic Tokens

Semantic tokens describe reusable UI meaning.

Examples:

```ts
theme.semantic.surface.default;
theme.semantic.text.primary;
theme.semantic.border.focus;
theme.semantic.status.error.fg;
theme.semantic.focus.ring;
```

Semantic tokens should be reusable across multiple components. Do not add a
semantic token for a single component-only state.

## Component Tokens

Component tokens describe component-specific states.

Examples:

```ts
theme.components.button.primary.solid.default.bg;
theme.components.button.primary.solid.hover.border;
theme.components.input.focus.placeholder;
theme.components.checkbox.disabled.fg;
```

Use component tokens when the value only makes sense for a component.

## Naming Roles

Use short visual roles consistently:

| Role          | Meaning                       |
| ------------- | ----------------------------- |
| `bg`          | Background                    |
| `fg`          | Foreground/content text       |
| `border`      | Border or stroke              |
| `ring`        | Focus ring or validation ring |
| `placeholder` | Placeholder text              |
| `icon`        | Icon color                    |

Recommended order inside state objects:

```ts
{
  bg,
  fg,
  border,
  ring,
  placeholder,
  icon,
}
```

Only include roles that the component actually uses.

## Naming States

Use predictable state names:

| State      | Meaning                         |
| ---------- | ------------------------------- |
| `default`  | Resting state                   |
| `hover`    | Pointer hover state             |
| `pressed`  | Active/pressed state            |
| `focus`    | Keyboard focus or focus-visible |
| `disabled` | Non-interactive state           |
| `error`    | Invalid state                   |
| `success`  | Valid/success state             |

Prefer `pressed` for component APIs even if an underlying semantic token uses
`active`.

## Theme Parity

Every semantic or component token must exist in all themes:

- light;
- dark;
- high contrast.

High contrast may intentionally use different semantic choices, but the shape
must stay compatible.

## CSS Variables

Web CSS variables are generated from token paths.

Examples:

```css
--surface-default
--text-primary
--button-primary-solid-default-bg
--input-focus-border
```

Do not write CSS variable names by hand in token source. Add token source values
and regenerate.

## Generated Files

When token source changes, run:

```bash
pnpm --filter @vellira-ui/tokens generate:types
pnpm --filter @vellira-ui/tokens test
```

Generated files must match source token shape.

## Documentation

If a public token path changes, update:

- `packages/tokens/README.md`;
- `apps/docs/src/tokens.md`;
- `apps/docs/src/theme-architecture.md`;
- component API docs if examples reference that token.
