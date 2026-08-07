import { describe, expect, it } from 'vitest';

import { computeFloatingPosition } from './computeFloatingPosition';

const boundary = {
  width: 500,
  height: 500,
};

const reference = {
  x: 200,
  y: 200,
  width: 100,
  height: 40,
};

const floating = {
  width: 80,
  height: 60,
};

describe('computeFloatingPosition', () => {
  describe('placement', () => {
    it.each([
      [
        'top',
        {
          top: 132,
          left: 210,
        },
        {
          left: 40,
        },
      ],
      [
        'top-start',
        {
          top: 132,
          left: 200,
        },
        {
          left: 50,
        },
      ],
      [
        'top-end',
        {
          top: 132,
          left: 220,
        },
        {
          left: 30,
        },
      ],
      [
        'right',
        {
          top: 190,
          left: 308,
        },
        {
          top: 30,
        },
      ],
      [
        'right-start',
        {
          top: 200,
          left: 308,
        },
        {
          top: 20,
        },
      ],
      [
        'right-end',
        {
          top: 180,
          left: 308,
        },
        {
          top: 40,
        },
      ],
      [
        'bottom',
        {
          top: 248,
          left: 210,
        },
        {
          left: 40,
        },
      ],
      [
        'bottom-start',
        {
          top: 248,
          left: 200,
        },
        {
          left: 50,
        },
      ],
      [
        'bottom-end',
        {
          top: 248,
          left: 220,
        },
        {
          left: 30,
        },
      ],
      [
        'left',
        {
          top: 190,
          left: 112,
        },
        {
          top: 30,
        },
      ],
      [
        'left-start',
        {
          top: 200,
          left: 112,
        },
        {
          top: 20,
        },
      ],
      [
        'left-end',
        {
          top: 180,
          left: 112,
        },
        {
          top: 40,
        },
      ],
    ] as const)(
      'positions %s placement',
      (placement, expectedPosition, expectedArrowPosition) => {
        expect(
          computeFloatingPosition({
            reference,
            floating,
            boundary,
            placement,
          })
        ).toEqual({
          position: expectedPosition,
          arrowPosition: expectedArrowPosition,
          placement,
        });
      }
    );
  });

  it('uses the configured offset', () => {
    expect(
      computeFloatingPosition({
        reference,
        floating,
        boundary,
        placement: 'bottom',
        offset: 20,
      })
    ).toEqual({
      position: {
        top: 260,
        left: 210,
      },
      arrowPosition: {
        left: 40,
      },
      placement: 'bottom',
    });
  });

  describe('flip', () => {
    it('flips top to bottom when there is not enough space above', () => {
      expect(
        computeFloatingPosition({
          reference: {
            x: 150,
            y: 10,
            width: 100,
            height: 40,
          },
          floating,
          boundary: {
            width: 400,
            height: 400,
          },
          placement: 'top',
        })
      ).toEqual({
        position: {
          top: 58,
          left: 160,
        },
        arrowPosition: {
          left: 40,
        },
        placement: 'bottom',
      });
    });

    it('flips bottom to top when there is not enough space below', () => {
      expect(
        computeFloatingPosition({
          reference: {
            x: 150,
            y: 350,
            width: 100,
            height: 40,
          },
          floating,
          boundary: {
            width: 400,
            height: 400,
          },
          placement: 'bottom',
        })
      ).toEqual({
        position: {
          top: 282,
          left: 160,
        },
        arrowPosition: {
          left: 40,
        },
        placement: 'top',
      });
    });

    it('flips left to right when there is not enough space on the left', () => {
      expect(
        computeFloatingPosition({
          reference: {
            x: 10,
            y: 150,
            width: 40,
            height: 100,
          },
          floating,
          boundary: {
            width: 400,
            height: 400,
          },
          placement: 'left',
        })
      ).toEqual({
        position: {
          top: 170,
          left: 58,
        },
        arrowPosition: {
          top: 30,
        },
        placement: 'right',
      });
    });

    it('flips right to left when there is not enough space on the right', () => {
      expect(
        computeFloatingPosition({
          reference: {
            x: 350,
            y: 150,
            width: 40,
            height: 100,
          },
          floating,
          boundary: {
            width: 400,
            height: 400,
          },
          placement: 'right',
        })
      ).toEqual({
        position: {
          top: 170,
          left: 262,
        },
        arrowPosition: {
          top: 30,
        },
        placement: 'left',
      });
    });
  });

  describe('shift', () => {
    it('shifts away from the left boundary and clamps the arrow', () => {
      expect(
        computeFloatingPosition({
          reference: {
            x: 0,
            y: 200,
            width: 20,
            height: 40,
          },
          floating,
          boundary: {
            width: 400,
            height: 400,
          },
          placement: 'top',
          flip: false,
        })
      ).toEqual({
        position: {
          top: 132,
          left: 12,
        },
        arrowPosition: {
          left: 16,
        },
        placement: 'top',
      });
    });

    it('shifts away from the right boundary and clamps the arrow', () => {
      expect(
        computeFloatingPosition({
          reference: {
            x: 380,
            y: 200,
            width: 20,
            height: 40,
          },
          floating,
          boundary: {
            width: 400,
            height: 400,
          },
          placement: 'top',
          flip: false,
        })
      ).toEqual({
        position: {
          top: 132,
          left: 308,
        },
        arrowPosition: {
          left: 64,
        },
        placement: 'top',
      });
    });

    it('shifts away from the top boundary and clamps the arrow', () => {
      expect(
        computeFloatingPosition({
          reference: {
            x: 200,
            y: 0,
            width: 40,
            height: 20,
          },
          floating,
          boundary: {
            width: 400,
            height: 400,
          },
          placement: 'right',
          flip: false,
        })
      ).toEqual({
        position: {
          top: 12,
          left: 248,
        },
        arrowPosition: {
          top: 16,
        },
        placement: 'right',
      });
    });

    it('shifts away from the bottom boundary and clamps the arrow', () => {
      expect(
        computeFloatingPosition({
          reference: {
            x: 200,
            y: 380,
            width: 40,
            height: 20,
          },
          floating,
          boundary: {
            width: 400,
            height: 400,
          },
          placement: 'right',
          flip: false,
        })
      ).toEqual({
        position: {
          top: 328,
          left: 248,
        },
        arrowPosition: {
          top: 44,
        },
        placement: 'right',
      });
    });
  });

  it('positions from the supplied reference rect', () => {
    expect(
      computeFloatingPosition({
        reference: {
          x: 40,
          y: 80,
          width: 120,
          height: 32,
        },
        floating: {
          width: 100,
          height: 50,
        },
        boundary,
        placement: 'bottom-start',
      })
    ).toEqual({
      position: {
        top: 120,
        left: 40,
      },
      arrowPosition: {
        left: 60,
      },
      placement: 'bottom-start',
    });
  });
});
