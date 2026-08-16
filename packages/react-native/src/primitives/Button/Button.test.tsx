import { act } from 'react';

import { Text } from 'react-native';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { render } from '../../test-utils/render';
import { nativeThemes } from '../../theme';

import { Button } from './Button';
import type { ButtonIconElement } from './types';

const hexToRgb = (hex: string) => {
  const value = hex.replace('#', '');
  const red = Number.parseInt(value.slice(0, 2), 16);
  const green = Number.parseInt(value.slice(2, 4), 16);
  const blue = Number.parseInt(value.slice(4, 6), 16);

  return `rgb(${red}, ${green}, ${blue})`;
};

const TestIcon = ({
  color,
  size,
  testID,
}: {
  color?: string;
  size?: number;
  testID: string;
}) => (
  <Text testID={testID}>
    {color}:{size}
  </Text>
);

afterEach(() => {
  document.body.innerHTML = '';
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
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

  it('does not call onPress while loading', () => {
    const onPress = vi.fn();
    const { container, unmount } = render(
      <Button loading onPress={onPress}>
        Save
      </Button>
    );

    act(() => container.querySelector('button')?.click());

    expect(onPress).not.toHaveBeenCalled();
    expect(container.querySelector('button')?.disabled).toBe(true);
    expect(container.querySelector('button')?.getAttribute('aria-busy')).toBe(
      'true'
    );
    expect(
      container.querySelector('button')?.getAttribute('aria-disabled')
    ).toBe('true');
    expect(container.querySelector('[role="progressbar"]')).toBeTruthy();

    unmount();
  });

  it('renders loadingText while loading', () => {
    const { container, unmount } = render(
      <Button loading loadingText='Saving...'>
        Save
      </Button>
    );

    expect(container.querySelector('button')?.textContent).toContain(
      'Saving...'
    );

    unmount();
  });

  it('warns when icon-only button has no accessibilityLabel', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);

    render(<Button iconStart={<Text>Icon</Text>} />);

    expect(warn).toHaveBeenCalledWith(
      'Button: icon-only buttons must provide an accessibilityLabel.'
    );

    warn.mockRestore();
    warn.mockRestore();
    vi.clearAllMocks();
  });

  it('does not warn for icon-only buttons in production', () => {
    vi.stubGlobal('__DEV__', false);
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);

    render(<Button iconStart={<Text>Icon</Text>} />);

    expect(warn).not.toHaveBeenCalled();
  });

  it('does not warn for icon-only buttons with accessibilityLabel', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    const { container, unmount } = render(
      <Button
        accessibilityLabel='Search'
        fullWidth
        iconOnly
        iconStart={<Text>Icon</Text>}
      >
        Search
      </Button>
    );
    const button = container.querySelector('button');

    expect(button?.getAttribute('aria-label')).toBe('Search');
    expect(button?.textContent).toBe('Icon');
    expect(button?.style.width).toBe('46px');
    expect(button?.style.height).toBe('46px');
    expect(button?.style.alignSelf).toBe('');
    expect(warn).not.toHaveBeenCalled();

    unmount();
  });

  it('passes color and size to left and right icons', () => {
    const iconColor =
      nativeThemes.light.components.button.primary.solid.default.fg;
    const iconStart = (
      <TestIcon testID='left-icon' />
    ) satisfies ButtonIconElement;
    const iconEnd = (
      <TestIcon testID='right-icon' />
    ) satisfies ButtonIconElement;
    const { container, unmount } = render(
      <Button iconSize={18} iconStart={iconStart} iconEnd={iconEnd}>
        Save
      </Button>
    );

    expect(
      container.querySelector('[data-testid="left-icon"]')?.textContent
    ).toBe(`${iconColor}:18`);
    expect(
      container.querySelector('[data-testid="right-icon"]')?.textContent
    ).toBe(`${iconColor}:18`);

    unmount();
  });

  it('applies fullWidth and custom style', () => {
    const { container, unmount } = render(
      <Button fullWidth style={{ width: 240 }}>
        Save
      </Button>
    );
    const button = container.querySelector('button');

    expect(button?.style.alignSelf).toBe('');
    expect(button?.style.width).toBe('240px');

    unmount();
  });

  it('does not stretch fullWidth vertically on React Native Web', () => {
    const { container, unmount } = render(<Button fullWidth>Save</Button>);
    const button = container.querySelector('button');

    expect(button?.style.width).toBe('100%');
    expect(button?.style.alignSelf).toBe('');

    unmount();
  });

  it('uses hover tokens when hovered', () => {
    const { container, unmount } = render(<Button>Save</Button>);
    const button = container.querySelector('button');

    act(() => {
      button?.dispatchEvent(new MouseEvent('mouseover', { bubbles: true }));
    });

    expect(button?.style.backgroundColor).toBe(
      hexToRgb(nativeThemes.light.components.button.primary.solid.hover.bg)
    );

    unmount();
  });

  it('shows a focus ring when focus is visible', () => {
    const matchesSpy = vi
      .spyOn(HTMLElement.prototype, 'matches')
      .mockReturnValue(true);

    const { container, unmount } = render(<Button>Button</Button>);
    const button = container.querySelector('button');

    act(() => {
      button?.focus();
    });

    expect(button?.style.borderColor).toBe(
      hexToRgb(nativeThemes.light.semantic.focus.ring.color)
    );

    matchesSpy.mockRestore();
    unmount();
  });

  it('does not show a focus ring for non-visible web focus', () => {
    const matchesSpy = vi
      .spyOn(HTMLElement.prototype, 'matches')
      .mockReturnValue(false);

    const { container, unmount } = render(<Button>Button</Button>);
    const button = container.querySelector('button');

    act(() => {
      button?.focus();
    });

    expect(button?.style.borderColor).not.toBe(
      hexToRgb(nativeThemes.light.semantic.focus.ring.color)
    );

    matchesSpy.mockRestore();
    unmount();
  });

  it('keeps the hover background when focused while hovered', () => {
    const { container, unmount } = render(<Button>Save</Button>);
    const button = container.querySelector('button');
    const hoverBg = hexToRgb(
      nativeThemes.light.components.button.primary.solid.hover.bg
    );

    act(() => {
      button?.dispatchEvent(new MouseEvent('mouseover', { bubbles: true }));
      button?.focus();
    });

    expect(button?.style.backgroundColor).toBe(hoverBg);
    expect(button?.style.borderColor).toBe(
      hexToRgb(nativeThemes.light.semantic.focus.ring.color)
    );

    unmount();
  });
});
