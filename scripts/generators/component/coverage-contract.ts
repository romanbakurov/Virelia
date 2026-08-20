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
  parts: readonly string[];
  baseline: {
    ownership: 'generated';
    requirements: readonly BaselineTestRequirement[];
  };
  componentSpecific: {
    ownership: 'manual';
    required: boolean;
    requirements: readonly BaselineTestRequirement[];
  };
};

export function splitComponentTestRequirements(
  requirements: readonly BaselineTestRequirement[]
) {
  return {
    baseline: [...requirements],
    componentSpecific: [] as BaselineTestRequirement[],
  };
}

function createManualRequirements(params: {
  capabilities: readonly ComponentCapability[];
  parts: readonly string[];
  isNative: boolean;
}) {
  const { capabilities, parts, isNative } = params;
  const requirements: BaselineTestRequirement[] = [];

  if (capabilities.includes('focus-management')) {
    requirements.push('focus-management');
  }

  if (capabilities.includes('portal')) {
    requirements.push('portal');
  }

  if (
    capabilities.includes('keyboard') &&
    !isNative &&
    !parts.includes('Trigger')
  ) {
    requirements.push('keyboard');
  }

  return requirements;
}

export function createComponentTestCoverageContract(params: {
  componentName: string;
  profile: ComponentProfileArg;
  control: FormControlKindArg;
  capabilities: readonly ComponentCapability[];
  parts?: readonly string[];
  isNative: boolean;
}): ComponentTestCoverageContract {
  const {
    componentName,
    profile,
    control,
    capabilities,
    parts = [],
    isNative,
  } = params;
  const baseline = createBaselineTestContract({
    profile,
    control,
    capabilities,
    parts,
    isNative,
  });
  const manualRequirements = createManualRequirements({
    capabilities,
    parts,
    isNative,
  });

  return {
    version: componentTestCoverageContractVersion,
    component: componentName,
    platform: baseline.platform,
    profile,
    control,
    parts,
    baseline: {
      ownership: 'generated',
      requirements: baseline.requirements,
    },
    componentSpecific: {
      ownership: 'manual',
      required: manualRequirements.length > 0,
      requirements: manualRequirements,
    },
  };
}

export function renderComponentTestCoverageContract(
  contract: ComponentTestCoverageContract
) {
  return `${JSON.stringify(contract, null, 2)}\n`;
}
