import type { Preview } from '@storybook/react-vite';

import { ThemeProvider } from '@vellira-ui/react';

import '@vellira-ui/tokens/css';
import '@vellira-ui/react/styles';
import '@vellira-ui/assets/styles';

const withTheme: Preview['decorators'][number] = (Story, context) => {
  const theme = context.globals.theme ?? 'light';

  document.documentElement.dataset.theme = theme;
  document.documentElement.dataset.velliraTheme = theme;

  return (
    <ThemeProvider theme={theme}>
      <div
        style={{
          minHeight: '100vh',
          width: '100%',
          background: 'var(--surface-default)',
          color: 'var(--text-primary)',
          padding: 24,
          boxSizing: 'border-box',
          transition: 'none',
        }}
      >
        <Story />
      </div>
    </ThemeProvider>
  );
};

const preview: Preview = {
  globalTypes: {
    theme: {
      name: 'Theme',
      description: 'Vellira theme',
      defaultValue: 'light',
      toolbar: {
        icon: 'paintbrush',
        showName: true,
        items: [
          { value: 'light', title: 'Light' },
          { value: 'dark', title: 'Dark' },
          { value: 'high-contrast', title: 'High Contrast' },
        ],
      },
    },
  },

  decorators: [withTheme],

  parameters: {
    backgrounds: {
      disable: true,
    },

    layout: 'fullscreen',

    controls: {
      expanded: true,
    },

    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: 'todo',
    },
  },
};

export default preview;
