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

const manualRequirements = new Set<BaselineTestRequirement>([
  'focus-management',
  'portal',
]);

export function splitComponentTestRequirements(
  requirements: readonly BaselineTestRequirement[]
) {
  const baseline: BaselineTestRequirement[] = [];
  const componentSpecific: BaselineTestRequirement[] = [];

  for (const requirement of requirements) {
    if (manualRequirements.has(requirement)) {
      componentSpecific.push(requirement);
    } else {
      baseline.push(requirement);
    }
  }

  return {
    baseline,
    componentSpecific,
  };
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
  const requirements = splitComponentTestRequirements(baseline.requirements);

  return {
    version: componentTestCoverageContractVersion,
    component: componentName,
    platform: baseline.platform,
    profile,
    control,
    parts,
    baseline: {
      ownership: 'generated',
      requirements: requirements.baseline,
    },
    componentSpecific: {
      ownership: 'manual',
      required: requirements.componentSpecific.length > 0,
      requirements: requirements.componentSpecific,
    },
  };
}

export function renderComponentTestCoverageContract(
  contract: ComponentTestCoverageContract
) {
  return `${JSON.stringify(contract, null, 2)}\n`;
}
