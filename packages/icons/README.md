# @vellira-ui/icons

Shared icon package for Vellira.

Icons are generated for both web and React Native entry points and compiled to `dist` for publishing. Web consumers resolve the default web entry, while React Native can use the `react-native` export condition. Explicit `./web` and `./native` entry points are also available.

## Development

Generate icons:

```bash
pnpm --filter @vellira-ui/icons generate
```

Build icons and compile publishable output:

```bash
pnpm --filter @vellira-ui/icons build
```

Published files are emitted to `dist` and include JavaScript, source maps, and TypeScript declarations.

## Notes

- Source SVG assets live in `svg/`.
- Generated files live in `src/generated/`.
- The generator currently emits TSX-compatible icon files for native usage.
