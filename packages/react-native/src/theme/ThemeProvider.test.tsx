import { act, useEffect } from 'react';

import { Pressable, Text } from 'react-native';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { render } from '../test-utils/render';

import { semanticColor } from './semanticColor';
import { ThemeProvider } from './ThemeProvider';
import { type NativeThemeName, nativeThemes } from './themes';
import { useTheme } from './useTheme';
import { useThemeStyles } from './useThemeStyles';

afterEach(() => {
  document.body.innerHTML = '';
  vi.restoreAllMocks();
});

const ThemeReader = () => {
  const { themeName, theme, setTheme } = useTheme();

  return (
    <Pressable
      accessibilityRole='button'
      accessibilityLabel='theme-toggle'
      onPress={() => setTheme('dark')}
    >
      <Text>
        {themeName}:{theme.name}
      </Text>
    </Pressable>
  );
};

describe('Native theme runtime', () => {
  it('provides the light theme from the default context', () => {
    const { container, unmount } = render(<ThemeReader />);

    expect(container.textContent).toBe('light:light');

    unmount();
  });

  it('supports uncontrolled theme updates', () => {
    const onThemeChange = vi.fn();
    const { container, unmount } = render(
      <ThemeProvider defaultTheme='highContrast' onThemeChange={onThemeChange}>
        <ThemeReader />
      </ThemeProvider>
    );

    expect(container.textContent).toBe('highContrast:high-contrast');

    act(() => container.querySelector('button')?.click());

    expect(container.textContent).toBe('dark:dark');
    expect(onThemeChange).toHaveBeenCalledWith('dark');

    unmount();
  });

  it('keeps controlled theme value until the parent changes it', () => {
    const onThemeChange = vi.fn();
    const { container, rerender, unmount } = render(
      <ThemeProvider theme='light' onThemeChange={onThemeChange}>
        <ThemeReader />
      </ThemeProvider>
    );

    act(() => container.querySelector('button')?.click());

    expect(onThemeChange).toHaveBeenCalledWith('dark');
    expect(container.textContent).toBe('light:light');

    rerender(
      <ThemeProvider theme='dark' onThemeChange={onThemeChange}>
        <ThemeReader />
      </ThemeProvider>
    );

    expect(container.textContent).toBe('dark:dark');

    unmount();
  });

  it('exposes the default context setter as a no-op', () => {
    const { container, unmount } = render(<ThemeReader />);

    act(() => container.querySelector('button')?.click());

    expect(container.textContent).toBe('light:light');

    unmount();
  });
});

describe('semanticColor', () => {
  const colors = {
    light: 'light-value',
    dark: 'dark-value',
    highContrast: 'contrast-value',
  };

  it.each([
    ['light', 'light-value'],
    ['dark', 'dark-value'],
    ['highContrast', 'contrast-value'],
  ] satisfies Array<[NativeThemeName, string]>)(
    'resolves the %s semantic value',
    (themeName, expected) => {
      expect(semanticColor(nativeThemes[themeName], colors)).toBe(expected);
    }
  );
});

describe('useThemeStyles', () => {
  it('memoizes styles until the active theme changes', () => {
    const createStyles = vi.fn((theme) => ({
      backgroundColor: theme.semantic.surface.default,
    }));
    const seenStyles: Array<{ backgroundColor: string }> = [];

    const StyleReader = ({ marker }: { marker: string }) => {
      const styles = useThemeStyles(createStyles);

      useEffect(() => {
        seenStyles.push(styles);
      }, [marker, styles]);

      return <Text>{styles.backgroundColor}</Text>;
    };

    const { rerender, unmount } = render(
      <ThemeProvider theme='light'>
        <StyleReader marker='one' />
      </ThemeProvider>
    );

    rerender(
      <ThemeProvider theme='light'>
        <StyleReader marker='two' />
      </ThemeProvider>
    );

    rerender(
      <ThemeProvider theme='dark'>
        <StyleReader marker='three' />
      </ThemeProvider>
    );

    expect(createStyles).toHaveBeenCalledTimes(2);
    expect(seenStyles[0]).toBe(seenStyles[1]);
    expect(seenStyles[1]).not.toBe(seenStyles[2]);

    unmount();
  });
});
