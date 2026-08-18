# Workspace source resolution

## Decision

Vellira workspace consumers may resolve local packages directly from source
through the dedicated `vellira-source` package export condition.

Published npm consumers continue to resolve stable `dist` artifacts.

## Problem

Previously, local workspace consumers could resolve generated declarations from
`dist` even when package source had already changed.

This created a failure mode where:

1. a shared source contract changed;
2. its generated declarations remained stale;
3. a dependent workspace consumer resolved the stale declarations;
4. validation failed with misleading TypeScript errors.

Correctness therefore depended on manually rebuilding workspace dependencies in
the correct order.

## Workspace model

Workspace consumers that require current package contracts enable
`moduleResolution: bundler` and the `vellira-source` custom condition.

The resolution model is:

    workspace consumer
        -> vellira-source
        -> package exports
        -> src/index.ts

## Published package model

The `vellira-source` condition is opt-in and is not used by normal npm
consumers.

Without that condition, package exports continue resolving stable build
artifacts:

    npm consumer
        -> standard conditions
        -> package exports
        -> dist

This preserves the published package contract.

## Internal package imports

Packages consumed directly from source must not require consumer tsconfigs to
understand package-internal TypeScript aliases.

`@vellira-ui/react` therefore uses package-local `#...` imports for internal
source boundaries. These mappings belong to the package itself and remain an
implementation detail.

## Alternative considered: dependency prebuilds

Building dependencies before dependent validation would also prevent stale
declarations.

It was not selected as the primary workspace model because it preserves build
order coupling, increases validation cost, and makes correctness depend on
generated artifact freshness.

Dependency builds remain necessary for producing publishable artifacts, but
they are not the source of truth for workspace contract validation.

## Toolchain validation

The source-resolution model has been validated with:

- TypeScript `moduleResolution: bundler`
- TypeScript `customConditions`
- Next.js / Turbopack
- Vite / Storybook
- React Native / Expo
- `@vellira-ui/react`
- `@vellira-ui/react-native`

Regression tests verify workspace source resolution and fallback to published
`dist` declarations.

## Platform-specific packages

`@vellira-ui/icons` requires additional platform-aware handling because its root
entrypoint selects different Web and React Native implementations.

Its workspace source-resolution contract is handled separately so the existing
public API can remain unchanged while preserving platform selection.

## Migration path

Workspace packages can adopt source resolution incrementally:

1. expose a `vellira-source` conditional export;
2. ensure source files do not depend on consumer-owned TypeScript aliases;
3. enable `vellira-source` in the workspace consumer;
4. verify supported toolchains;
5. add regression coverage for source and `dist` resolution;
6. preserve existing published exports.

Published npm consumers require no migration.
