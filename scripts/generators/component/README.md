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
