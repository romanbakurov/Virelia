import { act, createRef } from 'react';
import { createRoot } from 'react-dom/client';

import { afterEach, describe, expect, it, vi } from 'vitest';

import { expectNoA11yViolations } from '../../test-utils/a11y';

import { Button } from './Button';
import type { ButtonProps } from './types';

import styles from './Button.module.scss';

afterEach(() => {
  document.body.innerHTML = '';
  vi.restoreAllMocks();
});

describe('Button', () => {
  const renderButton = (props: ButtonProps = {}) => {
    const container = document.createElement('div');
    document.body.append(container);
    const root = createRoot(container);

    act(() => root.render(<Button {...props}>{props.children}</Button>));

    return {
      button: container.querySelector('button'),
      container,
      root,
    };
  };

  it('calls onClick when enabled', async () => {
    const onClick = vi.fn();
    const { button, container, root } = renderButton({
      children: 'Save',
      onClick,
    });

    await expectNoA11yViolations(container);

    act(() => button?.click());

    expect(onClick).toHaveBeenCalledOnce();
    act(() => root.unmount());
  });

  it('uses the standard aria-label attribute', () => {
    const { button, root } = renderButton({
      'aria-label': 'Search',
      leftIcon: 'icon',
    });

    expect(button?.getAttribute('aria-label')).toBe('Search');
    act(() => root.unmount());
  });

  it('defaults to type button', () => {
    const { button, root } = renderButton({ children: 'Save' });

    expect(button?.getAttribute('type')).toBe('button');
    act(() => root.unmount());
  });

  it('forwards refs to the button element', () => {
    const ref = createRef<HTMLButtonElement>();
    const container = document.createElement('div');
    document.body.append(container);
    const root = createRoot(container);

    act(() => root.render(<Button ref={ref}>Save</Button>));

    expect(ref.current).toBe(container.querySelector('button'));
    act(() => root.unmount());
  });

  it('passes custom className and fullWidth class', () => {
    const { button, root } = renderButton({
      children: 'Save',
      className: 'custom-button',
      fullWidth: true,
    });

    expect(button?.className).toContain('custom-button');
    expect(button?.className).toContain('fullWidth');
    act(() => root.unmount());
  });

  it('applies color, variant, and size classes from the public API', () => {
    const colors = ['primary', 'secondary', 'close', 'danger'] as const;
    const variants = ['solid', 'outline', 'ghost'] as const;
    const sizes = ['sm', 'md', 'lg'] as const;

    for (const color of colors) {
      for (const variant of variants) {
        for (const size of sizes) {
          const { button, root } = renderButton({
            children: `${color} ${variant} ${size}`,
            color,
            variant,
            size,
          });

          expect(button?.classList.contains(styles[color])).toBe(true);
          expect(button?.classList.contains(styles[variant])).toBe(true);
          expect(button?.classList.contains(styles[size])).toBe(true);

          act(() => root.unmount());
        }
      }
    }
  });

  it('renders left and right icons', () => {
    const { container, root } = renderButton({
      children: 'Save',
      leftIcon: <svg data-testid='left-icon' />,
      rightIcon: <svg data-testid='right-icon' />,
    });

    expect(container.querySelector('[data-testid="left-icon"]')).toBeTruthy();
    expect(container.querySelector('[data-testid="right-icon"]')).toBeTruthy();
    act(() => root.unmount());
  });

  it('hides the label for icon-only buttons with an accessible label', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    const { button, container, root } = renderButton({
      'aria-label': 'Search',
      iconOnly: true,
      leftIcon: <svg data-testid='search-icon' />,
      children: 'Search',
    });

    await expectNoA11yViolations(container);

    expect(button?.getAttribute('aria-label')).toBe('Search');
    expect(button?.className).toContain('iconOnly');
    expect(button?.textContent).toBe('');
    expect(warn).not.toHaveBeenCalled();
    act(() => root.unmount());
  });

  it('warns for icon-only buttons without an accessible label', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    const { root } = renderButton({
      iconOnly: true,
      leftIcon: <svg data-testid='search-icon' />,
    });

    expect(warn).toHaveBeenCalledWith(
      'Button: icon-only buttons must provide aria-label.'
    );
    act(() => root.unmount());
  });

  it('renders loading state and loadingText', () => {
    const { button, root } = renderButton({
      children: 'Save',
      loading: true,
      loadingText: 'Saving...',
    });

    expect(button?.disabled).toBe(true);
    expect(button?.getAttribute('aria-busy')).toBe('true');
    expect(button?.textContent).toBe('Saving...');
    act(() => root.unmount());
  });

  it('does not call onClick while loading', () => {
    const onClick = vi.fn();
    const { button, root } = renderButton({
      children: 'Save',
      loading: true,
      onClick,
    });

    act(() => button?.click());

    expect(onClick).not.toHaveBeenCalled();
    act(() => root.unmount());
  });
});
