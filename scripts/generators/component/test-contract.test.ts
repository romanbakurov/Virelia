import { describe, expect, it } from 'vitest';

import {
  componentBaselineTestContractVersion,
  createBaselineTestContract,
} from './test-contract';

describe('component baseline test contracts', () => {
  it('pins the machine-readable contract version', () => {
    expect(componentBaselineTestContractVersion).toBe(1);
  });

  it('creates a minimal base contract', () => {
    expect(
      createBaselineTestContract({
        profile: 'base',
        control: 'value',
        capabilities: [],
        isNative: false,
      })
    ).toEqual({
      version: componentBaselineTestContractVersion,
      profile: 'base',
      control: 'value',
      platform: 'web',
      requirements: ['render', 'accessibility'],
    });
  });

  it('derives form-control coverage requirements from capabilities', () => {
    const contract = createBaselineTestContract({
      profile: 'form-control',
      control: 'boolean',
      capabilities: [
        'controlled',
        'uncontrolled',
        'disabled',
        'required',
        'invalid',
      ],
      isNative: true,
    });

    expect(contract.platform).toBe('native');
    expect(contract.requirements).toEqual([
      'render',
      'accessibility',
      'callback',
      'controlled',
      'uncontrolled',
      'disabled',
      'required',
      'invalid',
    ]);
  });

  it('derives richer compound requirements without a separate taxonomy', () => {
    const contract = createBaselineTestContract({
      profile: 'compound',
      control: 'value',
      capabilities: ['compound-api', 'keyboard', 'focus-management'],
      isNative: false,
    });

    expect(contract.requirements).toEqual([
      'render',
      'accessibility',
      'compound-api',
      'keyboard',
      'focus-management',
    ]);
  });

  it('does not duplicate repeated capability requirements', () => {
    const contract = createBaselineTestContract({
      profile: 'overlay',
      control: 'value',
      capabilities: ['portal', 'portal'],
      isNative: false,
    });

    expect(
      contract.requirements.filter((item) => item === 'portal')
    ).toHaveLength(1);
  });
});
