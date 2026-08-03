# Contributing to Vellira

Thank you for contributing to Vellira.

This document describes the development workflow, coding standards, and release process used throughout the project.

---

## Development Setup

Choose the development environment that best fits your workflow.

Vellira supports native development, Docker, and GitHub Codespaces.

---

## Development Environments

Vellira supports multiple development environments depending on your workflow.

### Native

Run the project directly on your machine.

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

Recommended for contributors already familiar with the project.

### Docker

Run the development environment in Docker.

```bash
pnpm docker:install
pnpm docker:storybook
pnpm docker:shell
```

Provides a consistent environment across macOS, Windows, and Linux.

### Visual Regression Tests

Run Playwright visual tests inside the Linux container:

```bash
pnpm docker:e2e
```

Update snapshots:

```bash
pnpm docker:e2e:update
```

### GitHub Codespaces

Open the repository in GitHub Codespaces to start contributing without installing Node.js, pnpm, or project dependencies locally.

The Dev Container configuration is applied automatically.

---

## Branch Naming

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

## Commit Messages

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

## Development Workflow

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

## Quality Checks

Before opening a Pull Request, all commands below must succeed:

```bash
pnpm ci
```

`pnpm ci` runs:

- ci:quality
- ci:build
- ci:typecheck
- ci:playwright
- ci:test
- ci:smoke

For individual checks, you can also run:

- `pnpm lint`
- `pnpm typecheck`
- `pnpm test`
- `pnpm test:coverage`
- `pnpm build`
- `pnpm smoke:web`
- `pnpm smoke:native`
- `pnpm check:public-api`
- `pnpm docs:api:check`

Do not open a Pull Request if any of these checks fail.

---

## Pull Requests

Pull Requests should:

- focus on a single change
- use Conventional Commits
- pass all CI checks
- include tests when behavior changes
- update documentation when public APIs change

Keep Pull Requests as small as reasonably possible.

---

## Project Architecture

The repository is organized as a modular monorepo.

```text
packages/
├── react
├── react-native
├── tokens
├── core
├── icons
├── types
└── assets
```

Each package has a clearly defined responsibility.

- `react` — Web components
- `react-native` — React Native components
- `tokens` — Shared design tokens
- `core` — Shared hooks and interaction logic
- `types` — Shared TypeScript types
- `icons` — Cross-platform icon library
- `assets` — Fonts and design assets

---

## Component Development

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

## Public API

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

## Documentation

Whenever a public component changes:

- update Storybook examples
- update generated API documentation
- update README when necessary

Documentation is expected to evolve together with the implementation.

---

## Release Process

Vellira uses Semantic Release.

During every release, the pipeline automatically performs:

1. Lint
2. Build
3. Automated tests
4. Coverage
5. Package Smoke Tests
6. Public API Validation
7. API Documentation Validation
8. GitHub Release

No manual version updates are required.

Package versions are managed automatically during the release process.

---

## Code Style

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

## Good First Issues

If you're contributing for the first time, consider looking for issues labeled:

- `good first issue`
- `help wanted`
- `documentation`

These are intended to help new contributors get started with the project.

---

## Thank You

Thank you for helping improve Vellira.

Every contribution—whether it's code, documentation, testing, or feedback—helps make the project better.
