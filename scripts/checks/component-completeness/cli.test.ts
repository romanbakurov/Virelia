import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import { afterEach, describe, expect, it, vi } from 'vitest';

import { runComponentCompletenessCli } from './cli';

const tempRoots: string[] = [];

function createTempRoot() {
  const root = fs.mkdtempSync(
    path.join(os.tmpdir(), 'vellira-component-completeness-cli-')
  );

  tempRoots.push(root);

  return root;
}

function createCompleteButtonFixture(root: string) {
  for (const packageName of ['react', 'react-native']) {
    const componentDir = path.join(
      root,
      'packages',
      packageName,
      'src',
      'primitives',
      'Button'
    );

    fs.mkdirSync(componentDir, { recursive: true });

    fs.writeFileSync(path.join(componentDir, 'Button.tsx'), '');
    fs.writeFileSync(path.join(componentDir, 'types.ts'), '');
    fs.writeFileSync(path.join(componentDir, 'Button.test.tsx'), '');
    fs.writeFileSync(path.join(componentDir, 'Button.stories.tsx'), '');
    fs.writeFileSync(path.join(componentDir, 'README.md'), '');

    fs.writeFileSync(
      path.join(componentDir, 'index.ts'),
      `export * from './Button';
export * from './types';
`
    );

    fs.writeFileSync(
      path.join(componentDir, '..', 'index.ts'),
      `export * from './Button';
`
    );
  }

  const registryDir = path.join(
    root,
    'apps',
    'website',
    'src',
    'component-catalog',
    'registry'
  );

  fs.mkdirSync(registryDir, { recursive: true });

  fs.writeFileSync(
    path.join(registryDir, 'components.ts'),
    `export const webComponents = [
  {
    slug: 'button',
    name: 'Button',
  },
];
`
  );

  fs.writeFileSync(
    path.join(registryDir, 'componentPages.ts'),
    `export const componentPages = {
  button: {
    name: 'Button',
    Accessibility: () => null,
    api: {
      react: [],
      'react-native': [],
    },
  },
};
`
  );
}

afterEach(() => {
  vi.restoreAllMocks();
  process.exitCode = undefined;

  for (const root of tempRoots.splice(0)) {
    fs.rmSync(root, {
      recursive: true,
      force: true,
    });
  }
});

describe('component completeness CLI', () => {
  it('checks one component by name', () => {
    const root = createTempRoot();

    createCompleteButtonFixture(root);

    const log = vi.spyOn(console, 'log').mockImplementation(() => undefined);

    const results = runComponentCompletenessCli(['Button'], root);

    expect(results).toHaveLength(1);
    expect(results[0]?.componentName).toBe('Button');
    expect(results[0]?.ready).toBe(true);

    expect(log).toHaveBeenCalledWith(expect.stringContaining('READY'));

    expect(process.exitCode).toBeUndefined();
  });

  it('accepts component names case-insensitively', () => {
    const root = createTempRoot();

    createCompleteButtonFixture(root);

    vi.spyOn(console, 'log').mockImplementation(() => undefined);

    const results = runComponentCompletenessCli(['button'], root);

    expect(results[0]?.componentName).toBe('Button');
    expect(results[0]?.ready).toBe(true);
  });

  it('rejects an unknown component', () => {
    const root = createTempRoot();

    expect(() => runComponentCompletenessCli(['DoesNotExist'], root)).toThrow(
      'Unknown component "DoesNotExist". No component metadata found.'
    );
  });

  it('sets a non-zero exit code for incomplete components', () => {
    const root = createTempRoot();

    vi.spyOn(console, 'log').mockImplementation(() => undefined);

    const results = runComponentCompletenessCli(['Button'], root);

    expect(results[0]?.ready).toBe(false);
    expect(process.exitCode).toBe(1);
  });

  it('rejects invalid CLI usage', () => {
    expect(() => runComponentCompletenessCli([])).toThrow(
      'Usage: pnpm check:component <ComponentName|--all>'
    );

    expect(() => runComponentCompletenessCli(['Button', 'unexpected'])).toThrow(
      'Usage: pnpm check:component <ComponentName|--all>'
    );
  });
});
