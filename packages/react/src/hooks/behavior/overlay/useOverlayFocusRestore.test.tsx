import { act, createRef } from 'react';

import type { RefObject } from 'react';
import { describe, expect, it, vi } from 'vitest';

import { render } from '../../../test-utils/render';

import { useOverlayFocusRestore } from './useOverlayFocusRestore';

type TestOverlayProps = {
  active: boolean;
  enabled?: boolean;
  finalFocus?: RefObject<HTMLElement | null>;
  onCloseAutoFocus?: Parameters<
    typeof useOverlayFocusRestore
  >[0]['onCloseAutoFocus'];
};

function TestOverlay({
  active,
  enabled,
  finalFocus,
  onCloseAutoFocus,
}: TestOverlayProps) {
  useOverlayFocusRestore({
    active,
    enabled,
    finalFocus,
    onCloseAutoFocus,
  });

  return null;
}

async function flushMicrotasks() {
  await act(async () => {
    await new Promise((resolve) => queueMicrotask(resolve));
  });
}

describe('useOverlayFocusRestore', () => {
  it('restores focus to the element focused before open', async () => {
    const trigger = document.createElement('button');
    trigger.type = 'button';
    document.body.append(trigger);
    trigger.focus();

    const { rerender, unmount } = render(<TestOverlay active />);

    const contentButton = document.createElement('button');
    contentButton.type = 'button';
    document.body.append(contentButton);
    contentButton.focus();

    rerender(<TestOverlay active={false} />);
    await flushMicrotasks();

    expect(document.activeElement).toBe(trigger);

    unmount();
    trigger.remove();
    contentButton.remove();
  });

  it('prefers finalFocus over the previously focused element', async () => {
    const trigger = document.createElement('button');
    const finalFocusElement = document.createElement('button');
    const finalFocus = createRef<HTMLElement>();

    trigger.type = 'button';
    finalFocusElement.type = 'button';
    finalFocus.current = finalFocusElement;
    document.body.append(trigger, finalFocusElement);
    trigger.focus();

    const { rerender, unmount } = render(
      <TestOverlay active finalFocus={finalFocus} />
    );

    rerender(<TestOverlay active={false} finalFocus={finalFocus} />);
    await flushMicrotasks();

    expect(document.activeElement).toBe(finalFocusElement);

    unmount();
    trigger.remove();
    finalFocusElement.remove();
  });

  it('does not restore focus when disabled', async () => {
    const trigger = document.createElement('button');
    const contentButton = document.createElement('button');

    trigger.type = 'button';
    contentButton.type = 'button';
    document.body.append(trigger, contentButton);
    trigger.focus();

    const { rerender, unmount } = render(
      <TestOverlay active enabled={false} />
    );

    contentButton.focus();
    rerender(<TestOverlay active={false} enabled={false} />);
    await flushMicrotasks();

    expect(document.activeElement).toBe(contentButton);

    unmount();
    trigger.remove();
    contentButton.remove();
  });

  it('does not restore focus when close autofocus is prevented', async () => {
    const trigger = document.createElement('button');
    const contentButton = document.createElement('button');
    const onCloseAutoFocus = vi.fn((event) => event.preventDefault());

    trigger.type = 'button';
    contentButton.type = 'button';
    document.body.append(trigger, contentButton);
    trigger.focus();

    const { rerender, unmount } = render(
      <TestOverlay active onCloseAutoFocus={onCloseAutoFocus} />
    );

    contentButton.focus();
    rerender(
      <TestOverlay active={false} onCloseAutoFocus={onCloseAutoFocus} />
    );
    await flushMicrotasks();

    expect(onCloseAutoFocus).toHaveBeenCalledTimes(1);
    expect(document.activeElement).toBe(contentButton);

    unmount();
    trigger.remove();
    contentButton.remove();
  });
});
