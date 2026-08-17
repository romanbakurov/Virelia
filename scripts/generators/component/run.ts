import { createComponentGenerationPlan } from './plan';
import { validateComponentGenerationPlan } from './preflight';
import { writeComponentGenerationPlan } from './write';

import type { ComponentGeneratorOptions } from './cli';

export type RunComponentGeneratorResult = {
  plan: ReturnType<typeof createComponentGenerationPlan>;
  createdFiles: string[];
  updatedFiles: string[];
};

export function runComponentGenerator(params: {
  root: string;
  options: ComponentGeneratorOptions;
}): RunComponentGeneratorResult {
  const plan = createComponentGenerationPlan(params);

  const preflight = validateComponentGenerationPlan(plan);

  if (!preflight.ok) {
    throw new Error(preflight.errors.join('\n'));
  }

  const result = writeComponentGenerationPlan(plan);

  return {
    plan,
    ...result,
  };
}
