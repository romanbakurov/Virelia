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
  profile: ComponentProfileArg;
  capabilities: readonly ComponentCapability[];
  parts: readonly string[];
  isNative: boolean;
}) {
  const { profile, capabilities, parts, isNative } = params;
  const requirements: BaselineTestRequirement[] = [];

  const pushRequirement = (requirement: BaselineTestRequirement) => {
    if (!requirements.includes(requirement)) {
      requirements.push(requirement);
    }
  };

  if (profile === 'compound') {
    if (capabilities.includes('controlled')) {
      pushRequirement('controlled');
    }

    if (capabilities.includes('uncontrolled')) {
      pushRequirement('uncontrolled');
    }

    if (capabilities.includes('disabled')) {
      pushRequirement('disabled');
    }

    if (capabilities.includes('required')) {
      pushRequirement('required');
    }

    if (capabilities.includes('invalid')) {
      pushRequirement('invalid');
    }
  }

  if (capabilities.includes('focus-management')) {
    pushRequirement('focus-management');
  }

  if (capabilities.includes('portal')) {
    pushRequirement('portal');
  }

  if (
    capabilities.includes('keyboard') &&
    !isNative &&
    (profile === 'compound' || !parts.includes('Trigger'))
  ) {
    pushRequirement('keyboard');
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
    profile,
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
