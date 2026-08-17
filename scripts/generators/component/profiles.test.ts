import { describe, expect, it } from 'vitest';

import { getComponentProfile } from './profiles';

describe('component generator profiles', () => {
  it('returns a neutral base profile', () => {
    expect(getComponentProfile('base')).toEqual({
      profile: 'base',
      capabilities: [],
      supportsParts: false,
      description: 'Neutral component scaffold with no specialized behavior.',
    });
  });

  it('defines compound API behavior', () => {
    expect(getComponentProfile('compound').capabilities).toContain(
      'compound-api'
    );
  });

  it('defines overlay behavior', () => {
    expect(getComponentProfile('overlay').capabilities).toEqual(
      expect.arrayContaining([
        'controlled',
        'uncontrolled',
        'keyboard',
        'focus-management',
        'compound-api',
        'portal',
      ])
    );
  });

  it('defines form-control capabilities', () => {
    expect(getComponentProfile('form-control').capabilities).toEqual([
      'controlled',
      'uncontrolled',
      'disabled',
      'required',
      'invalid',
    ]);
  });

  it('allows parts for compound and overlay profiles', () => {
    expect(getComponentProfile('base').supportsParts).toBe(false);
    expect(getComponentProfile('form-control').supportsParts).toBe(false);
    expect(getComponentProfile('compound').supportsParts).toBe(true);
    expect(getComponentProfile('overlay').supportsParts).toBe(true);
  });
});
