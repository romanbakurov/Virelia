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
      },
    });
  });

  it('serializes deterministically with a trailing newline', () => {
    const contract = createComponentTestCoverageContract({
      componentName: 'Accordion',
      profile: 'compound',
      control: 'value',
      capabilities: ['compound-api', 'keyboard'],
      isNative: true,
    });

    const first = renderComponentTestCoverageContract(contract);
    const second = renderComponentTestCoverageContract(contract);

    expect(first).toBe(second);
    expect(first.endsWith('\n')).toBe(true);
    expect(JSON.parse(first)).toEqual(contract);
  });
});
