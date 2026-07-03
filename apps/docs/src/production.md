# Production

Use this checklist before shipping Vellira in an application.

## Install Only What You Need

Vellira is split into focused packages. Install the renderer and supporting
packages your application actually uses.

| Target        | Package                        |
| ------------- | ------------------------------ |
| React DOM     | `@romanbakurov/vellira-web`    |
| React Native  | `@romanbakurov/vellira-native` |
| Shared tokens | `@romanbakurov/vellira-tokens` |
| Icons         | `@romanbakurov/vellira-icons`  |

## Web Application Checklist

- Import `@romanbakurov/vellira-web/styles` once in the app entry.
- Wrap app-level theme switching in `ThemeProvider` when the product exposes
  light, dark, or high-contrast modes.
- Use semantic CSS variables for product surfaces instead of raw palette
  values.
- Verify keyboard interaction for forms, tabs, menus, tooltips, and dialogs.
- Keep Storybook links close to product review for visual states.

## Native Application Checklist

- Install required React Native peer dependencies.
- Test component behavior in `apps/native-playground` or your app shell.
- Verify screen-reader labels, disabled states, and validation text on real
  devices where possible.
- Keep layout spacing and surfaces tied to `@romanbakurov/vellira-tokens`.

## Release Confidence

Before publishing or merging a significant change, run the same checks CI uses.

```bash
pnpm docs:build
pnpm ci
```

For focused checks:

```bash
pnpm --filter @romanbakurov/vellira-web test
pnpm --filter @romanbakurov/vellira-native test
pnpm --filter @romanbakurov/vellira-tokens test
pnpm check:public-api
```

## Deployment

The documentation site deploys to `https://docs.vellira.dev` from the
`Deploy Docs` workflow. The workflow builds the VitePress app, verifies the
generated artifact, and deploys it to Cloudflare Pages.

Storybook remains the live component review surface. The target public split is:

| Site                    | Purpose                                        |
| ----------------------- | ---------------------------------------------- |
| `www.vellira.dev`       | Marketing and product positioning              |
| `docs.vellira.dev`      | Documentation, guides, API references, theming |
| `storybook.vellira.dev` | Live component states and visual review        |
