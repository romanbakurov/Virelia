import type { Preview } from '@storybook/react-vite';

import { ThemeProvider } from '@vellira-ui/react';

import '@vellira-ui/tokens/css';
import '@vellira-ui/react/styles';
import '@vellira-ui/assets/styles';

const nativeHTMLElementFocus =
  typeof HTMLElement === 'undefined' ? undefined : HTMLElement.prototype.focus;
const nativeHTMLElementBlur =
  typeof HTMLElement === 'undefined' ? undefined : HTMLElement.prototype.blur;

const restoreStorybookFocusAccessors = () => {
  if (typeof HTMLElement === 'undefined') {
    return;
  }

  const focusDescriptor = Object.getOwnPropertyDescriptor(
    HTMLElement.prototype,
    'focus'
  );
  const blurDescriptor = Object.getOwnPropertyDescriptor(
    HTMLElement.prototype,
    'blur'
  );

  if (
    nativeHTMLElementFocus &&
    (focusDescriptor?.get || focusDescriptor?.set)
  ) {
    Object.defineProperty(HTMLElement.prototype, 'focus', {
      configurable: true,
      writable: true,
      value: nativeHTMLElementFocus,
    });
  }

  if (nativeHTMLElementBlur && (blurDescriptor?.get || blurDescriptor?.set)) {
    Object.defineProperty(HTMLElement.prototype, 'blur', {
      configurable: true,
      writable: true,
      value: nativeHTMLElementBlur,
    });
  }
};

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
  beforeEach: () => {
    restoreStorybookFocusAccessors();
  },

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
