# Contributing

Use this page as the short contribution path. The repository-level guides still
define the detailed conventions.

## Workflow

1. Create a focused branch.
2. Make the implementation change.
3. Add or update tests and Storybook stories when behavior changes.
4. Update documentation for public APIs, examples, or token changes.
5. Run focused checks locally.
6. Open a pull request.

## Component Changes

When adding or changing a component, keep Web and Native behavior aligned where
the platform allows it.

Expected updates:

- component implementation;
- public types;
- unit tests;
- Storybook stories;
- API docs when exports change;
- VitePress docs when public usage changes.

## Token Changes

Token changes should preserve the layer model:

```text
Primitive colors
  -> Semantic tokens
  -> Component tokens
  -> Renderer components
```

Prefer adding semantic meaning before exposing raw palette values to product
code.

## Useful Commands

```bash
pnpm docs:build
pnpm --filter @vellira-ui/react test
pnpm --filter @vellira-ui/react-native test
pnpm check:public-api
```

## Detailed Guides

- [Contributing Guide](https://github.com/romanbakurov/Vellira/blob/main/CONTRIBUTING.md)
- [Component Conventions](https://github.com/romanbakurov/Vellira/blob/main/docs/COMPONENT_CONVENTIONS.md)
- [Package Conventions](https://github.com/romanbakurov/Vellira/blob/main/docs/PACKAGE_CONVENTIONS.md)
