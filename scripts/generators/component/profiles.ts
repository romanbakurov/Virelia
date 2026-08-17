import type { ComponentProfileArg } from './cli';

export type ComponentProfileDefinition = {
  profile: ComponentProfileArg;
  capabilities: readonly string[];
  description: string;
};

export const componentProfiles: Record<
  ComponentProfileArg,
  ComponentProfileDefinition
> = {
  base: {
    profile: 'base',
    capabilities: [],
    description: 'Neutral component scaffold with no specialized behavior.',
  },

  'form-control': {
    profile: 'form-control',
    capabilities: ['disabled', 'required', 'invalid'],
    description:
      'Form-oriented scaffold with validation and field-state requirements.',
  },

  compound: {
    profile: 'compound',
    capabilities: ['compound-api'],
    description:
      'Compound component scaffold composed from a root and public child slots.',
  },

  overlay: {
    profile: 'overlay',
    capabilities: [
      'controlled',
      'uncontrolled',
      'keyboard',
      'focus-management',
      'compound-api',
      'portal',
    ],
    description:
      'Overlay scaffold with open-state, focus, dismissal, and portal requirements.',
  },
};

export function getComponentProfile(
  profile: ComponentProfileArg
): ComponentProfileDefinition {
  return componentProfiles[profile];
}
