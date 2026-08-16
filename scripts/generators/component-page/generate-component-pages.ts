import { spawnSync } from 'node:child_process';

import { generatedComponentPageComponents } from './component-page-components';

const args = process.argv.slice(2);

const check = args.includes('--check');
const help = args.includes('--help') || args.includes('-h');

const helpText = `
Vellira component pages generator

Usage:
  pnpm component-pages:generate [options]

Options:
  --check    Check all generated component pages without writing files
  --help     Show this help message
  -h         Alias for --help

Examples:
  pnpm component-pages:generate
  pnpm component-pages:generate --check
`;

if (help) {
  console.log(helpText.trim());
  process.exit(0);
}

const supportedArgs = new Set(['--check', '--help', '-h']);
const unknownArgs = args.filter((arg) => !supportedArgs.has(arg));

if (unknownArgs.length > 0) {
  console.error(`Unknown option: ${unknownArgs.join(', ')}`);
  console.error('');
  console.error(helpText.trim());
  process.exit(1);
}

const failures: string[] = [];

for (const componentName of generatedComponentPageComponents) {
  console.log(
    check
      ? `=== Checking ${componentName} ===`
      : `=== Generating ${componentName} ===`
  );

  const commandArgs = [
    'create:component-page',
    componentName,
    '--force',
    ...(check ? ['--check'] : []),
  ];

  const result = spawnSync('pnpm', commandArgs, {
    encoding: 'utf8',
    stdio: 'inherit',
  });

  if (result.status !== 0) {
    failures.push(componentName);
  }
}

if (failures.length > 0) {
  console.error('');
  console.error(
    `${check ? 'Component page check' : 'Component page generation'} failed for: ${failures.join(', ')}`
  );
  process.exit(1);
}

console.log('');

if (check) {
  console.log(
    `All ${generatedComponentPageComponents.length} generated component pages are up to date.`
  );
} else {
  console.log(
    `Generated ${generatedComponentPageComponents.length} component pages successfully.`
  );
}
