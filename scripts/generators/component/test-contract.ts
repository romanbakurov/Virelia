import type { ComponentCapability } from '@vellira-ui/metadata';
import type { ComponentProfileArg, FormControlKindArg } from './cli';

export const componentBaselineTestContractVersion = 1 as const;

export type BaselineTestRequirement =
  | 'render'
  | 'accessibility'
  | 'accessible-name'
  | 'interaction'
  | 'callback'
  | 'controlled'
  | 'uncontrolled'
  | 'disabled'
  | 'required'
  | 'invalid'
  | 'keyboard'
  | 'focus-management'
  | 'compound-api'
  | 'portal';

export type ComponentBaselineTestContract = {
  version: typeof componentBaselineTestContractVersion;
  profile: ComponentProfileArg;
  control: FormControlKindArg;
  platform: 'web' | 'native';
  requirements: readonly BaselineTestRequirement[];
};

const capabilityRequirements: Partial<
  Record<ComponentCapability, BaselineTestRequirement>
> = {
  controlled: 'controlled',
  uncontrolled: 'uncontrolled',
  disabled: 'disabled',
  required: 'required',
  invalid: 'invalid',
  keyboard: 'keyboard',
  'focus-management': 'focus-management',
  'compound-api': 'compound-api',
  portal: 'portal',
};

export function createBaselineTestContract(params: {
  profile: ComponentProfileArg;
  control: FormControlKindArg;
  capabilities: readonly ComponentCapability[];
  parts?: readonly string[];
  isNative: boolean;
}): ComponentBaselineTestContract {
  const {
    profile,
    control,
    capabilities,
    parts = [],
    isNative,
  } = params;
  const requirements: BaselineTestRequirement[] = ['render', 'accessibility'];
  const hasTrigger = parts.includes('Trigger');

  if (profile === 'form-control') {
    requirements.push('callback');
  }

  if (hasTrigger) {
    requirements.push('accessible-name', 'interaction');
  }

  for (const capability of capabilities) {
    const requirement = capabilityRequirements[capability];

    if (!requirement) {
      continue;
    }

    if (requirement === 'keyboard' && isNative) {
      continue;
    }

    if (
      requirement === 'keyboard' &&
      !hasTrigger &&
      (profile === 'compound' || profile === 'overlay')
    ) {
      continue;
    }

    if (!requirements.includes(requirement)) {
      requirements.push(requirement);
    }
  }

  return {
    version: componentBaselineTestContractVersion,
    profile,
    control,
    platform: isNative ? 'native' : 'web',
    requirements,
  };
}
