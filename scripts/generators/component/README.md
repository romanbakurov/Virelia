# Component Generator

Scaffolds runtime Vellira components in package source trees.

## Command

```bash
pnpm create:component <Name> <platform> <layer>
```

Platforms:

- `web` writes to `packages/react`
- `native` writes to `packages/react-native`
- `both` writes to both packages

Layers:

- `primitives`
- `components`
- `patterns`

## Responsibility

This generator owns library/runtime scaffolding:

- component implementation files
- public `types.ts`
- local `index.ts`
- tests
- stories
- platform styles
- package layer barrel exports

It should not depend on the website component catalog or component-page
generation pipeline.

Templates live in `templates/` next to the entry point.

## Platform strategy

The component generator treats React and React Native as related but distinct
platform targets.

Shared component contracts should stay aligned where that improves developer
experience, but generated implementations must not force identical web and
mobile UX.

React Native output should be designed for native interaction patterns and may
diverge between iOS and Android when appropriate.

Examples of acceptable platform divergence include:

- web floating content vs native sheet or modal presentation
- browser keyboard behavior vs native back handling
- pointer and hover behavior on web vs touch-first interaction on native
- web focus management vs native accessibility focus behavior
- platform-specific presentation, spacing, motion, and control affordances

The generator should preserve cross-platform API intent without treating React
Native as a visual copy of the web implementation.
