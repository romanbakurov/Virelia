import {
  renderPartComponentTemplate,
  renderPartIndexTemplate,
  renderPartTypesTemplate,
} from './templates';

import type {
  ComponentGenerationPlan,
  ComponentGenerationTarget,
} from './plan';

export type ResolvedPartTemplates = {
  types: string;
  index: string;
  component: string;
};

export function resolvePartTemplates(params: {
  plan: ComponentGenerationPlan;
  target: ComponentGenerationTarget;
  partName: string;
}): ResolvedPartTemplates {
  const { plan, target, partName } = params;

  return {
    types: renderPartTypesTemplate({
      componentName: plan.componentName,
      partName,
      isNative: target.isNative,
    }),

    index: renderPartIndexTemplate({
      componentName: plan.componentName,
      partName,
      isNative: target.isNative,
    }),

    component: renderPartComponentTemplate({
      componentName: plan.componentName,
      partName,
      isNative: target.isNative,
    }),
  };
}
