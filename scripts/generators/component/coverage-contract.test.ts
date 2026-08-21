import { describe, expect, it } from 'vitest';

import {
  componentTestCoverageContractVersion,
  createComponentTestCoverageContract,
  renderComponentTestCoverageContract,
} from './coverage-contract';

describe('component test coverage contracts', () => {
  it('derives a versioned machine-readable contract from generator intent', () => {
    const contract = createComponentTestCoverageContract({
      componentName: 'Switch',
      profile: 'form-control',
      control: 'boolean',
      capabilities: [
        'controlled',
        'uncontrolled',
        'disabled',
        'required',
        'invalid',
      ],
      isNative: false,
    });

    expect(contract).toEqual({
      version: componentTestCoverageContractVersion,
      component: 'Switch',
      platform: 'web',
      profile: 'form-control',
      control: 'boolean',
      parts: [],
      baseline: {
        ownership: 'generated',
        requirements: [
          'render',
          'accessibility',
          'callback',
          'controlled',
          'uncontrolled',
          'disabled',
          'required',
          'invalid',
        ],
      },
      componentSpecific: {
        ownership: 'manual',
        required: false,
        requirements: [],
      },
    });
  });

  it('keeps deep overlay behavior explicitly manual', () => {
    const contract = createComponentTestCoverageContract({
      componentName: 'Dialog',
      profile: 'overlay',
      control: 'value',
      capabilities: [
        'controlled',
        'uncontrolled',
        'keyboard',
        'focus-management',
        'compound-api',
        'portal',
      ],
      parts: ['Root', 'Trigger', 'Content'],
      isNative: false,
    });

    expect(contract.baseline.requirements).toEqual(
      expect.arrayContaining([
        'render',
        'accessibility',
        'accessible-name',
        'interaction',
        'controlled',
        'uncontrolled',
        'keyboard',
        'compound-api',
      ])
    );
    expect(contract.componentSpecific).toEqual({
      ownership: 'manual',
      required: true,
      requirements: ['focus-management', 'portal'],
    });
  });

  it('does not require browser keyboard coverage on native targets', () => {
    const contract = createComponentTestCoverageContract({
      componentName: 'Accordion',
      profile: 'compound',
      control: 'value',
      capabilities: ['compound-api', 'keyboard'],
      parts: ['Root', 'Trigger', 'Content'],
      isNative: true,
    });

    expect(contract.baseline.requirements).toContain('interaction');
    expect(contract.baseline.requirements).not.toContain('keyboard');
  });

  it('serializes deterministically with a trailing newline', () => {
    const contract = createComponentTestCoverageContract({
      componentName: 'Accordion',
      profile: 'compound',
      control: 'value',
      capabilities: ['compound-api', 'keyboard'],
      parts: ['Root', 'Trigger', 'Content'],
      isNative: true,
    });

    const first = renderComponentTestCoverageContract(contract);
    const second = renderComponentTestCoverageContract(contract);

    expect(first).toBe(second);
    expect(first.endsWith('\n')).toBe(true);
    expect(JSON.parse(first)).toEqual(contract);
  });
});
