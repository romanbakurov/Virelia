import type { FloatingPlacement } from '@vellira-ui/types';

import type {
  FloatingAlign,
  FloatingBoundary,
  FloatingPositionResult,
  FloatingRect,
  FloatingSide,
  FloatingSize,
} from './types';

interface ComputeFloatingPositionOptions {
  reference: FloatingRect;
  floating: FloatingSize;
  boundary: FloatingBoundary;
  placement: FloatingPlacement;
  offset?: number;
  padding?: number;
  arrowPadding?: number;
  flip?: boolean;
  shift?: boolean;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), Math.max(min, max));
}

function parsePlacement(placement: FloatingPlacement): {
  side: FloatingSide;
  align: FloatingAlign;
} {
  const [side, align = 'center'] = placement.split('-');

  return {
    side: side as FloatingSide,
    align: align as FloatingAlign,
  };
}

function createPlacement(
  side: FloatingSide,
  align: FloatingAlign
): FloatingPlacement {
  return align === 'center' ? side : `${side}-${align}`;
}

function getOppositeSide(side: FloatingSide): FloatingSide {
  switch (side) {
    case 'top':
      return 'bottom';
    case 'right':
      return 'left';
    case 'bottom':
      return 'top';
    case 'left':
      return 'right';
  }
}

function computeBasePosition({
  reference,
  floating,
  side,
  align,
  offset,
}: {
  reference: FloatingRect;
  floating: FloatingSize;
  side: FloatingSide;
  align: FloatingAlign;
  offset: number;
}) {
  const referenceCenterX = reference.x + reference.width / 2;
  const referenceCenterY = reference.y + reference.height / 2;

  const alignedLeft =
    align === 'start'
      ? reference.x
      : align === 'end'
        ? reference.x + reference.width - floating.width
        : referenceCenterX - floating.width / 2;

  const alignedTop =
    align === 'start'
      ? reference.y
      : align === 'end'
        ? reference.y + reference.height - floating.height
        : referenceCenterY - floating.height / 2;

  switch (side) {
    case 'top':
      return {
        top: reference.y - floating.height - offset,
        left: alignedLeft,
      };

    case 'right':
      return {
        top: alignedTop,
        left: reference.x + reference.width + offset,
      };

    case 'bottom':
      return {
        top: reference.y + reference.height + offset,
        left: alignedLeft,
      };

    case 'left':
      return {
        top: alignedTop,
        left: reference.x - floating.width - offset,
      };
  }
}

function getMainAxisOverflow({
  side,
  position,
  floating,
  boundary,
  padding,
}: {
  side: FloatingSide;
  position: { top: number; left: number };
  floating: FloatingSize;
  boundary: FloatingBoundary;
  padding: number;
}) {
  switch (side) {
    case 'top':
      return padding - position.top;
    case 'right':
      return position.left + floating.width + padding - boundary.width;
    case 'bottom':
      return position.top + floating.height + padding - boundary.height;
    case 'left':
      return padding - position.left;
  }
}

export function computeFloatingPosition({
  reference,
  floating,
  boundary,
  placement,
  offset = 8,
  padding = 12,
  arrowPadding = 16,
  flip = true,
  shift = true,
}: ComputeFloatingPositionOptions): FloatingPositionResult {
  const parsed = parsePlacement(placement);

  let resolvedSide = parsed.side;
  let position = computeBasePosition({
    reference,
    floating,
    side: resolvedSide,
    align: parsed.align,
    offset,
  });

  if (
    flip &&
    getMainAxisOverflow({
      side: resolvedSide,
      position,
      floating,
      boundary,
      padding,
    }) > 0
  ) {
    const oppositeSide = getOppositeSide(resolvedSide);

    const oppositePosition = computeBasePosition({
      reference,
      floating,
      side: oppositeSide,
      align: parsed.align,
      offset,
    });

    const oppositeOverflow = getMainAxisOverflow({
      side: oppositeSide,
      position: oppositePosition,
      floating,
      boundary,
      padding,
    });

    if (oppositeOverflow <= 0) {
      resolvedSide = oppositeSide;
      position = oppositePosition;
    }
  }

  if (shift) {
    position = {
      top: clamp(
        position.top,
        padding,
        boundary.height - floating.height - padding
      ),
      left: clamp(
        position.left,
        padding,
        boundary.width - floating.width - padding
      ),
    };
  }

  const referenceCenterX = reference.x + reference.width / 2;
  const referenceCenterY = reference.y + reference.height / 2;

  const arrowPosition =
    resolvedSide === 'top' || resolvedSide === 'bottom'
      ? {
          left: clamp(
            referenceCenterX - position.left,
            arrowPadding,
            floating.width - arrowPadding
          ),
        }
      : {
          top: clamp(
            referenceCenterY - position.top,
            arrowPadding,
            floating.height - arrowPadding
          ),
        };

  return {
    position,
    arrowPosition,
    placement: createPlacement(resolvedSide, parsed.align),
  };
}
