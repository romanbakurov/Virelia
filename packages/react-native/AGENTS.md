# React Native package instructions

## React Native Web parity

Components in this package are rendered both on native platforms and through
React Native Web inside the Vellira website component catalog.

Avoid native layout styles that override the website preview container's
alignment when rendered on web.

### Root `alignSelf`

Do not use an unconditional:

```ts
alignSelf: 'flex-start';
```

on the root view of a public component when that component is also rendered
through React Native Web.

On web, this can override the parent flex container's alignment and cause the
React and React Native previews to jump vertically when switching platforms.

If flex-start is required on iOS or Android, use a platform-specific value:

```import { Platform } from 'react-native';


root: {
alignSelf: Platform.select({
web: 'auto',
default: 'flex-start',
}),
},
```

If alignSelf is not required by the native component itself, prefer omitting
it entirely.

Do not apply this rule mechanically to internal layout elements such as lists,
rows, segmented containers, or other child elements where flex-start is an
intentional part of the component layout.

Cross-platform visual verification

When changing or creating a component that has both React and React Native
implementations:

compare the React and React Native previews in the Vellira website;
verify root position as well as component width and height;
check for visual jumps when switching between React and React Native;
do not compensate for component layout bugs in ComponentPlayground;
fix React Native Web behavior at the component source;
preserve native iOS and Android behavior when adding web-specific overrides.

A React Native component can have matching width and height while still causing
a large platform-switch jump if its root uses different alignment behavior on
React Native Web.

Preferred debugging order

When React and React Native previews do not align:

Compare the component's actual width and height.
Compare its position relative to the website preview container.
Inspect root styles such as alignSelf, width, flex, and positioning.
Check React Native Web-specific behavior before changing shared website
playground layout.
Prefer a component-level Platform.select fix over a website-specific
workaround.
