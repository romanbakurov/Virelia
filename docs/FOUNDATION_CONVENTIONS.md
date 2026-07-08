# Foundation Conventions

Foundation tokens are the non-component design decisions that make the system
feel consistent: radius, spacing, typography, elevation, motion, and z-index.
Renderer components should consume these tokens instead of inventing local
values.

## Radius

Use radius tokens to describe the shape of an element, not its size.

| Token  | Typical usage                         |
| ------ | ------------------------------------- |
| `xs`   | Small controls, checkbox indicators   |
| `sm`   | Inputs, selects, compact surfaces     |
| `md`   | Dropdowns, popovers, cards            |
| `lg`   | Modals, larger panels                 |
| `full` | Pills, circular icon buttons, avatars |

Rules:

- Use `full` only when the shape should stay pill/circle at any size.
- Use `sm` or `md` for framed controls.
- Do not hardcode `8px` or `999px` in components when a radius token exists.

## Spacing

Spacing follows a 4px grid. Use spacing tokens for layout gaps, padding, and
component rhythm.

Common values:

| Value | Usage                              |
| ----- | ---------------------------------- |
| `4`   | Tight icon/text spacing            |
| `8`   | Compact gaps                       |
| `12`  | Small control padding              |
| `16`  | Standard layout gap                |
| `20`  | Comfortable control padding        |
| `24`  | Section spacing                    |
| `32`  | Large block spacing                |
| `40+` | Page-level spacing and large bands |

Rules:

- Prefer `gap` over margins inside component layouts.
- Keep repeated controls aligned to the same spacing scale.
- Do not use arbitrary values such as `13px` unless matching text metrics or a
  platform requirement.

## Typography

Typography tokens cover font family, size, weight, and line height.

Use typography tokens for:

- component labels;
- form text;
- button text;
- menu items;
- headings inside component surfaces.

Rules:

- Match font size to the surface. Compact controls should not use display-scale
  type.
- Use line-height tokens so text does not clip in Web or Native.
- Do not use negative letter spacing.
- Do not scale text with viewport width.

## Elevation

Elevation is used only when an element needs to visually sit above surrounding
content.

Use elevation for:

- dropdown content;
- modal content;
- popovers and overlays;
- temporary floating surfaces.

Avoid elevation for:

- ordinary form controls;
- every card in a dense dashboard;
- decorative depth with no interaction meaning.

## Motion

Motion should clarify state changes. It should not hide latency or make repeated
workflows slower.

Use motion for:

- hover/press feedback;
- overlay entry and exit;
- loading indicators.

Rules:

- Respect reduced-motion preferences on Web.
- Keep interaction transitions short, usually around 150-250ms.
- Do not animate layout in ways that shift nearby controls unexpectedly.

## Z-Index

Use z-index tokens for overlays and layered UI.

Typical order:

```text
base content
sticky navigation
dropdowns/popovers
modals
toasts or global overlays
```

Rules:

- Do not use arbitrary high z-index values.
- Keep stacking decisions inside overlay systems when possible.
- A component should not escape its expected stacking layer.

## Colors

Never use primitive colors inside components.

```text
Component
↓
Semantic
↓
Primitive
```

Example:

```text
Button
↓
action.primary
↓
primary.600
```

Renderer components should consume semantic or component tokens. Primitive color
references belong inside the token package.
