import type { ComponentQualityRuleContext } from './types';

export function qualityRoot(context: ComponentQualityRuleContext) {
  return context.rootDir ?? process.cwd();
}
