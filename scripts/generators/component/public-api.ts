import type { ComponentGenerationPlan } from './plan';

export function getGeneratedPublicPropTypeNames(plan: ComponentGenerationPlan) {
  return [
    `${plan.componentName}Props`,
    ...getGeneratedPublicPartPropTypeNames(plan),
  ];
}

export function getGeneratedPublicPartPropTypeNames(
  plan: ComponentGenerationPlan
) {
  return plan.parts
    .filter((partName) => partName !== 'Root')
    .map((partName) => `${plan.componentName}${partName}Props`);
}
