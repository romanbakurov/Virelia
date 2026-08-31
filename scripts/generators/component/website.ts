import { spawnSync } from 'node:child_process';

import type { ComponentCategoryArg, ComponentProfileArg } from './cli';

export type WebsiteComponentProfile =
  'primitive' | 'form-control' | 'compound' | 'overlay';

export function resolveWebsiteComponentProfile(
  profile: ComponentProfileArg
): WebsiteComponentProfile {
  return profile === 'base' ? 'primitive' : profile;
}

export function generateComponentWebsitePage(params: {
  root: string;
  componentName: string;
  profile: ComponentProfileArg;
  category: ComponentCategoryArg;
}) {
  const result = spawnSync(
    'pnpm',
    [
      'create:component-page',
      params.componentName,
      '--force',
      `--profile=${resolveWebsiteComponentProfile(params.profile)}`,
      `--category=${params.category}`,
    ],
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
