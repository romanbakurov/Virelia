import type { ReactNode } from 'react';
import { afterEach, describe, expect, it } from 'vitest';

import { render } from '../../test-utils/render';

import meta, {
  AccessibleWithoutVisibleLabel,
  Controlled,
  Error,
  Indeterminate,
  Playground,
  Sizes,
  States,
  WithDescription,
} from './Checkbox.stories';

afterEach(() => {
  document.body.innerHTML = '';
});

const renderStory = (
  story: {
    args?: Record<string, unknown>;
    render?: (args: Record<string, unknown>) => ReactNode;
  },
  extraArgs: Record<string, unknown> = {}
) => {
  const args = {
    ...(meta.args as Record<string, unknown>),
    ...story.args,
    ...extraArgs,
  };

  return render(story.render?.(args) ?? null);
};

describe('Native Checkbox stories', () => {
  it('smoke-renders interactive stories', () => {
    const stories = [
      Playground,
      Controlled,
      Indeterminate,
      Error,
      WithDescription,
      AccessibleWithoutVisibleLabel,
    ];

    for (const story of stories) {
      const { container, unmount } = renderStory(story);

      expect(container.querySelector('[role="checkbox"]')).toBeTruthy();

      unmount();
    }
  });

  it('renders size and state matrices', () => {
    const { container: sizesContainer, unmount: unmountSizes } =
      renderStory(Sizes);

    expect(sizesContainer.querySelectorAll('[role="checkbox"]')).toHaveLength(
      3
    );

    unmountSizes();

    const { container: statesContainer, unmount: unmountStates } =
      renderStory(States);

    expect(statesContainer.querySelectorAll('[role="checkbox"]').length).toBe(
      7
    );
    expect(statesContainer.textContent).toContain(
      'This option is required to continue.'
    );
    expect(statesContainer.textContent).toContain('This field is required');

    unmountStates();
  });

  it('renders the accessible icon-only story without visible label text', () => {
    const { container, unmount } = renderStory(AccessibleWithoutVisibleLabel);

    const checkbox = container.querySelector('[role="checkbox"]');

    expect(checkbox?.getAttribute('aria-label')).toBe('Enable notifications');
    expect(container.textContent).not.toContain('Enable notifications');
    expect(container.textContent).not.toContain('Accept terms');

    unmount();
  });
});
