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

  it('keeps component-specific compound behavior out of the generated baseline', () => {
    const contract = createBaselineTestContract({
      profile: 'compound',
      control: 'value',
      capabilities: [
        'compound-api',
        'controlled',
        'uncontrolled',
        'disabled',
        'keyboard',
        'focus-management',
      ],
      parts: ['Root', 'Item', 'Trigger', 'Content'],
      isNative: false,
    });

    expect(contract.requirements).toEqual([
      'render',
      'accessibility',
      'compound-api',
    ]);
  });

  it('keeps simple compound Trigger behavior in the generated baseline', () => {
    const contract = createBaselineTestContract({
      profile: 'compound',
      control: 'value',
      capabilities: ['compound-api'],
      parts: ['Root', 'Trigger', 'Content'],
      isNative: false,
    });

    expect(contract.requirements).toEqual([
      'render',
      'accessibility',
      'accessible-name',
      'interaction',
      'compound-api',
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
