import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

import { runTsProjectCoverageCheck } from './checker';

describe('ts-project-coverage checker', () => {
  it('does not treat a stale root solution reference as ownership authority', () => {
    using fixture = createFixture({
      'package.json': JSON.stringify({
        scripts: {
          'ci:typecheck': 'pnpm typecheck',
          typecheck: 'turbo run typecheck',
        },
      }),
      'tsconfig.json': JSON.stringify({
        files: [],
        references: [{ path: './packages/widget' }],
      }),
      'packages/widget/package.json': JSON.stringify({ scripts: {} }),
      'packages/widget/tsconfig.json': JSON.stringify({
        compilerOptions: { noEmit: true },
        include: ['src/**/*.ts'],
      }),
      'packages/widget/src/index.ts': 'export const value = 1;\n',
      'entrypoints.json': JSON.stringify([]),
    });

    const result = runTsProjectCoverageCheck(
      fixture.path,
      path.join(fixture.path, 'entrypoints.json')
    );

    expect(result.unownedFiles).toEqual(['packages/widget/src/index.ts']);
    expect(result.summary.blocking).toBe(true);
  });

  it('does not treat an orphan tsconfig as ownership authority', () => {
    using fixture = createFixture({
      'package.json': JSON.stringify({
        scripts: {
          'ci:typecheck': 'pnpm typecheck',
          typecheck: 'turbo run typecheck',
        },
      }),
      'packages/widget/package.json': JSON.stringify({ scripts: {} }),
      'packages/widget/tsconfig.json': JSON.stringify({
        compilerOptions: { noEmit: true },
        include: ['src/**/*.ts'],
      }),
      'packages/widget/src/index.ts': 'export const value = 1;\n',
      'entrypoints.json': JSON.stringify([]),
    });

    const result = runTsProjectCoverageCheck(
      fixture.path,
      path.join(fixture.path, 'entrypoints.json')
    );

    expect(result.discoveredTsconfigs).toContain(
      'packages/widget/tsconfig.json'
    );
    expect(result.authoritativeProjects).toEqual([]);
    expect(result.unownedFiles).toEqual(['packages/widget/src/index.ts']);
    expect(result.summary.blocking).toBe(true);
  });

  it('uses a verified typecheck entrypoint and recursive project references as ownership authority', () => {
    using fixture = createFixture({
      'package.json': JSON.stringify({
        scripts: {
          'ci:typecheck': 'pnpm typecheck',
          typecheck: 'turbo run typecheck',
        },
      }),
      'packages/app/package.json': JSON.stringify({
        scripts: {
          typecheck: 'tsc -p tsconfig.json --noEmit',
        },
      }),
      'packages/app/tsconfig.json': JSON.stringify({
        files: [],
        references: [{ path: '../shared' }],
      }),
      'packages/shared/tsconfig.json': JSON.stringify({
        compilerOptions: { composite: true, noEmit: true },
        include: ['src/**/*.ts'],
      }),
      'packages/shared/src/index.ts': 'export const value = 1;\n',
      'entrypoints.json': JSON.stringify([
        {
          project: 'packages/app/tsconfig.json',
          packageJson: 'packages/app/package.json',
          script: 'typecheck',
          invocation: 'tsc -p tsconfig.json --noEmit',
          rootScript: 'typecheck',
          rootInvocation: 'turbo run typecheck',
          reason: 'App typecheck is a verified CI entrypoint.',
        },
      ]),
    });

    const result = runTsProjectCoverageCheck(
      fixture.path,
      path.join(fixture.path, 'entrypoints.json')
    );

    expect(result.authoritativeProjects).toContain(
      'packages/app/tsconfig.json'
    );
    expect(result.authoritativeProjects).toContain(
      'packages/shared/tsconfig.json'
    );
    expect(result.unownedFiles).toEqual([]);
    expect(result.summary.blocking).toBe(false);
  });
});

function createFixture(files: Record<string, string>) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'ts-project-coverage-'));
  for (const [file, contents] of Object.entries(files)) {
    const filePath = path.join(root, file);
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    fs.writeFileSync(filePath, contents);
  }
  return {
    path: root,
    [Symbol.dispose]() {
      fs.rmSync(root, { force: true, recursive: true });
    },
  };
}
