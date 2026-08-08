import type { CSSProperties } from 'react';
import { describe, expect, it } from 'vitest';

import { render } from '../../../test-utils/render';

import { useOverlayPresentation } from './useOverlayPresentation';

type PresentationResult = ReturnType<typeof useOverlayPresentation>;

function TestPresentation({
  onReady,
  ...options
}: Parameters<typeof useOverlayPresentation>[0] & {
  onReady: (value: PresentationResult) => void;
}) {
  const presentation = useOverlayPresentation(options);

  onReady(presentation);

  return null;
}

describe('useOverlayPresentation', () => {
  it('resolves floating presentation and fixed strategy for portalled overlays', () => {
    let result: PresentationResult | undefined;

    const { unmount } = render(
      <TestPresentation
        open
        portal
        onReady={(value) => {
          result = value;
        }}
      />
    );

    expect(result?.presentation).toBe('floating');
    expect(result?.floatingStyles.position).toBe('fixed');

    unmount();
  });

  it('resolves inline presentation and absolute strategy for inline overlays', () => {
    let result: PresentationResult | undefined;

    const { unmount } = render(
      <TestPresentation
        open
        portal={false}
        onReady={(value) => {
          result = value;
        }}
      />
    );

    expect(result?.presentation).toBe('inline');
    expect(result?.floatingStyles.position).toBe('absolute');

    unmount();
  });

  it('preserves explicit modal presentation metadata', () => {
    let result: PresentationResult | undefined;
    const animationStyle = {
      '--modal-animation-open-duration': '200ms',
    } as CSSProperties;

    const { unmount } = render(
      <TestPresentation
        animationStyle={animationStyle}
        presentation='modal'
        onReady={(value) => {
          result = value;
        }}
      />
    );

    expect(result?.presentation).toBe('modal');
    expect(result?.animationStyle).toBe(animationStyle);

    unmount();
  });
});
