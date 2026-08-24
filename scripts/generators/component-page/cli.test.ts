import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

import { afterEach, describe, expect, it } from 'vitest';

const fixtureRoots: string[] = [];

function repoRoot() {
  return process.cwd();
}

function copyIfExists(root: string, fixture: string, relativePath: string) {
  const source = path.join(root, relativePath);
  const target = path.join(fixture, relativePath);

  if (!fs.existsSync(source)) return;

  fs.cpSync(source, target, {
    recursive: true,
    filter: (item) =>
      !item.includes(`${path.sep}.next${path.sep}`) &&
      !item.includes(`${path.sep}dist${path.sep}`) &&
      !item.includes(`${path.sep}coverage${path.sep}`),
  });
}

function createFixtureRepo() {
  const root = repoRoot();
  const fixture = fs.mkdtempSync(
    path.join(os.tmpdir(), 'vellira-component-page-cli-')
  );
  fixtureRoots.push(fixture);

  for (const relativePath of [
    'apps',
    'packages',
    'scripts',
    'package.json',
    'pnpm-lock.yaml',
    'pnpm-workspace.yaml',
    'tsconfig.json',
    'tsconfig.tooling.json',
    'tsconfig.tooling.test.json',
    'vitest.config.ts',
    'vitest.tooling.config.ts',
    '.prettierrc',
    '.prettierignore',
  ]) {
    copyIfExists(root, fixture, relativePath);
  }

  fs.symlinkSync(
    path.join(root, 'node_modules'),
    path.join(fixture, 'node_modules')
  );

  return fixture;
}

function runGenerator(
  fixture: string,
  args: readonly string[]
): {
  status: number | null;
  stdout: string;
  stderr: string;
} {
  return spawnSync(
    'node',
    [
      path.join(repoRoot(), 'node_modules/tsx/dist/cli.mjs'),
      'scripts/generators/component-page/create-component-page.ts',
      ...args,
    ],
    {
      cwd: fixture,
      encoding: 'utf8',
    }
  );
}

function generatedButtonApiPath(fixture: string) {
  return path.join(
    fixture,
    'apps/website/src/component-catalog/components/Button/buttonApi.ts'
  );
}

afterEach(() => {
  for (const fixture of fixtureRoots.splice(0)) {
    fs.rmSync(fixture, { recursive: true, force: true });
  }
});

describe('component page CLI check modes', () => {
  it('keeps human-readable check compatible with registry validation', () => {
    const fixture = createFixtureRepo();
    const before = fs.readFileSync(generatedButtonApiPath(fixture), 'utf8');

    const result = runGenerator(fixture, ['Button', '--force', '--check']);

    expect(result.status).toBe(0);
    expect(result.stdout).toContain(
      'Generated component page is up to date: Button'
    );
    expect(result.stdout).toContain(
      'Skipped component catalog registration: button'
    );
    expect(result.stderr).toBe('');
    expect(fs.readFileSync(generatedButtonApiPath(fixture), 'utf8')).toBe(
      before
    );
  });

  it('emits structured JSON check output with valid registry paths', () => {
    const fixture = createFixtureRepo();
    const before = fs.readFileSync(generatedButtonApiPath(fixture), 'utf8');

    const result = runGenerator(fixture, [
      'Button',
      '--force',
      '--check',
      '--json',
    ]);

    expect(result.status).toBe(0);
    expect(result.stderr).toBe('');
    expect(JSON.parse(result.stdout)).toEqual({
      schemaVersion: '1',
      componentName: 'Button',
      status: 'up-to-date',
      staleFiles: [],
    });
    expect(fs.readFileSync(generatedButtonApiPath(fixture), 'utf8')).toBe(
      before
    );
  });

  it('reports stale generated files in JSON check mode without mutating them', () => {
    const fixture = createFixtureRepo();
    const apiFile = generatedButtonApiPath(fixture);
    const staleContent = `${fs.readFileSync(apiFile, 'utf8')}\n// stale fixture drift\n`;
    fs.writeFileSync(apiFile, staleContent);

    const result = runGenerator(fixture, [
      'Button',
      '--force',
      '--check',
      '--json',
    ]);

    expect(result.status).toBe(1);
    expect(result.stderr).toBe('');
    expect(JSON.parse(result.stdout)).toEqual({
      schemaVersion: '1',
      componentName: 'Button',
      status: 'stale',
      staleFiles: [
        'apps/website/src/component-catalog/components/Button/buttonApi.ts',
      ],
    });
    expect(fs.readFileSync(apiFile, 'utf8')).toBe(staleContent);
  });
});
