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
    expect(contract.version).toBe(componentBaselineTestContractVersion);
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
      parts: ['Root', 'Trigger', 'Content'],
      isNative: false,
    });

    expect(contract.requirements).toEqual([
      'render',
      'accessibility',
      'accessible-name',
      'interaction',
      'compound-api',
      'keyboard',
    ]);
  });

  it('does not duplicate repeated capability requirements', () => {
    const contract = createBaselineTestContract({
      profile: 'compound',
      control: 'value',
      capabilities: ['compound-api', 'compound-api'],
      isNative: false,
    });

    expect(
      contract.requirements.filter((item) => item === 'compound-api')
    ).toHaveLength(1);
  });
});
