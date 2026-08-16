import { spawnSync } from 'node:child_process';

const result = spawnSync('pnpm', ['component-pages:generate', '--check'], {
  stdio: 'inherit',
});

process.exit(result.status ?? 1);
