import path from 'node:path';
import { pathToFileURL } from 'node:url';

import { describe, expect, it } from 'vitest';

type AliasConfig = {
  resolve?: {
    alias?: Record<string, string>;
  };
};

async function loadAliases(
  relativeConfigPath: string
): Promise<Record<string, string>> {
  const configPath = path.resolve(process.cwd(), relativeConfigPath);
  const configUrl = pathToFileURL(configPath).href;

  // Keep the package config outside the tooling TypeScript compilation graph
  // while still validating its actual runtime-resolved alias object.
  const loaded = (await import(configUrl)) as {
    default?: unknown;
  };

  const alias = (loaded.default as AliasConfig | undefined)?.resolve?.alias;

  if (!alias || Array.isArray(alias)) {
    throw new Error(
      `Expected ${relativeConfigPath} to expose object-form aliases.`
    );
  }

  return alias;
}

const root = process.cwd();

describe('package Vitest workspace source resolution', () => {
  it('resolves React workspace dependencies from source', async () => {
    const resolved = await loadAliases('packages/react/vitest.config.ts');

    expect(resolved['@vellira-ui/core']).toBe(
      path.resolve(root, 'packages/core/src/index.ts')
    );

    expect(resolved['@vellira-ui/icons']).toBe(
      path.resolve(root, 'packages/icons/src/web.source.ts')
    );

    expect(resolved['@vellira-ui/icons/web']).toBe(
      path.resolve(root, 'packages/icons/src/web.ts')
    );

    expect(resolved['@vellira-ui/icons/native']).toBe(
      path.resolve(root, 'packages/icons/src/native.ts')
    );

    expect(resolved['@vellira-ui/icons/lottie']).toBe(
      path.resolve(root, 'packages/icons/src/lottie.ts')
    );

    expect(resolved['@vellira-ui/tokens']).toBe(
      path.resolve(root, 'packages/tokens/src/index.ts')
    );

    expect(resolved['@vellira-ui/types']).toBe(
      path.resolve(root, 'packages/types/src/index.ts')
    );
  });

  it('resolves React Native self-imports from source', async () => {
    const resolved = await loadAliases(
      'packages/react-native/vitest.config.ts'
    );

    expect(resolved['@vellira-ui/react-native']).toBe(
      path.resolve(root, 'packages/react-native/src/index.ts')
    );
  });
});
