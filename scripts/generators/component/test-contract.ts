import type { ComponentCapability } from '@vellira-ui/metadata';
import type { ComponentProfileArg, FormControlKindArg } from './cli';

export const componentBaselineTestContractVersion = 1 as const;

export type BaselineTestRequirement =
  | 'render'
  | 'accessibility'
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
  isNative: boolean;
}): ComponentBaselineTestContract {
  const { profile, control, capabilities, isNative } = params;
  const requirements: BaselineTestRequirement[] = ['render', 'accessibility'];

  if (profile === 'form-control') {
    requirements.push('callback');
  }

  for (const capability of capabilities) {
    const requirement = capabilityRequirements[capability];

    if (requirement && !requirements.includes(requirement)) {
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
