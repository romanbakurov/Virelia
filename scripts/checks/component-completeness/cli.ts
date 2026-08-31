import path from 'node:path';

import { componentMetadata } from '../../../packages/metadata/src';

import {
  formatComponentCompletenessResult,
  runComponentCompletenessCheck,
} from './run';

function findComponentMetadata(componentName: string) {
  return componentMetadata.find(
    (metadata) => metadata.name.toLowerCase() === componentName.toLowerCase()
  );
}

export async function runComponentCompletenessCli(
  args: readonly string[],
  root = process.cwd()
) {
  const [target, ...extraArgs] = args;

  if (!target || extraArgs.length > 0) {
    throw new Error('Usage: pnpm check:component <ComponentName|--all>');
  }

  const metadata =
    target === '--all'
      ? componentMetadata
      : (() => {
          const component = findComponentMetadata(target);

          if (!component) {
            throw new Error(
              `Unknown component "${target}". No component metadata found.`
            );
          }

          return [component];
        })();

  const results = await runComponentCompletenessCheck({
    root: path.resolve(root),
    metadata,
    generatedDocsScope: target === '--all' ? 'all' : 'targeted',
  });

  console.log(results.map(formatComponentCompletenessResult).join('\n\n'));

  if (results.some((result) => !result.ready)) {
    process.exitCode = 1;
  }

  return results;
}
