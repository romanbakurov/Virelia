# Quality

Vellira treats documentation, type definitions, component behavior, and package
publishing as one quality surface.

## CI Gates

The main CI workflow validates:

- formatting and linting;
- package builds;
- documentation build;
- TypeScript checks;
- generated API docs;
- public API snapshots;
- unit tests and coverage;
- Storybook and web end-to-end checks;
- package smoke tests.

## Local Commands

Run the full pipeline before opening a high-impact pull request.

```bash
pnpm ci
```

Focused checks are faster while developing.

```bash
pnpm docs:build
pnpm typecheck
pnpm test
pnpm check:public-api
pnpm smoke:packages
```

## Documentation Quality

Documentation should explain:

- why a package exists;
- how to install it;
- how to render the first useful component;
- how state is controlled;
- how tokens and themes are applied;
- how to test and review the result.

If a public API changes, update the package docs and VitePress pages in the
same pull request.

## Release Quality

Published packages are validated with smoke tests and public export checks.
This protects consumers from broken package entry points, missing declarations,
and accidental API drift.
