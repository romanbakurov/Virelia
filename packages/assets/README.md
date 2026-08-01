# @vellira-ui/assets

Shared static assets for the Vellira Design System.

This package contains reusable assets shared across the Vellira ecosystem, including application fonts, documentation assets, Storybook assets, and future design tooling assets.

## Installation

```bash
pnpm add @vellira-ui/assets
```

## Font Styles

Import the bundled font stylesheet:

```ts
import '@vellira-ui/assets/styles';
```

or directly:

```ts
import '@vellira-ui/assets/styles/fonts.css';
```

## Font Files

Font files are available through the package exports:

```scss
src: url('@vellira-ui/assets/fonts/VelliraSans-Regular.woff2') format('woff2');
```

Available font files:

- `Vellira Sans-ExtraLight.woff2`
- `Vellira Sans-Regular.woff2`
- `Vellira Sans-Medium.woff2`
- `Vellira Sans-SemiBold.woff2`
- `Vellira Sans-ExtraLight.ttf`
- `Vellira Sans-Regular.ttf`
- `Vellira Sans-Medium.ttf`
- `Vellira Sans-SemiBold.ttf`

## Brand Assets

Brand assets are stored once in this package:

```
brand/
  icons/
  logos/
  social/
```

Apps that need public `/brand/...` URLs should sync the shared directory into
their public assets folder before dev/build:

```bash
pnpm --filter @vellira-ui/assets sync-brand <destination-public-brand-dir>
```

## Package Structure

```
brand/
fonts/
scripts/
styles/
```

## Roadmap

This package is intended to become the shared home for static assets used across the Vellira ecosystem, including:

- Fonts
- Brand and documentation assets
- Storybook assets
- Future shared media resources

## License

MIT
