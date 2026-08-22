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
  } else {
    const metadataBarrel = fs.readFileSync(plan.metadataBarrelFile, 'utf8');

    if (!metadataBarrel.includes('export const componentMetadata = [')) {
      errors.push(
        `Missing componentMetadata registry in ${plan.metadataBarrelFile}`
      );
    } else if (!metadataBarrel.includes('] as const;')) {
      errors.push(
        `Invalid componentMetadata registry in ${plan.metadataBarrelFile}`
      );
    }

    const metadataName = `${plan.componentName[0].toLowerCase()}${plan.componentName.slice(1)}Metadata`;

    const metadataImport = `import { ${metadataName} } from './${plan.componentName}.metadata';`;
    const metadataRegistryEntry = `  ${metadataName},`;

    const hasMetadataImport = metadataBarrel.includes(metadataImport);
    const hasMetadataRegistryEntry = metadataBarrel.includes(
      metadataRegistryEntry
    );

    if (
      (hasMetadataImport || hasMetadataRegistryEntry) &&
      !fs.existsSync(plan.metadataFile)
    ) {
      errors.push(
        `Conflicting metadata registration for ${plan.componentName} in ${plan.metadataBarrelFile}`
      );
    }
  }

  if (fs.existsSync(plan.metadataFile)) {
    existingTargets.push(plan.metadataFile);
  }

  if (fs.existsSync(plan.tokenFactoryFile)) {
    existingTargets.push(plan.tokenFactoryFile);
  }

  for (const tokenTarget of plan.tokenThemeTargets) {
    if (fs.existsSync(tokenTarget.componentFile)) {
      existingTargets.push(tokenTarget.componentFile);
    }
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
