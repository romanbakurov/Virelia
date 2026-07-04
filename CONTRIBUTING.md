# Contributing to Vellira

Thank you for contributing to Vellira.

This document describes the development workflow, coding standards, and release process used throughout the project.

---

# Development Setup

Install dependencies:

```bash
pnpm install
```

Run Storybook:

```bash
pnpm storybook
```

Run the Native Playground:

```bash
pnpm native
```

---

# Branch Naming

Use descriptive branch names.

| Type          | Example                      |
| ------------- | ---------------------------- |
| Feature       | `feat/button-loading`        |
| Fix           | `fix/select-keyboard`        |
| Refactor      | `refactor/tabs-api`          |
| Documentation | `docs/component-conventions` |
| Chore         | `chore/update-dependencies`  |
| CI            | `ci/release-workflow`        |
| Test          | `test/dropdown-coverage`     |

---

# Commit Messages

Vellira follows the Conventional Commits specification.

Examples:

```text
feat(button): add loading state
fix(select): restore keyboard navigation
refactor(tabs): simplify controlled mode
docs(api): improve generated documentation
test(dropdown): increase coverage
chore(deps): update dependencies
ci(release): improve workflow
```

Release types:

| Commit             | Version |
| ------------------ | ------- |
| `fix:`             | Patch   |
| `feat:`            | Minor   |
| `feat!:`           | Major   |
| `BREAKING CHANGE:` | Major   |

---

# Development Workflow

1. Create a branch from `main`.
2. Implement your changes.
3. Run all quality checks.
4. Commit using Conventional Commits.
5. Push the branch.
6. Open a Pull Request.
7. Wait for CI to pass.
8. Merge into `main`.
9. Semantic Release creates the release automatically.

---

# Quality Checks

Before opening a Pull Request, all commands below must succeed:

```bash
pnpm ci
```

`pnpm ci` expands to `ci:quality`, `ci:build`, `ci:typecheck`, `ci:playwright`, `ci:test`, and `ci:smoke`. For focused local checks, run the narrower scripts directly: `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm test:coverage`, `pnpm build`, `pnpm smoke:packages`, `pnpm check:public-api`, or `pnpm docs:api:check`.

Do not open a Pull Request if any of these checks fail.

---

# Pull Requests

Pull Requests should:

- focus on a single change
- use Conventional Commits
- pass all CI checks
- include tests when behavior changes
- update documentation when public APIs change

Keep Pull Requests as small as reasonably possible.

---

# Component Development

All public components must follow the project conventions described in:

```text
docs/COMPONENT_CONVENTIONS.md
```

This includes:

- directory structure
- public API
- accessibility
- styling
- Storybook
- testing
- documentation

---

# Public API

Public package exports are considered part of the stable API.

Do not:

- expose internal hooks
- expose contexts
- expose utilities
- expose implementation details

Every public API change must pass:

```bash
pnpm check:public-api
```

This check validates package export keys and public symbol snapshots. Intentional public API additions or removals must update `scripts/check-public-api.mjs` in the same change.

---

# Documentation

Whenever a public component changes:

- update Storybook examples
- update generated API documentation
- update README when necessary

Documentation is expected to evolve together with the implementation.

---

# Release Process

Vellira uses Semantic Release.

The release pipeline automatically performs:

1. Lint
2. Build
3. Tests
4. Coverage
5. Package Smoke Tests
6. Public API Validation
7. API Documentation Validation
8. GitHub Release

No manual version updates are required.

Package versions are managed automatically during the release process.

---

# Code Style

General principles:

- Keep components focused.
- Prefer composition over configuration.
- Keep APIs predictable.
- Reuse shared logic from `@vellira-ui/core`.
- Reuse shared types from `@vellira-ui/types`.
- Use design tokens instead of hardcoded values.
- Treat accessibility as a first-class feature.
- Preserve backward compatibility whenever possible.

---

# Thank You

Thank you for helping improve Vellira.
Every contribution—whether it's code, documentation, testing, or feedback—helps make the project better.
