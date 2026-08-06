import type { FloatingPlacement } from '@vellira-ui/types';

export type FloatingSide = 'top' | 'right' | 'bottom' | 'left';
export type FloatingAlign = 'start' | 'center' | 'end';

export interface FloatingRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface FloatingSize {
  width: number;
  height: number;
}

export interface FloatingBoundary {
  width: number;
  height: number;
}

export interface FloatingPoint {
  top: number;
  left: number;
}

export interface FloatingArrowPosition {
  top?: number;
  left?: number;
}

export interface FloatingPositionResult {
  position: FloatingPoint;
  arrowPosition: FloatingArrowPosition;
  placement: FloatingPlacement;
}
