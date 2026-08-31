import { checkComponentCompleteness } from './check-component';
import { checkGeneratedComponentDocsCompleteness } from './check-generated-component-docs';

import type { ComponentMetadata } from '@vellira-ui/metadata';
import {
  componentDocsContracts as defaultComponentDocsContracts,
  type ComponentDocsContract,
} from '../../../apps/docs/src/component-docs';
import type { ComponentCompletenessResult } from './types';

export function formatComponentCompletenessResult(
  result: ComponentCompletenessResult
) {
  const lines = [result.componentName, ''];

  const platformGroups = [
    {
      platform: 'react' as const,
      label: 'React',
    },
    {
      platform: 'react-native' as const,
      label: 'React Native',
    },
  ];

  for (const { platform, label } of platformGroups) {
    const platformChecks = result.checks.filter(
      (check) => check.platform === platform
    );

    if (platformChecks.length === 0) {
      continue;
    }

    lines.push(label);

    for (const check of platformChecks) {
      const status = check.ok ? '✓' : '✗';

      lines.push(
        `${check.name.padEnd(16)} ${status}${
          !check.ok && check.details ? ` ${check.details}` : ''
        }`
      );
    }

    lines.push('');
  }

  const sharedChecks = result.checks.filter(
    (check) => check.platform === undefined
  );

  if (sharedChecks.length > 0) {
    lines.push('Shared');

    for (const check of sharedChecks) {
      const status = check.ok ? '✓' : '✗';

      lines.push(
        `${check.name.padEnd(16)} ${status}${
          !check.ok && check.details ? ` ${check.details}` : ''
        }`
      );
    }

    lines.push('');
  }

  lines.push(result.ready ? 'READY' : 'INCOMPLETE');

  return lines.join('\n');
}

export async function runComponentCompletenessCheck(params: {
  root: string;
  metadata: readonly ComponentMetadata[];
  componentDocsContracts?: readonly ComponentDocsContract[];
  generatedDocsScope?: 'all' | 'targeted';
}) {
  const {
    root,
    metadata,
    componentDocsContracts = defaultComponentDocsContracts,
    generatedDocsScope = 'all',
  } = params;

  const results = metadata.map((component) =>
    checkComponentCompleteness({
      root,
      metadata: component,
    })
  );

  const metadataNames = new Set(metadata.map((component) => component.name));
  const docsContracts =
    generatedDocsScope === 'all'
      ? componentDocsContracts
      : componentDocsContracts.filter((contract) =>
          metadataNames.has(contract.component)
        );

  if (docsContracts.length > 0) {
    results.push(
      await checkGeneratedComponentDocsCompleteness({
        root,
        metadata,
        contracts: docsContracts,
        orphanComponentNames:
          generatedDocsScope === 'targeted' ? [...metadataNames] : undefined,
      })
    );
  }

  return results;
}
