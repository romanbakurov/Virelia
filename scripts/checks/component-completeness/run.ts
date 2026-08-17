import { checkComponentCompleteness } from './check-component';

import type { ComponentMetadata } from '@vellira-ui/metadata';
import type { ComponentCompletenessResult } from './types';

export function formatComponentCompletenessResult(
  result: ComponentCompletenessResult
) {
  const lines = [result.componentName, ''];

  for (const check of result.checks) {
    const status = check.ok ? '✓' : '✗';

    lines.push(
      `${check.name.padEnd(16)} ${status}${
        !check.ok && check.details ? ` ${check.details}` : ''
      }`
    );
  }

  lines.push('');
  lines.push(result.ready ? 'READY' : 'INCOMPLETE');

  return lines.join('\n');
}

export function runComponentCompletenessCheck(params: {
  root: string;
  metadata: readonly ComponentMetadata[];
}) {
  const { root, metadata } = params;

  return metadata.map((component) =>
    checkComponentCompleteness({
      root,
      metadata: component,
    })
  );
}
