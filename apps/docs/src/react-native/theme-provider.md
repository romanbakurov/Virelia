---
title: React Native ThemeProvider
description: Apply and control Vellira light, dark, and high-contrast themes in React Native with ThemeProvider and useTheme.
---

# ThemeProvider

ThemeProvider supplies the active Vellira native theme to components.

## Basic Usage

```tsx
import { ThemeProvider } from '@vellira-ui/react-native';

<ThemeProvider defaultTheme='dark'>
  <App />
</ThemeProvider>
```

## Supported Themes

| Theme | Purpose |
| --- | --- |
| `light` | Default light interface |
| `dark` | Dark interface |
| `highContrast` | Higher-contrast native theme |

## Controlled Theme

```tsx
<ThemeProvider
  theme={themeName}
  onThemeChange={setThemeName}
>
  <App />
</ThemeProvider>
```

Use controlled mode when theme state is stored in app settings, navigation state, or persistent storage.

## Uncontrolled Theme

```tsx
<ThemeProvider defaultTheme='light'>
  <App />
</ThemeProvider>
```

## Reading The Theme

```tsx
import { useTheme } from '@vellira-ui/react-native';

function ThemeReader() {
  const { themeName, theme, setTheme } = useTheme();

  return null;
}
```

`useTheme` returns:

| Property | Purpose |
| --- | --- |
| `themeName` | Current theme name |
| `theme` | Current native token object |
| `setTheme` | Updates the active theme |

## Theme Switcher

```tsx
import {
  Button,
  useTheme,
} from '@vellira-ui/react-native';
import { View } from 'react-native';

export function ThemeSwitcher() {
  const { themeName, setTheme } = useTheme();

  return (
    <View style={{ gap: 8 }}>
      <Button
        appearance={themeName === 'light' ? 'solid' : 'outline'}
        onPress={() => setTheme('light')}
      >
        Light
      </Button>

      <Button
        appearance={themeName === 'dark' ? 'solid' : 'outline'}
        onPress={() => setTheme('dark')}
      >
        Dark
      </Button>

      <Button
        appearance={themeName === 'highContrast' ? 'solid' : 'outline'}
        onPress={() => setTheme('highContrast')}
      >
        High contrast
      </Button>
    </View>
  );
}
```

## Using Tokens

```tsx
import { useTheme } from '@vellira-ui/react-native';
import { Text, View } from 'react-native';

function Card() {
  const { theme } = useTheme();

  return (
    <View
      style={{
        backgroundColor: theme.colors.background,
        padding: theme.spacing.md,
      }}
    >
      <Text style={{ color: theme.colors.text }}>
        Themed content
      </Text>
    </View>
  );
}
```

Use the actual token paths exposed by the current `NativeTheme` type.

## Accessibility

- Do not assume dark mode and high contrast are equivalent.
- Check text, controls, borders, pressed states, and disabled states in every supported theme.
- Avoid hard-coded colors around themed Vellira components.
- Persist a user-selected theme deliberately and avoid unexpected changes during a session.

## See Also

- [Design Tokens](/design-system/tokens)
- [Theme Architecture](/design-system/theme-architecture)
- [Accessibility](/design-system/accessibility)
