import { spawnSync } from 'node:child_process';

export function generateComponentWebsitePage(params: {
  root: string;
  componentName: string;
}) {
  const result = spawnSync(
    'pnpm',
    ['create:component-page', params.componentName, '--force'],
    {
      cwd: params.root,
      encoding: 'utf8',
      stdio: 'pipe',
    }
  );

  if (result.error) {
    throw new Error(
      `Website component page generation failed for ${params.componentName}: ${result.error.message}`
    );
  }

  if (result.status !== 0) {
    const output = [result.stdout, result.stderr]
      .filter(Boolean)
      .join('\n')
      .trim();

    throw new Error(
      [
        `Website component page generation failed for ${params.componentName}.`,
        output,
      ]
        .filter(Boolean)
        .join('\n')
    );
  }
}
