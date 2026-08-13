import { act } from 'react';

import { Text } from 'react-native';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { render } from '../../test-utils/render';
import { nativeThemes } from '../../theme';

import { Checkbox } from './Checkbox';
import { createStyles } from './Checkbox.styles';

afterEach(() => {
  document.body.innerHTML = '';
  vi.restoreAllMocks();
});

describe('Native Checkbox', () => {
  it('toggles uncontrolled value and calls onCheckedChange', () => {
    const onCheckedChange = vi.fn();
    const { container, unmount } = render(
      <Checkbox label='Accept' onCheckedChange={onCheckedChange} />
    );

    const checkbox =
      container.querySelector<HTMLButtonElement>('[role="checkbox"]');

    expect(checkbox?.getAttribute('aria-checked')).toBe('false');
    act(() => checkbox?.click());
    expect(checkbox?.getAttribute('aria-checked')).toBe('true');
    expect(onCheckedChange).toHaveBeenCalledWith(true);

    unmount();
  });

  it('uses the label as the accessible name', () => {
    const { container, unmount } = render(<Checkbox label='Accept terms' />);

    const checkbox =
      container.querySelector<HTMLButtonElement>('[role="checkbox"]');

    expect(checkbox?.getAttribute('aria-label')).toBe('Accept terms');

    unmount();
  });

  it('renders description text', () => {
    const { container, unmount } = render(
      <Checkbox
        label='Product updates'
        description='Receive occasional release notes.'
      />
    );

    expect(container.textContent).toContain(
      'Receive occasional release notes.'
    );

    unmount();
  });

  it('resolves the indeterminate state to checked on press', () => {
    const onCheckedChange = vi.fn();
    const { container, unmount } = render(
      <Checkbox
        label='Accept'
        indeterminate
        onCheckedChange={onCheckedChange}
      />
    );

    const checkbox =
      container.querySelector<HTMLButtonElement>('[role="checkbox"]');

    act(() => checkbox?.click());

    expect(onCheckedChange).toHaveBeenCalledWith(true);
    unmount();
  });

  it('warns when no accessible label is provided', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    const { unmount } = render(<Checkbox />);

    expect(warn).toHaveBeenCalledWith(
      'Checkbox: an accessible label must be provided through label or accessibilityLabel.'
    );

    unmount();
  });

  it('keeps controlled value until checked changes', () => {
    const onCheckedChange = vi.fn();
    const { container, rerender, unmount } = render(
      <Checkbox
        label='Accept'
        checked={false}
        onCheckedChange={onCheckedChange}
      />
    );

    const checkbox =
      container.querySelector<HTMLButtonElement>('[role="checkbox"]');

    act(() => checkbox?.click());

    expect(onCheckedChange).toHaveBeenCalledWith(true);
    expect(checkbox?.getAttribute('aria-checked')).toBe('false');

    rerender(
      <Checkbox label='Accept' checked onCheckedChange={onCheckedChange} />
    );

    expect(checkbox?.getAttribute('aria-checked')).toBe('true');

    unmount();
  });

  it('marks disabled state and ignores presses', () => {
    const onCheckedChange = vi.fn();
    const { container, unmount } = render(
      <Checkbox
        label='Accept'
        disabled
        defaultChecked
        onCheckedChange={onCheckedChange}
      />
    );

    const checkbox =
      container.querySelector<HTMLButtonElement>('[role="checkbox"]');

    expect(checkbox?.getAttribute('aria-disabled')).toBe('true');
    expect(checkbox?.getAttribute('aria-checked')).toBe('true');

    act(() => checkbox?.click());

    expect(onCheckedChange).not.toHaveBeenCalled();
    expect(checkbox?.getAttribute('aria-checked')).toBe('true');

    unmount();
  });

  it('renders custom icons and accepts color and label position props', () => {
    const { container, rerender, unmount } = render(
      <Checkbox
        label='Accept'
        checked
        color='success'
        labelPosition='start'
        icon={<Text testID='native-custom-check'>ok</Text>}
      />
    );

    expect(
      container.querySelector('[data-testid="native-custom-check"]')
    ).not.toBe(null);

    rerender(
      <Checkbox
        label='Accept'
        indeterminate
        color='warning'
        indeterminateIcon={<Text testID='native-custom-mixed'>mixed</Text>}
      />
    );

    expect(
      container.querySelector('[data-testid="native-custom-mixed"]')
    ).not.toBe(null);

    unmount();
  });

  it('keeps labeled row height stable across sizes', () => {
    const styles = createStyles(nativeThemes.light);

    expect(styles.labelSm.lineHeight).toBe(
      nativeThemes.light.tokens.typography.lineHeight.md
    );
    expect(styles.labelMd.lineHeight).toBe(
      nativeThemes.light.tokens.typography.lineHeight.md
    );
    expect(styles.labelLg.lineHeight).toBe(
      nativeThemes.light.tokens.typography.lineHeight.md
    );
  });
});
