import {
  renderPartComponentTemplate,
  renderPartIndexTemplate,
  renderPartTypesTemplate,
  renderNativeOverlayPartComponentTemplate,
  renderNativeOverlayPartTypesTemplate,
  renderWebOverlayPartComponentTemplate,
  renderWebOverlayPartTypesTemplate,
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

  if (plan.profile === 'overlay') {
    return {
      types: target.isNative
        ? renderNativeOverlayPartTypesTemplate({
            componentName: plan.componentName,
            partName,
          })
        : renderWebOverlayPartTypesTemplate({
            componentName: plan.componentName,
            partName,
          }),

      index: renderPartIndexTemplate({
        componentName: plan.componentName,
        partName,
        isNative: target.isNative,
      }),

      component: target.isNative
        ? renderNativeOverlayPartComponentTemplate({
            componentName: plan.componentName,
            partName,
          })
        : renderWebOverlayPartComponentTemplate({
            componentName: plan.componentName,
            partName,
          }),
    };
  }

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
