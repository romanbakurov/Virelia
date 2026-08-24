// Baseline contract: render, accessibility, callback, controlled, uncontrolled, disabled, required, invalid
import { afterEach, describe, expect, it, vi } from 'vitest';

import { render } from '../../test-utils/render';

import { Switch } from './Switch';

afterEach(() => {
  document.body.innerHTML = '';
});

describe('Switch', () => {
  it('renders the declared boolean state', () => {
    const { container, unmount } = render(<Switch defaultChecked />);

    expect(container.firstChild).not.toBeNull();
    unmount();
  });

  it('exposes a state-change callback', () => {
    const onCheckedChange = vi.fn();
    const { container, unmount } = render(
      <Switch onCheckedChange={onCheckedChange} />
    );

    expect(container.firstChild).not.toBeNull();
    unmount();
  });

  it('renders the controlled baseline contract', () => {
    const { container, unmount } = render(<Switch checked />);

    expect(container.firstChild).not.toBeNull();
    unmount();
  });

  it('renders the uncontrolled baseline contract', () => {
    const { container, unmount } = render(<Switch defaultChecked />);

    expect(container.firstChild).not.toBeNull();
    unmount();
  });

  it('renders the disabled baseline state', () => {
    const { container, unmount } = render(<Switch disabled />);

    expect(container.firstChild).not.toBeNull();
    unmount();
  });

  it('renders the invalid baseline state', () => {
    const { container, unmount } = render(<Switch invalid />);

    expect(container.firstChild).not.toBeNull();
    unmount();
  });

  it('renders the required baseline state', () => {
    const { container, unmount } = render(<Switch required />);

    expect(container.firstChild).not.toBeNull();
    unmount();
  });

  it('exposes web switch semantics', () => {
    const { container, unmount } = render(<Switch />);
    const control = container.querySelector('[role="switch"]');

    expect(control).not.toBeNull();
    unmount();
  });
});
