# Component Conventions

This document defines the architectural and implementation standards for all Vellira components. Every new component should follow these conventions to ensure consistency, maintainability, and predictable APIs across web and native packages.

---

# Directory Structure

## Simple component

```text
Component/
├── Component.tsx
├── Component.styles.ts
├── Component.stories.tsx
├── Component.test.tsx
├── types.ts
└── index.ts
```

## Compound component

```text
Component/
├── Component.tsx
├── ComponentContext.tsx
├── types.ts
├── index.ts
├── Part/
│   ├── Part.tsx
│   ├── Part.styles.ts
│   ├── types.ts
│   └── index.ts
├── AnotherPart/
│   ├── AnotherPart.tsx
│   ├── AnotherPart.styles.ts
│   ├── types.ts
│   └── index.ts
```

---

# Public API

The renderer package root must expose only supported public runtime APIs.

Allowed exports:

- Button
- Checkbox
- Dropdown
- FormField
- Input
- Modal
- RadioGroup
- Select
- Tabs
- ThemeProvider
- Tooltip
- useTheme

Native may also expose theme names and theme objects needed by consumers:

- NativeThemeName
- nativeThemes

Do **not** export:

- internal hooks
- contexts
- utilities
- styles
- implementation details
- helper functions

Internal modules should remain private.

---

# Component API

Every component should expose a clean, predictable API.

Prefer:

- controlled mode
- uncontrolled mode
- event callbacks
- composition over configuration

Example:

```tsx
<Tabs
  value={value}
  onValueChange={setValue}
/>

<Tabs defaultValue='profile' />
```

---

# Controlled vs Uncontrolled

Whenever appropriate, support both modes.

Examples:

```tsx
value / defaultValue;

checked / defaultChecked;

open / defaultOpen;

value / defaultValue;
```

Callbacks:

```tsx
onChange;

onCheckedChange;

onOpenChange;

onValueChange;
```

---

# Types

Shared component contracts belong in:

```
@vellira-ui/types
```

Platform-specific props stay inside each renderer.

Example:

```ts
export interface ButtonProps extends BaseButtonProps {
  className?: string;
}
```

Avoid duplicating shared interfaces.

---

# Styling

Use design tokens exclusively.

Good:

```ts
padding: theme.tokens.spacing[3];
borderRadius: theme.tokens.radius.md;
color: theme.semantic.text.primary;
```

Avoid hardcoded values whenever a token exists.

Bad:

```ts
padding: 12;
borderRadius: 8;
color: '#4F46E5';
```

---

# Component Styles

Every component owns its styling.

```
Component.styles.ts
```

Do not inline large style objects inside component files.

---

# Accessibility

Every interactive component must be accessible.

## Web

Required:

- semantic HTML
- keyboard navigation
- focus management
- ARIA roles
- ARIA attributes

## Native

Required:

- accessibilityRole
- accessibilityState
- accessibilityLabel (when appropriate)
- accessibilityHint (when appropriate)

Accessibility is considered part of the component API.

Icon-only actions must expose an accessible name. Use standard `aria-label` on
web components and `accessibilityLabel` on native components.

---

# Icons

Icons should come only from:

```
@vellira-ui/icons
```

Do not import SVGs directly inside components.

Icons must inherit component color automatically.

---

# State Management

Prefer reusable hooks from:

```
@vellira-ui/core
```

Examples:

- useControllableState
- useKeyboardNavigation
- useTabsKeyboard

Avoid duplicating logic between components.

---

# Context

Compound components should communicate through Context.

Avoid prop drilling.

Example:

```
Tabs
 ├── Tabs.List
 ├── Tabs.Trigger
 └── Tabs.Content
```

---

# Stories

Every public component must include Storybook stories.

Minimum stories:

- Default
- Disabled
- Variants
- Controlled example (if applicable)
- Real-world example

Stories should demonstrate real usage rather than implementation details.

---

# Tests

Every component should include tests for:

- rendering
- user interaction
- disabled state
- controlled mode
- uncontrolled mode
- accessibility (where applicable)

New features should include corresponding tests.

---

# Documentation

Every public component must provide:

- Storybook documentation
- generated API documentation
- examples
- prop descriptions

Documentation should stay synchronized with implementation.

---

# Package Readiness Checklist

Before opening a Pull Request:

```bash
pnpm ci
```

For focused local checks, use the narrower scripts directly: `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm test:coverage`, `pnpm build`, `pnpm smoke:packages`, `pnpm check:public-api`, or `pnpm docs:api:check`.

All checks must pass before merging.

---

# General Principles

Follow these principles throughout the project:

- Keep components small and focused.
- Prefer composition over configuration.
- Avoid unnecessary abstractions.
- Keep APIs stable.
- Keep runtime exports minimal.
- Favor readability over cleverness.
- Use design tokens consistently.
- Write tests alongside features.
- Treat accessibility as a first-class feature.
- Preserve backward compatibility whenever possible.
