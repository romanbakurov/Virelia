import fs from 'node:fs';

import type { ComponentGenerationPlan } from './plan';
import { getComponentProfile } from './profiles';

export type ComponentPreflightResult =
  | {
      ok: true;
      existingTargets: string[];
    }
  | {
      ok: false;
      errors: string[];
    };

export function validateComponentGenerationPlan(
  plan: ComponentGenerationPlan
): ComponentPreflightResult {
  const errors: string[] = [];
  const existingTargets: string[] = [];
  const profile = getComponentProfile(plan.profile);

  for (const target of plan.targets) {
    if (!fs.existsSync(target.barrelFile)) {
      errors.push(`Missing layer barrel file: ${target.barrelFile}`);
    }

    if (fs.existsSync(target.componentDir)) {
      existingTargets.push(target.componentDir);
    }
  }

  if (
    profile.supportsParts &&
    plan.parts.length > 0 &&
    !plan.parts.includes('Root')
  ) {
    errors.push(
      `Component profile "${plan.profile}" requires a Root part when parts are provided.`
    );
  }

  if (!profile.supportsParts && plan.parts.length > 0) {
    errors.push(
      `Component parts are not supported by the ${plan.profile} profile.`
    );
  }

  if (!fs.existsSync(plan.metadataBarrelFile)) {
    errors.push(`Missing metadata barrel file: ${plan.metadataBarrelFile}`);
  }

  if (fs.existsSync(plan.metadataFile)) {
    existingTargets.push(plan.metadataFile);
  }

  if (existingTargets.length > 0 && !plan.force) {
    errors.push(
      `Component already exists:\n${existingTargets
        .map((target) => `- ${target}`)
        .join('\n')}\nUse --force to overwrite existing component files.`
    );
  }

  return errors.length > 0
    ? {
        ok: false,
        errors,
      }
    : {
        ok: true,
        existingTargets,
      };
}
