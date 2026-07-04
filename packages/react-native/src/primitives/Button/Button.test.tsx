import { act } from 'react';

import { Text } from 'react-native';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { render } from '../../test-utils/render';

import { Button } from './Button';

afterEach(() => {
  document.body.innerHTML = '';
  vi.restoreAllMocks();
});

describe('Native Button', () => {
  it('calls onPress when enabled', () => {
    const onPress = vi.fn();
    const { container, unmount } = render(
      <Button onPress={onPress}>Save</Button>
    );

    act(() => container.querySelector('button')?.click());

    expect(onPress).toHaveBeenCalledOnce();

    unmount();
  });

  it('does not call onPress when disabled', () => {
    const onPress = vi.fn();
    const { container, unmount } = render(
      <Button disabled onPress={onPress}>
        Save
      </Button>
    );

    act(() => container.querySelector('button')?.click());

    expect(onPress).not.toHaveBeenCalled();

    unmount();
  });

  it('warns when icon-only button has no accessibilityLabel', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);

    render(<Button leftIcon={<Text>Icon</Text>} />);

    expect(warn).toHaveBeenCalledWith(
      'Vellira Button: icon-only buttons must provide an accessibilityLabel.'
    );

    warn.mockRestore();
    warn.mockRestore();
    vi.clearAllMocks();
  });
});
