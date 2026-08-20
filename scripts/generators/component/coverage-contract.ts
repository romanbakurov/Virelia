import type { ComponentCapability } from '@vellira-ui/metadata';
import type { ComponentProfileArg, FormControlKindArg } from './cli';
import {
  createBaselineTestContract,
  type BaselineTestRequirement,
} from './test-contract';

export const componentTestCoverageContractVersion = 1 as const;

export type ComponentTestCoverageContract = {
  version: typeof componentTestCoverageContractVersion;
  component: string;
  platform: 'web' | 'native';
  profile: ComponentProfileArg;
  control: FormControlKindArg;
  baseline: {
    ownership: 'generated';
    requirements: readonly BaselineTestRequirement[];
  };
  componentSpecific: {
    ownership: 'manual';
    required: boolean;
  };
};

export function createComponentTestCoverageContract(params: {
  componentName: string;
  profile: ComponentProfileArg;
  control: FormControlKindArg;
  capabilities: readonly ComponentCapability[];
  isNative: boolean;
}): ComponentTestCoverageContract {
  const { componentName, profile, control, capabilities, isNative } = params;
  const baseline = createBaselineTestContract({
    profile,
    control,
    capabilities,
    isNative,
  });

  return {
    version: componentTestCoverageContractVersion,
    component: componentName,
    platform: baseline.platform,
    profile,
    control,
    baseline: {
      ownership: 'generated',
      requirements: baseline.requirements,
    },
    componentSpecific: {
      ownership: 'manual',
      required: false,
    },
  };
}

export function renderComponentTestCoverageContract(
  contract: ComponentTestCoverageContract
) {
  return `${JSON.stringify(contract, null, 2)}\n`;
}
