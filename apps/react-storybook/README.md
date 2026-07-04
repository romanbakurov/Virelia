# Vellira Storybook

Web Storybook app for `@vellira-ui/react`.

Use this app to develop, document, and visually review web components. Web stories live next to components in `packages/react/src/**/*.stories.tsx`.

## Development

From the workspace root:

```bash
pnpm --filter @vellira-ui/react-storybook dev
```

Storybook runs on port `6006`.

## Build

```bash
pnpm --filter @vellira-ui/react-storybook build-storybook
```

## Tests And Visual Review

Component behavior tests live in `packages/react/src/**/*.test.tsx` and run with:

```bash
pnpm --filter @vellira-ui/react test
```

Chromatic publishes the hosted visual review build from this Storybook app.

## Notes

- Uses Storybook React Vite.
- Uses Chromatic for hosted visual review.
- Fonts used by Storybook come from `@vellira-ui/assets`.
