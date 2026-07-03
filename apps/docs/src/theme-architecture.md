# Theme Architecture

Vellira separates design decisions into layers. Each layer has a narrower job
than the one below it, which keeps the public component APIs stable while the
visual language evolves.

```text
Primitive colors
        |
        v
Semantic tokens
        |
        v
Component tokens
        |
        v
React components
```

## Primitive Colors

Primitive colors are raw palette values. They describe color families such as
brand, status, neutral, gray, and mono values.

Primitive values are useful inside the token package, but product code should
rarely depend on them directly.

```ts
import { theme } from '@romanbakurov/vellira-tokens';

theme.colors.primary[500];
theme.colors.vellira[950];
theme.colors.success[600];
```

## Semantic Tokens

Semantic tokens translate palettes into UI meaning. Instead of asking for
`primary.500` or `vellira.950`, components and applications ask for concepts
such as surface, text, border, focus, and status.

```ts
theme.semantic.surface.default;
theme.semantic.text.primary;
theme.semantic.border.default;
theme.semantic.status.success.fg;
```

This layer is what makes theme changes manageable. A palette can evolve while
the semantic contract stays readable.

## Component Tokens

Component tokens turn semantic decisions into component states. A button does
not need to know how a brand palette is arranged. It only needs values for
default, hover, pressed, disabled, and other states.

```ts
theme.components.button.primary.default.bg;
theme.components.button.primary.hover.bg;
theme.components.input.focus.border;
theme.components.dropdown.content.bg;
```

Component tokens keep renderer implementations aligned across Web and React
Native.

## React Components

Renderer packages consume the token layers and expose stable components.

| Renderer | Package                        | Responsibility                                |
| -------- | ------------------------------ | --------------------------------------------- |
| Web      | `@romanbakurov/vellira-web`    | DOM components, CSS modules, browser behavior |
| Native   | `@romanbakurov/vellira-native` | React Native primitives and platform styles   |

The components should depend on semantic and component tokens, not on raw
palette decisions. This keeps visual changes centralized inside the token
system.

## Why This Shape

This architecture gives Vellira three useful properties:

- product code reads in design-system language;
- renderer packages stay visually consistent;
- token changes can be made without rewriting component APIs.

When extending the system, add the lowest-level value that matches the decision.
Use primitive colors for palette work, semantic tokens for shared UI meaning,
and component tokens for stateful component behavior.
