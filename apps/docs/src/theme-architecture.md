# Theme Architecture

Vellira separates design decisions into layers. Each layer has a narrower job
than the one below it, which keeps the public component APIs stable while the
visual language evolves.

```text
Primitive colors
        │
        ▼
Semantic tokens
        │
        ▼
Component tokens
        │
        ▼
Renderer components
        │
        ▼
Application
```

## Primitive Colors

Primitive colors define the raw color palette. They describe color families such as
brand, status, neutral, gray, and mono values.

Primitive values are useful inside the token package, but product code should
rarely depend on them directly.

```ts
import { theme } from '@vellira-ui/tokens';

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

This layer isolates design decisions from implementation details.

## Component Tokens

Component tokens turn semantic decisions into component states. Components should not depend on palette values directly. They consume semantic
and component tokens that describe UI states.

```ts
theme.components.button.primary.default.bg;
theme.components.button.primary.hover.bg;
theme.components.input.focus.border;
theme.components.dropdown.content.bg;
```

Component tokens keep renderer implementations aligned across Web and React
Native.

## Renderer Components

Renderer packages consume the token layers and expose stable components.

| Renderer | Package                    | Responsibility                   |
| -------- | -------------------------- | -------------------------------- |
| Web      | `@vellira-ui/react`        | React components for the browser |
| Native   | `@vellira-ui/react-native` | React Native components          |

The components should depend on semantic and component tokens, not on raw
palette decisions. This keeps visual changes centralized inside the token
system.

## Why This Shape

This architecture gives Vellira three useful properties:

- product code reads in design-system language;
- renderer packages stay visually consistent;
- token changes can be made without rewriting component APIs.

When introducing a new design decision, add it at the lowest appropriate layer.

Use primitive colors for palettes, semantic tokens for reusable UI meaning,
and component tokens for component-specific states.

## Design Flow

When creating a new component, the recommended flow is:

1. Define or reuse primitive colors.
2. Create semantic meanings where needed.
3. Map semantics to component tokens.
4. Build renderer-specific implementations.
5. Expose a stable public API.
