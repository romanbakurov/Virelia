# Native Playground

Expo app for developing and testing `@vellira-ui/react-native`.

The app runs as a normal Expo playground for `@vellira-ui/react-native`. Use `apps/native-storybook` for on-device React Native Storybook.

## Start

```bash
pnpm --filter native-playground start
```

## Platforms

```bash
pnpm --filter native-playground ios
pnpm --filter native-playground android
pnpm --filter native-playground web
```

## Native Storybook

Use `apps/native-storybook` for on-device Storybook:

```bash
pnpm --filter native-storybook start
pnpm --filter native-storybook ios
pnpm --filter native-storybook android
```

## Testing

Native package unit tests run outside the simulator:

```bash
pnpm --filter @vellira-ui/react-native test
```

The playground itself is mainly for manual Expo and on-device Storybook checks.

## Notes

- Built with Expo `56`.
- Uses React Native `0.85`.
- Consumes `@vellira-ui/react-native` from the workspace.
- Manual playground screens cover the native package in an Expo app context.
