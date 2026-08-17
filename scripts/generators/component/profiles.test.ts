import { describe, expect, it } from 'vitest';

import { getComponentProfile } from './profiles';

describe('component generator profiles', () => {
  it('returns a neutral base profile', () => {
    expect(getComponentProfile('base')).toEqual({
      profile: 'base',
      capabilities: [],
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
});
