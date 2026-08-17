import {
  renderCompoundComponentTemplate,
  renderFormControlComponentTemplate,
  renderFormControlTypesTemplate,
  renderNativeComponentTemplate,
  renderTypesTemplate,
  renderWebComponentTemplate,
} from './templates';

import type {
  ComponentGenerationPlan,
  ComponentGenerationTarget,
} from './plan';

export type ResolvedComponentTemplates = {
  types: string;
  component: string;
};

export function resolveComponentTemplates(params: {
  plan: ComponentGenerationPlan;
  target: ComponentGenerationTarget;
}): ResolvedComponentTemplates {
  const { plan, target } = params;
  const { componentName } = plan;

  switch (plan.profile) {
    case 'form-control':
      return {
        types: renderFormControlTypesTemplate({
          componentName,
        }),
        component: renderFormControlComponentTemplate({
          componentName,
          isNative: target.isNative,
        }),
      };

    case 'compound':
      return {
        types: renderTypesTemplate({
          componentName,
        }),
        component: renderCompoundComponentTemplate({
          componentName,
          parts: plan.parts,
        }),
      };

    case 'overlay':
      // Overlay-specific web/native templates will be added next.
      return {
        types: renderTypesTemplate({
          componentName,
        }),
        component: target.isNative
          ? renderNativeComponentTemplate({
              componentName,
            })
          : renderWebComponentTemplate({
              componentName,
            }),
      };

    case 'base':
      return {
        types: renderTypesTemplate({
          componentName,
        }),
        component: target.isNative
          ? renderNativeComponentTemplate({
              componentName,
            })
          : renderWebComponentTemplate({
              componentName,
            }),
      };
  }
}
