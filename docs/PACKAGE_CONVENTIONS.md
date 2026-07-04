# Package Conventions

This document defines the standards for all packages in the Vellira monorepo.

The goal is to keep every package consistent, maintainable, and easy to understand.

---

# Package Responsibilities

Each package should have a single responsibility.

Current packages:

| Package                    | Responsibility                 |
| -------------------------- | ------------------------------ |
| `@vellira-ui/react`        | Web components                 |
| `@vellira-ui/react-native` | React Native components        |
| `@vellira-ui/core`         | Shared hooks and runtime logic |
| `@vellira-ui/types`        | Shared TypeScript contracts    |
| `@vellira-ui/icons`        | Cross-platform icon library    |
| `@vellira-ui/tokens`       | Design tokens                  |
| `@vellira-ui/assets`       | Shared fonts and static assets |

A package should not take responsibilities that belong to another package.

---

# Package Structure

Every package should follow the same structure whenever possible.

```text
package/
├── src/
├── dist/
├── package.json
├── tsconfig.json
├── tsconfig.build.json
├── vite.config.ts (if applicable)
├── vitest.config.ts (if applicable)
└── README.md
```

Generated files must never be edited manually.

---

# Package Naming

All public packages use the following naming convention:

```text
@vellira-ui/*
```

Examples:

```text
@vellira-ui/react
@vellira-ui/react-native
@vellira-ui/core
```

---

# Dependencies

Packages should depend only on what they actually use.

Avoid unnecessary dependencies.

Prefer:

- peerDependencies for frameworks
- dependencies for runtime requirements
- devDependencies for tooling

---

# Package Relationships

Dependencies should follow this direction:

```text
tokens
   │
   ├──────────────┐
   │              │
icons          types
   │              │
   └──────┐       │
          │       │
        core      │
          │       │
          ├───────┘
          │
     web / native

assets
   │
 apps / docs / storybook
```

Rules:

- web must not depend on native
- native must not depend on web
- tokens must remain independent
- assets must remain static and renderer-neutral
- types must not import runtime code
- core must not import renderer-specific code

---

# Public API

Only expose supported public APIs.

Do not expose:

- internal utilities
- implementation details
- internal contexts
- internal styles
- internal hooks unless intentionally public

Every public export becomes part of the package contract.

`pnpm check:public-api` validates both package export keys and public symbol snapshots for package entry points. If a public symbol is intentionally added or removed, update the snapshot in `scripts/check-public-api.mjs` in the same change.

---

# Exports

Prefer explicit exports.

Good:

```json
{
  "exports": {
    ".": "./dist/index.js",
    "./styles": "./dist/styles.css"
  }
}
```

Avoid wildcard exports.

---

# Build

Every code package must build independently.

Packages should produce:

- JavaScript
- TypeScript declarations
- assets when applicable

Generated output belongs only inside:

```text
dist/
```

Static asset packages may publish source assets directly when they do not need a compile step.

---

# Type Safety

Packages must compile with:

```bash
pnpm typecheck
```

No TypeScript errors are allowed.

Avoid using:

- any
- ts-ignore

unless absolutely necessary.

---

# Testing

Every public package should contain automated tests.

Tests should verify:

- runtime behavior
- public API
- edge cases
- accessibility when applicable

Packages should maintain healthy coverage.

---

# Storybook

Renderer packages should include Storybook stories.

Stories demonstrate:

- default usage
- variants
- disabled states
- controlled examples
- real-world examples

---

# Documentation

Each public package should include:

- README
- API documentation
- usage examples
- installation instructions (if necessary)

Documentation should stay synchronized with implementation.

---

# Versioning

Package versions are managed automatically.

Do not edit versions manually.

Semantic Release updates versions during the release process.

---

# Release Requirements

Before a package can be released, all checks must pass:

```bash
pnpm ci
```

`pnpm ci` runs `ci:quality`, `ci:build`, `ci:typecheck`, `ci:playwright`, `ci:test`, and `ci:smoke`. Use the narrower scripts for local iteration when you only need one gate.

---

# Package Smoke Tests

Every published package must pass package smoke tests.

Smoke tests verify:

- installation from packed tarballs
- runtime imports
- public exports
- cross-package compatibility

Smoke tests should simulate real consumer usage.

---

# Backward Compatibility

Public APIs should remain stable.

Breaking changes require:

- a major version
- updated documentation
- migration notes when appropriate

Avoid unnecessary breaking changes.

---

# General Principles

Every package should follow these principles:

- Single responsibility
- Minimal public API
- Explicit exports
- Stable contracts
- Strong typing
- Consistent structure
- Comprehensive tests
- Clear documentation
- Predictable releases

Keep packages focused, reusable, and easy to maintain.
