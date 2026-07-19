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
import '@vellira-ui/assets/styles/fonts.scss';
```

## Font Files

Font files are available through the package exports:

```scss
src: url('@vellira-ui/assets/fonts/VelliraSans-Regular.woff2') format('woff2');
```

Available font files:

- `VelliraSans-ExtraLight.woff2`
- `VelliraSans-Regular.woff2`
- `VelliraSans-Medium.woff2`
- `VelliraSans-SemiBold.woff2`
- `VelliraSans-ExtraLight.ttf`
- `VelliraSans-Regular.ttf`
- `VelliraSans-Medium.ttf`
- `VelliraSans-SemiBold.ttf`

## Package Structure

```
fonts/
styles/
```

## Roadmap

This package is intended to become the shared home for static assets used across the Vellira ecosystem, including:

- Fonts
- Documentation assets
- Storybook assets
- Future shared media resources

## License

MIT
