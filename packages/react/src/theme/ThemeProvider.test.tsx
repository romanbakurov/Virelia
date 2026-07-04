import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { ThemeProvider } from './ThemeProvider';
import { useTheme } from './useTheme';

afterEach(() => {
  cleanup();
  delete document.documentElement.dataset.velliraTheme;
});

const ThemeConsumer = () => {
  const { theme, setTheme } = useTheme();

  return (
    <>
      <span data-testid='theme'>{theme}</span>

      <button type='button' onClick={() => setTheme('dark')}>
        Set dark
      </button>
    </>
  );
};

describe('ThemeProvider', () => {
  it('renders children with default theme', () => {
    render(
      <ThemeProvider>
        <div>Content</div>
      </ThemeProvider>
    );

    expect(screen.getByText('Content')).toBeInTheDocument();
    expect(screen.getByText('Content').parentElement).toHaveAttribute(
      'data-vellira-theme',
      'light'
    );
  });

  it('uses defaultTheme for uncontrolled usage', () => {
    render(
      <ThemeProvider defaultTheme='dark'>
        <div>Content</div>
      </ThemeProvider>
    );

    expect(screen.getByText('Content').parentElement).toHaveAttribute(
      'data-vellira-theme',
      'dark'
    );
  });

  it('normalizes highContrast theme names for CSS selectors', () => {
    render(
      <ThemeProvider defaultTheme='highContrast'>
        <div>Content</div>
      </ThemeProvider>
    );

    expect(screen.getByText('Content').parentElement).toHaveAttribute(
      'data-vellira-theme',
      'high-contrast'
    );
    expect(document.documentElement).toHaveAttribute(
      'data-vellira-theme',
      'high-contrast'
    );
  });

  it('provides theme value through context', () => {
    render(
      <ThemeProvider defaultTheme='dark'>
        <ThemeConsumer />
      </ThemeProvider>
    );

    expect(screen.getByTestId('theme')).toHaveTextContent('dark');
  });

  it('updates uncontrolled theme through useTheme', async () => {
    const user = userEvent.setup();

    render(
      <ThemeProvider defaultTheme='light'>
        <ThemeConsumer />
      </ThemeProvider>
    );

    await user.click(screen.getByRole('button', { name: 'Set dark' }));

    expect(screen.getByTestId('theme')).toHaveTextContent('dark');
  });

  it('calls onThemeChange when theme changes', async () => {
    const user = userEvent.setup();
    const onThemeChange = vi.fn();

    render(
      <ThemeProvider defaultTheme='light' onThemeChange={onThemeChange}>
        <ThemeConsumer />
      </ThemeProvider>
    );

    await user.click(screen.getByRole('button', { name: 'Set dark' }));

    expect(onThemeChange).toHaveBeenCalledWith('dark');
  });
});
