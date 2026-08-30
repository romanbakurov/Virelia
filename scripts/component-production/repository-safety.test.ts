import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import { afterEach, describe, expect, it } from 'vitest';

import { validateComponentProductionRepositorySafety } from './repository-safety';

const roots: string[] = [];

afterEach(() => {
  for (const root of roots.splice(0)) {
    fs.rmSync(root, {
      recursive: true,
      force: true,
    });
  }
});

describe('validateComponentProductionRepositorySafety', () => {
  it('allows a feature branch', () => {
    const root = repository();

    git(root, 'switch', '-c', 'feat/avatar');

    expect(validateComponentProductionRepositorySafety(root)).toMatchObject({
      ok: true,
      branch: 'feat/avatar',
    });
  });

  it('blocks main before production writes', () => {
    const root = repository();

    expect(validateComponentProductionRepositorySafety(root)).toMatchObject({
      ok: false,
      branch: 'main',
      reason:
        'Component production refuses direct writes on protected/default branch "main".',
    });
  });

  it('allows a detached disposable checkout', () => {
    const root = repository();
    const revision = git(root, 'rev-parse', 'HEAD').trim();

    git(root, 'checkout', '--detach', revision);

    expect(validateComponentProductionRepositorySafety(root)).toMatchObject({
      ok: true,
      branch: null,
    });
  });

  it('fails closed outside a Git repository', () => {
    const root = fs.mkdtempSync(
      path.join(os.tmpdir(), 'vellira-production-non-git-')
    );

    roots.push(root);

    expect(validateComponentProductionRepositorySafety(root)).toEqual({
      ok: false,
      branch: null,
      defaultBranch: null,
      reason: 'Component production requires a Git repository checkout.',
    });
  });
});

function repository(): string {
  const root = fs.mkdtempSync(
    path.join(os.tmpdir(), 'vellira-production-git-')
  );

  roots.push(root);

  git(root, 'init', '-b', 'main');
  git(root, 'config', 'user.email', 'test@vellira.dev');
  git(root, 'config', 'user.name', 'Vellira Test');

  fs.writeFileSync(path.join(root, 'README.md'), 'fixture\n');

  git(root, 'add', 'README.md');
  git(root, 'commit', '-m', 'test fixture');

  return root;
}

function git(root: string, ...args: readonly string[]): string {
  return execFileSync('git', args, {
    cwd: root,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  });
}
