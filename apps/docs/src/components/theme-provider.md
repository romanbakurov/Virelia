# ThemeProvider

ThemeProvider gives Vellira components access to the active theme. Use it near
the app root or at a contained boundary when a product surface intentionally
uses a different theme.

## When To Use

Wrap the application once when all Vellira components should share the same
theme.

```tsx
import '@vellira-ui/tokens/css';
import '@vellira-ui/react/styles';
import { ThemeProvider } from '@vellira-ui/react';

<ThemeProvider defaultTheme='light'>
  <App />
</ThemeProvider>
```

Native does not need CSS imports.

```tsx
import { ThemeProvider } from '@vellira-ui/react-native';

<ThemeProvider defaultTheme='dark'>
  <App />
</ThemeProvider>
```

## Controlled Theme

Use controlled mode when theme state is stored in user settings, synchronized
with system preference, or controlled by a shell application.

```tsx
const [theme, setTheme] = useState('light');

<ThemeProvider theme={theme} onThemeChange={setTheme}>
  <App />
</ThemeProvider>
```

## Real Example: Theme Switcher

```tsx
import { Button, ThemeProvider, useTheme } from '@vellira-ui/react';
import { useState } from 'react';

function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();

  return (
    <div role='toolbar' aria-label='Theme'>
      <Button
        appearance={theme === 'light' ? 'solid' : 'ghost'}
        color='neutral'
        onClick={() => setTheme('light')}
      >
        Light
      </Button>
      <Button
        appearance={theme === 'dark' ? 'solid' : 'ghost'}
        color='neutral'
        onClick={() => setTheme('dark')}
      >
        Dark
      </Button>
      <Button
        appearance={theme === 'high-contrast' ? 'solid' : 'ghost'}
        color='neutral'
        onClick={() => setTheme('high-contrast')}
      >
        High contrast
      </Button>
    </div>
  );
}

export function AppShell() {
  const [theme, setTheme] = useState('light');

  return (
    <ThemeProvider theme={theme} onThemeChange={setTheme}>
      <ThemeSwitcher />
      <App />
    </ThemeProvider>
  );
}
```

## Supported Themes

| Web | Native | Purpose |
| --- | --- | --- |
| `light` | `light` | Default bright product UI. |
| `dark` | `dark` | Dark product UI. |
| `high-contrast` | `highContrast` | Higher contrast accessibility mode. |
| `highContrast` | `highContrast` | Web compatibility alias. |

## Production Guidance

- Import token CSS before rendering web components.
- Avoid reading theme once and caching derived colors outside render.
- Let component styles consume tokens so live theme switching updates correctly.
- Test light, dark, and high contrast modes before shipping a new component.

## See Also

- [Theme Architecture](/theme-architecture)
- [Tokens](/tokens)
