# Vellira Generators

This directory contains two separate generator subsystems.

## Component

`scripts/generators/component/` scaffolds runtime package components for
`packages/react`, `packages/react-native`, and shared package exports.

Command:

```bash
pnpm create:component <Name> <platform> <layer>
```

## Component Page

`scripts/generators/component-page/` builds website component catalog pages from
source extraction, profiles, optional colocated metadata, and a normalized page
model.

Commands:

```bash
pnpm create:component-page <Name> [--force] [--check]
pnpm component-pages:audit
pnpm component-pages:check
pnpm test:component-pages
```

Keep utilities in a subsystem unless both generators genuinely share them.
