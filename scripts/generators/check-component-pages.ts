import { spawnSync } from 'node:child_process';

import { generatedComponentPageComponents } from './component-page-components';

const failures: string[] = [];

for (const componentName of generatedComponentPageComponents) {
  const result = spawnSync(
    'pnpm',
    ['create:component-page', componentName, '--force', '--check'],
    {
      encoding: 'utf8',
      stdio: 'pipe',
    }
  );

  if (result.status !== 0) {
    failures.push(componentName);
    process.stdout.write(result.stdout);
    process.stderr.write(result.stderr);
  }
}

if (failures.length > 0) {
  console.error(`Component page check failed for: ${failures.join(', ')}`);
  process.exit(1);
}

console.log(
  `Component page generated output is up to date for ${generatedComponentPageComponents.length} components.`
);
