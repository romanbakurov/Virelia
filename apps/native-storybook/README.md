# Native Storybook

Expo app for running on-device React Native Storybook for `@vellira-ui/react-native`.

Native Storybook reads stories from `packages/react-native/src/**/*.stories.@(ts|tsx)`, so package-level stories appear here automatically after running the Storybook generation step.

## Start

```bash
pnpm --filter native-storybook start
```

## Platforms

```bash
pnpm --filter native-storybook ios
pnpm --filter native-storybook android
```

If stories are added or removed, regenerate the React Native Storybook registry:

```bash
pnpm --filter native-storybook exec sb-rn-get-stories
```

## Testing

Native package unit tests run outside the simulator:

```bash
pnpm --filter @vellira-ui/react-native test
```

The Storybook app is mainly for manual Expo and on-device component checks.

## Notes

- Built with Expo `56`.
- Uses React Native `0.85`.
- Consumes `@vellira-ui/react-native` from the workspace.
- Native stories cover Button, Checkbox, Input, FormField, RadioGroup, Select, Dropdown, Tabs, Tooltip, and Modal.
