import { Text } from 'react-native';
import { describe, expect, it, vi } from 'vitest';

import { render } from '../../test-utils/render';

import { Portal, PortalProvider } from './Portal';

describe('Native Portal', () => {
  it('renders children through the native adapter', () => {
    const { container, unmount } = render(
      <Portal>
        <Text>Portal content</Text>
      </Portal>
    );

    expect(container.textContent).toContain('Portal content');

    unmount();
  });

  it('supports a provider container value for API parity', () => {
    const { container, unmount } = render(
      <PortalProvider container={{}}>
        <Portal>
          <Text>Provided portal content</Text>
        </Portal>
      </PortalProvider>
    );

    expect(container.textContent).toContain('Provided portal content');

    unmount();
  });

  it('does not pass deprecated pointerEvents as a web prop', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const error = vi.spyOn(console, 'error').mockImplementation(() => {});

    const { unmount } = render(
      <Portal>
        <Text>Portal content</Text>
      </Portal>
    );

    const messages = [...warn.mock.calls, ...error.mock.calls]
      .flat()
      .join('\n');

    expect(messages).not.toContain('props.pointerEvents is deprecated');

    unmount();
    warn.mockRestore();
    error.mockRestore();
  });
});
